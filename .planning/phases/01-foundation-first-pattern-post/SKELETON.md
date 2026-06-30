# Walking Skeleton — Frontend Blueprints

**Phase:** 1
**Generated:** 2026-06-29

## Capability Proven End-to-End

A visitor can load `/patterns/toast-notification-system`, see a real Pattern post rendered from an MDX file through the typed Velite content layer, and toggle light/dark theme with no flash of the wrong theme — served by the built Next.js app and exercised by an automated Playwright smoke test.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16.2.x App Router + React 19.2.x + Turbopack | Author's locked choice (CLAUDE.md / D-01); RSC-by-default fits a content-heavy site where post bodies render to static HTML and only the theme toggle is a client island. |
| Language | TypeScript 5.7+ | Typed frontmatter + component props; locked in CLAUDE.md (pin 5.x, do not adopt a 6.x dist-tag). |
| Styling | Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.js`) + `@tailwindcss/typography` via `@plugin` directive | Locked in CLAUDE.md; v4 CSS-first config avoids JS-config drift; typography plugin powers the `prose` post body. |
| Content layer | Velite 0.4.0 (Zod-validated, build-time typed JSON, imported as `#site/content`) | Locked per D-02; decouples `content/patterns/*.mdx` from route files; computes reading time at build time. |
| Velite ↔ Next wiring | Turbopack-safe top-level dynamic `import("velite")` in `next.config.ts` (guarded by `VELITE_STARTED`, mode via `process.argv`) | Next.js 16 defaults to Turbopack; the legacy `VeliteWebpackPlugin` silently no-ops under it (Pitfall 1). |
| MDX rendering | `next-mdx-remote/rsc` v6.0.0 (`<MDXRemote>` async Server Component) | Locked per D-01. RISK: upstream repo archived 2026-04-09 — v6.0.0 works today; tracked as a watch item (see Out of Scope / STATE note). |
| Syntax highlighting | Shiki (latest) via `rehype-pretty-code` 0.14.3 + `@rehype-pretty/transformers` copy button | Locked per D-03; verified peer range allows latest Shiki. Build-time highlighting, zero client highlighter shipped. |
| Plugin chain order | `remark-gfm` → `rehype-slug` → `rehype-autolink-headings` → `rehype-pretty-code` | slug must precede autolink (Pitfall 2); pretty-code last. |
| Theming | `next-themes` (`attribute="class"`, blocking script auto-injected), `<html suppressHydrationWarning>` | Flash-free without hand-rolling the blocking script (Pitfall 4); the one acceptable near-root `"use client"`. |
| Site identity | Name/OG "Frontend Blueprints" (D-07); author byline "Alejandro Arevalo" (D-09); domain via single `NEXT_PUBLIC_SITE_URL` env var, default `https://example.com` (D-08) | Single-source domain swaps trivially to production later. |
| Data access | `lib/content.ts` (`getAllPatterns`, `getPatternBySlug`) wraps `#site/content`; route files never import `#site/content` directly | Centralizes the content-access surface; one place to evolve in later phases. |
| Deployment target | Local full-stack run (`npm run dev`; `npm run build && npm run start`); no hosted deploy in Phase 1 | Static MDX-in-repo site; Vercel zero-config deploy deferred — local run command is the documented full-stack exercise for the skeleton. |
| Directory layout | Project-root `app/`, `lib/`, `components/`, `content/patterns/`; no `src/` dir | Matches RESEARCH.md Recommended Project Structure; all plan file paths assume this layout. |
| Test runner | Playwright (smoke-only) | Phase risk is build/render/visual correctness, not algorithmic logic; smoke tests cover route render, reading-time presence, 404, theme toggle, RSS/sitemap/robots. |

## Stack Touched in Phase 1

- [x] Project scaffold (Next.js framework, Turbopack build, ESLint, Playwright test runner)
- [x] Routing — real routes: `/`, `/patterns`, `/patterns/[slug]`, `/rss.xml`, `/sitemap.xml`, `/robots.txt`
- [x] Content layer — real read: one MDX post compiled by Velite and rendered through `next-mdx-remote/rsc` (no DB; the content layer is the persistence boundary for this static site)
- [x] UI — interactive element wired up: theme toggle (client island) reading/writing theme via `next-themes`
- [x] Deployment — documented local full-stack run command (`npm run dev` / `npm run build && npm run start`); a Playwright smoke suite exercises the built app end-to-end

> Note on the template's "DB read AND write": this is a static, single-author, MDX-in-repo site with no database by explicit design (CLAUDE.md "no headless CMS"; REQUIREMENTS.md "no CMS"). The Velite-compiled content collection is the data layer; the "write" is authoring an MDX file committed to the repo. There is no runtime database to read/write, and adding one would violate the project's locked architecture.

## Out of Scope (Deferred to Later Slices)

- Live, interactive demo registry (`mdx-components.tsx` demo components) — Phase 2 (PATT-02).
- Browsing by category and tag — Phase 2 (PATT-04).
- Table of contents with anchor links — Phase 2 (SITE-04). (Heading ids + self-links ARE added in Phase 1 via rehype-slug/autolink, but the TOC UI is Phase 2.)
- Screenshots / GIF / video in posts — deferred (D-06: code blocks only for v1).
- Cross-linking infrastructure (many-to-many `relatedContent`, build-time validation) — Phase 3 (LINK-01..03).
- The Blueprints track — Phase 4 (BLUE-01..03).
- A dedicated UI design pass (refined accent color / font pairing / layout) — Phase 2 has `UI hint: yes` (D-10/D-11 leave base theme to Claude's discretion for v1).
- Hosted deployment (Vercel), CI config, full-text search, newsletter, comments — out of scope / v2.
- **Watch item:** `next-mdx-remote` upstream repo archived 2026-04-09. v6.0.0 functions correctly today; re-confirm it still works before any future Next.js major-version upgrade. Escape hatch: `next-mdx-remote-client` fork or `@next/mdx`.

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- Phase 2: A visitor can interact with live demos, browse Patterns by category/tag, and jump via a table of contents (PATT-02, PATT-04, SITE-04).
- Phase 3: The author can declare many-to-many Blueprint↔Pattern relationships in frontmatter, build-validated against broken slugs (LINK-01, LINK-02, LINK-03).
- Phase 4: A visitor can read multi-perspective Blueprint posts cross-linked to the Patterns they're composed of (BLUE-01, BLUE-02, BLUE-03).
