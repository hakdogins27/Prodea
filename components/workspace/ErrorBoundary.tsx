"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="max-w-lg w-full p-8 rounded-[2rem] glass-effect border border-red-500/10 shadow-2xl relative overflow-hidden text-center">
            {/* Subtle glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-600/10 blur-[60px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              
              <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-white/90 mb-4 selection:bg-red-500/30">
                Sync Interrupted
              </h2>
              
              <p className="text-sm text-white/40 font-medium leading-relaxed mb-10">
                The architectural engine encountered a critical inconsistency. Your session data remains preserved in local storage.
              </p>
              
              <button 
                onClick={() => window.location.reload()}
                className="group relative px-10 py-4 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                Re-Initialize Engine
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
