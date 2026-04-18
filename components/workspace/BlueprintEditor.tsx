import { Layout, RotateCcw, ListTodo, Command, Cpu, Database, ArrowRight, ShieldCheck, FileText, Workflow, MoreHorizontal, Check, Sparkles } from "lucide-react";
import { FormSection } from "./FormSection";
import { IdeaState, Message } from "@/store/useProjectStore";
import { cn } from "@/lib/utils";
import { AIAssistant } from "./AIAssistant";

interface BlueprintEditorProps {
  ideaState: IdeaState;
  updateIdeaState: any;
  lastUpdatedField: string | null;
  focusMode: boolean;
  setFocusMode: (val: boolean) => void;
  isProcessing: boolean;
  messages: Message[];
  refinementInput: string;
  setRefinementInput: (val: string) => void;
  isChatCompleted: boolean;
  initialMissingCount: number;
  currentMissingCount: number;
  handleRefinement: () => void;
  handleFinalize: () => void;
}

export function BlueprintEditor({
  ideaState,
  updateIdeaState,
  lastUpdatedField,
  focusMode,
  setFocusMode,
  isProcessing,
  messages,
  refinementInput,
  setRefinementInput,
  isChatCompleted,
  initialMissingCount,
  currentMissingCount,
  handleRefinement,
  handleFinalize,
}: BlueprintEditorProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 sm:space-y-10 pb-32 custom-scrollbar">
      <div className="max-w-2xl mx-auto space-y-10 sm:space-y-12">
        
        {/* Workspace Header & Toggle with Mobile Focus */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/5 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Command className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight">Strategy Workspace</h2>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{focusMode ? "Focus Mode Active" : "Professional Architect Mode"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setFocusMode(!focusMode)}
              className={cn(
                "flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                focusMode ? "bg-primary text-black border-primary" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
              )}
            >
              {focusMode ? "Switch to Pro Mode" : "Back to Focus"}
            </button>
          </div>
        </div>

        {/* SECTION 0 */}
        {!focusMode && (
          <FormSection 
            title="AI INSTRUCTIONS" 
            icon={<Sparkles className="w-4 h-4 text-white" />}
            index={0}
            gradient="from-purple-500 to-blue-600"
            fields={[{ label: "Agent Guardrails", key: "aiInstructions", value: ideaState.aiInstructions, multiline: true }]}
            updateIdeaState={updateIdeaState}
            highlightField={lastUpdatedField}
          />
        )}

        {/* SECTION 1 */}
        <FormSection 
          title="PROJECT OVERVIEW" 
          icon={<Layout className="w-4 h-4 text-white" />}
          index={1}
          gradient="from-blue-400 to-indigo-600"
          fields={[
            { label: "Project Name", key: "overview.name", value: ideaState.overview.name },
            { label: "Core Goal", key: "overview.coreGoal", value: ideaState.overview.coreGoal },
            { label: "Problem it solves", key: "overview.problem", value: ideaState.overview.problem },
            { label: "Target Users", key: "overview.targetUsers", value: ideaState.overview.targetUsers },
            { label: "Description", key: "overview.description", value: ideaState.overview.description, multiline: true },
            { label: "Out of Scope", key: "overview.outOfScope", value: ideaState.overview.outOfScope, multiline: true },
          ]}
          updateIdeaState={updateIdeaState}
          highlightField={lastUpdatedField}
        />

        {/* SECTION 2 */}
        <FormSection 
          title="CURRENT STATE" 
          icon={<RotateCcw className="w-4 h-4 text-white" />}
          index={2}
          gradient="from-emerald-400 to-teal-600"
          fields={[{ label: "Live Status", key: "currentState", value: ideaState.currentState, multiline: true }]}
          updateIdeaState={updateIdeaState}
          highlightField={lastUpdatedField}
        />

        {/* SECTION 3 */}
        <FormSection 
          title="FEATURE BACKLOG" 
          icon={<ListTodo className="w-4 h-4 text-white" />}
          index={3}
          gradient="from-teal-400 to-cyan-600"
          fields={[{ label: "Roadmap (MVP/Post-MVP)", key: "featureBacklog", value: ideaState.featureBacklog, multiline: true }]}
          updateIdeaState={updateIdeaState}
          highlightField={lastUpdatedField}
        />

        {/* SECTION 4 */}
        <FormSection 
          title="TECH STACK" 
          icon={<Command className="w-4 h-4 text-white" />}
          index={4}
          gradient="from-cyan-400 to-blue-600"
          fields={[{ label: "Layered Stack", key: "techStack", value: ideaState.techStack, multiline: true }]}
          updateIdeaState={updateIdeaState}
          highlightField={lastUpdatedField}
        />

        {/* SECTION 5-8 */}
        {!focusMode && (
          <div className="space-y-12 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-700">
            <FormSection 
              title="SYSTEM ARCHITECTURE" 
              icon={<Cpu className="w-4 h-4 text-white" />}
              index={5}
              gradient="from-orange-600 to-red-700"
              fields={[{ label: "Architecture Type & Decisions", key: "systemArchitecture", value: ideaState.systemArchitecture, multiline: true }]}
              updateIdeaState={updateIdeaState}
              highlightField={lastUpdatedField}
            />
            <div className="grid md:grid-cols-2 gap-8">
              <FormSection title="FRONTEND" icon={<Layout className="w-4 h-4" />} fields={[{ label: "Structure", key: "frontendStructure", value: ideaState.frontendStructure, multiline: true }]} updateIdeaState={updateIdeaState} highlightField={lastUpdatedField} index={6} gradient="from-blue-500 to-indigo-600" />
              <FormSection title="BACKEND" icon={<Cpu className="w-4 h-4" />} fields={[{ label: "Runtime & API Style", key: "backendStructure", value: ideaState.backendStructure, multiline: true }]} updateIdeaState={updateIdeaState} highlightField={lastUpdatedField} index={7} gradient="from-indigo-600 to-purple-700" />
            </div>
            <FormSection title="DATABASE" icon={<Database className="w-4 h-4" />} fields={[{ label: "Schema & Entities", key: "databaseDesign", value: ideaState.databaseDesign, multiline: true }]} updateIdeaState={updateIdeaState} highlightField={lastUpdatedField} index={8} gradient="from-purple-700 to-pink-600" />
          </div>
        )}

        {/* SECTION 9 */}
        <FormSection 
          title="API CONTRACT" 
          icon={<ArrowRight className="w-4 h-4 text-white" />} 
          fields={[{ label: "Endpoint Map", key: "apiContract", value: ideaState.apiContract, multiline: true }]} 
          updateIdeaState={updateIdeaState} 
          highlightField={lastUpdatedField} 
          index={9} 
          gradient="from-pink-600 to-rose-600" 
        />

        {/* SECTION 10-12 */}
        {!focusMode && (
          <div className="space-y-12 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-700">
            <FormSection title="SECURITY" icon={<ShieldCheck className="w-4 h-4" />} fields={[{ label: "Auth & Hardening", key: "securityLayer", value: ideaState.securityLayer, multiline: true }]} updateIdeaState={updateIdeaState} highlightField={lastUpdatedField} index={10} gradient="from-rose-600 to-slate-600" />
            <FormSection title="PERFORMANCE" icon={<FileText className="w-4 h-4" />} fields={[{ label: "Strategy & Targets", key: "performanceStrategy", value: ideaState.performanceStrategy, multiline: true }]} updateIdeaState={updateIdeaState} highlightField={lastUpdatedField} index={11} gradient="from-slate-600 to-gray-800" />
            <FormSection 
              title="WORKFLOW MAP" 
              icon={<Workflow className="w-4 h-4 text-white" />}
              index={12}
              gradient="from-amber-400 to-orange-600"
              fields={[{ label: "Usage Flow", key: "workflowUsageMap", value: ideaState.workflowUsageMap, multiline: true }]}
              updateIdeaState={updateIdeaState}
              highlightField={lastUpdatedField}
            />
          </div>
        )}

        {/* SECTION 13-14 */}
        <div className="grid md:grid-cols-2 gap-8">
          <FormSection title="CONSTRAINTS" icon={<MoreHorizontal className="w-4 h-4 text-white" />} index={13} gradient="from-red-400 to-orange-600" fields={[{ label: "Limits", key: "constraints", value: ideaState.constraints, multiline: true }]} updateIdeaState={updateIdeaState} highlightField={lastUpdatedField} />
          <FormSection title="KNOWN RISKS" icon={<ShieldCheck className="w-4 h-4 text-white" />} index={14} gradient="from-rose-400 to-pink-600" fields={[{ label: "Risk Matrix", key: "knownRisks", value: ideaState.knownRisks, multiline: true }]} updateIdeaState={updateIdeaState} highlightField={lastUpdatedField} />
        </div>

        {/* SECTION 15 */}
        {!focusMode && (
          <FormSection title="DEV RULES" icon={<Check className="w-4 h-4 text-white" />} fields={[{ label: "Team Guidelines", key: "devRules", value: ideaState.devRules, multiline: true }]} updateIdeaState={updateIdeaState} highlightField={lastUpdatedField} index={15} gradient="from-indigo-600 to-blue-500" />
        )}

        {/* SECTION 16 */}
        <FormSection title="ENV VARIABLES" icon={<Command className="w-4 h-4 text-white" />} fields={[{ label: ".env.example", key: "envVariables", value: ideaState.envVariables, multiline: true }]} updateIdeaState={updateIdeaState} highlightField={lastUpdatedField} index={16} gradient="from-blue-600 to-cyan-500" />
        
        {/* SECTION 17-19 */}
        {!focusMode && (
          <div className="space-y-12 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="grid md:grid-cols-2 gap-8">
              <FormSection title="CHANGE LOG" icon={<FileText className="w-4 h-4 text-white" />} fields={[{ label: "History", key: "changeLog", value: ideaState.changeLog, multiline: true }]} updateIdeaState={updateIdeaState} highlightField={lastUpdatedField} index={17} gradient="from-indigo-500 to-purple-600" />
              <FormSection title="FUTURE IDEAS" icon={<Sparkles className="w-4 h-4 text-white" />} fields={[{ label: "Parking Lot", key: "futureIdeas", value: ideaState.futureIdeas, multiline: true }]} updateIdeaState={updateIdeaState} highlightField={lastUpdatedField} index={18} gradient="from-cyan-600 to-blue-500" />
            </div>
            <FormSection title="FINAL PRINCIPLE" icon={<Layout className="w-4 h-4 text-white" />} fields={[{ label: "The Philosophy", key: "finalPrinciple", value: ideaState.finalPrinciple, multiline: true }]} updateIdeaState={updateIdeaState} highlightField={lastUpdatedField} index={19} gradient="from-slate-600 to-slate-400" />
          </div>
        )}

        {/* AI Assistant Integrated into the Form Flow */}
        <AIAssistant 
          ideaState={ideaState}
          messages={messages}
          refinementInput={refinementInput}
          setRefinementInput={setRefinementInput}
          isProcessing={isProcessing}
          isChatCompleted={isChatCompleted}
          initialMissingCount={initialMissingCount}
          currentMissingCount={currentMissingCount}
          handleRefinement={handleRefinement}
          handleFinalize={handleFinalize}
        />
      </div>
    </div>
  );
}
