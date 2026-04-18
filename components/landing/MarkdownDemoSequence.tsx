"use client";

import { useState, useEffect } from "react";
import { Download, Folder, FileText, MousePointer2 } from "lucide-react";

export function MarkdownDemoSequence() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (step === 0) timeout = setTimeout(() => setStep(1), 1000); // Move cursor to Export
    else if (step === 1) timeout = setTimeout(() => setStep(2), 600);  // Click Export, file appears
    else if (step === 2) timeout = setTimeout(() => setStep(3), 1000); // Drag to Folder
    else if (step === 3) timeout = setTimeout(() => setStep(4), 500);  // Drop into Folder
    else if (step === 4) timeout = setTimeout(() => setStep(5), 3000); // Success flash, hold
    else if (step === 5) timeout = setTimeout(() => setStep(0), 500);  // Reset instantly
    return () => clearTimeout(timeout);
  }, [step]);

  return (
    <div className="relative w-full aspect-video sm:aspect-video bg-[#0A0A0A] rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center">
      
      {/* Simulated Mac Top Bar */}
      <div className="absolute top-0 left-0 w-full h-6 sm:h-8 bg-white/5 border-b border-white/10 flex items-center px-3 sm:px-4 gap-1.5 sm:gap-2 z-10 box-border">
        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
      </div>

      <div className="w-full h-full pt-6 sm:pt-8 flex items-center justify-center relative p-4 sm:p-8">
         {/* Left Side: Prodea Window */}
         <div className="absolute left-4 sm:left-8 top-10 sm:top-12 w-[55%] sm:w-64 h-32 sm:h-48 bg-white/[0.03] rounded-xl border border-white/10 flex flex-col items-center justify-center p-2 sm:p-4">
            <h4 className="font-bold text-white/30 text-[8px] sm:text-xs mb-2 sm:mb-4 tracking-widest text-center">PRODEA ENGINE</h4>
            <div className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium text-[8px] sm:text-xs flex items-center gap-1 sm:gap-2 transition-all duration-150 ${step >= 2 ? 'bg-primary/50 text-white scale-95' : 'bg-primary text-black'}`}>
               <Download className="w-3 h-3 sm:w-4 sm:h-4" /> Export
            </div>
         </div>

         {/* Right Side: AI IDE Workspace Folder */}
         <div className={`absolute right-4 sm:right-12 top-20 sm:top-24 w-[35%] sm:w-40 h-24 sm:h-32 rounded-xl flex flex-col items-center justify-center transition-all duration-500 ${step >= 4 ? 'bg-emerald-500/10 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'bg-white/[0.02] border border-white/10'}`}>
            <Folder className={`w-8 h-8 sm:w-12 sm:h-12 mb-1 sm:mb-2 transition-colors duration-500 ${step >= 4 ? 'text-emerald-500 fill-emerald-500/20' : 'text-blue-400 fill-blue-400/20'}`} />
            <span className="font-mono text-[8px] sm:text-xs text-muted-foreground font-bold">/root</span>
            <span className={`absolute -bottom-6 sm:-bottom-8 font-mono text-[7px] sm:text-[9px] font-bold text-emerald-400 transition-opacity duration-300 ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}>&gt; CONTEXT</span>
         </div>

         {/* Animating File Asset */}
         <div className={`absolute z-20 flex flex-col items-center gap-1 transition-all pointer-events-none
            ${step < 2 ? 'opacity-0 scale-90 top-[35%] left-[20%] sm:top-32 sm:left-32' : ''}
            ${step === 2 ? 'opacity-100 scale-100 top-[35%] left-[20%] sm:top-32 sm:left-32 duration-300' : ''} 
            ${step === 3 ? 'opacity-100 scale-[0.7] sm:scale-100 top-[25%] right-[25%] sm:top-24 sm:right-32 duration-1000 ease-expo' : ''}
            ${step >= 4 ? 'opacity-0 scale-50 top-[30%] right-[10%] sm:top-32 sm:right-12 duration-300' : ''}
         `}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white shadow-xl rounded flex items-center justify-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            </div>
            <span className="text-[7px] sm:text-[10px] font-mono text-white/80 bg-black/50 px-1 rounded">blueprint.md</span>
         </div>

         {/* Animating Mouse Cursor */}
         <MousePointer2 
           className={`absolute w-6 h-6 sm:w-8 sm:h-8 text-black drop-shadow-2xl z-50 transition-all pointer-events-none 
             ${step === 0 ? 'bottom-4 left-1/2 duration-0' : ''}
             ${step === 1 ? 'top-[35%] left-[25%] sm:top-32 sm:left-36 duration-1000 ease-out' : ''}
             ${step === 2 ? 'top-[35%] left-[25%] sm:top-32 sm:left-36 scale-75 duration-150' : ''}
             ${step === 3 ? 'top-[25%] right-[25%] sm:top-24 sm:right-32 scale-100 duration-1000 ease-expo' : ''}
             ${step >= 4 ? 'top-[30%] right-[5%] sm:top-32 sm:right-8 duration-700 ease-in' : ''}
           `} 
           fill="white"
         />
      </div>
    </div>
  )
}
