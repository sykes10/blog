# Phase 1: Foundation & First Pattern Post - Context

**Gathered:** 2026-06-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold the Next.js/MDX content pipeline (typed content layer, MDX rendering, syntax highlighting, theming, SEO basics) and ship one complete, readable, SEO-correct Pattern post end-to-end — proving the pipeline works before any further content is written. No live demo registry yet (that's Phase 2) — this post ships with static code examples only.

</domain>

<decisions>
## Implementation Decisions

### MDX rendering & content layer (carried forward — not re-discussed)
- **D-01:** `next-mdx-remote/rsc` v6 (RSC-native, async Server Component) is the locked choice over `@next/mdx`, per `.claude/CLAUDE.md`'s Tech Stack section. This resolves the open disagreement flagged in `.planning/research/SUMMARY.md` (STACK.md vs ARCHITECTURE.md/PITFALLS.md) — the author has already decided in CLAUDE.md and that decision stands.
- **D-02:** Velite for the typed, Zod-validated content collection layer (per CLAUDE.md) — content lives in `content/`, decoupled from route files.
- **D-03:** Shiki via `rehype-pretty-code` 0.14.3 for syntax highlighting; verify the exact Shiki peer version range against the installed `rehype-pretty-code` package at install time rather than trusting `shiki@latest`.

### First Pattern post topic
- **D-04:** The first Pattern post is a **Toast / Notification system** — a Component-category pattern. Chosen over combobox/autocomplete and modal/dialog for being a less commonly well-covered topic with real depth (queue management, ARIA live regions, auto-dismiss timing, stacking/positioning, pause-on-hover).
- **D-05:** Post follows the standard Pattern template from REQUIREMENTS.md PATT-01: problem it solves → when to use / when not to use → trade-offs → common mistakes → accessibility considerations → performance implications → edge cases → implementation considerations.

### Static example presentation (PATT-03)
- **D-06:** Code blocks only for v1 — no screenshots, no GIF/video. Fastest to ship; visual/interactive proof is deferred to Phase 2's live demo registry. This is a deliberate choice, not an omission.

### Site identity & SEO metadata
- **D-07:** Site name/tagline in metadata, header, and OG tags: **"Frontend Blueprints"** (matches project name as-is).
- **D-08:** Domain: use a **placeholder domain** (e.g. `https://example.com`) for canonical URLs, OG tags, sitemap, and RSS for now. Must be a single config value/env var that's trivial to swap to the real domain later — do not hardcode it in multiple places.
- **D-09:** Author byline / JSON-LD Article schema author name: **"Alejandro Arevalo"** (not the git handle `sykes10`).

### Visual/typography direction
- **D-10:** Distinct personal-brand styling — not a purely minimal/generic dev-blog look. The site should read as deliberately "designed" to a hiring manager browsing many candidate portfolios, not templated.
- **D-11:** No specific accent color or font pairing mandated by the author — pick a reasonable signature accent color and a distinctive heading/display font pairing during implementation. This is explicitly Claude's discretion for v1; can be refined later via a dedicated UI pass (e.g. Phase 2 has `UI hint: yes` in ROADMAP.md).

### Claude's Discretion
- Exact accent color, font pairing, and specific layout/spacing details for the base theme (per D-11).
- Exact Shiki version pin within the `rehype-pretty-code` 0.14.3 peer range (verify at install time per D-03 and STATE.md blocker note).
- Specific copy/wording for the Toast pattern post's "when to use / when not to use" and "common mistakes" sections — author has final say at review, no further checkpoint needed here.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Tech stack & version decisions
- `.claude/CLAUDE.md` — Technology Stack section: locks Next.js 16.2.x/React 19.2.x/Tailwind v4, `next-mdx-remote/rsc` v6 over `@next/mdx`, Velite over Contentlayer/content-collections, Shiki+rehype-pretty-code over Prism, version compatibility table, and "What NOT to Use" list. This is the authoritative resolution of the MDX-library disagreement noted in research.

### Requirements & roadmap
- `.planning/REQUIREMENTS.md` — FOUND-01 through FOUND-04, PATT-01, PATT-03, SITE-01 through SITE-03 are the v1 requirements this phase delivers.
- `.planning/ROADMAP.md` §"Phase 1: Foundation & First Pattern Post" — phase goal, success criteria, mode (mvp).

### Research
- `.planning/research/SUMMARY.md` — stack/architecture/feature/pitfalls synthesis; flags the MDX-library disagreement (resolved by D-01 above) and the Shiki peer-version verification need (resolved by D-03 above).
- `.planning/research/STACK.md`, `.planning/research/ARCHITECTURE.md`, `.planning/research/PITFALLS.md`, `.planning/research/FEATURES.md` — detailed backing research; read if planner needs depth beyond SUMMARY.md.

### Project state
- `.planning/STATE.md` §"Blockers/Concerns" — Phase 1 planning blockers (MDX library choice — resolved by D-01; Shiki version verification — captured in D-03).

</canonical_refs>

<code_context>
## Existing Code Insights

Repo is fully greenfield — no `package.json`, no scaffold, no existing components, no codebase maps in `.planning/codebase/`. There is nothing to reuse; this phase creates the foundation from scratch.

</code_context>

<specifics>
## Specific Ideas

- Toast/notification system as the first post's subject (D-04) — author explicitly wants a less-commonly-well-covered component over combobox/modal.
- Byline should read "Alejandro Arevalo", not the git handle "sykes10" (D-09) — author's email is alex.arevalo.dev@gmail.com, git config currently shows username sykes10.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. Live demo for the Toast pattern, screenshots/recordings, and a dedicated UI design pass are explicitly deferred to Phase 2 (already on the roadmap, not new scope).

</deferred>

---

*Phase: 1-Foundation & First Pattern Post*
*Context gathered: 2026-06-29*
