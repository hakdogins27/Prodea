import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { INITIAL_IDEA_STATE } from '@/lib/constants';
import { deepMerge } from '@/lib/state-utils';

export interface ProjectOverview {
  name: string;
  description: string;
  problem: string;
  targetUsers: string;
  coreGoal: string;
  outOfScope: string;
}

export interface IdeaState {
  aiInstructions: string;
  // Essential 5 (grouped/expanded)
  overview: ProjectOverview;
  featureBacklog: string;
  techStack: string;
  constraints: string;

  // Additional 13
  currentState: string;
  systemArchitecture: string;
  frontendStructure: string;
  backendStructure: string;
  databaseDesign: string;
  apiContract: string;
  securityLayer: string;
  performanceStrategy: string;
  workflowUsageMap: string;
  knownRisks: string;
  devRules: string;
  envVariables: string;
  changeLog: string;
  futureIdeas: string;
  finalPrinciple: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  // If the AI updated state based on this message, we can optionally track it for UI badges
  extractedState?: Partial<IdeaState>;
}

interface ProjectStore {
  messages: Message[];
  ideaState: IdeaState;
  workflowStep: 1 | 2 | 3;
  isProcessing: boolean;
  isChatCompleted: boolean;
  interviewStep: number;
  lastUpdatedField: string | null;
  addMessage: (message: Message) => void;
  updateIdeaState: (state: Partial<IdeaState> | ((prev: IdeaState) => IdeaState)) => void;
  setWorkflowStep: (step: 1 | 2 | 3) => void;
  setIsProcessing: (processing: boolean) => void;
  setIsChatCompleted: (completed: boolean) => void;
  setInterviewStep: (step: number) => void;
  setLastUpdatedField: (field: string | null) => void;
  clearSession: () => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      messages: [],
      ideaState: INITIAL_IDEA_STATE,
      workflowStep: 1,
      isProcessing: false,
      isChatCompleted: false,
      interviewStep: 0,
      lastUpdatedField: null,
      addMessage: (message) => 
        set((state) => ({ messages: [...state.messages, message] })),
      updateIdeaState: (update) => 
        set((state) => {
          const data = typeof update === 'function' ? update(state.ideaState) : update;
          return { 
            ideaState: deepMerge(state.ideaState, data)
          };
        }),
      setWorkflowStep: (step) => set({ workflowStep: step }),
      setIsProcessing: (processing) => set({ isProcessing: processing }),
      setIsChatCompleted: (completed) => set({ isChatCompleted: completed }),
      setInterviewStep: (step) => set({ interviewStep: step }),
      setLastUpdatedField: (field) => set({ lastUpdatedField: field }),
      clearSession: () => 
        set({ messages: [], ideaState: INITIAL_IDEA_STATE, workflowStep: 1, isProcessing: false, isChatCompleted: false, interviewStep: 0, lastUpdatedField: null }),
    }),
    {
      name: 'prodea-session-v7',
      partialize: (state) => ({
        messages: state.messages,
        ideaState: state.ideaState,
        workflowStep: state.workflowStep,
        isChatCompleted: state.isChatCompleted,
        interviewStep: state.interviewStep,
      }),
    }
  )
)
