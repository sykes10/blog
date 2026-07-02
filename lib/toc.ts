// Heading-extraction helper for the Pattern post table of contents (SITE-04).
// Route files must import from here rather than re-implementing slugification,
// so TOC anchor ids stay guaranteed-identical to the ids rehype-slug renders.
import GithubSlugger from "github-slugger";

export type Heading = {
  id: string;
  text: string;
  depth: number;
};

/**
 * Parses raw MDX text and returns one entry per markdown heading (## and
 * deeper), with an `id` produced by github-slugger — the same slugifier
 * rehype-slug uses internally — so TOC links resolve to the exact `id`
 * attribute rendered on the corresponding heading. Headings inside fenced
 * code blocks are skipped. A fresh GithubSlugger instance is used per call
 * so duplicate-heading `-1`/`-2` disambiguation matches per-document.
 */
export function extractHeadings(raw: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();

    // Track fenced code block state (```lang ... ```) so heading-like lines
    // inside code samples (e.g. shell comments, markdown snippets) are not
    // mistaken for real headings.
    if (trimmed.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,6})\s+(.+)$/.exec(trimmed);
    if (!match) continue;

    const depth = match[1].length;
    const text = match[2].trim();
    const id = slugger.slug(text);

    headings.push({ id, text, depth });
  }

  return headings;
}
