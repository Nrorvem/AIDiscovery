# Layout & structure instructions (design TBD)

> Goal: provide section order + intended layout patterns. Visual style decisions happen later.

## Global layout
- Header:
  - Logo (left)
  - Nav links (Services, Pricing, Case Study, Contact)
  - Primary CTA button: "Get the Snapshot" → {{CALENDLY_LINK}}
- Top bar/announcement above header (optional on all pages)
- Footer:
  - Link columns (optional)
  - Disclaimer: `GLOBAL.FOOTER_DISCLAIMER_SHORT`

## Homepage (/)
Recommended section order:
1. Hero (H1 + subhead + 2 CTAs)
2. Under-hero bullets (4 bullets)
3. Problem section (headline + bullet list + result statement)
4. What we do / mechanism (“Service Graph” + “Proof Layer”) with numbered list
5. Who it’s for (ICP) + best fit bullets + “not ideal” line
6. How it works (3-step) with timelines
7. Offers/services (Offer A/B/C cards)
8. Social proof (early-stage note)
9. FAQ (3 Q&As)
10. Final CTA block (book snapshot + email fallback)

Layout patterns:
- Use a consistent max width container and generous spacing.
- Use “cards” for offers and for the 3-step “How it works”.
- Use a clean FAQ accordion OR static Q/A blocks (no heavy JS required).

## Pricing (/pricing)
Sections:
1. Header (page H1 + subhead)
2. Snapshot pricing block
3. Foundation Lite block (includes/excludes)
4. Foundation Standard block
5. Ongoing management (two tiers)
6. CTA(s) to book/talk

Layout patterns:
- Pricing blocks should be easy to scan.
- Clearly separate “includes” vs “excludes”.

## Services (/services)
- Single page with a plain-English list.
- Can be presented as bullet list or small cards.

## Demo case study (/case-studies/demo)
- Must be labeled clearly as DEMO.
Sections:
1. Title + client/service area/goal
2. Starting point (Before bullets)
3. What we implemented (Foundation) with numbered subsections
4. Before/after artifacts examples
5. Results (demo language placeholders)
6. CTA

## Contact (/contact)
- Simple: headline, instructions, email/phone, Calendly link
- Include “What we need from you” bullet list
- No form.