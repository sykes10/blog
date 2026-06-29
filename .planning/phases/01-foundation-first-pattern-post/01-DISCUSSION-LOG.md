# Phase 1: Foundation & First Pattern Post - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-29
**Phase:** 1-Foundation & First Pattern Post
**Areas discussed:** First Pattern topic, Site identity & SEO metadata, Static example presentation, Visual/typography direction

---

## First Pattern topic

| Option | Description | Selected |
|--------|-------------|----------|
| Component pattern | UI component with engineering depth (focus management, a11y, composition API design) | ✓ |
| Behaviour pattern | Reusable interaction behaviour independent of any one component | |
| Engineering pattern | Reusable engineering technique (caching, form state, error boundaries) | |
| I have a specific topic in mind | Author-provided topic | |

**Follow-up — which component:**

| Option | Description | Selected |
|--------|-------------|----------|
| Combobox / Autocomplete | Focus management, keyboard nav, ARIA combobox, async loading, debouncing | |
| Modal / Dialog | Focus trapping, scroll lock, portal rendering, ARIA dialog, animations | |
| Toast / Notification system | Queue management, ARIA live regions, auto-dismiss timing, stacking, pause-on-hover | ✓ |
| Something else | Author-provided component | |

**User's choice:** Toast / Notification system (Component category)
**Notes:** Chosen for being a less commonly well-covered topic with real depth, vs. the more frequently-written-about combobox/modal patterns.

---

## Site identity & SEO metadata

**Site name:**

| Option | Description | Selected |
|--------|-------------|----------|
| Frontend Blueprints | Use project name as-is for title/tagline/OG tags | ✓ |
| I have a different site name in mind | Author-provided name | |

**Domain:**

| Option | Description | Selected |
|--------|-------------|----------|
| Use a placeholder domain | e.g. https://example.com, swap later via config | ✓ |
| I already have a domain | Author provides real domain now | |

**Author byline:**

Initial framing offered git identity ("sykes10" / alex.arevalo.dev@gmail.com) as a starting point — author flagged it as a handle, not a display name, and selected "Something else." Follow-up offered "Alex Arevalo" / "Alex" as derived options; author free-typed the final answer.

**User's choice:** Site name "Frontend Blueprints"; placeholder domain; author byline "Alejandro Arevalo".
**Notes:** Byline corrected from the git config username (sykes10) to the author's actual preferred display name.

---

## Static example presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Code blocks only | No screenshots/images; fastest to ship, defers visual proof to Phase 2 | ✓ |
| Code + static screenshots | PNG/JPG screenshots of toast states (entering, stacked, dismissing) | |
| Code + short screen-recording (GIF/video) | Best for showing timing/animation/stacking behaviour | |

**User's choice:** Code blocks only
**Notes:** Deliberate choice — visual/interactive proof deferred to Phase 2's live demo registry, not an omission.

---

## Visual/typography direction

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal, text-focused dev-blog | Generous whitespace, restrained palette, typography-led | |
| Distinct personal-brand styling | Deliberate color/accent identity, custom touches for portfolio differentiation | ✓ |
| I have specific visual references | Author-provided reference sites/styles | |

**Follow-up — accent/brand specifics:**

| Option | Description | Selected |
|--------|-------------|----------|
| Figure it out during implementation | Pick a reasonable accent color + heading font pairing now, refine later | ✓ |
| I have a specific color/font in mind | Author-provided exact values | |

**User's choice:** Distinct personal-brand styling, with accent color/font pairing left to Claude's discretion for v1.
**Notes:** Can be refined later via a dedicated UI pass — Phase 2 already has `UI hint: yes` in ROADMAP.md.

---

## Claude's Discretion

- Exact accent color and heading/display font pairing for the v1 theme (visual/typography direction follow-up).
- Exact Shiki version pin within the `rehype-pretty-code` 0.14.3 peer range — verify at install time.
- Specific prose/copy for the Toast pattern post's "when to use" / "common mistakes" sections.

## Deferred Ideas

None — discussion stayed within Phase 1 scope. Live demo, screenshots/recordings, and a dedicated UI design pass for the Toast pattern are already scheduled in Phase 2 of the roadmap, not new scope introduced here.
