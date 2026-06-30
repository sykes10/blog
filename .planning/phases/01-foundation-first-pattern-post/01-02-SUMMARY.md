---
phase: 01-foundation-first-pattern-post
plan: "02"
subsystem: content-pipeline
tags:
  - mdx
  - syntax-highlighting
  - shiki
  - rehype
  - seo
  - json-ld
  - accessibility
  - content
dependency_graph:
  requires:
    - 01-01 (Next.js scaffold, Velite content layer, MDXRemote wiring, post route)
  provides:
    - Full remark/rehype+Shiki plugin chain wired in MDXRemote options (pattern chain: remarkGfm → rehypeSlug → rehypeAutolinkHeadings → rehypePrettyCode)
    - Shiki github-light/github-dark theme pair with CSS data-theme visibility switching
    - @rehype-pretty/transformers copy-button (no hand-rolled client JS)
    - Callout presentational component (note/tip/warning/danger types)
    - Complete 8-section Toast Pattern post (production-grade prose, multi-language code blocks)
    - Per-post SEO: generateMetadata with OG tags + metadataBase + siteName, JSON-LD Article schema
    - Reading time rendered in post header
  affects:
    - All future pattern posts (inherit the plugin chain + Callout component)
    - Phase 2 (Callout can be extended; MDX options object is now the single place to add new plugins)
    - Phase 3 (SEO metadata pattern established for Blueprint posts)
tech_stack:
  added:
    - Plugin chain wired: remark-gfm@4.0.1, rehype-slug@6.0.0, rehype-autolink-headings@7.1.0, rehype-pretty-code@0.14.3, shiki@4.x (all installed in Plan 01)
    - @rehype-pretty/transformers: transformerCopyButton (copy-button with no client JS)
  patterns:
    - Plugin chain passes through MDXRemote options.mdxOptions (not velite.config.ts — because s.raw() pattern means Velite does not compile MDX, next-mdx-remote/rsc does)
    - rehype-pretty-code light/dark theme pair via CSS data-theme visibility rules in globals.css (no JS theme switching for code blocks)
    - JSON-LD Article schema injected via dangerouslySetInnerHTML at SSR (author-controlled build-time data, T-01-03 threat accepted)
    - Single SITE_URL constant from process.env.NEXT_PUBLIC_SITE_URL with fallback for all URL construction (D-08)
    - Callout component uses not-prose class to escape @tailwindcss/typography styling
key_files:
  created:
    - components/mdx/Callout.tsx
  modified:
    - app/patterns/[slug]/page.tsx (MDX plugin chain, metadataBase, siteName, JSON-LD url field)
    - lib/mdx-components.tsx (registers Callout; inline code override updated for rehype-pretty-code compat)
    - content/patterns/toast-notification-system.mdx (full 8-section body)
    - app/globals.css (data-theme light/dark visibility rules for rehype-pretty-code)
decisions:
  - "Plugin chain goes in MDXRemote options.mdxOptions (app/patterns/[slug]/page.tsx), NOT in velite.config.ts: the s.raw() architecture (decided in Plan 01) means Velite stores raw MDX text — next-mdx-remote/rsc compiles it. The plan said 'extend velite.config.ts MDX options' but that was written before the s.raw() deviation was known. Velite's global mdx: {} config only applies when s.mdx() is used."
  - "Used Record<string, any> type cast for MDX_OPTIONS to avoid PluggableList type incompatibility between @mdx-js/mdx CompileOptions and the concrete plugin function signatures — a known TypeScript narrowing issue with the unified ecosystem's plugin tuple syntax"
  - "metadataBase added to generateMetadata so Next.js correctly resolves canonical alternates.canonical relative URL; without it Next.js warns and may produce incorrect absolute URLs in OG tags"
metrics:
  duration_minutes: 21
  completed_date: "2026-06-30T18:14:44Z"
  tasks_completed: 3
  tasks_total: 3
  files_created: 1
  files_modified: 4
status: complete
---

# Phase 01 Plan 02: Rich Post Content — Plugin Chain, 8-Section Toast Post, SEO Metadata

**One-liner:** Shiki syntax highlighting via rehype-pretty-code wired into MDXRemote options, complete production-grade 8-section Toast Pattern post (multi-language code blocks, GFM table, Callout components), and per-post SEO metadata (OG tags with siteName, JSON-LD Article schema, metadataBase, reading time).

## What Was Built

### Task 1: Remark/Rehype + Shiki Plugin Chain

Wired the full plugin chain into `MDXRemote`'s `options.mdxOptions` in `app/patterns/[slug]/page.tsx`:

- `remarkPlugins: [remarkGfm]` — GFM table/strikethrough/autolinks support
- `rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, {behavior: "wrap"}], [rehypePrettyCode, {...}]]`
- Plugin chain order enforces the Pattern 3 requirement: `rehypeSlug` before `rehypeAutolinkHeadings` (autolink depends on slug's id attributes)
- `rehypePrettyCode` configured with `themes: { light: "github-light", dark: "github-dark" }` paired theme
- `transformerCopyButton` from `@rehype-pretty/transformers` — copy-to-clipboard with zero hand-rolled client JS
- `globals.css` updated with `data-theme` visibility rules for light/dark code block switching via CSS

Created `components/mdx/Callout.tsx`:
- Presentational aside component with four types: `note`, `tip`, `warning`, `danger`
- `not-prose` class escapes `@tailwindcss/typography` so callout styles aren't overridden
- Accessible: uses `<aside>` semantic element with type-specific icons

Updated `lib/mdx-components.tsx`:
- Registered `Callout` component for MDX use as `<Callout type="...">...</Callout>`
- Updated inline code override to avoid double-styling Shiki-processed `<code>` blocks
- No live-demo registry entries (D-06 — deferred to Phase 2)

### Task 2: Complete Toast Pattern Post

Replaced the minimal seed body with the full 8-section template (D-05/PATT-01):

1. **The Problem Toast Solves** — queue management, accessibility, auto-dismiss, stacking complexity
2. **When to Use (and When Not To)** — four cases for each, Callout with the accessibility test heuristic
3. **Trade-offs** — GFM table comparing five queue strategies with pros/cons and guidance
4. **Common Mistakes** — five anti-patterns: hardcoded timeouts, synchronous event handlers, hover-only pause, misuse of `role="alert"`, storing undo in toast state
5. **Accessibility Considerations** — ARIA live region model, `aria-atomic="false"`, polite vs assertive, WCAG 2.1 SC 2.2.2, CSS `prefers-reduced-motion`
6. **Performance Implications** — React re-render avoidance (CSS animation over JS interval), batching rapid-fire toasts
7. **Edge Cases** — navigation, multiple tabs, z-index under modals, RTL layouts, long messages
8. **Implementation Considerations** — TypeScript interfaces, useReducer pattern, pause/resume timer with residual time tracking, Callout note about Sonner

Multi-language code blocks exercised: `html`, `tsx`, `css`, `typescript`.

### Task 3: Per-Post SEO Metadata (delivered in Task 1 commit)

The `page.tsx` rewrite for Task 1 also delivered all Task 3 requirements:

- `generateMetadata` returns `title`, `description`, `openGraph` (type: "article", publishedTime, siteName: "Frontend Blueprints"), `metadataBase`, `alternates.canonical`
- Single `SITE_URL` constant from `process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"` (D-08)
- JSON-LD `<script type="application/ld+json">` with `author: { "@type": "Person", name: "Alejandro Arevalo" }` (D-09)
- `post.readingTime` rendered in the post header (SITE-03)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Plugin chain wired in MDXRemote options, not velite.config.ts**
- **Found during:** Task 1 implementation
- **Issue:** The plan said "extend MDX compile options in `velite.config.ts`" but the Plan 01 deviation (switching to `s.raw()`) means Velite does not compile MDX — it only stores raw text. Velite's `mdx: {}` global config only applies to collections using `s.mdx()`. With `s.raw()`, the MDX compilation happens inside `next-mdx-remote/rsc`'s `MDXRemote` component.
- **Fix:** Added `MDX_OPTIONS` to `app/patterns/[slug]/page.tsx` and passed it as `options={{ mdxOptions: MDX_OPTIONS }}` to `<MDXRemote>`. The Velite config remains unchanged (it correctly uses `s.raw()`).
- **Files modified:** `app/patterns/[slug]/page.tsx`
- **Commit:** b715ac6

**2. [Rule 1 - Bug] TypeScript PluggableList type incompatibility**
- **Found during:** Task 1 build verification (`npm run build`)
- **Issue:** TypeScript rejected the `MDX_OPTIONS` object because `as const` made arrays `readonly`, which is incompatible with `Pluggable[]` (mutable). Without `as const`, the tuple syntax `[rehypeAutolinkHeadings, { behavior: "wrap" }]` caused a type inference failure — TypeScript couldn't narrow the tuple to `[Plugin, PluginOptions]` reliably due to how the unified ecosystem types its plugin parameters.
- **Fix:** Used `Record<string, any>` type annotation for `MDX_OPTIONS` to bypass the structural type mismatch. The ESLint disable comment documents the intentionality. This is a known TypeScript interop issue with the unified/remark/rehype ecosystem.
- **Files modified:** `app/patterns/[slug]/page.tsx`
- **Commit:** b715ac6

**3. [Rule 2 - Missing Critical] Added metadataBase to generateMetadata**
- **Found during:** Task 3 review of Plan 01's existing generateMetadata
- **Issue:** The Plan 01 `generateMetadata` was missing `metadataBase`, which Next.js requires to correctly resolve relative canonical URLs and produce absolute OG tag URLs in the HTML `<head>`. Without it, `alternates.canonical` is not resolved properly.
- **Fix:** Added `metadataBase: new URL(SITE_URL)` and `alternates: { canonical: '/patterns/${post.slug}' }`.
- **Files modified:** `app/patterns/[slug]/page.tsx`
- **Commit:** b715ac6

## Known Stubs

None. All fields, routes, and components use real data from the Velite content layer.

## Threat Flags

None. No new network endpoints, auth paths, file access patterns, or schema changes beyond what was documented in the plan's `<threat_model>` (T-01-03: JSON-LD dangerouslySetInnerHTML accepted as author-controlled build-time data).

## Success Criteria Status

- [x] Code blocks render with Shiki `data-theme` attributes (confirmed in built HTML) — FOUND-02
- [x] Post follows full 8-section template with static code snippets only (8 `##` headings confirmed; no image/video/demo) — PATT-01, PATT-03
- [x] Each post has OG tags, JSON-LD Article (author "Alejandro Arevalo"), title/description — SITE-01
- [x] Post displays estimated reading time (confirmed "min read" in built HTML) — SITE-03
- [x] GFM table in trade-offs section (7 table rows confirmed in MDX)
- [x] `npm run build` green — all 6 static pages generated

## Self-Check

**Files exist:**
- FOUND: components/mdx/Callout.tsx
- FOUND: app/patterns/[slug]/page.tsx
- FOUND: lib/mdx-components.tsx
- FOUND: content/patterns/toast-notification-system.mdx
- FOUND: app/globals.css

**Commits exist:**
- b715ac6: feat(01-02): wire remark/rehype+Shiki plugin chain and Callout component
- 6c0c031: feat(01-02): author complete 8-section Toast Pattern post

## Self-Check: PASSED
