"use client";

import { Zap } from "lucide-react";
import { cn, humanizeValue } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  icon: React.ReactNode;
  fields: {
    label: string;
    key: string;
    value: any;
    multiline?: boolean;
  }[];
  updateIdeaState: any;
  onAssist?: (field: string) => void;
  hasAssist?: boolean;
  targetField?: string;
  highlightField?: string | null;
  index: number;
  gradient?: string;
}

export function FormSection({ 
  title, 
  icon, 
  fields, 
  updateIdeaState, 
  onAssist, 
  hasAssist, 
  targetField, 
  highlightField, 
  index, 
  gradient 
}: FormSectionProps) {
  return (
    <div 
      className="space-y-6 opacity-0 animate-elastic group" 
      style={{ animationDelay: `${(index || 0) * 0.15}s` }}
    >
       <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110",
            gradient ? `bg-gradient-to-br ${gradient}` : "bg-white/[0.03] border border-white/10"
          )}>
            {icon}
          </div>
          <h3 className={cn(
            "text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300",
            gradient ? `text-gradient ${gradient}` : "text-white/40"
          )}>
            {title}
          </h3>
       </div>
       <div className="grid gap-8">
          {fields.map((f) => {
            const isHighlighted = highlightField === f.key;
            return (
              <div key={f.key} className="relative group">
                 <div className="flex items-center justify-between mb-3 px-1">
                    <label className="text-xs font-black uppercase tracking-widest text-white/40">{f.label}</label>
                    {isHighlighted && <div className="text-[10px] text-primary font-black animate-pulse uppercase tracking-widest flex items-center gap-1.5"><Zap className="w-3 h-3" /> Updated</div>}
                 </div>
                 <div className="relative">
                    {f.multiline ? (
                      <textarea 
                        value={humanizeValue(f.value)}
                        onChange={(e) => {
                           const val = e.target.value;
                           if (f.key.includes('.')) {
                             const [parent, child] = f.key.split('.');
                             updateIdeaState((prev: any) => ({ ...prev, [parent]: { ...prev[parent], [child]: val } }));
                           } else {
                             updateIdeaState({ [f.key]: val });
                           }
                        }}
                        className={cn(
                          "w-full bg-white/[0.02] border-2 border-white/5 rounded-2xl p-5 text-sm text-white outline-none transition-all duration-700 min-h-[120px] resize-none focus:border-primary/20",
                          isHighlighted ? "border-primary/40 bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.1)]" : ""
                        )}
                      />
                    ) : (
                      <input 
                        type="text"
                        value={humanizeValue(f.value)}
                        onChange={(e) => {
                           const val = e.target.value;
                           if (f.key.includes('.')) {
                             const [parent, child] = f.key.split('.');
                             updateIdeaState((prev: any) => ({ ...prev, [parent]: { ...prev[parent], [child]: val } }));
                           } else {
                             updateIdeaState({ [f.key]: val });
                           }
                        }}
                        className={cn(
                          "w-full bg-white/[0.02] border-2 border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none transition-all duration-700 focus:border-primary/20",
                          isHighlighted ? "border-primary/40 bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.1)]" : ""
                        )}
                      />
                    )}
                    {hasAssist && targetField === f.key && (
                       <button 
                        onClick={() => onAssist?.(f.key)}
                        className="absolute right-4 top-4 p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-primary transition-all text-white/30 hover:text-white"
                       >
                         <Zap className="w-4 h-4" />
                       </button>
                    )}
                </div>
              </div>
            );
          })}
       </div>
    </div>
  );
}
