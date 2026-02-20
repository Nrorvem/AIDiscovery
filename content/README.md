# Content folder (source of truth)

This folder contains the site copy and structure, broken into small, addressable blocks.

## Editing rules (important)
- Keep copy verbatim unless you intentionally change it.
- When requesting edits from Claude, reference block IDs like `HOME.HERO.HEADLINE`.
- Variables (Calendly, email, phone, etc.) should be updated in `variables.md`.

## Variable placeholders
This content uses simple placeholders like:
- {{CALENDLY_LINK}}
- {{EMAIL}}
- {{PHONE}}

Update them in `variables.md`. The site implementation can replace them at build time or during rendering.

## Files
- `variables.md` — single place for URLs + contact + location strings.
- `global.md` — top bar/announcement, global CTAs, footer disclaimer.
- `pages/*.md` — per-page copy in structured blocks.
- `layout-instructions.md` — page section ordering and layout notes.
- `assets.md` — placeholder list of needed images/icons.
- `edit-notes.md` — pending tweaks and decisions.