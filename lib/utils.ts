import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { IdeaState } from "@/store/useProjectStore"
import { renderBlueprint } from "./blueprint-renderer"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const humanizeValue = (val: any): string => {
  if (!val) return "";
  
  let processed = val;
  if (typeof val === 'string') {
    // 1. Detect and split grouped bullet points (e.g., "- Item A - Item B" -> newlines)
    // We look for a dash that is preceded by non-newline characters and followed by a space
    processed = val.replace(/([^\n])\s+-\s+/g, '$1\n- ');

    // 2. Flatten markdown tables if found in Step 2 preview
    if (processed.includes('|') && processed.includes('---')) {
      processed = processed.split('\n')
        .filter((line: string) => !line.includes('---')) // remove separator
        .map((line: string) => {
          if (line.trim().startsWith('|')) {
            const cells = line.split('|').map((c: string) => c.trim()).filter((c: string) => c !== "");
            return `- ${cells.join(': ')}`;
          }
          return line;
        })
        .join('\n');
    }
    return processed;
  }
  
  if (Array.isArray(val)) {
    return val.map((item: any) => typeof item === 'object' ? humanizeValue(item) : `- ${item}`).join('\n');
  }
  
  if (typeof val === 'object') {
    return Object.values(val)
      .map((v: any) => humanizeValue(v))
      .filter((v: string) => v.trim() !== "")
      .join('\n\n');
  }
  
  return String(val);
};

export const renderMarkdown = (state: IdeaState) => {
  return renderBlueprint(state);
};
