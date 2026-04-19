"use client";

import { FileText, Command, ClipboardCheck, Download, RotateCcw, Check, Sparkles } from "lucide-react";
import { IdeaState } from "@/store/useProjectStore";

interface ExportReviewProps {
  previewMarkdown: string;
  setPreviewMarkdown: (val: string) => void;
  ideaState: IdeaState;
  aiSummary: string | null;
  copied: boolean;
  setCopied: (val: boolean) => void;
  setWorkflowStep: (step: 1 | 2 | 3) => void;
  clearSession: () => void;
}

export function ExportReview({
  previewMarkdown,
  setPreviewMarkdown,
  ideaState,
  aiSummary,
  copied,
  setCopied,
  setWorkflowStep,
  clearSession,
}: ExportReviewProps) {
  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-6xl mx-auto w-full animate-in fade-in zoom-in duration-700">
      <div className="flex flex-col md:flex-row gap-6 sm:gap-8 h-full min-h-0 md:min-h-[600px]">
        
        {/* Left: The Content Preview */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight">Final Blueprint</h2>
                <p className="text-[10px] sm:text-xs text-white/40 font-bold uppercase tracking-widest">Review and finalize content</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(previewMarkdown);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-xs font-bold"
              >
                {copied ? <ClipboardCheck className="w-4 h-4 text-emerald-400" /> : <Command className="w-4 h-4 text-white/40" />}
                {copied ? "Copied!" : "Copy Markdown"}
              </button>
            </div>
          </div>

          <div className="flex-1 relative group">
            <textarea 
              value={previewMarkdown}
              onChange={(e) => setPreviewMarkdown(e.target.value)}
              className="w-full h-full min-h-[300px] md:min-h-[500px] bg-white/[0.02] border-2 border-white/5 rounded-3xl p-6 sm:p-8 font-mono text-[13px] sm:text-sm leading-relaxed text-white/80 outline-none focus:border-emerald-500/30 transition-all custom-scrollbar resize-none"
            />
            <div className="absolute inset-0 rounded-3xl bg-emerald-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-700" />
          </div>
        </div>

        {/* Right: AI Summary & Final Actions */}
        <div className="w-full md:w-80 flex flex-col gap-6">
          
          {/* AI SUMMARY CARD */}
          <div className="glass-glow border border-white/10 rounded-3xl p-6 flex flex-col gap-6 spectral-border relative z-10">
            <div className="text-center pb-6 border-b border-white/5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 via-red-600 to-amber-500 border-2 border-white/20 flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(220,38,38,0.4)] animate-spectrum-glow">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-gradient from-white to-orange-400">System Ready</h3>
              <p className="text-xs text-white/40">Blueprint generation complete.</p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={async () => {
                  const blob = new Blob([previewMarkdown], { type: "text/markdown" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${ideaState.overview.name || 'prodea'}_blueprint.md`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_15_40px_rgba(220,38,38,0.3)] spectral-border"
              >
                Download .md <Download className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setWorkflowStep(2)}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all text-xs"
              >
                <RotateCcw className="w-4 h-4" /> Back to Editor
              </button>
            </div>
          </div>

          {/* AI SUMMARY CARD (Moved Below Download for conversion priority) */}
          {aiSummary !== null && (
            <div className="glass-glow border border-primary/20 rounded-3xl p-6 relative overflow-hidden group animate-in slide-in-from-top duration-700">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Architect's Summary</span>
                </div>
                <p className="text-[13px] leading-relaxed text-white/70 font-medium italic">
                  "{aiSummary}"
                </p>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest">Alignment Verified</p>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-primary/40 animate-pulse" />
                    <div className="w-1 h-1 rounded-full bg-primary/40 animate-pulse delay-75" />
                    <div className="w-1 h-1 rounded-full bg-primary/40 animate-pulse delay-150" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={clearSession}
            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/10 hover:text-red-400 transition-colors"
          >
            Destroy session & Restart
          </button>
        </div>
      </div>
    </div>
  );
}
