import { IdeaState } from "@/store/useProjectStore";

export const EMPTY_STATE_SCHEMA: IdeaState = {
  aiInstructions: '',
  overview: {
    name: '', 
    description: '', 
    problem: '',
    targetUsers: '', 
    coreGoal: '',
    outOfScope: ''
  },
  featureBacklog: '',
  techStack: '',
  constraints: '',
  currentState: '',
  systemArchitecture: '',
  frontendStructure: '',
  backendStructure: '',
  databaseDesign: '',
  apiContract: '',
  securityLayer: '',
  performanceStrategy: '',
  workflowUsageMap: '',
  knownRisks: '',
  devRules: '',
  envVariables: '',
  changeLog: '',
  futureIdeas: '',
  finalPrinciple: ''
};

export const INITIAL_IDEA_STATE = EMPTY_STATE_SCHEMA;
