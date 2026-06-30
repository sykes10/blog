---
phase: 01-foundation-first-pattern-post
plan: "01"
subsystem: scaffold
tags:
  - nextjs
  - velite
  - mdx
  - tailwind
  - theming
  - playwright
dependency_graph:
  requires: []
  provides:
    - Next.js 16.2.9 App Router scaffold with TypeScript + Tailwind v4 + Turbopack
    - Velite 0.4.0 Pattern collection schema with typed content layer
    - getAllPatterns() and getPatternBySlug() in lib/content.ts
    - Pattern post route at /patterns/[slug] rendering MDX via next-mdx-remote/rsc
    - Flash-free light/dark theming via next-themes (ThemeProvider + ThemeToggle)
    - Playwright smoke suite (3 tests green against production build)
  affects:
    - All subsequent plans in Phase 1 (build on this scaffold)
    - Phase 2 (extends Velite schema, MDX plugin chain, SEO)
    - Phase 3 (cross-linking, Blueprints track builds on content layer)
tech_stack:
  added:
    - next@16.2.9
    - react@19.2.4 / react-dom@19.2.4
    - typescript@5.9.3
    - tailwindcss@4.x / @tailwindcss/postcss / @tailwindcss/typography@0.5.20
    - next-mdx-remote@6.0.0 (/rsc entrypoint)
    - velite@0.4.0 + zod@4.4.3
    - rehype-pretty-code@0.14.3 + shiki@4.x + @rehype-pretty/transformers
    - remark-gfm@4.0.1 + rehype-slug@6.0.0 + rehype-autolink-headings@7.1.0
    - next-themes@0.4.6
    - reading-time@1.5.0
    - @playwright/test@1.x
  patterns:
    - Velite content layer with Zod-validated frontmatter and readingTime transform
    - Turbopack-safe Velite wiring via async IIFE in next.config.ts (not VeliteWebpackPlugin)
    - next-mdx-remote/rsc with raw MDX source (not pre-compiled Velite s.mdx() output)
    - next-themes ThemeProvider + suppressHydrationWarning flash-free theming
    - Tailwind v4 CSS-first config with @theme block and @plugin directive (no tailwind.config.js)
    - Client Component island pattern (ThemeToggle) with mount guard for hydration safety
key_files:
  created:
    - package.json
    - tsconfig.json (added #site/content path alias)
    - next.config.ts (Turbopack-safe Velite wiring)
    - postcss.config.mjs
    - velite.config.ts
    - mdx-components.tsx (root convention file)
    - lib/mdx-components.tsx
    - lib/content.ts
    - app/layout.tsx
    - app/globals.css
    - app/page.tsx
    - app/patterns/page.tsx
    - app/patterns/[slug]/page.tsx
    - components/theme/ThemeProvider.tsx
    - components/theme/ThemeToggle.tsx
    - content/patterns/toast-notification-system.mdx
    - .env.example
    - playwright.config.ts
    - tests/smoke.spec.ts
  modified:
    - .gitignore (added node_modules, .next, .velite, test-results, .env.local)
decisions:
  - "Switched Velite body field from s.mdx() to s.raw(): s.mdx() outputs a pre-compiled JS function-body string that cannot be evaluated server-side by Next.js during static generation (ERR_REQUIRE_ASYNC_MODULE / Function() arguments[0] failure in SSR context); s.raw() provides raw MDX text that next-mdx-remote/rsc compiles correctly as an async Server Component"
  - "Wrapped Velite dynamic import in async IIFE in next.config.ts rather than using top-level await: Next.js 16's CJS-based config transpiler throws ERR_REQUIRE_ASYNC_MODULE with top-level await"
  - "Used Tailwind v4 canonical class syntax throughout: text-(--var) instead of text-[var(--var)], bg-accent instead of bg-[var(--color-accent)]"
  - "Deep violet accent color (oklch(0.55 0.22 280)) and Inter/JetBrains Mono font pairing: distinctive personal-brand styling per D-10/D-11"
metrics:
  duration_minutes: 23
  completed_date: "2026-06-30T17:53:08Z"
  tasks_completed: 4
  tasks_total: 4
  files_created: 19
  files_modified: 3
status: complete
---

# Phase 01 Plan 01: Walking Skeleton — Scaffold, Content Pipeline, Theming, Smoke Tests

**One-liner:** Next.js 16 App Router scaffold wired end-to-end: Velite typed content layer serves raw MDX to next-mdx-remote/rsc, flash-free theming via next-themes, responsive prose typography via @tailwindcss/typography, and a Playwright smoke suite running green against the real built app.

## What Was Built

A fully working walking skeleton for Frontend Blueprints:

- **Project scaffold:** Next.js 16.2.9 + TypeScript 5.9.3 + Tailwind v4 + Turbopack via `create-next-app`, with all locked content-pipeline dependencies installed
- **Content layer:** Velite 0.4.0 Pattern collection with Zod-validated frontmatter (`title`, `slug`, `description<=160`, `category` enum, `tags`, `publishedAt`, `readingTime` computed from `reading-time` package), `raw` field exposing MDX source for `next-mdx-remote/rsc`
- **Content access layer:** `lib/content.ts` with `getAllPatterns()` and `getPatternBySlug()` — all route files go through this, zero direct `#site/content` imports in `app/`
- **Post route:** `/patterns/[slug]` as an async Server Component using `generateStaticParams` + `generateMetadata` + `notFound()` for 404 + `MDXRemote` render inside `prose dark:prose-invert` article
- **Theming:** `ThemeProvider` (client wrapper) + `ThemeToggle` (client island with mount guard) — next-themes injects the blocking script, no hand-rolled `localStorage` access
- **Typography:** Tailwind v4 CSS-first `@import "tailwindcss"` + `@plugin "@tailwindcss/typography"` + `@theme` block with deep violet accent (`oklch(0.55 0.22 280)`) and Inter/JetBrains Mono font pairing
- **Seed content:** `content/patterns/toast-notification-system.mdx` with real frontmatter and genuine prose body covering the problem statement, when-to-use guidance, and a production TypeScript interface sketch
- **Smoke tests:** 3 Playwright tests green against production build: (1) 200 + title + reading-time presence, (2) 404 for unknown slug, (3) theme toggle changes `<html>` class

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Switched s.mdx() to s.raw() for Velite body field**
- **Found during:** Task 2/3 build verification
- **Issue:** Velite's `s.mdx()` outputs a pre-compiled JavaScript function-body string (not raw MDX). `next-mdx-remote/rsc`'s `<MDXRemote>` expects raw MDX source — passing the pre-compiled string causes an `acorn` parse error. Separately, evaluating the pre-compiled string via `Function()` during Next.js SSR/static generation fails (`Cannot destructure property 'Fragment' of 'arguments[0]'`) because the SSR execution context handles `arguments` differently than a browser.
- **Fix:** Changed `body: s.mdx()` to `raw: s.raw()` in `velite.config.ts`. The `raw` field holds the verbatim MDX text, which `MDXRemote` compiles server-side as an async React Server Component — zero client JS shipped for the post body.
- **Files modified:** `velite.config.ts`, `app/patterns/[slug]/page.tsx`
- **Commit:** 50e4547

**2. [Rule 3 - Blocking] Fell back from top-level await to async IIFE in next.config.ts**
- **Found during:** Task 1 build verification (first `npm run build` attempt)
- **Issue:** `next.config.ts` with top-level `await import("velite")` throws `ERR_REQUIRE_ASYNC_MODULE` — Next.js 16's config transpiler (`transpile-config.js`) uses `require()` to load the compiled config, which is incompatible with ESM top-level await.
- **Fix:** Wrapped the Velite dynamic import in an async IIFE: `(async () => { if (!process.env.VELITE_STARTED && ...) { await import("velite")... } })()`
- **Files modified:** `next.config.ts`
- **Commit:** 54a1fee (amended behavior described)

**3. [Style] Applied Tailwind v4 canonical class syntax throughout**
- **Found during:** IDE diagnostics after Task 3 file writes
- **Issue:** IDE flagged `text-[var(--foreground)]` should be `text-(--foreground)`, `bg-[var(--color-accent)]` should be `bg-accent`, etc.
- **Fix:** Updated all affected files to use canonical Tailwind v4 CSS variable shorthand syntax.
- **Files modified:** All app/ and component files
- **Commit:** 50e4547

## Architecture Notes

The key architectural decision that differs from the RESEARCH.md plan: **Velite's `s.mdx()` output cannot be used with `next-mdx-remote/rsc`'s `<MDXRemote>`**. These two packages have incompatible compilation outputs. The working pattern is:
- Velite validates frontmatter and stores raw MDX text (`s.raw()`)
- `<MDXRemote source={post.raw}>` compiles the MDX at render time server-side
- Result: fully static HTML, zero client JS for post body content

The `s.mdx()` field would only be useful with a custom client-side evaluation approach (using `Function()` + JSX runtime injection), but that approach fails during Next.js SSR. For this project's architecture (RSC-first, static generation), `s.raw()` + `MDXRemote` is the correct pattern.

## Known Stubs

None. All fields and routes return real data from the Velite-compiled content layer.

## Threat Flags

None. No new network endpoints, auth paths, or trust boundary changes beyond what was documented in the plan's `<threat_model>`. The JSON-LD injection uses `JSON.stringify()` over author-controlled build-time data (no untrusted input interpolation). RSS and sitemap are not implemented in this plan (Plan 02).

## Success Criteria Status

- [x] A visitor can load `/patterns/toast-notification-system` and see real MDX content rendered through the Velite typed content layer (FOUND-01) — verified by Playwright smoke test + build output
- [x] The theme toggle switches light/dark; hard refresh shows no flash of the wrong theme (FOUND-03) — functional aspect verified by smoke test; flash-free aspect is manual-only per VALIDATION.md
- [x] The post body renders with responsive, readable prose typography (FOUND-04) — verified visually; responsive layout is manual-only per VALIDATION.md
- [x] `npm run build` passes — all 4 route segments generated statically
- [x] `npm test` passes — 3/3 Playwright smoke tests green

## Self-Check

**Files exist:**
- FOUND: package.json, tsconfig.json, next.config.ts, velite.config.ts, mdx-components.tsx, lib/mdx-components.tsx, lib/content.ts, app/layout.tsx, app/globals.css, app/page.tsx, app/patterns/page.tsx, app/patterns/[slug]/page.tsx, components/theme/ThemeProvider.tsx, components/theme/ThemeToggle.tsx, content/patterns/toast-notification-system.mdx, .env.example, playwright.config.ts, tests/smoke.spec.ts

**Commits exist:**
- b0bf524: chore(01-01): scaffold Next.js 16 + Tailwind v4 with content pipeline deps
- 54a1fee: feat(01-01): add Velite Pattern schema, content layer, and seed MDX post
- 50e4547: feat(01-01): wire post route, theming, MDX rendering, and prose typography
- f4d5b08: test(01-01): add Playwright smoke harness for walking skeleton
- 14da7b6: chore(01-01): gitignore Playwright test-results directory

## Self-Check: PASSED
