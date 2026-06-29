# Requirements: Frontend Engineering Blog

**Defined:** 2026-06-29
**Core Value:** Each post must teach a frontend engineering concept thoroughly enough that a hiring manager understands how the author thinks, and a frontend engineer leaves with usable knowledge.

## v1 Requirements

### Foundation

- [ ] **FOUND-01**: Site renders MDX content through a typed content layer (Velite or content-collections) as a statically-generated Next.js site
- [ ] **FOUND-02**: Code blocks render with accurate syntax highlighting (Shiki/rehype-pretty-code) for TS/TSX/JS/HTML/CSS
- [ ] **FOUND-03**: Site supports light/dark mode without a flash of the wrong theme on load
- [ ] **FOUND-04**: Site has responsive, readable typography across mobile/tablet/desktop

### Building Blocks

- [ ] **BLOCK-01**: User can read a Building Blocks post following a consistent template: behavior → accessibility → scalability/design-system readiness → code
- [ ] **BLOCK-02**: User can view a live, interactive demo of the real component embedded in a Building Blocks post, when the author chooses to include one
- [ ] **BLOCK-03**: User can view static code snippets with optional screenshots in a Building Blocks post, when a live demo isn't included
- [ ] **BLOCK-04**: User can browse Building Blocks posts by tag/category (e.g. "Buttons", "Forms", "Navigation")

### Cross-Linking

- [ ] **LINK-01**: Author can declare related posts in frontmatter linking an Anatomy of X post to the Building Blocks post(s) it builds on
- [ ] **LINK-02**: Build fails if a related-post reference points to a slug that doesn't exist (prevents silent link rot)
- [ ] **LINK-03**: User can navigate from an Anatomy of X post to the Building Blocks posts it references, with related posts surfaced inline

### Anatomy of X

- [ ] **ANAT-01**: User can read an Anatomy of X post that breaks down the architecture of a complex feature (e.g. booking system, LLM chat UI)
- [ ] **ANAT-02**: Anatomy of X post includes a working demo of the feature when feasible; ships architecture-only when a demo is impractical for v1
- [ ] **ANAT-03**: User can browse Anatomy of X posts separately from Building Blocks posts

### Site & Discovery

- [ ] **SITE-01**: Each post has accurate SEO metadata (Open Graph tags, JSON-LD, page title/description)
- [ ] **SITE-02**: Site exposes an RSS feed and sitemap
- [ ] **SITE-03**: Each post displays estimated reading time
- [ ] **SITE-04**: Long posts have a table of contents with anchor links to headings

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Discovery

- **DISC-01**: Full-text search across posts (revisit once post count grows past ~20-30)

### Engagement

- **ENGG-01**: Newsletter signup
- **ENGG-02**: Comments on posts

### Anatomy of X

- **ANAT-04**: Sandpack-based runnable, multi-file demos for Anatomy of X features too complex for the standard component-registry demo pattern

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Headless CMS | Single-author git workflow with code demos embedded directly in content is the whole point; a CMS reintroduces a content/code separation this project is designed to avoid |
| Comments | Too early at "a handful of posts" scale; adds moderation overhead with no clear payoff yet |
| Newsletter | Not part of core value; revisit only if audience/post count grows |
| Multi-author support | Single author by design |
| Full-text search (v1) | Unnecessary at launch scale; tags/categories cover discovery until post count grows substantially |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | TBD | Pending |
| FOUND-02 | TBD | Pending |
| FOUND-03 | TBD | Pending |
| FOUND-04 | TBD | Pending |
| BLOCK-01 | TBD | Pending |
| BLOCK-02 | TBD | Pending |
| BLOCK-03 | TBD | Pending |
| BLOCK-04 | TBD | Pending |
| LINK-01 | TBD | Pending |
| LINK-02 | TBD | Pending |
| LINK-03 | TBD | Pending |
| ANAT-01 | TBD | Pending |
| ANAT-02 | TBD | Pending |
| ANAT-03 | TBD | Pending |
| SITE-01 | TBD | Pending |
| SITE-02 | TBD | Pending |
| SITE-03 | TBD | Pending |
| SITE-04 | TBD | Pending |

**Coverage:**
- v1 requirements: 18 total
- Mapped to phases: 0
- Unmapped: 18 ⚠️ (roadmap creation will fill this in)

---
*Requirements defined: 2026-06-29*
*Last updated: 2026-06-29 after initial definition*
