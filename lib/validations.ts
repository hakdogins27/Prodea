import { z } from "zod";

export const ProjectOverviewSchema = z.object({
  name: z.string().max(100).optional().default(''),
  description: z.string().max(2000).optional().default(''),
  problem: z.string().max(1000).optional().default(''),
  targetUsers: z.string().max(500).optional().default(''),
  coreGoal: z.string().max(500).optional().default(''),
  outOfScope: z.string().max(2000).optional().default(''),
});

export const IdeaStateSchema = z.object({
  aiInstructions: z.string().max(2000).optional().default(''),
  overview: ProjectOverviewSchema,
  featureBacklog: z.string().max(5000).optional().default(''),
  techStack: z.string().max(2000).optional().default(''),
  constraints: z.string().max(2000).optional().default(''),
  currentState: z.string().max(2000).optional().default(''),
  systemArchitecture: z.string().max(5000).optional().default(''),
  frontendStructure: z.string().max(3000).optional().default(''),
  backendStructure: z.string().max(3000).optional().default(''),
  databaseDesign: z.string().max(5000).optional().default(''),
  apiContract: z.string().max(5000).optional().default(''),
  securityLayer: z.string().max(3000).optional().default(''),
  performanceStrategy: z.string().max(2000).optional().default(''),
  workflowUsageMap: z.string().max(3000).optional().default(''),
  knownRisks: z.string().max(2000).optional().default(''),
  devRules: z.string().max(2000).optional().default(''),
  envVariables: z.string().max(2000).optional().default(''),
  changeLog: z.string().max(3000).optional().default(''),
  futureIdeas: z.string().max(3000).optional().default(''),
  finalPrinciple: z.string().max(1000).optional().default(''),
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
