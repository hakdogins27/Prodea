import { z } from "zod";

const flexibleString = z.union([z.string(), z.any()]).transform(val => {
  if (typeof val === 'string') return val;
  if (val === null || val === undefined) return '';
  try {
    if (Array.isArray(val)) return val.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join('\n');
    if (typeof val === 'object') return Object.entries(val).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`).join('\n');
    return String(val);
  } catch (e) {
    return String(val);
  }
});

export const ProjectOverviewSchema = z.object({
  name: flexibleString.optional().default(''),
  description: flexibleString.optional().default(''),
  problem: flexibleString.optional().default(''),
  targetUsers: flexibleString.optional().default(''),
  coreGoal: flexibleString.optional().default(''),
  outOfScope: flexibleString.optional().default(''),
});

export const IdeaStateSchema = z.object({
  aiInstructions: flexibleString.optional().default(''),
  overview: ProjectOverviewSchema,
  featureBacklog: flexibleString.optional().default(''),
  techStack: flexibleString.optional().default(''),
  constraints: flexibleString.optional().default(''),
  currentState: flexibleString.optional().default(''),
  systemArchitecture: flexibleString.optional().default(''),
  frontendStructure: flexibleString.optional().default(''),
  backendStructure: flexibleString.optional().default(''),
  databaseDesign: flexibleString.optional().default(''),
  apiContract: flexibleString.optional().default(''),
  securityLayer: flexibleString.optional().default(''),
  performanceStrategy: flexibleString.optional().default(''),
  workflowUsageMap: flexibleString.optional().default(''),
  knownRisks: flexibleString.optional().default(''),
  devRules: flexibleString.optional().default(''),
  envVariables: flexibleString.optional().default(''),
  changeLog: flexibleString.optional().default(''),
  futureIdeas: flexibleString.optional().default(''),
  finalPrinciple: flexibleString.optional().default(''),
});

export const ChatRequestSchema = z.object({
  message: z.string().min(1, "Message is required").max(5000),
  phase: z.enum(['extraction', 'refinement']).optional().default('extraction'),
  state: IdeaStateSchema.optional(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().default([]),
});

export const ExportRequestSchema = z.object({
  state: IdeaStateSchema,
  mode: z.enum(['clean', 'assisted', 'raw']).optional().default('clean'),
});
