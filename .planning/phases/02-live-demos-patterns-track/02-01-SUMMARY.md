---
phase: 02-live-demos-patterns-track
plan: 01
subsystem: ui
tags: [react, useOptimistic, next-mdx-remote, mdx, accessibility, testing]

# Dependency graph
requires:
  - phase: 01-foundation-first-pattern-post
    provides: next-mdx-remote/rsc rendering pipeline, getMDXComponents() registry with Callout, Pattern content collection (Velite schema), 8-section Pattern template
provides:
  - First live demo in the component registry (OptimisticUpdatesDemo), proving the "use client" island pattern inside a Server Component MDX body
  - Second Pattern post (Optimistic Updates, Behaviours category), giving the Patterns track two posts across two categories
  - Playwright coverage for demo interaction and aria-live presence (tests/patterns-demo.spec.ts)
affects: [phase-2-remaining-plans, patterns-track-content, demo-registry]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "useOptimistic + startTransition for optimistic UI with automatic rollback (no manual snapshot/restore)"
    - "Persistent role=status aria-live=polite region rendered unconditionally, filled only on failure"
    - "Demo components live under components/demos/, registered one-line-per-component in lib/mdx-components.tsx getMDXComponents()"

key-files:
  created:
    - components/demos/OptimisticUpdatesDemo.tsx
    - content/patterns/optimistic-updates.mdx
    - tests/patterns-demo.spec.ts
  modified:
    - lib/mdx-components.tsx

key-decisions:
  - "Demo interaction is a like-toggle (count + liked boolean) with a ~40% simulated failure rate, so the rollback path is actually visible on a few clicks, not a rare edge case (D-05, Claude's discretion)"
  - "Simulated failure throws a single authored generic message (\"Update failed. Please try again.\") — never error.stack or internal detail, since this is teaching code readers may copy verbatim (threat T-02-01)"
  - "aria-live region uses role=status/aria-live=polite (not assertive) — the rollback matters but isn't an emergency interrupt"

patterns-established:
  - "Client demo islands: 'use client' directive first line, named function export, co-located under components/demos/, registered via one-line entry in getMDXComponents()"

requirements-completed: [PATT-02]

coverage:
  - id: D1
    description: "Visitor can click the demo's action button and see the UI update immediately (optimistic state) before the simulated network call resolves"
    requirement: "PATT-02"
    verification:
      - kind: e2e
        ref: "tests/patterns-demo.spec.ts#clicking the action button applies the optimistic update immediately"
        status: pass
    human_judgment: false
  - id: D2
    description: "On simulated failure, the UI reverts to prior state and a visible, aria-live-announced error message explains the failure"
    requirement: "PATT-02"
    verification:
      - kind: e2e
        ref: "tests/patterns-demo.spec.ts#an aria-live status region is present in the DOM on load"
        status: pass
    human_judgment: true
    rationale: "Automated test confirms the role=status region exists and the demo's failure path is wired (component code reviewed for authored generic message + automatic revert via useOptimistic), but announcement quality/timing for actual screen-reader users is a manual-only check per RESEARCH.md (NVDA+Firefox pass, phase gate not this plan's automated verify)."
  - id: D3
    description: "The Optimistic Updates Pattern post is live at /patterns/optimistic-updates in the Behaviours category, spanning a second category alongside the existing Toast post"
    requirement: "PATT-02"
    verification:
      - kind: e2e
        ref: "tests/patterns-demo.spec.ts#post page responds 200 and the demo action button is visible"
        status: pass
      - kind: other
        ref: "npm run build (Velite frontmatter validation, category: behaviours enum, static generation of /patterns/optimistic-updates)"
        status: pass
    human_judgment: false

duration: 4min
completed: 2026-07-02
status: complete
---

# Phase 2 Plan 1: Optimistic Updates Live Demo Summary

**First live demo in the registry: a `useOptimistic` + `startTransition` like-toggle with automatic rollback, embedded in the new Optimistic Updates Pattern post (Behaviours category)**

## Performance

- **Duration:** ~4 min (commit span 16:19:33 to 16:23:21)
- **Started:** 2026-07-02T16:19:33+01:00
- **Completed:** 2026-07-02T16:23:21+01:00
- **Tasks:** 3
- **Files modified:** 4 (3 created, 1 modified)

## Accomplishments
- Built `OptimisticUpdatesDemo`, a `"use client"` island using React 19's `useOptimistic` + `startTransition` with automatic rollback on simulated failure (no hand-rolled snapshot/restore logic)
- Registered the demo in `getMDXComponents()` as the first entry in the demo registry, proving the architecture: a real client island hydrating inside an otherwise-static Server-Component MDX body
- Authored `content/patterns/optimistic-updates.mdx`, the second Pattern post (Behaviours category), following the same 8-section template as the Toast post and embedding `<OptimisticUpdatesDemo />` near the top of the article
- Added `tests/patterns-demo.spec.ts` covering page load, the click-to-optimistic-update behavior, and the persistent `role="status"` aria-live region — RED confirmed before implementation, GREEN confirmed after

## Task Commits

Each task was committed atomically:

1. **Task 1: Write failing end-to-end Playwright spec for the optimistic demo** - `480bf5b` (test)
2. **Task 2: Build the OptimisticUpdatesDemo client island and register it** - `985de0c` (feat)
3. **Task 3: Author the Optimistic Updates Pattern post and turn the spec green** - `8416afb` (feat)

_TDD gate: `test(02-01)` commit (RED) exists before `feat(02-01)` commits (GREEN) — see TDD Gate Compliance below._

## Files Created/Modified
- `tests/patterns-demo.spec.ts` - Playwright spec: page load, click-to-optimistic-update via `waitForFunction` on `aria-pressed`, persistent aria-live region presence
- `components/demos/OptimisticUpdatesDemo.tsx` - `"use client"` like-toggle demo: `useOptimistic`/`startTransition`, ~40% simulated failure rate, authored generic error message, persistent `role="status"` live region, keyboard-operable native `<button>`
- `lib/mdx-components.tsx` - Imports and registers `OptimisticUpdatesDemo` in `getMDXComponents()`; updated the stale "deferred to Phase 2" comment
- `content/patterns/optimistic-updates.mdx` - New Pattern post, slug `optimistic-updates`, category `behaviours`, embeds `<OptimisticUpdatesDemo />`, follows the 8-section template, mentions the `useOptimistic` reducer overload in Implementation Considerations

## Decisions Made
- Chose a like-toggle (count + boolean) as the concrete demo interaction over a todo-list, since it maps most directly to the post's "the failure path is the actual engineering problem" thesis with minimal UI surface (D-05, Claude's discretion)
- Set the simulated failure rate to 40% (matching RESEARCH.md's suggested range) so a reader clicking a few times reliably sees the rollback path during manual verification, not just the happy path
- Task 3's acceptance criteria allowed reconciling the spec's button matcher against the real accessible name if needed — no reconciliation was needed, since the button's `aria-label` ("Like this pattern" / "Unlike this pattern") and visible text ("Like" / "Liked") both matched the Task 1 spec's `/like/i` matcher on the first try

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

Playwright's `webServer` (`npm run build && npm run start`) was still finishing its cold-start handshake on the very first navigation of the first test run, producing a transient `net::ERR_CONNECTION_RESET` on test 1 while tests 2 and 3 (run immediately after, against the now-ready server) passed. This is a known race in the project's existing Playwright config (webServer startup timing), not a defect in this plan's code — a second run against the warm server passed all 3 tests, and the full suite (`npm test`, 10 tests including the pre-existing smoke/feed specs) passed cleanly afterward. No fix applied; out of scope for this plan's files.

## Known Stubs

None - no stub patterns found in files created/modified this plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Demo registry pattern is proven end-to-end; later Phase 2 plans (category/tag browsing, table of contents) can proceed independently, as none depend on this plan's specific files beyond the now-two-post Patterns collection
- Manual accessibility verification (keyboard-only pass + NVDA+Firefox screen-reader pass on the demo's rollback announcement) remains a phase-gate item per RESEARCH.md, not blocking for this plan but should be run before `/gsd-verify-work` on the full phase
- `getMDXComponents()`'s demo-registry comment now accurately reflects that the registry is populated, so the next demo component (if any) follows the same one-line registration pattern

## Self-Check: PASSED

- FOUND: components/demos/OptimisticUpdatesDemo.tsx
- FOUND: content/patterns/optimistic-updates.mdx
- FOUND: tests/patterns-demo.spec.ts
- FOUND: lib/mdx-components.tsx (modified)
- FOUND commit: 480bf5b
- FOUND commit: 985de0c
- FOUND commit: 8416afb

## TDD Gate Compliance

- RED gate: `480bf5b test(02-01): add failing Playwright spec for optimistic updates demo` — confirmed failing (3/3 tests failed, post/demo did not exist)
- GREEN gate: `985de0c feat(02-01): implement OptimisticUpdatesDemo client island and register it` and `8416afb feat(02-01): author Optimistic Updates pattern post in Behaviours category` — confirmed passing (`npx playwright test tests/patterns-demo.spec.ts`, 3/3 passed; full suite `npm test`, 10/10 passed)
- No REFACTOR commit needed — implementation was correct on first pass, no cleanup required beyond the plan's own tasks

---
*Phase: 02-live-demos-patterns-track*
*Completed: 2026-07-02*
