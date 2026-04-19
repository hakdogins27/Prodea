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
    `# PROJECT.md — LIVING SYSTEM CONTEXT\n> This file is the single source of truth for this project.\n> Update it after every meaningful change. Never let it go stale.`,
    
    `## 0. AI INSTRUCTIONS *(read this first)*\n\n${clean(state.aiInstructions) || '- No specific instructions provided.'}`,
    
    `## 1. PROJECT OVERVIEW\n\n- **Project name:** ${clean(state.overview.name)}\n- **Description:** ${clean(state.overview.description)}\n- **Problem it solves:** ${clean(state.overview.problem)}\n- **Target users:** ${clean(state.overview.targetUsers)}\n- **Core goal:** ${clean(state.overview.coreGoal)}\n- **Out of scope:** ${clean(state.overview.outOfScope) || 'None defined.'}`,
    
    `## 2. CURRENT STATE *(live status — update constantly)*\n\n${clean(state.currentState) || '**Completed:**\n- Initial concept\n\n**In progress:**\n- Baseline architecture'}`,
    
    `## 3. FEATURE BACKLOG *(evolving roadmap)*\n\n${clean(state.featureBacklog) || '**MVP (must-have):**\n- [ ] Core functionality\n\n**Post-MVP (planned):**\n- [ ] Advanced features'}`,
    
    `## 4. TECH STACK\n\n${state.techStack ? clean(state.techStack) : '| Layer | Technology | Version | Notes |\n|---|---|---|---|\n| Frontend | | | |\n| Backend | | | |\n| Database | | | |'}`,
    
    `## 5. SYSTEM ARCHITECTURE\n\n${state.systemArchitecture ? clean(state.systemArchitecture) : '**Architecture type:** Modular Monolith\n\n**Core modules:**\n- Core API\n- State Manager\n\n**Key decisions:**\n\n| Decision | Choice | Reason |\n|---|---|---|'}`,
    
    `## 6. FRONTEND STRUCTURE\n\n${clean(state.frontendStructure) || '**Framework:** Next.js\n**UI library:** Tailwind CSS\n**State management:** Zustand'}`,
    
    `## 7. BACKEND STRUCTURE\n\n${clean(state.backendStructure) || '**API style:** REST\n**Runtime:** Node.js'}`,
    
    `## 8. DATABASE DESIGN\n\n${clean(state.databaseDesign) || '**Database type:** LocalStorage (MVP)'}`,
    
    `## 9. API CONTRACT *(critical — never break without updating)*\n\n${state.apiContract ? clean(state.apiContract) : '| Method | Endpoint | Description | Auth |\n|---|---|---|---|\n| GET | /api/health | Server status | No |'}`,
    
    `## 10. SECURITY LAYER *(non-negotiable)*\n\n${clean(state.securityLayer) || '- Input validation enabled\n- Rate limiting configured'}`,
    
    `## 11. PERFORMANCE STRATEGY\n\n${clean(state.performanceStrategy) || '- Caching via LocalStorage\n- Lazy loading components'}`,
    
    `## 12. WORKFLOW USAGE MAP\n\n${state.workflowUsageMap ? clean(state.workflowUsageMap) : '| Phase | What it covers |\n|---|---|---|\n| Planning | Feature definition |\n| Backend | Server logic |'}`,
    
    `## 13. CONSTRAINTS\n\n${clean(state.constraints) || '- $0 infrastructure budget'}`,
    
    `## 14. KNOWN RISKS\n\n${state.knownRisks ? clean(state.knownRisks) : '| Risk | Likelihood | Impact | Mitigation |\n|---|---|---|---|'}`,
    
    `## 15. DEV RULES *(always follow)*\n\n${clean(state.devRules) || '1. Build smallest working version first\n2. Do not over-engineer'}`,
    
    `## 16. ENVIRONMENT VARIABLES\n\n\`\`\`bash\n${clean(state.envVariables) || '# No env variables defined yet'}\n\`\`\``,
    
    `## 17. CHANGE LOG *(system history)*\n\n${clean(state.changeLog) || '### [v0.1.0] — ' + new Date().toISOString().split('T')[0] + '\n- Initial project blueprint generated'}`,
    
    `## 18. FUTURE IDEAS / EXPANSION\n\n${clean(state.futureIdeas) || '- Community plugins\n- Global cloud sync'}`,
    
    `## 19. FINAL PRINCIPLE\n\n${clean(state.finalPrinciple) || 'This is a living system. Clarity > Cleverness.'}`,
  ];
  return sections.join('\n\n---\n\n');
}
