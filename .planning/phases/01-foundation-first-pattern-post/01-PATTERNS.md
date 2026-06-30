# Phase 1: Foundation & First Pattern Post - Pattern Map

**Mapped:** 2026-06-29
**Files analyzed:** 22 (net-new, greenfield scaffold)
**Analogs found:** 0 / 22 — repo confirmed greenfield (no `package.json`, no `src/`, no `app/`, no `content/`, no existing components or config of any kind)

## Greenfield Notice

This repository contains only `.claude/`, `.git/`, `.gitignore`, and `.planning/` at the time of this mapping. There is **no existing application code to pattern-match against**. Every file below is "no existing analog — net new, greenfield scaffold." The value of this document is a single, concrete checklist of every file Phase 1 must create, classified by role and data flow, sourced directly from `01-RESEARCH.md`'s Architecture Patterns / Code Examples sections and `01-CONTEXT.md`'s locked decisions — not pattern-matching against prior code.

For implementation-level code shape (imports, exact API calls, wiring order), the planner and implementing agent should pull directly from `01-RESEARCH.md`'s "Code Examples" and "Architecture Patterns" sections (Pattern 1-4), which already contain concrete, citation-backed snippets for this exact stack. Treat `01-RESEARCH.md` as the de facto "analog" source for this phase, since no in-repo analog exists yet.

## File Classification

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|-----------------|---------------|
| `package.json` | config | — | none | no analog — greenfield |
| `next.config.ts` | config | build-time (Velite wiring) | none | no analog — greenfield |
| `tsconfig.json` | config | — | none | no analog — greenfield (scaffolded by `create-next-app`) |
| `postcss.config.mjs` | config | — | none | no analog — greenfield (scaffolded by `create-next-app`, Tailwind v4 `@tailwindcss/postcss`) |
| `velite.config.ts` | config / content schema | transform (frontmatter → typed JSON) | none | no analog — greenfield |
| `content/patterns/toast-notification-system.mdx` | content file | file-I/O (static MDX source) | none | no analog — greenfield |
| `mdx-components.tsx` (root) | component registry | request-response (maps MDX tags → components) | none | no analog — greenfield |
| `lib/mdx-components.tsx` | component registry (impl) | request-response | none | no analog — greenfield |
| `lib/content.ts` | service (data access over Velite output) | CRUD (read-only: `getAllPatterns`, `getPatternBySlug`) | none | no analog — greenfield |
| `app/layout.tsx` | component (root layout) | request-response | none | no analog — greenfield |
| `app/globals.css` | config (styling) | — | none | no analog — greenfield |
| `app/page.tsx` | component (home/index route) | request-response | none | no analog — greenfield |
| `app/patterns/page.tsx` | component (listing route) | request-response (CRUD: read/list) | none | no analog — greenfield |
| `app/patterns/[slug]/page.tsx` | component (detail route) | request-response (CRUD: read/detail) | none | no analog — greenfield |
| `app/sitemap.ts` | route (convention file) | batch (reads full collection, emits sitemap) | none | no analog — greenfield |
| `app/rss.xml/route.ts` | route (Route Handler) | streaming/batch (emits XML response) | none | no analog — greenfield |
| `components/theme/ThemeToggle.tsx` | component (client island) | event-driven (click → theme state change) | none | no analog — greenfield |
| `components/mdx/Callout.tsx` (or similar typography component) | component | request-response (presentational) | none | no analog — greenfield |
| `.env.local` / `.env.example` | config | — | none | no analog — greenfield (single `NEXT_PUBLIC_SITE_URL` value per D-08) |
| `app/icon.tsx` or `public/favicon.ico` | config/asset | — | none | no analog — greenfield (optional, SEO-adjacent) |
| `app/robots.ts` | route (convention file) | batch | none | no analog — greenfield (commonly paired with `sitemap.ts`, not explicitly required by REQUIREMENTS.md but low-cost to add alongside SITE-02) |
| Test/smoke files (if Wave 0 adds Playwright) | test | smoke | none | no analog — greenfield (RESEARCH.md flags this as a Wave 0 gap, not yet decided) |

## Pattern Assignments

Since no in-repo analog exists for any file, each assignment below points to the **RESEARCH.md section and line-anchored code example** that should be copied/adapted instead of an analog file. This is the equivalent of a "pattern source" for a greenfield phase.

### `next.config.ts` (config, build-time)
**Source:** `01-RESEARCH.md` → Architecture Patterns → "Pattern 1: Turbopack-safe Velite wiring in `next.config.ts`"
**Copy:** The `process.argv`-gated top-level dynamic `import("velite")` block, guarded by `process.env.VELITE_STARTED`. Do NOT use `VeliteWebpackPlugin` (Anti-Pattern, Pitfall 1).
**Verify at implementation time:** whether top-level `await` requires `.mjs` extension or an async IIFE wrapper (Open Question 2 / Assumption A3) — smoke-test by confirming `.velite/` regenerates on `next dev` content-file save.

### `velite.config.ts` (config / content schema)
**Source:** `01-RESEARCH.md` → Code Examples → "Velite Pattern collection schema (minimal, v1)"
**Copy:** `defineCollection({ name: "Pattern", pattern: "patterns/**/*.mdx", schema: s.object({...}).transform(...) })` shape, fields: `title`, `slug`, `description` (≤160 chars), `category` (enum), `tags`, `publishedAt`, `body` (`s.mdx()`), `raw` (`s.raw()`), computed `readingTime` via the `reading-time` package in `.transform()`.
**Caveat (Assumption A2 / Open Question 1):** Exact `s.*` builder method names (`s.slug`, `s.mdx`, `s.raw`, `s.isodate`) are MEDIUM-LOW confidence — verify against `node_modules/velite/dist/index.d.ts` or `velite.js.org/reference/config` before finalizing, per RESEARCH.md's explicit instruction.
**Explicitly excluded:** no `demoComponents` field (Anti-Pattern — premature schema surface, deferred to Phase 2 per D-06).

### `content/patterns/toast-notification-system.mdx` (content file)
**Source:** `01-CONTEXT.md` D-04, D-05, D-06
**Structure:** Frontmatter matching the Velite schema above (`category: "components"` most likely fit), body following the 8-section Pattern template: problem it solves → when to use / when not to use → trade-offs → common mistakes → accessibility considerations → performance implications → edge cases → implementation considerations. Code blocks only (D-06) — no images/video/live demo.

### `mdx-components.tsx` (root) + `lib/mdx-components.tsx`
**Source:** `01-RESEARCH.md` → Recommended Project Structure (root file required by Next.js App Router convention) + `.claude/CLAUDE.md` → "Component registry via `mdx-components.tsx`"
**Copy:** Root file re-exports `useMDXComponents()` from `lib/mdx-components.tsx`. For Phase 1, the component map is typography-only (headings, code block wrapper) — no demo component registry yet (that's Phase 2 per phase boundary).

### `lib/content.ts` (service, CRUD read-only)
**Source:** `01-RESEARCH.md` → Architecture Patterns → Pattern 2 (the `patterns.find((p) => p.slug === params.slug)` and `patterns.map(...)` calls embedded directly in the page component example)
**Recommendation:** Extract these into `getAllPatterns()` / `getPatternBySlug(slug)` helpers in `lib/content.ts` rather than inlining `#site/content` lookups in every route file (RESEARCH.md's own example inlines this in the page component — the planner should decide whether to extract now or defer; either is consistent with the research).

### `app/patterns/[slug]/page.tsx` (component, request-response)
**Source:** `01-RESEARCH.md` → Architecture Patterns → "Pattern 2: `next-mdx-remote/rsc` with typed frontmatter via `compileMDX`" (full code block) + Code Examples → "JSON-LD Article schema injection"
**Copy:**
- `generateStaticParams()` — enumerate all patterns from Velite collection
- `generateMetadata({ params })` — title, description, OG tags (`type: "article"`, `publishedTime`)
- JSON-LD `<script type="application/ld+json">` with `author: { "@type": "Person", name: "Alejandro Arevalo" }` per D-09
- `<MDXRemote source={post.body} components={mdxComponents} />` inside `<article className="prose dark:prose-invert">`
- `notFound()` for missing slugs

### `app/layout.tsx` (component, root layout)
**Source:** `01-RESEARCH.md` → Architecture Patterns → "Pattern 4: Flash-free theming via `next-themes`" (full code block)
**Copy:** `<html lang="en" suppressHydrationWarning>`, `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>` wrapping `{children}`. Do not hand-roll the blocking script (Anti-Pattern / Pitfall 4).

### `app/globals.css` (config, styling)
**Source:** `01-RESEARCH.md` → Code Examples → "Tailwind v4 CSS-first setup with typography plugin"
**Copy:** `@import "tailwindcss";` then `@plugin "@tailwindcss/typography";` then `@theme { --color-accent: ...; --font-display: ...; }`. Do NOT add a `tailwind.config.js` (Pitfall 5). Accent color and font pairing are Claude's discretion per D-11.

### `app/sitemap.ts` (route, convention file, batch)
**Source:** `01-RESEARCH.md` → Code Examples → "sitemap.ts convention file" (full code block)
**Copy:** `MetadataRoute.Sitemap` return shape, reads `patterns` from `#site/content`, maps to `{ url, lastModified }`, uses `process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"` (single config value per D-08).

### `app/rss.xml/route.ts` (route, Route Handler, streaming/batch)
**Source:** `01-RESEARCH.md` → Code Examples → "RSS feed Route Handler" (full code block)
**Copy:** `GET()` handler building XML string from `patterns`, the local `escapeXml()` helper (escapes `&`, `<`, `>` in title/description — required per Security Domain's RSS/XML injection note), `Content-Type: application/xml; charset=utf-8` response header. Site name "Frontend Blueprints" hardcoded in the `<title>` channel element per D-07.

### `components/theme/ThemeToggle.tsx` (component, client island, event-driven)
**Source:** `01-RESEARCH.md` → Recommended Project Structure (explicitly called out as "the one interactive island this phase needs") + Pattern 4 note on `next-themes` being a deliberately tiny client wrapper
**Copy:** `"use client"` component using `next-themes`'s `useTheme()` hook to read/set theme on click. No analog exists; this is the smallest possible client-component surface per the architecture's "islands of interactivity" principle (also documented in `.claude/CLAUDE.md` Stack Patterns by Variant).

## Shared Patterns

### Plugin chain ordering (applies to `velite.config.ts` MDX options)
**Source:** `01-RESEARCH.md` → Architecture Patterns → "Pattern 3: Remark/rehype plugin chain ordering"
**Apply to:** `velite.config.ts` (or wherever the MDX compile pipeline is configured)
```typescript
const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    rehypeAutolinkHeadings,
    [rehypePrettyCode, { theme: "github-dark" }],
  ],
};
```
**Critical ordering rule:** `rehype-slug` MUST precede `rehype-autolink-headings` (Pitfall 2) — autolink has nothing to link to otherwise.

### Site URL config (single source of truth, D-08)
**Source:** `01-RESEARCH.md` Code Examples (`sitemap.ts`, `rss.xml/route.ts`)
**Apply to:** `app/sitemap.ts`, `app/rss.xml/route.ts`, `generateMetadata` calls in `app/patterns/[slug]/page.tsx`, any OG/canonical URL construction
**Pattern:** `const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";` — defined once per file that needs it, sourced from a single env var so swapping the real domain later requires only an `.env` change, not a multi-file find/replace.

### Author byline (D-09)
**Source:** `01-CONTEXT.md` D-09
**Apply to:** JSON-LD `author` field in `app/patterns/[slug]/page.tsx`, any visible byline UI in the post layout
**Value:** `"Alejandro Arevalo"` — never the git handle `sykes10`.

### Site name/tagline (D-07)
**Source:** `01-CONTEXT.md` D-07
**Apply to:** `app/layout.tsx` metadata export, RSS channel `<title>`, header component, OG `site_name`
**Value:** `"Frontend Blueprints"`.

## No Analog Found

All 22 files listed in File Classification have no in-repo analog — this is expected and correct for a Phase 1 greenfield scaffold. No further analog search is warranted; see Greenfield Notice above.

## Metadata

**Analog search scope:** Repository root (`C:\Users\Alex\workspace\blog`) — confirmed via directory listing to contain only `.claude/`, `.git/`, `.gitignore`, `.planning/`.
**Files scanned:** 0 source files exist (directory listing only; no Glob/Grep search performed against nonexistent `src/`, `app/`, `content/`, or `lib/` directories, per task instructions to skip exhaustive search on a confirmed-greenfield repo).
**Pattern extraction date:** 2026-06-29
**Primary pattern source for this phase:** `01-RESEARCH.md` (Architecture Patterns §Pattern 1-4, Code Examples) — treat as the de facto analog source until Phase 1 ships real code for Phase 2 to pattern-match against.
</content>
