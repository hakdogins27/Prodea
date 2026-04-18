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
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-red-500/5 border border-red-500/20 rounded-3xl">
          <h2 className="text-xl font-black text-red-500 mb-4 uppercase tracking-[0.2em]">Workspace Error</h2>
          <p className="text-sm text-white/40 mb-8 max-w-md">Something went wrong in the architectural engine. Your progress is saved in local storage.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-white text-black font-black rounded-full uppercase tracking-widest text-xs hover:scale-105 transition-all"
          >
            Refresh Workspace
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
