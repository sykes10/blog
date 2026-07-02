# Roadmap: Frontend Blueprints

## Overview

This roadmap takes the blog from an empty repo to a working, shareable portfolio asset. Phase 1 settles the foundational toolchain (content pipeline, rendering, theming, SEO basics) by shipping one real Pattern post end-to-end — the most expensive decisions to unwind later are made here, so nothing ships before they're locked. Phase 2 builds the live-demo registry and rounds out the Patterns track with browsing, tags, and a table of contents, bringing the track to a shareable volume. Phase 3 builds the cross-linking infrastructure (build-time validated, many-to-many `relatedContent` schema) that the Blueprints track depends on structurally, since a Blueprint is composed of the Patterns it references. Phase 4 ships the Blueprints track itself, cross-linking back into Patterns now that there's a body of Pattern content to reference.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & First Pattern Post** - Scaffold the Next.js/MDX pipeline and ship one complete, readable, SEO-correct Pattern post end-to-end (completed 2026-06-30)
- [x] **Phase 2: Live Demos & Patterns Track** - Add the interactive demo registry and round out Patterns with browsing, tags, and TOC across multiple posts (completed 2026-07-02)
- [ ] **Phase 3: Cross-Linking Infrastructure** - Build the frontmatter-driven, build-validated, many-to-many linking system that ties Blueprints and Patterns together
- [ ] **Phase 4: Blueprints Track** - Ship the production-design Blueprints track, cross-linked to the Patterns it's composed of, with demos where feasible

## Phase Details

### Phase 1: Foundation & First Pattern Post

**Goal**: A visitor can read one fully realized Pattern post — correctly themed, syntax-highlighted, fast, and discoverable by search engines — proving the entire content pipeline works end-to-end before any further content is written
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, PATT-01, PATT-03, SITE-01, SITE-02, SITE-03
**Success Criteria** (what must be TRUE):

  1. A visitor can load a published Pattern post rendered from an MDX file through a typed content layer, with no manual content wiring
  2. Code blocks in the post show accurate syntax highlighting for TS/TSX/JS/HTML/CSS
  3. The post follows the consistent Pattern template (the problem it solves → when to use / when not to use → trade-offs → common mistakes → accessibility considerations → performance implications → edge cases → implementation considerations) with static code snippets and optional screenshots, since no live demo ships until Phase 2's registry exists
  4. The site respects light/dark mode with no flash of the wrong theme, and renders readable, responsive typography on mobile/tablet/desktop
  5. The post has correct SEO metadata (Open Graph, JSON-LD, title/description), a reading time estimate, and is included in a working RSS feed and sitemap

**Plans**: 3/3 plans complete

- [x] 01-01-PLAN.md
- [x] 01-02-PLAN.md
- [x] 01-03-PLAN.md
- Wave 1: [01-01](.planning/phases/01-foundation-first-pattern-post/01-01-PLAN.md) — Scaffold + Velite pipeline + MDX render + flash-free theming + Playwright smoke (FOUND-01, FOUND-03, FOUND-04)
- Wave 2 *(blocked on Wave 1 completion, plans run in parallel)*:
  - [01-02](.planning/phases/01-foundation-first-pattern-post/01-02-PLAN.md) — Full Shiki plugin chain + complete Toast Pattern post + SEO metadata + reading time (FOUND-02, PATT-01, PATT-03, SITE-01, SITE-03)
  - [01-03](.planning/phases/01-foundation-first-pattern-post/01-03-PLAN.md) — RSS feed + sitemap + robots + automated feed smoke test (SITE-02)

**Cross-cutting constraints:**

- All post URLs derive from `NEXT_PUBLIC_SITE_URL` env var (single placeholder domain source, swappable without multi-file edits)
- `npm run build` must pass after every task across all three plans

### Phase 2: Live Demos & Patterns Track

**Goal**: A visitor can explore a small but real library of Pattern posts, browse them by category and tag, and interact with live demos where the author chose to include one
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: PATT-02, PATT-04, SITE-04
**Success Criteria** (what must be TRUE):

  1. A visitor can interact with a live, real-implementation demo embedded directly in a Pattern post via the demo registry pattern
  2. A visitor can browse Pattern posts filtered by category (Components, Behaviours, Engineering, UX) and by tag
  3. A visitor reading a long post can jump to any heading via a table of contents with anchor links
  4. Multiple Pattern posts are live, each independently following the structural template from Phase 1, spanning more than one category (e.g. a UI component, a behaviour, an engineering technique)

**Plans**: 3/3 plans complete

- [x] 02-01-PLAN.md
- [x] 02-02-PLAN.md
- [x] 02-03-PLAN.md

- Wave 1 *(all three plans are independent — zero file overlap — and run in parallel)*:
  - [ ] [02-01](.planning/phases/02-live-demos-patterns-track/02-01-PLAN.md) — Optimistic Updates live demo (useOptimistic + rollback) + new Behaviours Pattern post (PATT-02)
  - [ ] [02-02](.planning/phases/02-live-demos-patterns-track/02-02-PLAN.md) — Category browsing via static routes + client-side tag chip filter (PATT-04)
  - [ ] [02-03](.planning/phases/02-live-demos-patterns-track/02-03-PLAN.md) — Table of contents with anchor links + IntersectionObserver scroll-spy (SITE-04)

**UI hint**: yes

### Phase 3: Cross-Linking Infrastructure

**Goal**: The author can declare many-to-many relationships between Blueprints and Patterns in frontmatter, and the build pipeline guarantees those relationships are never silently broken — establishing the structural backbone the Blueprints track needs before it ships
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: LINK-01, LINK-02, LINK-03
**Success Criteria** (what must be TRUE):

  1. The author can declare related Patterns in a Blueprint's frontmatter, and related Blueprints in a Pattern's frontmatter, with the relationship treated as many-to-many in both directions
  2. The build fails with a clear error if a related-content reference points to a slug that doesn't exist
  3. A visitor reading a Blueprint sees the Patterns it's composed of surfaced inline and can navigate directly to them, and a visitor reading a Pattern sees any Blueprints that reference it surfaced inline

**Plans**: TBD

### Phase 4: Blueprints Track

**Goal**: A visitor can read a multi-perspective production-design analysis of a complete real-world feature, see how it's composed of the Patterns it builds on, and access a working demo when one is feasible
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: BLUE-01, BLUE-02, BLUE-03
**Success Criteria** (what must be TRUE):

  1. A visitor can read a Blueprint post that answers "how would you design and build this feature for production?" for a complete feature (e.g. LLM chat, search, authentication, checkout), drawing on whichever perspectives are relevant (user goals, journeys, UI anatomy, state/data model, interactions, edge cases, a11y, performance, security, analytics, architecture, testing strategy)
  2. The post includes a working demo of the feature when feasible, or ships as architecture-only with that decision made deliberately, not by omission
  3. A visitor can browse Blueprint posts in a section separate from Patterns
  4. The post cross-links to the Patterns it's composed of, using the infrastructure from Phase 3

**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & First Pattern Post | 3/3 | Complete    | 2026-06-30 |
| 2. Live Demos & Patterns Track | 3/3 | Complete   | 2026-07-02 |
| 3. Cross-Linking Infrastructure | 0/TBD | Not started | - |
| 4. Blueprints Track | 0/TBD | Not started | - |
