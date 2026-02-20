Follow CLAUDE.md exactly.

Context:
- This repo currently contains /content (already populated) but does NOT yet have an Astro project scaffold.
- I am using Claude Code on macOS zsh CLI.
- Goal: scaffold a minimal Astro site in THIS repo (without moving/deleting /content) and render pages from /content/pages/*.md.

Primary tasks:
1) Initialize an Astro project in the current directory (minimal template).
   - Do not overwrite /content.
   - Prefer TypeScript.
   - Keep dependencies minimal.
   - If initialization would overwrite files, stop and ask me first.

2) Implement a content loader that reads:
   - /content/variables.md → produces a variables map (e.g., CALENDLY_LINK, EMAIL).
   - /content/pages/*.md → parses frontmatter (slug, page_id, title) and block-structured content.

3) Implement variable substitution:
   - Replace {{VAR_NAME}} in field bodies and CTA links using variables map.
   - Ensure CALENDLY_LINK resolves to https://calendly.com/nrorvem and EMAIL resolves to rudy.b@nrorvem.com.

4) Implement page routing:
   - Generate static routes from the slug in each /content/pages/*.md file (e.g., "/" and "/pricing").
   - Render a page using a simple Base layout + sections derived from the parsed blocks.

5) Render logic requirements (important):
   - Block-ID headings like "# HOME.HERO" and "## HOME.HERO.HEADLINE" are NOT user-facing.
   - They are structural keys. The user-facing page should display:
     - Headline/subhead as real headings/paragraphs
     - Bullets as lists
     - CTAs as buttons/links
   - Parse common CTA patterns in field bodies such as:
     - "CTA: Label → URL"
     - "Primary CTA: Label → URL"
     - "Button: Label → URL"
   - Specifically ensure: any CTA label that includes "Talk about monthly management" links to {{CALENDLY_LINK}}.

6) Add a minimal navigation:
   - Home
   - Pricing
   - (Optionally) auto-generate nav items from the pages list, but keep it minimal.

Deliverables:
- Show diffs for all created/changed files.
- Provide the exact commands to run:
  - install deps
  - start dev server
  - build
- Explain (briefly) how I add a new page by adding a /content/pages/*.md file.

Constraints:
- Do not rewrite content copy in /content.
- Do not rename block IDs.
- Keep styling minimal (basic CSS ok; no Tailwind unless I ask).
- Prefer minimal, readable code over “clever.”