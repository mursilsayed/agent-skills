# Project Charter

If an Impact Brief already exists and this work is approved, carry its Problem Statement, Impact, and Outcomes forward unchanged.

**Project Name:** ____ **Approval Date:** ____

## Problem Statement

_Who has what problem when what trigger. There's an impact, and it has this effect on them._

## Impact

_Real-world change expected to result. What changes in the world if we succeed?_

## Outcomes

_Each outcome is one measurable condition that must be true when done (binary: yes/no). Keep independent — if one can't be true without another, consolidate._

**Outcome 1:** ____ _Verification:_ How will you confirm this is true? Who verifies? When?

**Outcome 2:** ____ _Verification:_ ____

## Scope & High Level Requirements

## Deliverables

_Concrete artifacts produced to achieve the outcomes._

## Risks

---

## Worked example — Checkout Performance Optimisation

**Project Name:** Checkout Performance Optimisation **Approval Date:** 2026-04-01

**Problem Statement:** Power users want to complete purchases quickly. But when the checkout page loads in 6+ seconds, they abandon. This costs ~$50k/month in lost revenue and increases support tickets about slowness.

**Impact:** Monthly checkout abandonment rate drops from 35% to under 20%, recovering ~$30k/month in revenue.

**Outcomes:**
- Checkout page loads in under 1 second for 95% of users. *Verification:* Load test suite measuring P95 latency in production-equivalent environment — Lead Engineer — pre-release sign-off.
- Checkout completion rate is ≥80% for sessions that reach the cart page. *Verification:* Analytics dashboard measurement over 2-week post-release period — Product Manager — 2 weeks post-release.

**Scope & High Level Requirements:** Backend query optimisation, Redis caching layer, frontend bundle reduction.

**Deliverables:** Optimised query layer; Redis caching service; reduced JS bundle; load test report.

**Risks:** Cache invalidation complexity; third-party payment provider latency.
