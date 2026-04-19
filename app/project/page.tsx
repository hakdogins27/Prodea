"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useProjectStore } from "@/store/useProjectStore";
import { 
  Download, Cpu, Loader2, RotateCcw, 
  ChevronRight
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ErrorBoundary } from "@/components/workspace/ErrorBoundary";
import { BrainDump } from "@/components/workspace/BrainDump";
import { BlueprintEditor } from "@/components/workspace/BlueprintEditor";
import { AIAssistant } from "@/components/workspace/AIAssistant";
import { ExportReview } from "@/components/workspace/ExportReview";
import { NotificationToast } from "@/components/workspace/NotificationToast";
import { mapApiError, ErrorInfo } from "@/lib/error-mapping";

function ProjectWorkspace() {
  const { 
    messages, ideaState, workflowStep, isProcessing, isChatCompleted, lastUpdatedField,
    addMessage, updateIdeaState, setWorkflowStep, setIsProcessing, setIsChatCompleted, setLastUpdatedField, 
    finalSummary, setFinalSummary, clearSession 
  } = useProjectStore();
  
  const [mounted, setMounted] = useState(false);
  const [brainDump, setBrainDump] = useState("");
  const [refinementInput, setRefinementInput] = useState("");
  const [previewMarkdown, setPreviewMarkdown] = useState("");
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [focusMode, setFocusMode] = useState(true);
  const [initialMissingCount, setInitialMissingCount] = useState(0);
  const [currentMissingCount, setCurrentMissingCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [notification, setNotification] = useState<ErrorInfo | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const ignitedRef = useRef(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) setIsSpeechSupported(true);
  }, []);

  // Highlight logic cleanup
  useEffect(() => {
    if (lastUpdatedField) {
      const timer = setTimeout(() => setLastUpdatedField(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdatedField, setLastUpdatedField]);
  
  // Cleanup for silence timer
  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  const idea = searchParams.get("idea");
  useEffect(() => {
    if (idea && !isProcessing && !ignitedRef.current) {
      ignitedRef.current = true;
      clearSession();
      router.replace("/project");
      handleIgnite(idea);
    }
  }, [idea, clearSession, isProcessing, router]);

  const handleIgnite = async (text: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, phase: 'extraction', state: ideaState })
      });
      const data = await response.json();
      
      if (response.ok && data.updated_state) {
        setWorkflowStep(2);
        await populateSequentially(data.updated_state);
        setInitialMissingCount(data.missingCount || 0);
        setCurrentMissingCount(0);
        setIsChatCompleted(true);
        
        if (data.ai_response) {
          addMessage({
            id: Date.now().toString(),
            role: "assistant",
            content: data.ai_response,
            timestamp: new Date().toISOString()
          });
        }
        setLastUpdatedField(null);
      } else {
        const error = mapApiError(response.status, data.details);
        setNotification(error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    const startText = brainDump;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
    recognition.onerror = () => {
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
    
    recognition.onresult = (event: any) => {
      let sessionTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        sessionTranscript += event.results[i][0].transcript;
      }
      const fullText = startText + (startText ? ' ' : '') + sessionTranscript;
      setBrainDump(fullText);

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (fullText.trim()) {
          recognition.stop();
          handleIgnite(fullText);
        }
      }, 5000);
    };

    recognition.start();
  };

  const populateSequentially = async (update: any) => {
    const fieldsToUpdate: { key: string, value: any }[] = [];
    
    // Always include overview fields first
    const overview = update.overview || {};
    const overviewKeys = ['name', 'description', 'problem', 'targetUsers', 'coreGoal', 'outOfScope'];
    overviewKeys.forEach(k => {
      if (overview[k] !== undefined) {
        fieldsToUpdate.push({ key: `overview.${k}`, value: overview[k] });
      }
    });

    // Then all other top-level fields
    const topLevelKeys = [
      'aiInstructions', 'featureBacklog', 'techStack', 'constraints', 'currentState', 
      'systemArchitecture', 'frontendStructure', 'backendStructure', 'databaseDesign', 
      'apiContract', 'securityLayer', 'performanceStrategy', 'workflowUsageMap', 
      'knownRisks', 'devRules', 'envVariables', 'changeLog', 'futureIdeas', 'finalPrinciple'
    ];
    topLevelKeys.forEach(k => {
      if (update[k] !== undefined) {
        fieldsToUpdate.push({ key: k, value: update[k] });
      }
    });

    for (const item of fieldsToUpdate) {
      if (item.key.includes('.')) {
        const [parent, child] = item.key.split('.');
        updateIdeaState((prev: any) => ({
          ...prev, [parent]: { ...prev[parent], [child]: item.value }
        }));
      } else {
        updateIdeaState({ [item.key]: item.value });
      }
      setLastUpdatedField(item.key);
      await new Promise(r => setTimeout(r, 400));
    }
  };

  const handleRefinement = async () => {
    const text = refinementInput.trim();
    if (!text || isProcessing) return;
    
    setRefinementInput("");
    addMessage({
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString()
    });
    
    setIsProcessing(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          phase: 'refinement', 
          state: ideaState,
          history: messages.slice(-10)
        })
      });
      const data = await response.json();
      
      if (response.ok) {
        setCurrentMissingCount(data.missingCount || 0);
        if (data.isChatCompleted) setIsChatCompleted(true);
        if (data.ai_response) {
          addMessage({
            id: Date.now().toString(),
            role: "assistant",
            content: data.ai_response,
            timestamp: new Date().toISOString()
          });
        }
      } else {
        const error = mapApiError(response.status, data.details);
        setNotification(error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateProgress = () => {
    const fields = [
      ideaState.aiInstructions,
      ideaState.overview.name, ideaState.overview.description, ideaState.overview.problem, 
      ideaState.overview.targetUsers, ideaState.overview.coreGoal, ideaState.overview.outOfScope,
      ideaState.featureBacklog, ideaState.techStack, ideaState.constraints, 
      ideaState.currentState, ideaState.systemArchitecture, 
      ideaState.databaseDesign, ideaState.apiContract, ideaState.securityLayer,
      ideaState.envVariables
    ];
    const filled = fields.filter(f => !!f).length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleFinalize = async () => {
    setIsFinalizing(true);
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: ideaState, mode: "assisted" })
      });
      const data = await response.json();
      if (data.markdown) {
        setPreviewMarkdown(data.markdown);
        setFinalSummary(data.summary || "");
        setWorkflowStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error("Failed to generate blueprint");
      }
    } catch (e) {
      setNotification(mapApiError(500, (e as any).message));
    } finally {
      setIsFinalizing(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex h-screen bg-[#020408] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white/90 selection:bg-primary/20 relative overflow-x-hidden">
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="h-20 glass-effect glow-border-b sticky top-0 z-50 px-4 sm:px-6 flex items-center justify-between">
           <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/" onClick={() => clearSession()} className="flex items-center gap-2 sm:gap-4 hover:opacity-80 transition-opacity font-bold tracking-tight">
                <Logo className="w-10 h-10 sm:w-12 sm:h-12" />
                <span className="font-branding text-[10px] sm:text-sm tracking-[0.2em] hidden xs:block">PRODEA</span>
              </Link>
              <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
              <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest hidden md:flex">
                <span>Step {workflowStep}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white/60">
                   {workflowStep === 1 && "The Brain Dump"}
                   {workflowStep === 2 && "The Refinement"}
                   {workflowStep === 3 && "The Export"}
                </span>
              </div>
           </div>

           <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3 w-24 xs:w-32 md:w-48">
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${calculateProgress()}%` }} />
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-primary">{calculateProgress()}%</span>
              </div>
              <button 
                onClick={() => { if(confirm("Discard and start over?")) clearSession(); }}
                className="p-2 rounded-full hover:bg-white/5 transition-colors text-white/20"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
           </div>
        </header>

          <NotificationToast 
            notification={notification} 
            onClear={() => setNotification(null)} 
          />
          
          <main className="flex-1 flex flex-col relative">
            <ErrorBoundary>
            {workflowStep === 1 && (
              <BrainDump 
                brainDump={brainDump}
                setBrainDump={setBrainDump}
                isProcessing={isProcessing}
                isListening={isListening}
                isSpeechSupported={isSpeechSupported}
                toggleListening={toggleListening}
                onIgnite={handleIgnite}
              />
            )}

            {workflowStep === 2 && (
              <div className="flex-1 flex flex-col md:flex-row animate-in slide-in-from-right duration-700 h-[calc(100vh-64px)] overflow-hidden relative">
                {isFinalizing && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#020408]/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full border-2 border-primary/20 animate-ping absolute inset-0" />
                        <div className="w-20 h-20 rounded-full border-y-2 border-primary animate-spin" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-black uppercase tracking-[0.3em] text-gradient from-white to-primary/60">Architecting...</h3>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mt-2">Infilling strategic blueprint sections</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <BlueprintEditor 
                  ideaState={ideaState}
                  updateIdeaState={updateIdeaState}
                  lastUpdatedField={lastUpdatedField}
                  focusMode={focusMode}
                  setFocusMode={setFocusMode}
                  isProcessing={isProcessing}
                  messages={messages}
                  refinementInput={refinementInput}
                  setRefinementInput={setRefinementInput}
                  isChatCompleted={isChatCompleted}
                  initialMissingCount={initialMissingCount}
                  currentMissingCount={currentMissingCount}
                  handleRefinement={handleRefinement}
                  handleFinalize={handleFinalize}
                />
              </div>
            )}
            {workflowStep === 3 && (
              <ExportReview 
                previewMarkdown={previewMarkdown}
                setPreviewMarkdown={setPreviewMarkdown}
                ideaState={ideaState}
                aiSummary={finalSummary}
                copied={copied}
                setCopied={setCopied}
                setWorkflowStep={setWorkflowStep}
                clearSession={clearSession}
              />
            )}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen bg-[#050A14] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <ProjectWorkspace />
    </Suspense>
  )
}
