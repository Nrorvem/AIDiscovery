import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

// ── Types ──────────────────────────────────────────────────────────────────

export interface Block {
  id: string;
  level: number; // 1 = section boundary, 2-4 = field
  body: string;  // already variable-substituted
}

export interface PageData {
  slug: string;
  page_id: string;
  title: string;
  blocks: Block[];
}

// Level-3 sub-group (e.g. HOME.OFFERS.A) containing level-4 fields.
export interface SubSection {
  id: string;
  body: string;    // body on the level-3 block itself (usually empty)
  fields: Block[]; // level-4 blocks
}

export interface Section {
  id: string;
  body: string;               // body on the level-1 block (e.g. CONTACT.DETAILS list)
  directFields: Block[];      // level-2 fields (HEADLINE, SUBHEAD, …)
  subsections: SubSection[];  // level-3 groups rendered as cards
}

// ── Variables ──────────────────────────────────────────────────────────────

export function loadVariables(): Record<string, string> {
  const text = readFileSync(resolve('content/variables.md'), 'utf-8');
  const vars: Record<string, string> = {};
  for (const line of text.split('\n')) {
    // Match lines of the form: "- KEY: value"
    const m = line.match(/^-\s+([A-Z_][A-Z0-9_]*):\s+(.+)/);
    if (m) vars[m[1]] = m[2].trimEnd();
  }
  return vars;
}

export function applyVars(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{([A-Z_][A-Z0-9_]*)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

// ── Parsing ────────────────────────────────────────────────────────────────

function parseFrontmatter(text: string): { meta: Record<string, string>; body: string } {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: text };
  const meta: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s+(.+)/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: m[2] };
}

// Block-ID headings are ALL_CAPS identifiers separated by dots.
// Examples: HOME.HERO  HOME.HERO.HEADLINE  HOME.OFFERS.A.TITLE
const BLOCK_HEADING_RE = /^(#{1,4})\s+([A-Z][A-Z0-9]*(?:[._][A-Z][A-Z0-9_]*)*)$/;

function parseBlocks(body: string, vars: Record<string, string>): Block[] {
  const blocks: Block[] = [];
  const lines = body.split('\n');
  let id = '';
  let level = 0;
  let buf: string[] = [];

  const flush = () => {
    if (id) {
      blocks.push({ id, level, body: applyVars(buf.join('\n').trim(), vars) });
    }
  };

  for (const line of lines) {
    // Skip markdown horizontal rules used as visual separators
    if (/^---+\s*$/.test(line.trim())) continue;

    const m = line.match(BLOCK_HEADING_RE);
    if (m) {
      flush();
      level = m[1].length;
      id = m[2];
      buf = [];
    } else if (id) {
      buf.push(line);
    }
  }

  flush();
  return blocks;
}

export function loadPages(): PageData[] {
  const vars = loadVariables();
  const dir = resolve('content/pages');
  return readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const text = readFileSync(join(dir, f), 'utf-8');
      const { meta, body } = parseFrontmatter(text);
      return {
        slug: meta.slug ?? '/',
        page_id: meta.page_id ?? '',
        title: meta.title ?? '',
        blocks: parseBlocks(body, vars),
      };
    });
}

// Group flat block list into sections.
//   Level 1 → Section container
//   Level 2 → directFields (headline, subhead, CTA at section level)
//   Level 3 → SubSection (rendered as a card group)
//   Level 4 → fields within the current SubSection
export function groupSections(blocks: Block[]): Section[] {
  const sections: Section[] = [];
  let section: Section | null = null;
  let subsection: SubSection | null = null;

  for (const block of blocks) {
    if (block.level === 1) {
      section = { id: block.id, body: block.body, directFields: [], subsections: [] };
      subsection = null;
      sections.push(section);
    } else if (block.level === 2 && section) {
      subsection = null; // level-2 field exits any current sub-section
      section.directFields.push(block);
    } else if (block.level === 3 && section) {
      subsection = { id: block.id, body: block.body, fields: [] };
      section.subsections.push(subsection);
    } else if (block.level === 4 && section) {
      if (subsection) {
        subsection.fields.push(block);
      } else {
        // Orphaned level-4 without a level-3 parent — treat as a direct field.
        section.directFields.push(block);
      }
    }
  }

  return sections;
}

// ── HTML rendering ─────────────────────────────────────────────────────────

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escAttr(s: string): string {
  return s.replace(/"/g, '&quot;');
}

// Apply bold/italic markdown and auto-link URLs.
function inlineMd(raw: string): string {
  // Split on URLs so we can escape text and link URLs separately.
  const parts = raw.split(/(https?:\/\/[^\s]+)/);
  return parts
    .map((part, i) => {
      if (i % 2 === 1) {
        // URL segment → render as a link
        return `<a href="${escAttr(part)}">${esc(part)}</a>`;
      }
      // Text segment → escape then apply **bold** and _italic_
      return esc(part)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/_(.+?)_/g, '<em>$1</em>')
        .replace(/~~(.+?)~~/g, '<s>$1</s>');
    })
    .join('');
}

// CTA line patterns: "CTA: Label → URL", "Primary CTA: ...", "Button: ..."
const CTA_RE = /^(?:(?:Primary|Secondary)\s+)?(?:CTA|Button):\s+(.+?)\s+→\s+(\S+)\s*$/;
// Fallback email line: "Or email: address"
const EMAIL_RE = /^Or email:\s+(.+)\s*$/;

// Render an array of text lines into HTML, grouping consecutive list items.
function renderLines(lines: string[]): string {
  const parts: string[] = [];
  let listBuf: string[] = [];
  let ordered = false;

  const flushList = () => {
    if (!listBuf.length) return;
    const tag = ordered ? 'ol' : 'ul';
    parts.push(`<${tag}>${listBuf.map(t => `<li>${t}</li>`).join('')}</${tag}>`);
    listBuf = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }

    // CTA / Button line → render as a button link
    const ctaM = line.match(CTA_RE);
    if (ctaM) {
      flushList();
      parts.push(`<a href="${escAttr(ctaM[2])}" class="btn">${esc(ctaM[1])}</a>`);
      continue;
    }

    // "Or email: addr" fallback line
    const emailM = line.match(EMAIL_RE);
    if (emailM) {
      flushList();
      const addr = emailM[1].trim();
      parts.push(`<p>Or email: <a href="mailto:${escAttr(addr)}">${esc(addr)}</a></p>`);
      continue;
    }

    // Unordered list item: "- text" or "* text"
    const ulM = line.match(/^[-*]\s+(.*)/);
    if (ulM) {
      if (ordered && listBuf.length) flushList();
      ordered = false;
      listBuf.push(inlineMd(ulM[1]));
      continue;
    }

    // Ordered list item: "1. text" or "1) text"
    const olM = line.match(/^\d+[.)]\s+(.*)/);
    if (olM) {
      if (!ordered && listBuf.length) flushList();
      ordered = true;
      listBuf.push(inlineMd(olM[1]));
      continue;
    }

    // Default: paragraph
    flushList();
    parts.push(`<p>${inlineMd(line)}</p>`);
  }

  flushList();
  return parts.join('\n');
}

const HEADING_SUFFIXES = new Set(['HEADLINE', 'H1']);

export function renderBlockBody(body: string, blockId: string): string {
  if (!body.trim()) return '';

  const suffix = blockId.split('.').pop() ?? '';
  const lines = body.split('\n');

  // HEADLINE / H1 → <h2> for first line, then render any remaining lines
  if (HEADING_SUFFIXES.has(suffix)) {
    const firstLine = lines[0]?.trim() ?? '';
    const rest = lines.slice(1);
    const restHtml = rest.some(l => l.trim()) ? renderLines(rest) : '';
    return `<h2>${esc(firstLine)}</h2>${restHtml}`;
  }

  // TITLE → <h3> for first line, then remaining lines
  if (suffix === 'TITLE') {
    const firstLine = lines[0]?.trim() ?? '';
    const rest = lines.slice(1);
    const restHtml = rest.some(l => l.trim()) ? renderLines(rest) : '';
    return `<h3>${esc(firstLine)}</h3>${restHtml}`;
  }

  // STEP_* → strip leading "1) " number, render as <h3> + remaining body
  if (suffix.startsWith('STEP_')) {
    const firstLine = (lines[0]?.trim() ?? '').replace(/^\d+[.)]\s+/, '');
    const rest = lines.slice(1);
    const restHtml = rest.some(l => l.trim()) ? renderLines(rest) : '';
    return `<h3>${esc(firstLine)}</h3>${restHtml}`;
  }

  // PRICE → styled paragraph (supports inline markdown for strikethrough etc.)
  if (suffix === 'PRICE') {
    return `<p class="price">${inlineMd(body.trim())}</p>`;
  }

  // TIMELINE → plain paragraph
  if (suffix === 'TIMELINE') {
    return `<p class="timeline">${esc(body.trim())}</p>`;
  }

  // INCLUDES_DETAIL → collapsible disclosure widget (no JS required)
  if (suffix === 'INCLUDES_DETAIL') {
    const content = renderLines(lines);
    return `<details class="includes-detail"><summary>See all details</summary>${content}</details>`;
  }

  // Everything else: parse line by line
  return renderLines(lines);
}
