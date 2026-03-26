# Generate CV Skill

Generate a tailored CV PDF from a Trilium master portfolio note, matched against a job description.

## Prerequisites

- Trilium Notes with ETAPI enabled and master portfolio note created
- Node.js >= 18
- puppeteer npm package installed (`npm install puppeteer`)
- A Chromium-based browser installed (Chrome, Brave, Chromium)

## Available Tools

| Tool | Purpose |
|------|---------|
| `mcp__trilium__search_notes` | Find the master portfolio note |
| `mcp__trilium__get_note` | Retrieve full portfolio content |
| `WebFetch` | Fetch job description from a URL |
| `Bash` | Run the html-to-pdf.js script |
| `Write` | Write the tailored CV HTML to disk |

## Workflow

### Step 1 — Get the Job Description

- If the user provides a **URL**, fetch it with `WebFetch` and extract: required skills, technologies, seniority level, domain, and key responsibilities
- If the user **pastes text**, use it directly
- Summarise the JD into a list of: primary skills, domain keywords, and role focus

### Step 2 — Fetch Master Portfolio

Search Trilium for the master portfolio:

```
mcp__trilium__search_notes("Master Portfolio")
```

Then fetch the full content with `mcp__trilium__get_note`. The portfolio contains:
- Core positioning statements
- Full skills inventory
- All work experience with accomplishments
- Quantified achievements
- Domain expertise tags

### Step 3 — Match & Select

Cross-reference the JD against the portfolio:

1. **Domain tags** — identify which domain expertise tags align with the JD, these determine which roles to foreground
2. **Skills** — from the skills inventory, select the categories and tools most relevant to the JD; reorder to put JD-matching skills first
3. **Roles** — select 3–5 roles to include at full depth; older or less relevant roles get 1–2 bullets or are dropped
4. **Accomplishments** — from each selected role, pick bullets that use the JD's own language or demonstrate directly relevant impact. Use the compressed STAR formula for every bullet:

   > **[Result/Outcome] by [Action] — [broader Impact]**

   The italic context line under each role provides the Situation and Task — do not repeat them in bullets. Lead with Result, not with what you did. A quantified metric alone is weak framing — always complete the chain to the business or user consequence using connective language ("which enabled", "resulting in", "ultimately leading to"). Lead with the bullet that has the strongest chain.

   > Weak (Action-first): "Rewrote the top 10 database queries, reducing load time by 90%"
   > Strong (Result-first): "Reduced database query time by 90% by rewriting the top 10 slowest queries — enabling dashboards to load instantly, improving NPS by 12 points and cutting support tickets by 25%"

   **Credibility checklist — every bullet must pass:**
   - **Baseline**: include before → after (`from X → to Y`), not just a % or multiplier in isolation
   - **Timeframe**: add a timeframe where it matters (e.g. "within 3 months", "per year")
   - **Attribution**: be specific about your contribution — avoid "contributed to" or "helped drive"; say what *you* did
   - **Plausible numbers**: avoid suspiciously round figures — prefer specific values or ranges ("$900K–$1.1M", not "$1M"); if the number is round, it must be clearly sourced
   - **Qualitative-only evidence**: if no hard metrics exist (Tier 3), name the source — "backed by manager feedback", "confirmed in sprint retrospectives", "reflected in support ticket trends" — rather than presenting it as a measured fact

5. **Summary** — draft a 3–4 bullet tailored summary. Open with the biggest relevant quantified win expressed as a full outcome → impact chain, follow with expertise alignment, close with a signal of breadth.

### Step 4 — Generate the CV HTML

Produce a complete HTML document styled to match this specification:

**Layout:** Single-column, A4, monospace font (`'Courier New', Courier, monospace`), font-size 11px

**Structure (in order):**
1. Name — centred, serif, 24px
2. Headline — centred, 12px bold, mirrors the JD job title (e.g. "Digital Solutions Architect"). Tailored per role.
3. Contact line — centred, 10px (phone | email | LinkedIn | GitHub)
4. Summary — bullet list (3–4 bullets)
5. Skills — plain `<p>` tags, one per category: `<strong>Category:</strong> value, value, value`. No tables. 7 merged categories in order: Programming Languages, Frameworks & APIs, Cloud & Infrastructure, Databases, DevOps & CI/CD, Observability & Testing, Frontend & Mobile. Reorder and trim categories to match the JD.
6. Education & Certifications — plain `<p>` tags, one entry per line. No tables. No graduation years. Include certifications first, then degrees.
7. Work Experience — for each role:
   - `<company> | <title> | <dates>` in bold
   - One italic context line — this provides the Situation and Task (S+T) so bullets don't need to repeat context
   - Bullet accomplishments — each following `[Result/Outcome] by [Action] — [broader Impact]`

**CSS reference:**
```css
body     { font-family: 'Courier New', Courier, monospace; font-size: 11px; line-height: 1.5; padding: 36px 48px; }
h1       { text-align: center; font-size: 24px; font-family: serif; margin-bottom: 2px; }
.headline{ text-align: center; font-size: 12px; font-weight: bold; margin-bottom: 4px; letter-spacing: 0.5px; }
h2       { font-size: 13px; border-bottom: 1px solid #000; margin-top: 14px; font-family: serif; }
p        { margin-bottom: 3px; }
```

### Step 5 — Write & Convert to PDF

1. Write the HTML to `output/<CompanyName>-CV.html` (create `output/` dir if needed)
2. Locate a Chromium-based browser executable — check in order:
   - `google-chrome`, `chromium-browser`, `chromium`
   - `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
   - `/Applications/Brave Browser.app/Contents/MacOS/Brave Browser`
3. Run the conversion script:
   ```bash
   NODE_PATH=$(npm root -g) node ~/.claude/skills/generate-cv/scripts/html-to-pdf.js \
     --input output/<CompanyName>-CV.html \
     --output output/<CompanyName>-CV.pdf \
     --browser "<browser-path>"
   ```
4. Confirm the PDF was created and report the output path to the user

## Output

Report to the user:
- The output PDF path
- Which roles were included and which were dropped, and why
- Any JD keywords that had no strong match in the portfolio (gaps worth noting)
