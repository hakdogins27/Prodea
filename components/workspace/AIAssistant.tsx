"use client";

import { Check, Cpu, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { IdeaState, Message } from "@/store/useProjectStore";

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
  const isReady = isChatCompleted || (initialMissingCount > 0 && currentMissingCount === 0);

  return (
    <div className="mt-8 spectral-border bg-white/[0.02] rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className={cn(
        "flex flex-col gap-4 p-5 transition-all duration-700",
        isReady ? "border-emerald-500/30 bg-emerald-500/10" : "border-white/10"
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

        <div className="flex flex-col gap-4 max-w-xl mx-auto w-full">
          <p className="text-xs leading-relaxed text-white/30 font-medium text-center px-4 ">
            {messages.length > 0 ? messages[messages.length - 1].content : "Drafting your complete blueprint..."}
          </p>
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleRefinement(); }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="flex-1 relative group">
              <input 
                value={refinementInput}
                onChange={(e) => setRefinementInput(e.target.value)}
                placeholder="Refine logic..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-4 py-3 sm:py-2 pr-10 text-[13px] sm:text-xs outline-none focus:border-white/10 focus:bg-white/[0.05] transition-all font-medium placeholder:text-white/10"
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
              className="flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-emerald-500 text-black rounded-lg hover:scale-[1.02] sm:hover:scale-105 active:scale-95 transition-all shadow-lg font-black uppercase tracking-widest text-xs whitespace-nowrap"
            >
               Finalize <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
