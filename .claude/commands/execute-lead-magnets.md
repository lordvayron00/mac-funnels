# Execute Lead Magnets from Notion

Query the Notion Lead Magnet Pipeline database for all items with status "Execute", then build and deploy the marketing assets for each one.

## Design System
Before building any HTML, read this file completely:
- `lead-magnet-system/reference/conversion-landing-sample.html`

Every landing page must match this design system: CSS variables, Plus Jakarta Sans, layout structure, component patterns, light/dark mode.

## Notion Database
- **Database ID:** 308307c6-7d1b-432d-9599-34388ba46274

---

## Pipeline — Execute in order:

### Step 1: Query Notion for "Execute" Items
Fetch all entries from the pipeline database where Status = "Execute".

For each item, extract:
- Name (title of the lead magnet)
- Topic
- Slug
- Format (Notion / PDF / Both)
- Notion URL (link to the content page)
- Page ID

If no items have Status = "Execute", tell the user clearly and stop. Suggest checking if items are still in "Draft" or "Ready".

### Step 2: Update Status to "In Progress"
For each item found, immediately update its Status to "In Progress". This prevents duplicate processing if the command is run again before finishing.

### Step 3: Build Assets Per Item

Process each item one at a time. For each, follow the path based on Format:

---

#### Format = "Notion" (default)
The deliverable is the Notion page itself. Build only the marketing assets:

1. Research the topic (web search) for landing page copy
2. Build the landing page at `website/lead-magnets/[slug].html`
   - Follow the design system from `conversion-landing-sample.html`
   - Hero copy should reference the Notion page as the deliverable
3. Write the delivery email at `website/lead-magnets/[slug]-email.txt`
   - Include the Notion URL as the main link
4. Update the pipeline entry: set **Landing URL** to `[TU_DOMINIO]/lead-magnets/[slug]`

---

#### Format = "PDF"
The deliverable is a downloadable PDF file:

1. Read the full content from the linked Notion page
2. Research the topic for landing page copy
3. Build a PDF-formatted HTML at `website/lead-magnets/[slug]-pdf.html`
   - Optimized for print: A4 layout, no nav, good typography, page breaks
4. Generate the PDF using Puppeteer:
   ```js
   const puppeteer = require('puppeteer');
   const browser = await puppeteer.launch();
   const page = await browser.newPage();
   await page.goto(`file://${process.cwd()}/website/lead-magnets/${slug}-pdf.html`);
   await page.pdf({ path: `website/lead-magnets/${slug}.pdf`, format: 'A4', printBackground: true });
   await browser.close();
   ```
5. Build the landing page at `website/lead-magnets/[slug].html`
6. Write the delivery email at `website/lead-magnets/[slug]-email.txt`
   - Reference the PDF as the attachment (user will attach it in ConvertKit)

---

#### Format = "Both"
Follow the PDF pipeline above, but the delivery email references both:
- The Notion page URL (for online reading)
- The PDF (as attachment for offline use)

---

### Step 4: Update Notion on Completion
After processing each item:
- Set Status → "Complete"
- Set Landing URL → `[TU_DOMINIO]/lead-magnets/[slug]` (if not already set)

### Step 5: Deploy All Assets
After processing all items, deploy everything at once:

```bash
git add website/lead-magnets/
git commit -m "Deploy [N] lead magnet(s): [list of titles]"
git push
```

### Step 6: Final Summary
Print a summary table for each processed item:

| Title | Format | Landing Page | Email File | Status |
|---|---|---|---|---|
| [title] | [format] | [slug].html | [slug]-email.txt | Complete |

Remind the user:
- Copy each `[slug]-email.txt` content into its ConvertKit automation
- If format was PDF, attach `[slug].pdf` to the ConvertKit email
- Visit `[TU_DOMINIO]/lead-magnets/[slug]` to verify each page is live
