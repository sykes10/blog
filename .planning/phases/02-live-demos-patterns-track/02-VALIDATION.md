---
phase: 02
slug: live-demos-patterns-track
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-01
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.61.1 (already configured) |
| **Config file** | `playwright.config.ts` (existing, runs against production build on `localhost:3000`) |
| **Quick run command** | `npx playwright test tests/<relevant-spec-file>.spec.ts` |
| **Full suite command** | `npm run build && npm test` |
| **Estimated runtime** | ~60–90 seconds (Playwright full suite, consistent with Phase 1 precedent) |

---

## Sampling Rate

- **After every task commit:** Run `npx playwright test tests/<relevant-spec-file>.spec.ts` (scoped to the spec covering that task)
- **After every plan wave:** Run `npm run build && npm test`
- **Before `/gsd-verify-work`:** Full suite must be green + manual accessibility checklist (below) completed
- **Max feedback latency:** ~30 seconds (single spec file run)

---

## Per-Task Verification Map

*Task IDs finalized once PLAN.md files exist — planner must map each row below to a concrete task ID.*

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD | TBD | TBD | PATT-02 | V5 | Demo click updates UI optimistically, then confirms or shows a visible rollback/error state | smoke | `npx playwright test tests/patterns-demo.spec.ts -g "optimistic demo"` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | PATT-04 | V5 | `/patterns/category/[category]` returns 200 and lists only posts in that category | smoke | `npx playwright test tests/patterns-category.spec.ts` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | PATT-04 | V5 | `/patterns/category/nonsense` returns 404 (route param validated against enum) | smoke | `npx playwright test tests/patterns-category.spec.ts -g "404"` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | PATT-04 | — | Tag chip filter narrows the visible list when a tag is clicked | smoke | `npx playwright test tests/patterns-tag-filter.spec.ts` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | SITE-04 | — | TOC renders a link per heading; clicking a link scrolls to/activates the matching heading id | smoke | `npx playwright test tests/patterns-toc.spec.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/patterns-demo.spec.ts` — stubs for PATT-02 (optimistic demo interaction)
- [ ] `tests/patterns-category.spec.ts` — stubs for PATT-04 (category routes + 404 handling)
- [ ] `tests/patterns-tag-filter.spec.ts` — stubs for PATT-04 (tag filter, client-side chip approach)
- [ ] `tests/patterns-toc.spec.ts` — stubs for SITE-04 (TOC link presence + click-to-scroll)

No new test framework/config install needed — Playwright is already configured project-wide.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Active heading highlight updates on scroll (scroll-spy) | SITE-04 | `IntersectionObserver`-driven scroll timing is flaky to assert reliably in headless CI (same justification Phase 1 used for theme-flash timing) | Scroll through a long post manually; confirm the TOC's active-link indicator (`aria-current="location"`) tracks the heading currently in view |
| `aria-live` region announces rollback/success to screen readers | PATT-02 (a11y) | Announcement quality/timing cannot be reliably asserted via DOM inspection alone | NVDA+Firefox pass: trigger the demo's success and failure paths, confirm the status message is announced |
| Demo, filter controls, and TOC are fully keyboard-operable | PATT-02, PATT-04, SITE-04 | Automated scanning (axe/Lighthouse) catches DOM-structural issues but not real keyboard usability or reading order | Keyboard-only pass: Tab through all three new interactive surfaces, confirm every control is reachable and operable (Enter/Space activates), and focus order is logical |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
