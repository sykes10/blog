---
phase: 1
slug: foundation-first-pattern-post
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-29
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None detected — greenfield repo, no `package.json` exists yet |
| **Config file** | none — see Wave 0 Requirements |
| **Quick run command** | `npm run build` (Next.js build-time MDX compilation + type-check is the primary fast-feedback gate for this phase — most of Phase 1's correctness is "does it compile and render," not unit-testable business logic) |
| **Full suite command** | `npm run build && npx playwright test` (once Wave 0 establishes a minimal Playwright smoke suite) |
| **Estimated runtime** | ~10–30s for `npm run build` alone; full suite TBD once Playwright smoke tests exist |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + manual checklist pass (theme flash, responsive layout, template structure, SEO metadata spot-check)
- **Before `/gsd-verify-work`:** All manual checklist items confirmed + `npm run build` green
- **Max feedback latency:** ~30 seconds

---

## Per-Task Verification Map

*Populated by the planner once PLAN.md task IDs exist. Use the Phase Requirements → Test Map below as the per-requirement source of truth in the interim.*

### Phase Requirements → Test Map (from RESEARCH.md Validation Architecture)

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | MDX content renders through Velite without manual wiring | build/smoke | `npm run build` (fails loudly on Velite/MDX compile errors) | ❌ Wave 0 |
| FOUND-02 | Code blocks show accurate TS/TSX/JS/HTML/CSS highlighting | visual/manual + smoke | manual visual check against the published post; optional Playwright screenshot test | ❌ Wave 0 |
| FOUND-03 | No flash of wrong theme | manual-only | hard-refresh check in both system-light and system-dark via DevTools override | manual-only — flash timing is not reliably assertable without a dedicated visual-regression harness (out of scope for Phase 1) |
| FOUND-04 | Responsive, readable typography mobile/tablet/desktop | manual + Lighthouse | manual viewport resize check; `npx lighthouse` for a CWV baseline | ❌ Wave 0 |
| PATT-01 | Pattern post follows the 8-section template | manual content review | author reviews rendered post against the template checklist | manual-only — structural/content correctness of prose is not automatable |
| PATT-03 | Static code snippets render correctly, no live demo | smoke | `npm run build` + manual visual check | ❌ Wave 0 |
| SITE-01 | SEO metadata (OG, JSON-LD, title/description) correct | automated smoke | script asserting `generateMetadata` output shape, or manual social-share-preview debugger check | ❌ Wave 0 |
| SITE-02 | RSS feed + sitemap working | automated smoke | `curl localhost:3000/rss.xml` and `curl localhost:3000/sitemap.xml` return valid XML with the one post listed | ❌ Wave 0 |
| SITE-03 | Reading time displayed | smoke | assert rendered page contains a reading-time string (Playwright or build-time assertion against the Velite-computed field) | ❌ Wave 0 |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `package.json` + Next.js/Velite/MDX scaffold — none of this exists yet (fully greenfield)
- [ ] Lightweight Playwright smoke-test setup — highest-value addition covers SITE-02 (RSS/sitemap XML validity) and SITE-03 (reading time presence); FOUND-03/PATT-01 remain justified manual-only items
- [ ] No CI config — out of scope for Phase 1 per MVP framing (`npm run build` pre-publish discipline is sufficient for a single-author git workflow at this stage)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No flash of wrong theme on load | FOUND-03 | Flash is a timing/visual phenomenon not reliably assertable in a headless test without a dedicated visual-regression harness | Hard-refresh the page with DevTools forcing `prefers-color-scheme: light` and then `dark`; confirm no flash of the opposite theme before paint |
| Pattern post follows the 8-section template | PATT-01 | Structural/content correctness of prose is not automatable | Author reviews the rendered post against the template checklist (problem → when to use/not → trade-offs → mistakes → a11y → performance → edge cases → implementation) |
| Responsive, readable typography across breakpoints | FOUND-04 | Visual layout correctness across viewports requires human judgment beyond a CWV score | Manually resize viewport (mobile/tablet/desktop) and confirm readable line length, spacing, and no overflow |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
