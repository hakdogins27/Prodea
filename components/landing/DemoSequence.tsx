"use client";

import { useState, useEffect } from "react";
import { Terminal, MousePointer2, Loader2, FileJson } from "lucide-react";

export function DemoSequence() {
  const fullText = "I want an AI voice command music player that only picks songs with lyrics synced to the screen.";
  const [typedText, setTypedText] = useState("");
  const [step, setStep] = useState(0); 

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (step === 0) {
      if (typedText.length < fullText.length) {
        timeout = setTimeout(() => setTypedText(fullText.slice(0, typedText.length + 1)), 40);
      } else {
        timeout = setTimeout(() => setStep(1), 500);
      }
    } else if (step === 1) { // Cursor gliding
      timeout = setTimeout(() => setStep(2), 700);
    } else if (step === 2) { // Clicked & Architecture loading
      timeout = setTimeout(() => setStep(3), 800);
    } else if (step === 3) { // Architecture done & Tech loading
      timeout = setTimeout(() => setStep(4), 800);
    } else if (step === 4) { // Tech done & Plan loading
      timeout = setTimeout(() => setStep(5), 800);
    } else if (step === 5) { // Plan done, wait before reset
      timeout = setTimeout(() => { setTypedText(""); setStep(0); }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [typedText, step]);

  return (
    <div className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)] flex flex-col md:flex-row relative">
      <div className="w-full md:w-5/12 bg-white/[0.02] p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-center relative backdrop-blur-md">
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5" /> User Input
        </div>
        <div className="bg-black/40 rounded-2xl p-6 shadow-sm border border-white/10 flex flex-col gap-4 relative min-h-[180px]">
          <div className="absolute -left-3 -top-3 text-4xl opacity-20 text-white font-medium">"</div>
          <div className="font-medium text-lg leading-relaxed text-white/90 min-h-[80px] selection:bg-primary/30">
             {typedText}
             {step === 0 && <span className="animate-pulse inline-block w-1.5 h-5 bg-primary ml-1 align-middle" />}
          </div>
          
          <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
             <div className="flex-1 bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white/30 truncate">
                {typedText.length > 0 ? "Analyzing for total inference..." : "Waiting for spark..."}
             </div>
             <button className={`px-4 py-2 rounded-lg font-black uppercase tracking-widest text-[10px] transition-all duration-300 ${step >= 2 ? 'bg-primary/20 text-white/50 scale-95' : 'bg-primary text-black'}`}>
               Ignite
             </button>
             {/* Animated Cursor */}
             <MousePointer2 
               className={`absolute w-8 h-8 text-black drop-shadow-2xl z-50 transition-all duration-[700ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                 step === 0 ? 'top-32 right-32 opacity-0' :
                 step === 1 ? 'bottom-4 right-4 opacity-100 scale-100' :
                 step === 2 ? 'bottom-4 right-4 opacity-100 scale-75' :
                 'top-32 right-32 opacity-0'
               }`} 
               fill="white"
             />
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-7/12 bg-transparent p-8 relative">
          <div className="text-xs font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
          <FileJson className="w-3.5 h-3.5" /> Prodea Output
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-inner flex flex-col justify-center min-h-[80px]">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Architecture</div>
              {step >= 3 ? <div className="font-semibold text-sm animate-in fade-in zoom-in duration-300">Voice-First Orchestrator</div> : step >= 2 ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /> : <div className="h-4" />}
            </div>
            <div className="p-5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-inner flex flex-col justify-center min-h-[80px]">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Tech Stack</div>
              {step >= 4 ? <div className="font-bold text-sm text-white/90 animate-in fade-in zoom-in duration-300">Next.js + Groq + Spotify</div> : step >= 2 ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /> : <div className="h-4" />}
            </div>
          </div>
          <div className="p-5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-inner min-h-[120px]">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Development Plan (Extracted)</div>
            {step >= 5 ? (
              <ul className="space-y-2 text-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Scaffold Audio Web API layer</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"/> Build real-time LRC ingestion engine</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Implement acoustic echo cancellation</li>
              </ul>
            ) : step >= 2 ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
