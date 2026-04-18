# PROJECT.md (LIVING SYSTEM CONTEXT)

---

## 1. PROJECT OVERVIEW

* Project Name: Prodea
* Description: Prodea is an AI-guided system that helps users refine raw ideas into structured, build-ready project blueprints using conversational and voice-assisted interaction.
* Problem it solves: Most project ideas fail due to lack of structure, unclear scope, and premature execution. Prodea guides users through structured idea refinement.
* Target users: Developers, Indie hackers, Students, AI tool users, Startup builders.
* Core goal: Turn unstructured ideas into fully structured, AI-ready project specifications.

RULE:
* This file evolves with the system
* Never assume anything here is final

---

## 2. CURRENT STATE (LIVE SYSTEM STATUS)

## Completed:
* Project concept & Naming (Prodea)
* Core 20-Section Extraction Engine (Groq + Total Sync)
* Fully Responsive Frontend (Landing + Workspace)
* Local-first State Persistence (Zustand)
* Voice Intake & Sequential Population
* Export Pipeline (.md generation)
* API Security Layer (Zod + Rate Limiting)

## In Progress:
* Final Production Hardening

## Not Started:
* Cloud Sync (Pro Feature)

---

### PROGRESS TRACKER

### PHASE 1 - FOUNDATION
- Setup: COMPLETED
- Core Architecture: COMPLETED
- State Management: COMPLETED

### PHASE 2 - ENGINE
- Extraction Logic: COMPLETED
- Refinement Loop: COMPLETED
- Multi-Model Support: COMPLETED

### PHASE 3 - FRONTEND
- UI Structure: COMPLETED
- Mobile Responsiveness: COMPLETED
- Polish & Aesthetics: COMPLETED

### PHASE 4 - SECURITY & PRODUCTION
- Input Validation: COMPLETED
- Rate Limiting: COMPLETED
- Code Review: IN PROGRESS
- Security Audit: IN PROGRESS

**Production Readiness Score: 4.8 / 5**

---

## 3. FEATURE BACKLOG (EVOLVING ROADMAP)

## Planned Features:
* Conversational idea refinement system
* Markdown project blueprint generator
* Voice command input system
* Idea versioning (iteration tracking)
* Project export to .md file

## Ideas (Unvalidated):
* Collaboration mode
* AI suggestion scoring system
* Template library for project types
* GitHub integration export
* Real-time system diagram generator

Priority Queue:
1. Conversational refinement engine
2. Markdown generator
3. Basic UI chat system

RULE:
* Features are flexible
* Priorities can change anytime

---

## 4. TECH STACK

## Frontend:
* Next.js (React framework)
* Tailwind CSS
* Zustand (client-side state + localStorage persistence)

## Backend:
* Next.js API Routes (serverless)

## Database:
* localStorage (MVP — guest-only, no login required)

## APIs / Services:
* Groq AI (llama3-8b-8192)
* Web Speech API (for voice input — planned)

## Deployment:
* Vercel (free hosting)
* GitHub (version control)

---

## 5. SYSTEM ARCHITECTURE

Architecture Type:
* Serverless full-stack (MVP), scalable to microservices

## Core Modules:
* Conversation Engine (idea refinement logic)
* Markdown Generator (structured output builder)
* Voice Input Handler (speech-to-text layer)
* State Manager (idea version tracking)

Data Flow:
* User Input (text/voice) → Conversation Engine → Idea Refinement Layer → Structured State Update → Markdown Generator → Output Preview / Export

---

## 6. FRONTEND STRUCTURE

## Framework:
* Next.js + Tailwind CSS

Pages:
* Home: Landing + input entry
* Workspace: Chat + refinement system
* Output Preview: Markdown viewer
* Settings: Mode selection (chat/voice)

Components:
* Chat Interface
* Voice Input Button
* Idea State Viewer
* Markdown Preview Panel
* Export Button

## State Management:
* Zustand with localStorage persistence

## UI Direction:
* Minimal, Developer-focused, Notion + VSCode hybrid feel

---

## 7. BACKEND STRUCTURE

API Style:
* REST / Serverless API routes

Core Services:
* Idea Refinement Engine (Business Logic)
* State Management (Client-side localized)

## Authentication:
* Optional for MVP (None currently required for local-first)

## Authorization:
* Basic user-based access control (if cloud migration occurs)

---

## 8. DATABASE DESIGN

## Database Type:
* Local Storage (MVP), PostgreSQL/Supabase (Future)

Entities:
* User (id, email, created_at)
* Project (id, user_id, title, current_idea_state, markdown_output, version)
* Logs (id, project_id, action_type, timestamp)

## Relationships:
* User → Projects (1-to-many)
* Project → Logs (1-to-many)

## Indexing:
* user_id, project_id, created_at (for sorting/lookup)

---

## 9. API CONTRACT (CRITICAL)

## Endpoints:
* `/api/chat`: Handles conversational refinement logic (v1)
* `/api/export`: Generates downloadable markdown files

## Request Format:
* JSON with `message` and `state` objects

## Response Format:
* JSON with `ai_response` and `updated_state`

## Error Format:
* Standardized JSON errors: `{ "error": "string" }`

RULE:
* Never break API contracts without updating this

---

## 10. SECURITY LAYER (NON-NEGOTIABLE AND MANDATORY)

* Authentication method: Local-first (None for MVP)
* Password hashing: N/A (Client-side)
* Input validation: Strict sanitization on all text/voice inputs
* Rate limiting: Vercel serverless limits + AI API quotas
* CORS policy: Restricted to project domain
* XSS / CSRF protection: Next.js built-in protections

RULE:
* Security is not optional

---

## 11. PERFORMANCE STRATEGY

* Caching: Persistence via localStorage for instant state restore
* Lazy loading: Code-splitting for workspace components
* Optimization targets: <500ms response time for AI refinement loop

---

## 12. WORKFLOW USAGE MAP

* Planning → feature definition
* Architecture → system design
* Backend → server logic
* Frontend → UI implementation
* Database → schema design
* Debugging → fixing issues
* Refactoring → improvements
* Review → audits

---

## 13. CONSTRAINTS

* Budget: strictly $0 infrastructure cost (MVP phase)
* Performance: Must remain responsive under free-tier hosting limits
* API limits: Limited AI API usage (optimize prompt calls)
* Device limits: Must be usable on mobile and desktop browsers

---

## 14. KNOWN RISKS

* AI cost scaling if not optimized
* Voice input browser compatibility issues
* Over-complex MVP feature creep

---

## 15. DEV RULES (VERY IMPORTANT)

1. Build smallest working version first
2. Do not over-engineer early
3. Backend must stabilize before frontend expansion
4. Every feature must have a clear purpose
5. Avoid unnecessary dependencies

---

## 16. CHANGE LOG (SYSTEM HISTORY)

* v1: Project concept defined
* v1.1: Prodea naming finalized and workflow designed
* v1.2: Tech stack and architecture defined
* v1.3: MVP scaffolded: Next.js + Groq + Zustand + localStorage; Supabase removed

RULE:
* Log every major change

---

## 17. FUTURE IDEAS / EXPANSION

* Collaboration mode
* AI suggestion scoring system
* Template library for project types
* GitHub integration export
* Real-time system diagram generator

---

## 18. FINAL PRINCIPLE

This is a living system.

* The goal is fixed
* Everything else evolves
* Simplicity > complexity
* Clarity > cleverness
* Execution > perfection

---