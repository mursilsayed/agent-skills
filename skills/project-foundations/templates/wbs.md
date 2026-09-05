# Deliverable-Oriented WBS

Our hierarchy: **Epic** (deliverable domain, theme-named container) → **Task** (outcome-phrased, maps 1:1 to a ticket).

## Task template

**Title:** `[Who] can [outcome]`

**Done when:** 2–4 checklist items describing how you know the outcome is real.

## Worked example — Self-Service Password Reset

```
1. Customer can request and complete a password reset from email        [Epic]
   1.1 Reset link opens a working password reset screen                 [Task]
   1.2 Customer can save a new password with a valid link                [Task]
   1.3 Expired or invalid links show a clear error                       [Task]
2. Support can see and troubleshoot reset requests                       [Epic]
   2.1 Support can view reset request history for a customer             [Task]
   2.2 Support can manually invalidate a reset link                      [Task]
3. Reset flow is production-ready                                       [Epic]
   3.1 Rate limiting prevents reset link abuse                           [Task]
   3.2 Release checklist executed and results recorded                   [Task]
```

Not every Epic needs the same number of Tasks. Break an Epic down only as far as needed for planning and tracking. Epic titles can be outcome-phrased or a shorter theme name ("Password reset support tooling") — either is fine as long as it names the deliverable domain, not a team or activity.

### Example Task done-when sets

**Customer can reset password from email link**
- Reset link opens a working password reset screen
- Customer can save a new password with a valid link
- Expired or invalid links show a clear error

**Finance can export invoice list as CSV**
- Export button appears on the invoice list screen
- Exported CSV includes invoice number, amount, and status
- Export respects the current filters applied to the list

## WBS ↔ JIRA mapping

| WBS Level | JIRA Equivalent |
|-----------|------------------|
| Top-level deliverable domain | Epic (theme name; no outcome sentence, done-when, or single owner required) |
| Sub-deliverable / leaf node | Task (outcome-phrased, lightweight template, single accountable owner) |

Keep the template lightweight on purpose — don't add mandatory fields unless the team explicitly asks for them later.
