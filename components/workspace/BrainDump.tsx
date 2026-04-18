"use client";

import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrainDumpProps {
  brainDump: string;
  setBrainDump: (val: string) => void;
  isProcessing: boolean;
  isListening: boolean;
  isSpeechSupported: boolean;
  toggleListening: () => void;
  onIgnite: (text: string) => void;
}

export function BrainDump({
  brainDump,
  setBrainDump,
  isProcessing,
  isListening,
  isSpeechSupported,
  toggleListening,
  onIgnite,
}: BrainDumpProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-4xl mx-auto w-full animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 tracking-tighter bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
          Ignite your idea.
        </h1>
        <p className="text-base sm:text-lg text-white/40 font-medium px-4">Describe your project idea. Messy is fine.</p>
      </div>
      <div className="w-full relative group px-2 sm:px-0">
        <textarea 
          value={brainDump}
          onChange={(e) => setBrainDump(e.target.value)}
          placeholder="e.g., I want to build a Spotify-like app but for voice-controlled classical music..."
          className="w-full h-48 sm:h-64 bg-white/[0.03] border-2 border-white/5 rounded-3xl p-6 sm:p-8 text-lg sm:text-xl text-white outline-none focus:border-primary/30 transition-all placeholder:text-white/10 shadow-2xl"
        />
        <div className="absolute inset-0 rounded-3xl bg-primary/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-700" />
        
        {isSpeechSupported && (
          <div className="absolute bottom-6 right-6 flex items-center gap-3">
            {isListening && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 animate-pulse transition-all duration-300">
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Listening...</span>
              </div>
            )}
            <button 
              onClick={toggleListening}
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg group/mic",
                isListening 
                  ? "bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)] scale-110" 
                  : "bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
              )}
              title={isListening ? "Stop Listening" : "Start Voice Intake"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 transition-transform group-hover/mic:scale-110" />}
            </button>
          </div>
        )}
      </div>
      <button 
        disabled={!brainDump.trim() || isProcessing}
        onClick={() => onIgnite(brainDump)}
        className="mt-8 group relative px-12 py-5 bg-white text-black font-black rounded-full hover:scale-105 active:scale-95 transition-all flex items-center gap-2 overflow-hidden disabled:opacity-50"
      >
        <span className="relative z-10 transition-colors uppercase tracking-widest text-sm">
          {isProcessing ? "Analyzing..." : "Ignite →"}
        </span>
        {!isProcessing && <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />}
      </button>
    </div>
  );
}
