# CLAUDE.md — Project Rules (Greenfield Astro + /content CMS)

## 0) Project status
- This repo is NOT yet an Astro project. It will be scaffolded into an Astro site.
- The /content directory already exists and is the source of truth for marketing content.

## 1) Prime directive
- Do not rewrite marketing copy unless explicitly requested.
- Do not rename or delete block IDs (e.g., HOME.OFFERS.C.CTA) in /content.
- Make the smallest possible changes to accomplish the task.

## 2) Content architecture (source of truth)
- /content/variables.md contains shared variables referenced as {{VAR_NAME}}.
- /content/pages/*.md contains pages with frontmatter (slug/page_id/title) and block-ID headings.
- Preserve frontmatter, ordering, and block IDs.

## 3) Global constants (must remain true)
- CALENDLY_LINK must be: https://calendly.com/nrorvem
- EMAIL must be: rudy.b@nrorvem.com
- Any CTA with label "Talk about monthly management" must link directly to {{CALENDLY_LINK}}

## 4) Greenfield scaffolding rules (Astro initialization)
- It is allowed to add new files required for Astro (package.json, src/, astro.config.*, etc.).
- Do NOT move, delete, or rename the existing /content directory.
- If a command would overwrite existing files, stop and ask for approval first.
- Prefer a minimal Astro template and minimal dependencies.

## 5) Implementation rules
- Keep /content as the canonical content store; read from it at build time using Node fs.
- Implement variable substitution for {{...}} using variables from /content/variables.md.
- Interpret block-ID headings as structure, not user-facing headings:
  - `# SECTION.KEY` indicates a section boundary.
  - `## SECTION.KEY.FIELD` indicates a field within a section.
  - Render user-facing content from the field bodies, not from the block-ID headings themselves.

## 6) Design upgrade mode (Finexo-inspired, but original)
- Goal: upgrade the site from plain markdown rendering to a modern SaaS/fintech aesthetic:
  - clean typography, consistent spacing, card-based sections, conversion-focused CTAs
  - fully responsive layouts + mobile nav
  - subtle hover/scroll interactions (must respect prefers-reduced-motion)

- Rules:
  - Do NOT copy or reproduce the Finexo (Webflow) template code or structure verbatim.
  - Do NOT rewrite marketing copy in /content.
  - It is allowed to:
    - add /src/styles/* (tokens, global styles)
    - add Astro UI components under /src/components/*
    - update layouts to apply the new design system
  - Prefer minimal dependencies (vanilla CSS or Astro scoped styles).
  - Accessibility requirements:
    - visible focus states
    - semantic headings
    - sufficient color contrast
    - keyboard-friendly mobile nav

## 7) UI / Layout targets (current phase)
- Sections should be full-bleed (background color spans full viewport width).
- Content should be centered inside a responsive container whose max width is:
  - max-width: clamp(48rem, 66vw, 80rem)
  - width: 100%
  - with comfortable horizontal padding on mobile
- Visual style target: modern SaaS/fintech (clean typography, subtle section contrast), not “boxed app panels”.

## 8) CTA label rules (current phase)
- It is allowed to shorten CTA button labels for on-page display (aim: 2 words).
- Keep CTA meaning intact. Prefer: "Get demo", "Start now", "Contact sales", "Get pricing", "View plans".
- Link rules remain: monthly-management CTA must always link to {{CALENDLY_LINK}}.
  - This rule must NOT rely on the CTA label text (since labels may be shortened).
  - Instead, enforce via block ID, section key, or URL assignment logic.

## 9) Icons
- It is allowed to add simple inline SVG icons next to section headings/subheadings.
- Icons must be decorative unless conveying unique info:
  - decorative icons must be aria-hidden
  - do not harm accessibility or reading flow
- Keep dependencies minimal; prefer local inline SVGs over large icon libraries.

## 10) Copy edits (if requested)
- /content is still the source of truth.
- When asked to edit copy:
  1) propose changes first (before/after)
  2) wait for approval OR apply directly if user explicitly says “apply these changes”
  3) do not rename block IDs or change frontmatter structure

## 11) Output requirements
After changes:
1) Summarize what changed and why
2) Provide diffs for changed/added files only
3) List any commands that were run (or need to be run)
4) List assumptions + follow-ups/questions

## 12) Safety checks before finishing
- Verify CTAs:
  - "Talk about monthly management" (shortened CTA button labels) → {{CALENDLY_LINK}}
- Verify no /content block IDs changed.
- Verify /content/variables.md values used are correct.