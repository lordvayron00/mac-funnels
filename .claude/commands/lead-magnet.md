# Lead Magnet Generator

Research and create a lead magnet for the topic: **$ARGUMENTS**

This command creates the lead magnet content as a Notion page and enters it into the pipeline. It does NOT generate any HTML files, PDFs, or emails. Those are built later by /execute-lead-magnets after you review and approve.

---

## Pipeline — Follow these steps in order:

### Step 1: Research the Topic
Use web search to deeply research "$ARGUMENTS". Find:
- 5-7 key insights, stats, or actionable tips that are specific and data-backed
- Common pain points the audience faces (real frustrations, not generic ones)
- What makes this topic valuable and urgent right now
- Any relevant data points, case studies, or examples from trusted sources

Compile your research into a structured outline with a compelling title and subtitle.

### Step 2: Write the Lead Magnet Content
Based on your research, write the full lead magnet as structured content:

- **Title** — clear, benefit-driven, specific (avoid vague words like "guía completa")
- **Subtitle** — one line expanding on the title with a concrete promise
- **Introduction** — why this matters right now, written as if talking to a friend (1-2 paragraphs)
- **Main content** — 5-7 sections, each with:
  - Section heading (action-oriented)
  - Actionable insight or step, explained in plain language
  - Specific examples, stats, or how-to details — never abstract
- **Summary/Checklist** — 5-7 quick-reference takeaways the reader can act on today
- **CTA** — next steps and follow Jorge Pérez on social for more content like this

Write in Jorge Pérez's voice: **conversacional y cercano, directo a los resultados, sin relleno académico**. 
- Talk to the reader like a trusted friend who happens to be an expert
- Short sentences. Concrete examples. No jargon.
- If a sentence doesn't add value, cut it.

### Step 3: Create the Notion Content Page
Create a separate Notion page (NOT inside the pipeline database) with the full lead magnet content from Step 2.

Use rich Notion formatting:
- H1 for the title
- H2 for main sections
- Bulleted and numbered lists for steps and tips
- Callout blocks for key takeaways or warnings
- Dividers between major sections
- Bold for the most important phrases in each section

### Step 4: Create the Pipeline Entry
Add an entry in the Lead Magnet Pipeline Notion database:
- **Database ID:** 308307c6-7d1b-432d-9599-34388ba46274

Set these properties:
- **Name** — the lead magnet title
- **Status** — "Draft"
- **Format** — "Notion"
- **Slug** — URL-friendly slug generated from the title (lowercase, hyphens, no accents)
- **Topic** — "$ARGUMENTS"
- **Notion URL** — link to the content page created in Step 3

### Step 5: Summary
Output a clear summary with:
- Lead magnet title and slug
- Link to the Notion content page
- Link to the pipeline database entry
- Reminder to the user:
  1. Review and edit the content page in Notion — change anything that doesn't sound like you
  2. Set Format to "Notion", "PDF", or "Both" based on how you want to deliver it
  3. Change Status to "Execute" when you're happy with the content
  4. Run /execute-lead-magnets to generate the landing page, email, and deploy
