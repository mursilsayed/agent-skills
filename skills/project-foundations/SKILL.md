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
3. Fill in Scope & High Level Requirements, Deliverables, and Risks with the user. Naming a Deliverable is a solution-selection decision, not neutral inventory-taking — see "Identifying deliverables safely" below. For each candidate, also check whether it's really a bounded artifact (a Deliverable), overlaps an existing Deliverable (fold in), or is unbounded ongoing activity (Out of scope — see "Deliverable vs. ongoing activity" below).
4. Assemble the result into `templates/project-charter.md`. Render Outcomes and Deliverables as tables, not bullet lists: Outcomes as `# | Outcome | Verification`; Deliverables as `Outcome | Deliverable(s) | Comments`, with one row per Outcome and its one-or-more Deliverables listed in that row's cell (e.g. `D2 — ...<br>D3 — ...`). This keeps the sections separate (diagnose-before-plan discipline) while making the mapping between them visible without merging them, so stakeholders reading the Charter don't have to hunt for how the two sections relate. Use the Comments column for dependencies, sequencing, or negotiation/stall risk on a given Deliverable — don't leave it blank if there's something a reader would otherwise miss.

**Identifying deliverables safely:** picking *which* deliverable satisfies an outcome requires domain expertise, and a wrong pick compounds downstream (rework cascades into scope, WBS, and stakeholder expectations already built on it). De-risk this rather than skipping it:
- Look for a credible external reference framework/model for this domain and localize it, rather than deriving deliverables from first principles — this also reduces the domain-mastery-before-credibility pressure on whoever is drafting.
- Treat the first-pass Deliverables list as provisional, not final (progressive elaboration / rolling wave planning) — it's expected to be revised as understanding improves, including after Charter sign-off.
- The real safeguard against a wrong choice is stakeholder review at sign-off, not getting it right solo before showing anyone — don't over-invest in perfecting the list before it's been seen.

**Deliverable vs. ongoing activity:** when deciding whether something belongs as its own Deliverable, ask whether it's a *bounded artifact* (has a natural "done" state, can be handed over and verified) or *unbounded ongoing activity* (execution/operations work with no natural end, e.g. "cleanup," "maintenance," "support"). Bounded → a Deliverable (or folds into an existing one covering the same artifact). Unbounded → Out of scope for the Charter/WBS, owned by whichever role holds ongoing operational accountability — pulling it in as a Deliverable makes the program's completion hostage to work that never naturally finishes.

### Workflow 3: Create Deliverable-Oriented WBS

Use once a Project Charter's outcomes and deliverables are approved.

1. For each Deliverable in the charter, decompose it into an Epic (a deliverable-domain theme, not a team or phase — nouns, not verbs) containing Tasks.
2. Phrase every Task as `[Who] can [outcome]`, each demonstrable and owned by a single accountable person or team.
3. Write 2–4 "done when" checklist items per Task describing observable evidence, not activities.
4. Check the whole breakdown against `knowledge/wbs-principles.md`: 100% rule, mutually-exclusive elements, deliverables not actions, single ownership, task-sizing rules.
5. Assemble the result into `templates/wbs.md`, mapping Epics/Tasks directly to the JIRA hierarchy (Epic/Task only, no Sub-Epic or Story).

---

**Best practices:** never let a Problem Statement prescribe a solution; never let an Outcome describe a deliverable; never let a WBS element describe an activity. Define verification before starting work, not after. When in doubt about which document to produce, ask where the work sits: not yet approved → Impact Brief; approved, needs execution scaffolding → Project Charter; charter approved, needs a ticket-ready plan → WBS.
