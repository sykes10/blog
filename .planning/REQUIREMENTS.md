# Requirements: Frontend Blueprints

**Defined:** 2026-06-29
**Core Value:** Every Blueprint or Pattern must give the reader a production-grade mental model — covering the "why" and trade-offs as much as the "how" — for a hiring manager to understand how the author thinks, or an engineer to use as a reference.

## v1 Requirements

### Foundation

- [x] **FOUND-01**: Site renders MDX content through a typed content layer (Velite or content-collections) as a statically-generated Next.js site
- [x] **FOUND-02**: Code blocks render with accurate syntax highlighting (Shiki/rehype-pretty-code) for TS/TSX/JS/HTML/CSS
- [x] **FOUND-03**: Site supports light/dark mode without a flash of the wrong theme on load
- [x] **FOUND-04**: Site has responsive, readable typography across mobile/tablet/desktop

### Patterns

- [x] **PATT-01**: User can read a Pattern article following a consistent template: the problem it solves → when to use / when not to use → trade-offs → common mistakes → accessibility considerations → performance implications → edge cases → implementation considerations
- [ ] **PATT-02**: User can view a live, interactive demo of the real implementation embedded in a Pattern article, when the author chooses to include one
- [x] **PATT-03**: User can view static code snippets with optional screenshots in a Pattern article, when a live demo isn't included
- [ ] **PATT-04**: User can browse Pattern articles by category (Components, Behaviours, Engineering, UX) and by tag

### Cross-Linking

- [ ] **LINK-01**: Author can declare related Patterns in a Blueprint's frontmatter, and related Blueprints in a Pattern's frontmatter (many-to-many)
- [ ] **LINK-02**: Build fails if a related-content reference points to a slug that doesn't exist (prevents silent link rot)
- [ ] **LINK-03**: User can navigate from a Blueprint to the Patterns it's composed of, and from a Pattern to the Blueprints that reference it, with related content surfaced inline

### Blueprints

- [ ] **BLUE-01**: User can read a Blueprint article that answers "how would you design and build this feature for production?" for a complete frontend feature (e.g. LLM chat, search, authentication, checkout), drawing on whichever perspectives are relevant (user goals, journeys, UI anatomy, state/data model, interactions, edge cases, a11y, performance, security, analytics, architecture, testing strategy) — depth chosen per feature, not every perspective mandatory for every post
- [ ] **BLUE-02**: Blueprint article includes a working demo of the feature when feasible; ships as architecture-only when a demo is impractical for v1
- [ ] **BLUE-03**: User can browse Blueprint articles separately from Patterns

### Site & Discovery

- [x] **SITE-01**: Each post has accurate SEO metadata (Open Graph tags, JSON-LD, page title/description)
- [x] **SITE-02**: Site exposes an RSS feed and sitemap
- [x] **SITE-03**: Each post displays estimated reading time
- [x] **SITE-04**: Long posts have a table of contents with anchor links to headings

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Discovery

- **DISC-01**: Full-text search across posts (revisit once post count grows past ~20-30)

### Engagement

- **ENGG-01**: Newsletter signup
- **ENGG-02**: Comments on posts

### Blueprints

- **BLUE-04**: Sandpack-based runnable, multi-file demos for Blueprint features too complex for the standard component-registry demo pattern

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Headless CMS | Single-author git workflow with code demos embedded directly in content is the whole point; a CMS reintroduces a content/code separation this project is designed to avoid |
| Comments | Too early at "a handful of posts" scale; adds moderation overhead with no clear payoff yet |
| Newsletter | Not part of core value; revisit only if audience/post count grows |
| Multi-author support | Single author by design |
| Full-text search (v1) | Unnecessary at launch scale; categories/tags cover discovery until post count grows substantially |
| Framework-specific tutorials | Content stays timeless and valuable regardless of framework/technology churn — a guiding principle, not just a v1 deferral |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| PATT-01 | Phase 1 | Complete |
| PATT-03 | Phase 1 | Complete |
| SITE-01 | Phase 1 | Complete |
| SITE-02 | Phase 1 | Complete |
| SITE-03 | Phase 1 | Complete |
| PATT-02 | Phase 2 | Pending |
| PATT-04 | Phase 2 | Pending |
| SITE-04 | Phase 2 | Complete |
| LINK-01 | Phase 3 | Pending |
| LINK-02 | Phase 3 | Pending |
| LINK-03 | Phase 3 | Pending |
| BLUE-01 | Phase 4 | Pending |
| BLUE-02 | Phase 4 | Pending |
| BLUE-03 | Phase 4 | Pending |

**Coverage:**

- v1 requirements: 18 total
- Mapped to phases: 18
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-29*
*Last updated: 2026-06-29 after roadmap revision (Building Blocks → Patterns, Anatomy of X → Blueprints; requirement IDs and phase mappings updated, 18/18 v1 requirements mapped)*
