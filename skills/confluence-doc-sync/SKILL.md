---
name: confluence-doc-sync
description: Create and maintain Confluence pages efficiently by drafting and iterating in a local Markdown file, and only pushing the full page to Confluence on an explicit publish step. Use this when the user wants to create a Confluence page, update an existing Confluence page, rubber-duck or iterate on a document that will eventually live in Confluence, or complains that Confluence updates are slow/expensive/looping.
---

# Confluence Doc Sync

## Why this skill exists

Confluence has no partial-update API: `updateConfluencePage` always replaces the
**entire** page body. The default body format is structured HTML with strict ADF
nesting rules, which requires fetching a format guide and constructing a fully valid
document on every single write. That means every small edit, even a one-word tweak
during rubber-ducking, costs a full fetch + full regenerate + full validated write.
This skill avoids that cost by keeping the editable "source of truth" as a local
Markdown file and treating Confluence as a publish target, not a live editor.

## Workflows Menu

| # | Workflow | Trigger phrases / when to use it | Section |
|---|----------|-----------------------------------|---------|
| 1 | Start a new page | "draft a Confluence page", no Confluence page exists yet | [Workflow 1: Start a new page](#workflow-1-start-a-new-page) |
| 2 | Attach to an existing page | "update this Confluence page", a live page exists but no local draft | [Workflow 2: Attach to an existing page](#workflow-2-attach-to-an-existing-page) |
| 3 | Iterate on the draft | rubber-ducking, rewrites, restructuring, review, typo fixes | [Workflow 3: Iterate on the draft](#workflow-3-iterate-on-the-draft) |
| 4 | Publish | "publish this", "push to Confluence", "sync the page", "update the live doc now" | [Workflow 4: Publish](#workflow-4-publish) |

If the request doesn't clearly match exactly one workflow, ask the user which one they want rather than guessing.
If the user asks what this skill can do, or asks to list workflows, show this table instead of running any workflow.

## Core rule

**Never call `updateConfluencePage` or `createConfluencePage` for intermediate edits.**
All iteration (rubber-ducking, rewrites, restructuring, typo fixes) happens on the
local Markdown draft using normal file edit tools. Only touch Confluence when the user
explicitly asks to publish, sync, or push to Confluence (or on first creation).

## Draft layout

For each tracked page, keep two files together (same directory, picked by the user or
defaulting to the current project's working/docs folder):

```
<slug>.md                   # the editable draft, plain Markdown
<slug>.confluence-sync.json # sidecar metadata, not meant for manual editing
```

Sidecar schema:

```json
{
  "cloudId": "...",
  "pageId": "...",
  "spaceId": "...",
  "title": "...",
  "lastSyncedVersion": 12,
  "lastSyncedAt": "2026-01-01T00:00:00Z",
  "lastPublishFormat": "markdown"
}
```

## Workflows

### Workflow 1: Start a new page

Use when no Confluence page exists yet.

1. Draft the content directly as a local Markdown file. Do not call any Confluence
   tool yet, let the user iterate freely first.
2. When the user says to create/publish it, decide format (see
   [Choosing a publish format](#choosing-a-publish-format)), call
   `atlassian-createConfluencePage`, then write the sidecar file with the returned
   `pageId`/`spaceId`/version info.

### Workflow 2: Attach to an existing page

Use when a live Confluence page exists but there is no local draft for it.

1. Call `atlassian-getConfluencePage` once with `contentFormat: "markdown"` to pull
   the current content.
2. Save it as the local Markdown draft, and write the sidecar file (capture the
   current `version` number as `lastSyncedVersion`).
3. From now on, edit only the local Markdown file for all iteration.

### Workflow 3: Iterate on the draft

- Just edit the local `.md` file with normal edit tools. This is the cheap path and
  should be used freely, as many times as needed.
- Do not read from or write to Confluence during this phase.

### Workflow 4: Publish

Explicit user request only. Do not infer this from ordinary editing requests.

1. **Drift check**: call `atlassian-getConfluencePage` (body not required to be
   read in full if a lighter call is available) to check the current version number
   against `lastSyncedVersion` in the sidecar.
   - If the remote version is unchanged: proceed.
   - If the remote version has moved on (someone/something else edited the live
     page): **warn the user** and ask whether to overwrite anyway, pull-and-merge
     first, or abort. Do not silently overwrite.
2. **Choose publish format** (see [Choosing a publish format](#choosing-a-publish-format)).
3. If format is `html`: call `atlassian-getContentFormatGuide` with
   `{ toolName: "updateConfluencePage" }` (or `createConfluencePage` for new pages)
   and convert the Markdown draft into valid structured HTML following that guide.
   If format is `markdown`: pass the draft content through with
   `contentFormat: "markdown"` directly, no guide call needed.
4. Call `atlassian-updateConfluencePage` (or `createConfluencePage` for new pages)
   exactly once with the full converted body.
5. Update the sidecar: new `lastSyncedVersion`, `lastSyncedAt`, `lastPublishFormat`.
6. Report what was published and the new version number. Do not re-fetch to verify
   unless the write call reports an error.

## Choosing a publish format

Ask the user (or infer and state the assumption) per the project's preference, since
this is a real cost/richness trade-off:

- **Markdown** (default/fast path): fine for prose, headings, lists, links, simple
  tables, code blocks. Cheaper: skips the format-guide fetch and avoids HTML nesting
  validation retries.
- **HTML**: needed when the draft requires Confluence-specific richness, panels,
  expands, multi-column layouts, macros, status badges, or when preserving existing
  inline comments' anchors matters. Costs more tokens per publish (guide fetch + strict
  nesting rules) but only on publish, not on every edit.

If unsure which the content needs, default to markdown and tell the user you did so,
rather than silently paying the HTML cost.

## Guardrails

- Never call `createConfluencePage`/`updateConfluencePage` more than once per explicit
  publish request.
- If a publish call fails validation (bad HTML nesting, etc.), fix the specific
  reported issue and retry; do not regenerate the whole body from scratch unless the
  structure itself is the problem.
- Treat the sidecar file as the skill's own bookkeeping; don't let the user hand-edit
  `lastSyncedVersion` and expect consistency, if it looks stale, re-pull.
