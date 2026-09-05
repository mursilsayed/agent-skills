# Framing tones and outcome verification

## Problem Framing vs Accomplishment Framing

Two outputs of the same Impact First Process — not two entry points. Accomplishment Framing depends on having done Problem Framing first; it's a re-expression, not an alternative diagnosis.

| Output | Tone | Produced at | Used for |
|--------|------|-------------|----------|
| Problem Framing | Deficit | Phase 4 | "What's broken and why does it matter?" — diagnosis, alignment, business case |
| Accomplishment Framing | Accomplishment | Phase 5 | "What was achieved and why does it matter?" — communicating value to stakeholders, 1:1s, reviews |

**Accomplishment Framing formula:** `[Result/Outcome] by [Action] — [broader Impact]`

Example: *Increased mobile team feature velocity by 50% (8 → 12 features/quarter) by redesigning the auth API contract — cutting per-feature integration time from 6 days to under 2 and reducing auth incidents from 3/month to <1.*

**Same situation, both framings:**

- Problem Framing: *Users want to complete purchases quickly. But when the checkout page loads slowly, they abandon. This causes lost revenue and erodes trust in the product.*
- Accomplishment Framing: *Reduced checkout load time from 6s to under 1s, which recovered abandoned sessions and reduced churn among high-value users by 8%.*

Lead with **Impact** when presenting to executives; lead with **Problem Statement** when aligning the team.

## How to verify an outcome

An outcome is binary — true or false. Without defined verification criteria, "outcome achieved" is an assumption, not a fact — define verification **before** starting work, never retroactively.

| Tier | Type | Example outcome | Verification mechanism |
|------|------|-------------------|--------------------------|
| 1 | Directly measurable | "Auth service responds in under 200ms" | Instrument and measure — benchmark suite, load tests, monitoring |
| 2 | Verifiable by inspection | "Runbook exists and is accessible to the team" | Check it exists — review, checklist, sign-off |
| 3 | Qualitative judgment | "Team understands the new architecture" | Human verification — review session, quiz, manager confirmation |

For every outcome, define upfront:
- **What does "true" look like exactly?** Be precise (e.g. "under 200ms" — P95? P99? under what load?).
- **Who verifies it?** One named person or role.
- **When is it verified?** At which milestone.
- **What is the verification deliverable?** The artifact producing the evidence.

Every outcome needs both a **production deliverable** (builds the thing) and a **verification deliverable** (confirms the condition is met, e.g. a benchmark suite or sign-off checklist) — the latter is not optional polish.
