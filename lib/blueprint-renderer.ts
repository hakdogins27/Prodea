import { IdeaState } from "@/store/useProjectStore";

/**
 * Cleans a field value by stripping leading markdown headers and redundant whitespace.
 * Prevents "## ##" duplicates.
 */
export function cleanField(val: string): string {
  if (!val) return '(Unspecified)';
  // Strip any leading # or whitespace followed by #
  return val.replace(/^(?:\s*#+\s*)+/, '').trim();
}

/**
 * Renders the state into a professional PROJECT.md format.
 * This is the SINGLE SOURCE OF TRUTH for blueprint rendering.
 */
export function renderBlueprint(state: IdeaState): string {
  const clean = (v: string) => cleanField(v);
  
  const sections = [
    `# PROJECT.md — LIVING SYSTEM CONTEXT`,
    `> This file is the single source of truth for this project.`,
    `> Update it after every meaningful change. Never let it go stale.`,
    `---`,
    `## 0. AI INSTRUCTIONS *(read this first)*\n\n${clean(state.aiInstructions)}`,
    `---`,
    `## 1. PROJECT OVERVIEW`,
    `- **Project Name**: ${clean(state.overview.name)}`,
    `- **Description**: ${clean(state.overview.description)}`,
    `- **Problem Statement**: ${clean(state.overview.problem)}`,
    `- **Target Users**: ${clean(state.overview.targetUsers)}`,
    `- **Core Goal**: ${clean(state.overview.coreGoal)}`,
    `- **Out of Scope**: ${clean(state.overview.outOfScope)}`,
    `---`,
    `## 2. CURRENT STATE *(live status)*\n\n${clean(state.currentState)}`,
    `---`,
    `## 3. FEATURE BACKLOG *(roadmap)*\n\n${clean(state.featureBacklog)}`,
    `---`,
    `## 4. TECH STACK\n\n${clean(state.techStack)}`,
    `---`,
    `## 5. SYSTEM ARCHITECTURE\n\n${clean(state.systemArchitecture)}`,
    `---`,
    `## 6. FRONTEND STRUCTURE\n\n${clean(state.frontendStructure)}`,
    `---`,
    `## 7. BACKEND STRUCTURE\n\n${clean(state.backendStructure)}`,
    `---`,
    `## 8. DATABASE DESIGN\n\n${clean(state.databaseDesign)}`,
    `---`,
    `## 9. API CONTRACT *(critical)*\n\n${clean(state.apiContract)}`,
    `---`,
    `## 10. SECURITY LAYER *(non-negotiable)*\n\n${clean(state.securityLayer)}`,
    `---`,
    `## 11. PERFORMANCE STRATEGY\n\n${clean(state.performanceStrategy)}`,
    `---`,
    `## 12. WORKFLOW USAGE MAP\n\n${clean(state.workflowUsageMap)}`,
    `---`,
    `## 13. CONSTRAINTS\n\n${clean(state.constraints)}`,
    `---`,
    `## 14. KNOWN RISKS\n\n${clean(state.knownRisks)}`,
    `---`,
    `## 15. DEV RULES\n\n${clean(state.devRules)}`,
    `---`,
    `## 16. ENVIRONMENT VARIABLES\n\n${clean(state.envVariables)}`,
    `---`,
    `## 17. CHANGE LOG\n\n${clean(state.changeLog)}`,
    `---`,
    `## 18. FUTURE IDEAS\n\n${clean(state.futureIdeas)}`,
    `---`,
    `## 19. FINAL PRINCIPLE\n\n${clean(state.finalPrinciple)}`,
  ];
  return sections.join('\n\n');
}
