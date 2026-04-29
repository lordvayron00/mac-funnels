# Landing Page Generator

Generate a conversion-optimized opt-in landing page for: **$ARGUMENTS**

## Design System
Before writing a single line of HTML, read this file completely:
- `lead-magnet-system/reference/conversion-landing-sample.html`

Match its visual system exactly: CSS variables, font stack (Plus Jakarta Sans), layout structure, component patterns, light/dark toggle implementation. Do not deviate from the design system without a reason.

---

## Pipeline:

### Step 1: Research the Topic
Use web search to research "$ARGUMENTS". Find:
- Core value proposition — what specific transformation does this lead magnet deliver?
- 3-5 specific pain points the target audience faces (make them feel recognized)
- Concrete outcomes and benefits to feature in copy
- Any stats or social proof angles relevant to the topic

### Step 2: Generate the slug
Create a URL-friendly slug from the topic: lowercase, hyphens, no accents, no special characters.
Example: "Inteligencia Artificial para Freelancers" → `ia-para-freelancers`

### Step 3: Build the Landing Page
Create the file at: `website/lead-magnets/[slug].html`

Follow the exact structure from `conversion-landing-sample.html`:

1. **Nav Bar** — fixed, blur backdrop, "Jorge Pérez" logo, theme toggle
2. **Hero section** — in this order:
   - Trust bar: photo `[TU_FOTO_URL]` + "por **Jorge Pérez**"
   - Eyebrow chip: "Descarga gratuita"
   - H1: compelling, specific headline (not generic)
   - Subhead: one sentence expanding the promise
   - Value pills: 3 pills with icons (Descarga instantánea + 2 specific to the topic)
   - Benefits list: 4 checkmarks with concrete, specific benefits
3. **Form Card** — name input + email input + submit button + micro-trust row
   - Webhook URL: `[CONVERTKIT_FORM_ENDPOINT]`
   - Form submits via fetch POST with FormData
   - Success state: hide form, show celebration message
4. **FAQ Section** — 4 questions specific to this topic and audience
5. **Final CTA Card** — inverted blue card, headline + button scrolling to #leadForm
6. **Footer** — "© 2025 Jorge Pérez" + privacy + unsubscribe links

Technical requirements:
- Pure CSS with variables only (no Tailwind, no external CSS CDNs)
- Plus Jakarta Sans via Google Fonts
- Full light/dark theme with localStorage persistence
- Accessible: proper labels, focus states, alt text on images
- Mobile responsive (test at 375px width)

### Step 4: Write the Delivery Email
Write the plain-text delivery email. Save to: `website/lead-magnets/[slug]-email.txt`

Structure:
```
Subject: [Short, specific subject line — max 50 chars]

Hey {{contact.first_name}},

[1-2 sentences: what they're getting and why it matters]

[The Notion link or PDF link — clearly labeled]

[2-3 sentences: what to focus on first or how to get the most value]

[1 sentence: follow Jorge Pérez for more content like this]

Hasta pronto,
Jorge

P.D. [Invite them to reply with their biggest question or takeaway]
```

Write in the same voice as the lead magnet: conversacional, cercano, sin relleno.

### Step 5: Deploy
Run the deploy script (handles git push + Vercel deploy automatically):
```bash
bash lead-magnet-system/scripts/deploy.sh "Add [lead magnet title] landing page"
```

### Step 6: Summary
Output:
- Page title and slug
- Files created (landing page path + email path)
- Live URL: `mac-funnels.vercel.app/lead-magnets/[slug]`
- Reminder: paste the email content from `[slug]-email.txt` into your ConvertKit automation for this form
