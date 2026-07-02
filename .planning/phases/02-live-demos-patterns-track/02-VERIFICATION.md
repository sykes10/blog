---
phase: 02-live-demos-patterns-track
verified: 2026-07-02T00:00:00Z
status: human_needed
score: 5/7 must-haves verified
behavior_unverified: 2
overrides_applied: 0
---

# Phase 2: Live Demos & Patterns Track Verification Report

**Phase Goal:** A visitor can explore a small but real library of Pattern posts, browse them by category and tag, and interact with live demos where the author chose to include one
**Verified:** 2026-07-02
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A visitor can interact with a live, real-implementation demo embedded directly in a Pattern post via the demo registry pattern | ✓ VERIFIED | `components/demos/OptimisticUpdatesDemo.tsx` is a `"use client"` island using `useOptimistic`+`startTransition`; registered in `getMDXComponents()` (`lib/mdx-components.tsx:67`); embedded as `<OptimisticUpdatesDemo />` in `content/patterns/optimistic-updates.mdx:16`. `tests/patterns-demo.spec.ts` (3/3 pass, re-run independently) confirms the page loads 200, the button is visible, and clicking it flips `aria-pressed` immediately (the optimistic state). |
| 2 | A visitor can browse Pattern posts filtered by category (Components, Behaviours, Engineering, UX) and by tag | ✓ VERIFIED | `lib/content.ts` exports `getPatternsByCategory`/`getPatternsByTag`/`getAllTags`. `app/patterns/category/[category]/page.tsx` statically generates all 4 category routes (confirmed in `npm run build` output: `● /patterns/category/[category]` → components, behaviours, engineering, ux). Direct `curl` against a production build confirmed `/patterns/category/behaviours` contains "Optimistic Updates" and NOT "Toast Notification System" (correct filtering); engineering/ux render empty lists (0 posts, expected, not broken). `components/patterns/TagFilter.tsx` is wired into `app/patterns/page.tsx` (server-fetches `getAllPatterns()`/`getAllTags()`, passes to client island). `tests/patterns-tag-filter.spec.ts` + `tests/patterns-category.spec.ts` pass (4/4 tests, re-run independently). |
| 3 | A visitor reading a long post can jump to any heading via a table of contents with anchor links | ✓ VERIFIED | `lib/toc.ts#extractHeadings()` uses `GithubSlugger` (same slugifier as `rehype-slug`) so ids match. `components/mdx/TableOfContents.tsx` renders `nav[aria-label="Table of contents"]` with one link per heading. `app/patterns/[slug]/page.tsx` computes `headings = extractHeadings(post.raw)` and renders `<TableOfContents headings={headings} />` above every post. `tests/patterns-toc.spec.ts` (2/2 pass, re-run independently) confirms link presence (>1 link, real heading text) and that clicking a link updates the URL hash to a resolving heading id ("Common Mistakes" → `#common-mistakes`, target element visible with matching text — no silent 404-scroll). |
| 4 | Multiple Pattern posts are live, each independently following the structural template from Phase 1, spanning more than one category | ✓ VERIFIED | Two posts exist: `content/patterns/toast-notification-system.mdx` (`category: components`) and `content/patterns/optimistic-updates.mdx` (`category: behaviours`). Both contain the identical 8-section heading structure (The Problem → When to Use (and When Not To) → Trade-offs → Common Mistakes → Accessibility Considerations → Performance Implications → Edge Cases → Implementation Considerations), confirmed by direct heading grep on both files. `npm run build` statically generates both under `/patterns/[slug]`. |
| 5 | (Plan 02-02 must-have) An invalid category URL (`/patterns/category/nonsense`) returns a proper 404, not a blank 200 | ✓ VERIFIED | `app/patterns/category/[category]/page.tsx` validates the param against a fixed `CATEGORIES` enum and calls `notFound()` before any lookup (`isCategory()` guard, line 67-69). `tests/patterns-category.spec.ts` asserts `GET /patterns/category/nonsense` → 404 (re-run independently, passed). |
| 6 | (Plan 02-01 must-have) When the simulated network call fails, the UI reverts to its prior state AND a visible, aria-live-announced error message explains the failure | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Code is present and correctly structured: `simulateLikeRequest()` rejects ~40% of the time with an authored generic message; the `catch` block sets `error` state which renders into a persistent `role="status" aria-live="polite"` element (`OptimisticUpdatesDemo.tsx:65-72,108-110`) and no manual revert code exists (relies on `useOptimistic` re-rendering from unchanged `committed` state, which is the correct React 19 pattern). However, `tests/patterns-demo.spec.ts` only asserts the aria-live *region exists* on load — no test triggers a failure and asserts the revert + visible error message actually occur (the ~40% random failure rate makes this non-deterministic without mocking, and no mock was added). SUMMARY.md's own coverage table marks this `human_judgment: true` with `verification: []` for the announcement-quality/actual-failure-trigger check. Presence and wiring are confirmed; the state-transition itself is not exercised by any automated test. |
| 7 | (Plan 02-03 must-have) The active heading is highlighted as the visitor scrolls (scroll-spy), with `aria-current` on the active link | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Code is present and correctly structured: `TableOfContents.tsx` creates an `IntersectionObserver` in `useEffect` (rootMargin `-110px 0px -60% 0px`), sets `activeId` on intersection, renders `aria-current="location"` on the matching link, and disconnects the observer on unmount. However, `tests/patterns-toc.spec.ts` explicitly excludes scroll-spy assertions ("Per RESEARCH.md, the active-heading scroll-spy highlight ... is manual-only"). No automated test exercises the actual scroll → `aria-current` transition. SUMMARY.md's own coverage table marks this `human_judgment: true` with `verification: []`. |

**Score:** 5/7 truths verified (2 present, behavior-unverified)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `components/demos/OptimisticUpdatesDemo.tsx` | Live demo client island | ✓ VERIFIED | Exists, substantive (114 lines, real `useOptimistic`/`startTransition` logic, no stubs), wired into `getMDXComponents()` and embedded in MDX |
| `content/patterns/optimistic-updates.mdx` | Second Pattern post, Behaviours category | ✓ VERIFIED | Exists, 8-section template, substantial prose (140 lines), embeds demo |
| `tests/patterns-demo.spec.ts` | Playwright coverage for demo | ✓ VERIFIED | Exists, 3 tests, all pass on independent re-run |
| `lib/mdx-components.tsx` | Demo registry | ✓ VERIFIED | Modified, imports + registers `OptimisticUpdatesDemo` |
| `lib/content.ts` | Category/tag data helpers | ✓ VERIFIED | `getPatternsByCategory`, `getPatternsByTag`, `getAllTags` all present, substantive (plain array methods over real data) |
| `app/patterns/category/[category]/page.tsx` | Static category route | ✓ VERIFIED | `generateStaticParams` enumerates all 4 categories, `notFound()` guard present, `npm run build` confirms 4 static routes generated |
| `components/patterns/TagFilter.tsx` | Client tag-chip filter | ✓ VERIFIED | `"use client"`, single `useState`, `role="group"`/`aria-pressed` buttons, real filter logic |
| `tests/patterns-category.spec.ts` | Category route coverage | ✓ VERIFIED | Exists, 3 tests, all pass |
| `tests/patterns-tag-filter.spec.ts` | Tag filter coverage | ✓ VERIFIED | Exists, 1 test (narrowing + toggle), passes |
| `lib/toc.ts` | Heading extraction | ✓ VERIFIED | `extractHeadings()` uses real `GithubSlugger`, fence-aware parsing, no stubs |
| `components/mdx/TableOfContents.tsx` | TOC client island | ✓ VERIFIED | `"use client"`, `IntersectionObserver` with cleanup, `aria-current` wiring |
| `tests/patterns-toc.spec.ts` | TOC coverage | ✓ VERIFIED | Exists, 2 tests, both pass |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `lib/mdx-components.tsx` (`getMDXComponents()`) | `OptimisticUpdatesDemo` | Import + object map entry | ✓ WIRED | Line 3 import, line 67 registration |
| `content/patterns/optimistic-updates.mdx` | `<OptimisticUpdatesDemo />` | Inline JSX in MDX body | ✓ WIRED | Rendered via `MDXRemote` with `components={mdxComponents}`; confirmed the button/live-region actually render (Playwright test passes against the live page) |
| `lib/content.ts` (`getPatternsByCategory`/`getPatternsByTag`/`getAllTags`) | `app/patterns/category/[category]/page.tsx` + `app/patterns/page.tsx` | Direct function import | ✓ WIRED | Category route imports and calls `getPatternsByCategory`; index page imports and calls `getAllPatterns`/`getAllTags` and passes them into `<TagFilter>` |
| `app/patterns/page.tsx` | `<TagFilter>` | Server-fetched props passed to client island | ✓ WIRED | `patterns={patterns} allTags={allTags}` — confirmed non-empty via direct render (2 posts, multiple tags) |
| `app/patterns/[slug]/page.tsx` | `extractHeadings(post.raw)` → `<TableOfContents headings={headings} />` | Server-computed prop into client island | ✓ WIRED | Confirmed ids match rendered `rehype-slug` output via passing Playwright click-to-anchor test (no silent 404-scroll) |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|---------------------|--------|
| `app/patterns/category/[category]/page.tsx` | `patterns` | `getPatternsByCategory(category)` over Velite-compiled `#site/content` | Yes — confirmed via direct `curl`: behaviours category renders "Optimistic Updates" and excludes "Toast Notification System" | ✓ FLOWING |
| `components/patterns/TagFilter.tsx` | `patterns`, `allTags` | Server-fetched `getAllPatterns()`/`getAllTags()` passed as props from `app/patterns/page.tsx` | Yes — real 2-post, multi-tag dataset; test confirms filtering by `"notifications"` narrows 2→1 | ✓ FLOWING |
| `components/mdx/TableOfContents.tsx` | `headings` | `extractHeadings(post.raw)` parsing real MDX source | Yes — 8 headings extracted from Toast post, ids byte-match rendered `rehype-slug` output (per SUMMARY + independently re-run click test) | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Full build succeeds and statically generates all expected routes | `npm run build` | 4 category routes + 2 pattern posts generated; no errors | ✓ PASS |
| Full Playwright suite passes (independent re-run, not trusting SUMMARY) | `npm test` | 16/16 passed | ✓ PASS |
| `/patterns/category/behaviours` lists only the Behaviours post | `curl` against production build | Contains "Optimistic Updates", excludes "Toast Notification System" | ✓ PASS |
| `/patterns/category/engineering` and `/patterns/category/ux` don't error with 0 posts | `curl` against production build | Both return 200 with empty list (no crash) | ✓ PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| PATT-02 | 02-01 | Live, interactive demo embedded in a Pattern article | ✓ SATISFIED | Demo registered + embedded + tested (Truth 1) |
| PATT-04 | 02-02 | Browse Pattern articles by category and by tag | ✓ SATISFIED | Category routes + tag filter, both tested (Truth 2, 5) |
| SITE-04 | 02-03 | Table of contents with anchor links on long posts | ✓ SATISFIED | TOC link presence + working anchors tested (Truth 3); scroll-spy highlight present but behavior-unverified (Truth 7) |

No orphaned requirements — REQUIREMENTS.md maps exactly PATT-02, PATT-04, SITE-04 to Phase 2, and all three appear in a plan's `requirements` frontmatter field.

**Documentation drift note (not a code gap):** `.planning/REQUIREMENTS.md` still shows PATT-04 as `- [ ]` (unchecked) and "Pending" in its traceability table, while PATT-02 and SITE-04 are marked "Complete". Codebase evidence above shows PATT-04 is fully implemented and tested identically to the other two. This is a stale-documentation issue in REQUIREMENTS.md itself, not a missing capability — flagged for correction, not blocking.

### Anti-Patterns Found

None. Grepped all phase-modified files (`OptimisticUpdatesDemo.tsx`, `lib/toc.ts`, `TableOfContents.tsx`, `TagFilter.tsx`, `app/patterns/category/[category]/page.tsx`, `lib/mdx-components.tsx`, `lib/content.ts`, `app/patterns/page.tsx`, `app/patterns/[slug]/page.tsx`) for `TBD|FIXME|XXX|TODO|HACK|PLACEHOLDER|placeholder|coming soon|not yet implemented` — no matches.

### Human Verification Required

### 1. Optimistic demo failure/rollback path (visible + screen-reader announced)

**Test:** Navigate to `/patterns/optimistic-updates` and click the Like button repeatedly (the demo simulates a ~40% random failure rate, so a handful of clicks should trigger a failure). Also run this with NVDA + Firefox.
**Expected:** On failure, the like count/state visually reverts to what it was before the click, a visible red error message appears ("Update failed. Please try again."), and the screen reader announces the error text through the `role="status"` region.
**Why human:** The failure is randomized (not deterministically triggerable without mocking, and no mock was added), and screen-reader announcement timing/quality cannot be verified by static analysis or a DOM-presence check. The current automated test only confirms the `aria-live` region exists on page load — it does not trigger or observe a failure.

### 2. Keyboard-only pass across all three new interactive surfaces

**Test:** Using only Tab/Shift+Tab/Enter/Space (no mouse), navigate through the Optimistic Updates demo button, the `/patterns/category/*` links, the `/patterns` tag filter chips, and the TOC links on a post page.
**Expected:** Every interactive element is reachable via Tab in a logical order, operable via Enter/Space, with a visible focus indicator.
**Why human:** Focus order and visible focus-ring quality require visual/interactive observation; not verifiable via grep or automated DOM assertions alone.

### 3. Table of contents scroll-spy active-heading highlight

**Test:** Open a Pattern post (e.g. `/patterns/toast-notification-system`) and scroll through its sections.
**Expected:** As each section heading enters the "reading zone" of the viewport, its corresponding TOC link gains `aria-current="location"` and a visible highlight (bold/foreground-colored), and the highlight moves to the next heading as you continue scrolling.
**Why human:** `IntersectionObserver` timing is documented as flaky in headless Playwright runs (RESEARCH.md, and explicitly excluded from `tests/patterns-toc.spec.ts`); no automated test exercises this transition. Code is present and structurally correct (observer created/disconnected in `useEffect`, `aria-current` wired to `activeId` state) but the runtime behavior is unexercised.

### Gaps Summary

No blocking gaps. All required artifacts exist, are substantive, are correctly wired, and real data flows through them (confirmed independently via build output, direct `curl` checks, and an independent re-run of the full 16-test Playwright suite — not by trusting SUMMARY.md's reported numbers). All 4 roadmap Success Criteria are met with working, tested code, and the phase delivers exactly what both SUMMARY.md and the PLAN frontmatter claim for the parts that are testable.

Two plan-declared must-have truths (the demo's failure/rollback behavior, and the TOC's scroll-spy highlight) are implemented and wired correctly by code inspection, but their actual runtime state transitions are not exercised by any automated test — both are documented as manual-only in their own SUMMARY.md coverage tables (honest self-reporting, not concealed). This routes the phase to `human_needed`, not `gaps_found`: nothing is missing or stubbed, but a human should confirm these two specific behaviors before considering the phase fully closed out. This aligns with the pre-existing manual-verification items already flagged by the plans themselves (keyboard-only pass, NVDA+Firefox pass) — no new gap was introduced, this verification simply formalizes and surfaces them at the phase level per the escalation-gate pattern.

A documentation-only discrepancy was found in `.planning/REQUIREMENTS.md` (PATT-04 shown as "Pending" despite being fully implemented) — flagged for correction but does not affect phase goal achievement.

---

_Verified: 2026-07-02_
_Verifier: Claude (gsd-verifier)_
