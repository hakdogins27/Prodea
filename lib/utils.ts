import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { IdeaState } from "@/store/useProjectStore"
import { renderBlueprint } from "./blueprint-renderer"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const humanizeValue = (val: any): string => {
  if (!val) return "";
  
  if (typeof val === 'string') {
    let processed = val;
    // 1. Detect and split joined categories (e.g., "Category: Item AnotherCategory: Item")
    // We look for a pattern like "Word: " after some text without a newline
    processed = processed.replace(/([^\n])\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*:)/g, '$1\n$2');

    // 2. Ensure bullet points are on new lines
    processed = processed.replace(/([^\n])\s+-\s+/g, '$1\n- ');

    // 3. Clean up any tripled newlines that might occur from aggressive matching
    return processed.replace(/\n{3,}/g, '\n\n').trim();
  }
  
  if (Array.isArray(val)) {
    return val.map((item: any) => typeof item === 'object' ? humanizeValue(item) : `- ${item}`).join('\n');
  }
  
  if (typeof val === 'object' && val !== null) {
    return Object.entries(val)
      .map(([k, v]) => {
        const label = k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1');
        return `${label}: ${humanizeValue(v)}`;
      })
      .join('\n\n');
  }
  
  return String(val);
};

export const renderMarkdown = (state: IdeaState) => {
  return renderBlueprint(state);
};
