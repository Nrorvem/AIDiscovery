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

## 7) Output requirements
After changes:
1) Summarize what changed and why
2) Provide diffs for changed/added files only
3) List any commands that were run (or need to be run)
4) List assumptions + follow-ups/questions

## 8) Safety checks before finishing
- Verify CTAs:
  - "Talk about monthly management" → {{CALENDLY_LINK}}
- Verify no /content block IDs changed.
- Verify /content/variables.md values used are correct.