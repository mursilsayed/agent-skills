# Project Charter

If an Impact Brief already exists and this work is approved, carry its Problem Statement, Impact, and Outcomes forward unchanged.

**Project Name:** ____ **Approval Date:** ____

## Problem Statement

_Who has what problem when what trigger. There's an impact, and it has this effect on them._

## Impact

_Real-world change expected to result. What changes in the world if we succeed?_

## Outcomes

_Each outcome is one measurable condition that must be true when done (binary: yes/no), independent of the others — if one can't be true without another, consolidate. An Outcome is solution- and technology-independent: it defines what must become true, not how. It stays stable even if the Deliverable that satisfies it changes (see Deliverables below)._

| # | Outcome | Verification |
|---|---|---|
| 1 | ____ | How will you confirm this is true? Who verifies? When? |
| 2 | ____ | ____ |

## Scope & High Level Requirements

## Deliverables

_A Deliverable is the specific solution chosen to satisfy an Outcome above — a concrete, bounded artifact, not ongoing activity. It may be revised as tooling or constraints change without reopening the Outcome itself. One or more Deliverables can satisfy a single Outcome._

| Outcome | Deliverable(s) | Comments |
|---|---|---|
| 1 | D1 — ____ | ____ |
| 2 | D2 — ____<br>D3 — ____ | e.g. dependencies between deliverables, sequencing, negotiation/stall risk |

## Risks

---

## Worked example — Checkout Performance Optimisation

**Project Name:** Checkout Performance Optimisation **Approval Date:** 2026-04-01

**Problem Statement:** Power users want to complete purchases quickly. But when the checkout page loads in 6+ seconds, they abandon. This costs ~$50k/month in lost revenue and increases support tickets about slowness.

**Impact:** Monthly checkout abandonment rate drops from 35% to under 20%, recovering ~$30k/month in revenue.

**Outcomes:**

| # | Outcome | Verification |
|---|---|---|
| 1 | Checkout page loads in under 1 second for 95% of users. | Load test suite measuring P95 latency in production-equivalent environment — Lead Engineer — pre-release sign-off. |
| 2 | Checkout completion rate is ≥80% for sessions that reach the cart page. | Analytics dashboard measurement over 2-week post-release period — Product Manager — 2 weeks post-release. |

**Scope & High Level Requirements:** Backend query optimisation, Redis caching layer, frontend bundle reduction.

**Deliverables:**

| Outcome | Deliverable(s) | Comments |
|---|---|---|
| 1 | D1 — Optimised query layer<br>D2 — Redis caching service<br>D3 — Reduced JS bundle | D1 blocks D2; D3 can proceed in parallel. |
| 2 | D4 — Load test report | Verifies both outcomes; run after D1–D3 land. |

**Risks:** Cache invalidation complexity; third-party payment provider latency.
