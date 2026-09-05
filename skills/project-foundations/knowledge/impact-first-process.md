# The Impact First Process

The structured method for going from an initial observation to a diagnosed, impact-justified piece of work. Apply this before committing to any significant work — whether the starting point is a complaint, failure, recurring pain point, or an opportunity/goal reworded as a problem to diagnose (e.g. "we are not currently capturing this market").

Solution options are deliberately **out of scope** for this process — it ends once the problem, its impact, and the desired outcomes are understood. That discipline (understand before you commit to a solution) is the whole point of Impact First Thinking.

## Phase 1 — Initial Problem & Impact Description

An initial framing, not a final diagnosis — good enough to justify investigation, not pretending the root cause is already known.

Ask: What appears to be happening? Who or what is affected? When does it occur? What immediate impact is visible? Why might this be worth investigating?

**Output:** Initial Problem & Impact Description.

## Phase 2 — Problem Analysis (5 Whys)

For each answer, ask **"Why is this happening?"**. Don't force exactly five — continue until you reach a cause that is actionable, evidence-based, and in scope. Distinguish confirmed causes, contributing factors, and hypotheses still needing validation.

A root cause is useful because it names the condition that needs to change — that condition becomes a candidate outcome.

> Root cause: Business-impacting automation failures are not surfaced proactively.
> Candidate outcome: Business-impacting automation failures are detected and routed proactively to the appropriate support team.

**Output:** Root cause(s), contributing factors, hypotheses needing validation, candidate outcomes.

## Phase 3 — Impact Analysis (5 So Whats)

For each consequence, ask **"So what happens because of this?"** — moving past the immediate technical/operational symptom to the wider business effect.

Chain: **Immediate consequence → Operational impact → Broader business impact.**

Don't stop too early at impacts like "manual effort" or "delay" if a more meaningful business consequence exists. Record uncertain broader impact as an impact hypothesis to validate with evidence.

**Output:** Impact chain, immediate impact, broader impact, impact hypotheses.

## Phase 4 — Detailed Problem & Impact Statement (Problem Framing)

Synthesize Phases 1–3 into a precise, deficit-tone statement. Do not prescribe a solution.

> **[Stakeholder] wants [goal]. To achieve that, they [task/process]. But when [trigger/condition], [problem occurs]. This causes [immediate and broader impact].**

**Output:** Detailed Problem & Impact Statement.

## Phase 5 — Desired Impact / Opportunity Statement (Accomplishment Framing)

Translate the problem statement into a positive, accomplishment-tone description of the change worth creating. Only possible once Phase 4 is done.

> **[Desired result / impact] by [changing the relevant condition] — [broader positive business impact].**

Describe the value to be created, not the implementation.

**Output:** Desired Impact / Opportunity Statement.

## Phase 6 — Desired Outcomes

Use the root-cause analysis to define the conditions that must become true to create the desired impact. Ask: **"What must be different when we are done?"** Describe a changed condition or capability — not a solution.

- Instead of "Build an RPA monitoring dashboard" → "Business-impacting RPA failures are detected and surfaced proactively."
- Instead of "Replace UI automation with APIs" → "Automations that depend on external interfaces are materially more resilient to interface changes."

**Output:** Desired Outcomes.

## Where it ends

The Detailed Problem & Impact Statement, Desired Impact / Opportunity Statement, and Desired Outcomes are consolidated into a single document — the **Impact Brief** (see `templates/impact-brief.md`) — the artifact used to decide whether the work should be approved. After that, the team moves into success-measure definition, business-case development, or solution discovery — none of which this process covers.
