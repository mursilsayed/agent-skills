---
name: project-foundations
description: Create an Impact Brief, Project Charter, and Deliverable-Oriented WBS using Impact First Thinking
---

# Project Foundations

## 1. Purpose & Scope

Build the three foundational documents of a piece of work, in sequence: the case for doing it (Impact Brief), the charter to run it (Project Charter), and the deliverable-oriented plan to execute it (WBS). Each document works backwards from impact — see `knowledge/impact-hierarchy.md` for the Impact → Outcome → Deliverable → Activity model that underlies all three.

## 2. Dependencies

No external tools or MCP servers required — this skill works entirely from conversation and its own local knowledge/templates. See [`./ABOUT.md`](./ABOUT.md) for details.

## Workflows Menu

| # | Workflow | Trigger phrases / when to use it | Section |
|---|----------|-----------------------------------|---------|
| 1 | Create Impact Brief | work not yet approved, deciding whether to commit | [Workflow 1: Create Impact Brief](#workflow-1-create-impact-brief) |
| 2 | Create Project Charter | work approved, needs execution scaffolding | [Workflow 2: Create Project Charter](#workflow-2-create-project-charter) |
| 3 | Create Deliverable-Oriented WBS | charter approved, needs a ticket-ready plan | [Workflow 3: Create Deliverable-Oriented WBS](#workflow-3-create-deliverable-oriented-wbs) |

If the request doesn't clearly match exactly one workflow, ask the user which one they want rather than guessing.
If the user asks what this skill can do, or asks to list workflows, show this table instead of running any workflow.

## 3. Supported workflows

### Workflow 1: Create Impact Brief

Use before a project is approved — decides **whether** to commit, not how to deliver. Follow the Impact First Process end to end (`knowledge/impact-first-process.md`):

1. Draft the Initial Problem & Impact Description (Phase 1) from the user's starting point — even an opportunity/goal should be reworded as a problem to diagnose.
2. Run 5 Whys to find root cause(s) (Phase 2).
3. Run 5 So Whats to trace the impact chain (Phase 3).
4. Synthesize the Detailed Problem & Impact Statement, deficit tone (Phase 4). See `knowledge/framing-and-verification.md` for the statement template.
5. Translate it into the Desired Impact / Opportunity Statement, accomplishment tone (Phase 5).
6. Define Desired Outcomes as binary conditions, not solutions (Phase 6).
7. Assemble the result into `templates/impact-brief.md`. Do not include solution options — those are explicitly out of scope for this document.

### Workflow 2: Create Project Charter

Use once work is approved to proceed.

1. If an Impact Brief exists for this work, carry its Problem Statement, Impact, and Outcomes forward **unchanged**. If not, derive them directly with the user using the same Problem Framing / Accomplishment Framing techniques as Workflow 1.
2. For each outcome, define verification: what "true" looks like precisely, who verifies it, when, and what verification deliverable produces the evidence (`knowledge/framing-and-verification.md`).
3. Fill in Scope & High Level Requirements, Deliverables, and Risks with the user.
4. Assemble the result into `templates/project-charter.md`.

### Workflow 3: Create Deliverable-Oriented WBS

Use once a Project Charter's outcomes and deliverables are approved.

1. For each Deliverable in the charter, decompose it into an Epic (a deliverable-domain theme, not a team or phase — nouns, not verbs) containing Tasks.
2. Phrase every Task as `[Who] can [outcome]`, each demonstrable and owned by a single accountable person or team.
3. Write 2–4 "done when" checklist items per Task describing observable evidence, not activities.
4. Check the whole breakdown against `knowledge/wbs-principles.md`: 100% rule, mutually-exclusive elements, deliverables not actions, single ownership, task-sizing rules.
5. Assemble the result into `templates/wbs.md`, mapping Epics/Tasks directly to the JIRA hierarchy (Epic/Task only, no Sub-Epic or Story).

---

**Best practices:** never let a Problem Statement prescribe a solution; never let an Outcome describe a deliverable; never let a WBS element describe an activity. Define verification before starting work, not after. When in doubt about which document to produce, ask where the work sits: not yet approved → Impact Brief; approved, needs execution scaffolding → Project Charter; charter approved, needs a ticket-ready plan → WBS.
