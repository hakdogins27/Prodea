"use client";

import { Check, Cpu, Loader2, Sparkles, ArrowRight, Copy, Terminal } from "lucide-react";
import { cn, humanizeValue } from "@/lib/utils";
import { parseAssistantResponse } from "@/lib/message-parser";
import { IdeaState, Message } from "@/store/useProjectStore";
import { useState } from "react";

interface AIAssistantProps {
  ideaState: IdeaState;
  messages: Message[];
  refinementInput: string;
  setRefinementInput: (val: string) => void;
  isProcessing: boolean;
  isChatCompleted: boolean;
  initialMissingCount: number;
  currentMissingCount: number;
  handleRefinement: () => void;
  handleFinalize: () => void;
}

export function AIAssistant({
  ideaState,
  messages,
  refinementInput,
  setRefinementInput,
  isProcessing,
  isChatCompleted,
  initialMissingCount,
  currentMissingCount,
  handleRefinement,
  handleFinalize,
}: AIAssistantProps) {
  const [copied, setCopied] = useState(false);
  const isReady = isChatCompleted || (initialMissingCount > 0 && currentMissingCount === 0);

  const lastMessage = messages[messages.length - 1];
  const { guidance, suggestion } = lastMessage && lastMessage.role === "assistant" 
    ? parseAssistantResponse(lastMessage.content)
    : { guidance: "Drafting your complete blueprint...", suggestion: null };

  const copyToClipboard = () => {
    if (!suggestion) return;
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 spectral-border bg-[#020408]/40 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className={cn(
        "flex flex-col gap-4 p-5 transition-all duration-700",
        isReady ? "border-emerald-500/30 bg-emerald-500/10" : "border-white/5"
      )}>
        {/* Hardening Checklist Header */}
        <div className="flex flex-col items-center gap-4 pb-4 border-b border-white/5">
          <div className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center border text-xs font-black transition-all duration-700 shadow-[0_0_20px_rgba(16,185,129,0.15)]", 
              (ideaState.overview.name) ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-500" : "bg-primary/20 border-primary/30 text-primary"
            )}>
              {(ideaState.overview.name) ? <Check className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
            </div>
            <div className="text-center">
              <h4 className={cn("text-[10px] font-black uppercase tracking-[0.3em] transition-colors mb-0.5", (ideaState.overview.name) ? "text-emerald-500" : "text-primary")}>
                {(ideaState.overview.name) ? "Architecture Ready" : "System Refining"}
              </h4>
              <p className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em]">
                 {(ideaState.overview.name) ? "Ready for final ignition" : "Verification in Progress"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: "Features", val: ideaState.featureBacklog },
              { label: "Stack", val: ideaState.techStack },
              { label: "Users", val: ideaState.overview.targetUsers },
              { label: "Constraints", val: ideaState.constraints },
              { label: "Arch", val: ideaState.systemArchitecture }
            ].map((item, i) => (
              <div key={i} className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest transition-all duration-500",
                item.val ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-white/5 border-white/5 text-white/20"
              )}>
                {item.val ? <Check className="w-2.5 h-2.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 max-w-xl mx-auto w-full py-2">
          {/* Guidance Section */}
          <div className="px-4">
            <p className="text-xs leading-relaxed text-white/40 font-medium text-center">
              {humanizeValue(guidance)}
            </p>
          </div>

          {/* Suggestion Card */}
          {suggestion && (
            <div className="relative group mx-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="absolute -top-2.5 right-4 px-2 py-0.5 bg-white/5 border border-white/10 rounded-md backdrop-blur-md z-10 transition-colors group-hover:border-primary/40">
                <div className="flex items-center gap-1.5 ">
                   <Terminal className="w-2.5 h-2.5 text-primary" />
                   <span className="text-[8px] font-black uppercase tracking-widest text-primary/60">Suggested Update</span>
                </div>
              </div>
              
              <div className="relative bg-white/[0.02] border border-white/5 rounded-2xl p-5 pt-7 group-hover:border-white/10 transition-all overflow-hidden">
                <pre className="text-[11px] leading-relaxed text-white/70 font-mono whitespace-pre-wrap">
                  {suggestion}
                </pre>
                
                <button 
                  onClick={copyToClipboard}
                  className={cn(
                    "absolute top-3 right-3 p-2 rounded-lg transition-all duration-300 hover:bg-white/10",
                    copied ? "text-emerald-500 bg-emerald-500/10" : "text-white/20"
                  )}
                  title="Copy Suggestion"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleRefinement(); }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-4"
          >
            <div className="flex-1 relative group">
              <input 
                value={refinementInput}
                onChange={(e) => setRefinementInput(e.target.value)}
                placeholder="Refine logic..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 sm:py-2.5 pr-10 text-[13px] sm:text-xs outline-none focus:border-white/10 focus:bg-white/[0.05] transition-all font-medium placeholder:text-white/10"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                <Sparkles className="w-4 h-4" />
              </div>
              {isProcessing && (
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                </div>
              )}
            </div>

            <button 
              type="button"
              onClick={handleFinalize}
              className="flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 bg-emerald-500 text-black rounded-xl hover:scale-[1.02] sm:hover:scale-105 active:scale-95 transition-all shadow-lg font-black uppercase tracking-widest text-xs whitespace-nowrap"
            >
               Finalize <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
