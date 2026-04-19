"use client";

import React, { useEffect } from "react";
import { AlertCircle, CheckCircle2, Info, X, AlertTriangle } from "lucide-react";
import { ErrorInfo } from "@/lib/error-mapping";

interface Props {
  notification: ErrorInfo | null;
  onClear: () => void;
  duration?: number;
}

export function NotificationToast({ notification, onClear, duration = 6000 }: Props) {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(onClear, duration);
      return () => clearTimeout(timer);
    }
  }, [notification, onClear, duration]);

  if (!notification) return null;

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-orange-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  };

  const borders = {
    error: "border-red-500/20 shadow-red-500/10",
    warning: "border-orange-500/20 shadow-orange-500/10",
    info: "border-blue-500/20 shadow-blue-500/10",
    success: "border-emerald-500/20 shadow-emerald-500/10",
  };

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className={`p-4 rounded-2xl glass-effect border ${borders[notification.type]} shadow-2xl flex items-start gap-4`}>
        <div className="mt-0.5">{icons[notification.type]}</div>
        <div className="flex-1">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-1">{notification.message}</h4>
          {notification.description && (
            <p className="text-[10px] text-white/40 font-medium leading-relaxed">
              {notification.description}
            </p>
          )}
        </div>
        <button 
          onClick={onClear}
          className="p-1 hover:bg-white/5 rounded-full transition-colors opacity-40 hover:opacity-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
