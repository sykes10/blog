---
phase: 02-live-demos-patterns-track
plan: 03
subsystem: ui
tags: [nextjs, mdx, rehype-slug, github-slugger, intersection-observer, accessibility]

# Dependency graph
requires:
  - phase: 01-foundation-first-pattern-post
    provides: MDX rendering pipeline (next-mdx-remote/rsc) with rehype-slug already wired on Pattern post headings
provides:
  - "extractHeadings(raw) heading-parsing helper in lib/toc.ts"
  - "TableOfContents client island with IntersectionObserver scroll-spy"
  - "Table of contents rendered on every Pattern post, ids guaranteed to match rehype-slug output"
affects: [02-live-demos-patterns-track, 03-blueprints-track]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Heading extraction from raw MDX via github-slugger (not a hand-rolled slugify) so TOC anchor ids always match rehype-slug's rendered ids"
    - "Client-island TOC pattern: server computes headings + renders links, client-only IntersectionObserver adds active-heading state"

key-files:
  created:
    - lib/toc.ts
    - components/mdx/TableOfContents.tsx
    - tests/patterns-toc.spec.ts
  modified:
    - app/patterns/[slug]/page.tsx

key-decisions:
  - "TOC placed inline above the article body (not a sticky sidebar) — simplest layout that keeps the existing max-w-3xl reading column intact"
  - "No heading-count threshold gating TOC visibility — component itself no-ops (returns null) when a post has zero headings, so short posts degrade gracefully without a separate config knob"
  - "github-slugger imported directly from lib/toc.ts as a transitive dependency of rehype-slug (already resolves in node_modules) rather than adding it as an explicit top-level dependency, per RESEARCH.md's zero-new-dependencies guidance for this phase"

patterns-established:
  - "lib/toc.ts: single-purpose heading-extraction utility, JSDoc'd pure function, matching lib/content.ts's centralized-data-access convention"

requirements-completed: [SITE-04]

coverage:
  - id: D1
    description: "Pattern post renders a table of contents (nav[aria-label=\"Table of contents\"]) listing every section heading"
    requirement: "SITE-04"
    verification:
      - kind: e2e
        ref: "tests/patterns-toc.spec.ts#Table of contents > renders a nav with a link per section heading"
        status: pass
    human_judgment: false
  - id: D2
    description: "Clicking a TOC link navigates to the matching heading anchor (id resolves — no silent 404-scroll)"
    requirement: "SITE-04"
    verification:
      - kind: e2e
        ref: "tests/patterns-toc.spec.ts#Table of contents > clicking a TOC link updates the URL hash to the matching heading id"
        status: pass
    human_judgment: false
  - id: D3
    description: "Active heading is highlighted via aria-current=\"location\" as the reader scrolls (IntersectionObserver scroll-spy)"
    requirement: "SITE-04"
    verification: []
    human_judgment: true
    rationale: "IntersectionObserver scroll-timing is flaky in headless Playwright (documented precedent in RESEARCH.md and Phase 1's smoke.spec.ts theme-flash note); requires a manual scroll pass to confirm the active link updates visually."

# Metrics
duration: 25min
completed: 2026-07-02
status: complete
---

# Phase 2 Plan 3: Table of Contents Summary

**`extractHeadings()` in `lib/toc.ts` parses raw MDX headings using `github-slugger` (the same slugifier `rehype-slug` uses internally), feeding a client-island `TableOfContents` with `IntersectionObserver` scroll-spy rendered on every Pattern post.**

## Performance

- **Duration:** ~25 min
- **Completed:** 2026-07-02T15:25:46Z
- **Tasks:** 3
- **Files modified:** 4 (3 created, 1 modified)

## Accomplishments
- `lib/toc.ts` exports `Heading` type and `extractHeadings(raw)`, deriving anchor ids from `github-slugger` (not a hand-rolled slugify) so TOC links are guaranteed to match the ids `rehype-slug` renders on the actual headings — verified by direct comparison of all 8 rendered `id` attributes on the Toast post against all 8 TOC `href` values (byte-identical), including a mixed-case/punctuated heading ("When to Use (and When Not To)" → `when-to-use-and-when-not-to`)
- `components/mdx/TableOfContents.tsx` — `"use client"` nav island: renders one indented link per heading, tracks the visible heading via `IntersectionObserver` (`rootMargin: "-110px 0px -60% 0px"`), sets `aria-current="location"` on the active link, disconnects the observer on unmount
- `app/patterns/[slug]/page.tsx` extended to extract headings from `post.raw` and render `<TableOfContents>` above the article body, preserving the existing header/JSON-LD/article/footer structure
- `tests/patterns-toc.spec.ts` (Playwright): link-presence assertion (nav visible, >1 link, real section heading text) and click-to-anchor assertion (clicking a TOC link updates the URL hash to the matching heading id, and the target element is visible with matching text)

## Task Commits

Each task was committed atomically:

1. **Task 1: Write failing Playwright spec for the table of contents** - `12d8e3e` (test)
2. **Task 2: Build extractHeadings() with slug-matched ids** - `0992e2b` (feat)
3. **Task 3: Build the TableOfContents island, integrate it, and turn the spec green** - `f09c11a` (feat)

_TDD gate sequence verified: test(RED) → feat → feat(GREEN), matching plan-level RED/GREEN cycle (no separate REFACTOR commit needed — no cleanup required after GREEN)._

## Files Created/Modified
- `lib/toc.ts` - New. `Heading` type + `extractHeadings(raw: string): Heading[]`, fence-aware markdown heading parser using `GithubSlugger`
- `components/mdx/TableOfContents.tsx` - New. Client-island TOC with `IntersectionObserver` scroll-spy, `aria-current="location"` on active link
- `app/patterns/[slug]/page.tsx` - Modified. Imports `extractHeadings`/`TableOfContents`, computes `headings = extractHeadings(post.raw)`, renders `<TableOfContents headings={headings} />` above `<article>`
- `tests/patterns-toc.spec.ts` - New. Playwright spec: TOC link presence + click-to-anchor (scroll-spy highlight intentionally excluded — manual-only)

## Decisions Made
- TOC placed inline above the article (not a sticky sidebar) — simplest option that preserves the existing single-column `max-w-3xl` reading layout; sticky-sidebar can be revisited later without touching `lib/toc.ts` or the component's data contract
- No heading-count threshold — `TableOfContents` already returns `null` when `headings.length === 0`, so posts with too few headings to need navigation simply render nothing, without a separate config option
- `github-slugger` imported directly without adding it to `package.json` as an explicit dependency, since it resolves transitively via `rehype-slug`'s own dependency tree (confirmed present in `node_modules/github-slugger` after `npm install`) — zero new top-level dependencies this phase, consistent with RESEARCH.md's Package Legitimacy Audit finding

## Deviations from Plan

None - plan executed exactly as written. `tests/patterns-toc.spec.ts` did not need any adjustment between Task 1 (RED) and Task 3 (GREEN) — the initial spec's expected heading text ("When to Use (and When Not To)", "Common Mistakes") and derived slug (`common-mistakes`) matched the actual rendered output on the first GREEN run, since `github-slugger`'s output was verified against the real Toast post content before writing the component.

## Issues Encountered
- **Local dev environment only:** `node_modules` did not exist in this git worktree at plan start (each worktree needs its own `npm install`) — ran `npm install` and `npx playwright install chromium` before any task work; this is worktree-lifecycle setup, not a plan deviation, and no application code or dependency manifest changed as a result.
- **Local dev environment only:** The first two `npx playwright test` invocations against `tests/patterns-toc.spec.ts` hit a stale/colliding server on port 3000 (Playwright's `reuseExistingServer` reused a leftover process from an earlier test run, before the `TableOfContents` integration existed, causing a false failure). Verified the actual rendered output directly via `curl` against a manually started `npm run start`, confirmed the TOC was present and byte-identical id matching held, then killed the stray process and reran `npx playwright test` — both tests, and the full 9-test suite (`npm test`), passed cleanly. No code changes were needed; this was a test-runner environment artifact, not a defect in the plan's deliverables.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- SITE-04 is fully satisfied: TOC renders on every Pattern post with ids guaranteed to match `rehype-slug`'s output.
- Manual verification still needed before phase gate (per plan's `<verification>` section, not part of this plan's automated scope): active-heading scroll-spy highlight visual check, and a keyboard-only pass confirming TOC links are reachable via Tab and operable via Enter.
- `lib/toc.ts`'s `extractHeadings()` is a general-purpose, content-type-agnostic helper — reusable as-is for a future Blueprints-track TOC (Phase 3) without modification.

---
*Phase: 02-live-demos-patterns-track*
*Completed: 2026-07-02*
