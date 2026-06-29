# Project Research Summary

**Project:** Personal technical blog (Next.js + MDX) -- "Building Blocks" component deep-dives and "Anatomy of X" architecture breakdowns, built as a hiring-manager-facing portfolio asset
**Domain:** Content-heavy site with embedded interactive React component demos (MDX-in-repo, no CMS, single author)
**Researched:** 2026-06-29
**Confidence:** MEDIUM

## Executive Summary

This is a static, git-committed MDX blog on Next.js App Router, differentiated by two content tracks (component-level "Building Blocks" and feature-level "Anatomy of X" architecture breakdowns) that cross-link to demonstrate compounding knowledge. The right way to build this -- confirmed across stack, architecture, and feature research -- is RSC-by-default static rendering with small, deliberately isolated "islands" of client interactivity for live component demos, backed by a typed content layer (Zod-validated frontmatter) so cross-linking and the two-track taxonomy are structurally enforced rather than hand-maintained.

The recommended approach: Next.js 16 (App Router) + React 19 + Tailwind v4 for the shell; a content-collections-style typed layer (Velite or @content-collections/core -- both viable, low-stakes choice) to validate and compile MDX; Shiki via rehype-pretty-code for syntax highlighting; and a single demo-component registry resolved through mdx-components.tsx so live demos render the real production component rather than a sandboxed copy. Feature-wise, table stakes (syntax highlighting, dark mode, SEO/OG/JSON-LD, RSS, TOC, tags) are cheap and should ship from day one; the actual differentiators -- per-post a11y/design-system-readiness structure and frontmatter-driven cross-linking between tracks -- are what make this site stand out from typical dev blogs and must be designed into the content schema from post #1, not retrofitted.

The dominant risk is not technical complexity but discipline: research consistently flags scope creep (building a CMS/design-system instead of shipping posts), misplaced use-client boundaries (collapsing RSC benefits), demo/code drift (the displayed snippet diverging from the real component), and inaccessible demos undermining the accessibility-focused content thesis. All four are mitigated by the same posture -- keep the v0 toolchain minimal, push use-client to leaf demo components only, source code blocks from real files, and require manual keyboard/screen-reader verification before any a11y-themed post ships. One unresolved disagreement surfaced between research files (see Gaps) needs a decision before the MDX pipeline phase: STACK.md recommends next-mdx-remote/rsc v6 for its content/route decoupling, while ARCHITECTURE.md and PITFALLS.md flag next-mdx-remote's RSC support as explicitly unstable upstream and recommend @next/mdx instead.

## Key Findings

### Recommended Stack

Core: Next.js 16.2.x (App Router, Turbopack/React Compiler stable) + React 19.2.x + TypeScript 5.7+ + Tailwind CSS 4.x (CSS-first config). Content layer: a typed, Zod-validated collection system (Velite 0.4.0 recommended as the lighter/more framework-agnostic default, @content-collections/core as an equally valid alternative) replacing the now-abandoned Contentlayer. Syntax highlighting: Shiki via rehype-pretty-code 0.14.3 (pin Shiki to the peer-compatible range, verify at install time) plus @rehype-pretty/transformers for copy buttons. Markdown ecosystem: remark-gfm, rehype-slug, rehype-autolink-headings for tables, heading IDs, and deep-linking. For live demos: a component-registry pattern via mdx-components.tsx is the primary mechanism -- Sandpack is explicitly deferred unless an Anatomy of X post needs a full runnable multi-file mini-app.

**Core technologies:**
- Next.js 16 (App Router) -- RSC-by-default static rendering with islands of client interactivity, the right fit for content-heavy pages with sparse interactive demos
- React 19 -- required peer, enables the Server Components/Actions model the architecture depends on
- Tailwind CSS v4 -- CSS-first config, faster builds, no JS config drift for a greenfield project
- Velite (or @content-collections/core) -- typed, Zod-validated frontmatter replacing dead Contentlayer
- Shiki + rehype-pretty-code -- build-time syntax highlighting with accurate TSX/JSX fidelity (Prism is stalled since 2022)

**MDX rendering library choice is unresolved between research files** -- see Gaps to Address.

### Expected Features

**Must have (table stakes):**
- Syntax-highlighted code blocks, code-block copy button
- Responsive/readable typography, dark mode (flash-free)
- SEO basics: Open Graph, meta tags, JSON-LD Article schema, sitemap
- RSS/Atom feed
- Reading time + table of contents/heading anchors
- Tags/categories mapped to the two tracks
- Cross-linking frontmatter schema (build now even before Anatomy of X ships)

**Should have (differentiators):**
- Per-post structural template for Building Blocks (intro to behavior to a11y to design-system-readiness to code) -- the core differentiator, must exist from post #1
- Case-by-case live demos via the component-registry pattern (real components, not sandboxed copies)
- Architecture-breakdown diagrams and cross-linking for Anatomy of X (added once Building Blocks has enough posts to link from)

**Defer (v2+):**
- Full-text search (defer until ~20-30 posts)
- Newsletter, comments -- explicit anti-features for a single-author, no-CMS portfolio blog
- Sandpack full sandbox and Code Hike step-throughs -- only when a specific post's teaching goal genuinely requires them
- Interactive (not static) architecture diagrams

### Architecture Approach

Static-generation-first, islands architecture: content lives in content/track/*.mdx, parsed and validated by a typed content layer at build time, rendered through a Server Component route tree (app/[track]/[slug]/page.tsx) that stays a Server Component end-to-end. The only client-rendered code is a small set of leaf demo components registered in a single components/demos/index.ts registry and resolved by name inside MDX (ButtonDemo) rather than imported per-file. Cross-linking between Building Blocks and Anatomy of X is modeled as structured frontmatter (relatedPosts array) resolved and validated at build time in lib/content.ts, so a broken slug reference fails the build instead of silently 404ing in production.

**Major components:**
1. Content layer (content-collections/Velite) -- parses, validates (Zod), and compiles MDX frontmatter + body at build time
2. MDX rendering pipeline (page.tsx + mdx-components.tsx) -- renders compiled posts as Server Components, injecting the demo/typography component map
3. Demo component registry (components/demos/) -- single source of truth mapping MDX tag names to real, use-client interactive implementations
4. Cross-linking/taxonomy system (lib/content.ts) -- resolves relatedPosts/tags into typed, build-validated links between tracks
5. Site shell/layout -- navigation, theme, per-track index pages, all server-rendered with no client JS

### Critical Pitfalls

1. **Scope creep into CMS/design-system infrastructure before any post ships** -- cap the v0 toolchain to exactly what post #1 needs; gate phase 2 on post #1 being published.
2. **Misplaced use-client boundary** (placed on mdx-components.tsx, layout, or the whole page instead of the leaf demo) -- collapses RSC benefits and bloats every page's bundle; push the directive to leaf demo components only.
3. **Demo/code drift** -- the displayed code snippet diverges from the real component's source after refactors; source code blocks from the real file at build time, or enforce a pre-publish diff check.
4. **Inaccessible demos undermining the a11y content thesis** -- automated scanners (axe-core) give false confidence; require a manual keyboard + screen-reader pass before any a11y-themed post ships.
5. **Bundle bloat from eagerly-registered demo dependencies** -- dynamically import each demo per-post, never register all demos globally; check with @next/bundle-analyzer on every phase that adds a demo.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation & content pipeline
**Rationale:** Everything else depends on the content layer, MDX rendering decision, and the Server/Client boundary convention being settled correctly before any post is written -- these are the most expensive things to unwind later (per Pitfalls 3, 5).
**Delivers:** Next.js 16 + React 19 + Tailwind v4 scaffold; typed content layer (Velite or content-collections) wired to content/track/*.mdx; MDX rendering pipeline with mdx-components.tsx; syntax highlighting via Shiki/rehype-pretty-code; base layout/dark mode/SEO metadata.
**Addresses:** Syntax highlighting, dark mode, SEO basics, RSS, tags/categories (table stakes from FEATURES.md)
**Avoids:** Pitfall 1 (scope creep) by capping the deliverable; Pitfall 5 (misplaced client boundary) by deciding the MDX library and registration pattern explicitly in this phase

### Phase 2: Demo component registry & first Building Blocks post
**Rationale:** The registry pattern and per-post structural template are the project's core differentiators and must exist before more than one post is written, or they'll be retrofitted inconsistently across posts (per ARCHITECTURE.md Pattern 2, FEATURES.md MVP).
**Delivers:** components/demos/index.ts registry pattern; one fully shipped Building Blocks post (real component, live demo, a11y section, static-code-or-demo decision applied) as the proof of the whole pipeline.
**Uses:** Component-registry stack pattern from STACK.md/ARCHITECTURE.md
**Implements:** Demo component registry, per-post structural template, dynamic-import bundle discipline (Pitfall 4)

### Phase 3: Cross-linking, taxonomy, and remaining Building Blocks posts
**Rationale:** Cross-linking frontmatter must exist before Anatomy of X content references it, and tag/taxonomy navigation needs more than one post to validate against.
**Delivers:** relatedPosts/tags schema enforced via Zod with build-time validation against real slugs; track index pages; 2-4 more Building Blocks posts.
**Addresses:** Cross-linking, tags/categories navigation (FEATURES.md differentiators)
**Avoids:** Anti-Pattern 2 (manual prose links that rot silently)

### Phase 4: Anatomy of X track
**Rationale:** Per PROJECT.md and FEATURES.md, this track should only start once Building Blocks has enough posts to link from -- it's explicitly sequenced after, not parallel.
**Delivers:** First Anatomy of X post (architecture-breakdown structure, static diagrams, cross-links back to Building Blocks); decision per-post on whether a live demo is warranted (architecture-only is an acceptable outcome).
**Addresses:** Anatomy of X track, architecture diagrams (FEATURES.md P2)

### Phase Ordering Rationale

- Foundation must precede any content because the MDX rendering library choice, content-layer choice, and Server/Client boundary convention are foundational decisions that are expensive to unwind once posts exist (PITFALLS.md Pitfalls 3 and 5).
- Demo registry and the structural template come before volume content because they are the differentiators that must compound across posts, not be added retroactively (FEATURES.md dependency notes).
- Cross-linking schema must exist before Anatomy of X content because Anatomy posts reference Building Blocks posts by slug from day one of that track (FEATURES.md, ARCHITECTURE.md cross-linking flow).
- Anatomy of X is sequenced last because it structurally depends on Building Blocks content existing to link to, matching the project's own stated v1/v1.x split.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Needs a deliberate research-phase pass to resolve the next-mdx-remote/rsc vs @next/mdx disagreement (see Gaps) before locking the MDX rendering approach, and to verify the exact Shiki/rehype-pretty-code peer version range at install time.
- **Phase 2:** Light research recommended on accessibility verification tooling/workflow (manual keyboard + screen-reader testing process) since automated-only verification is an explicitly flagged anti-pattern.

Phases with standard patterns (skip research-phase):
- **Phase 3:** Cross-linking/taxonomy via Zod-validated frontmatter is a well-documented pattern with consistent guidance across STACK/ARCHITECTURE/FEATURES research.
- **Phase 4:** Anatomy of X structure follows the same content-pipeline conventions established in Phase 1-3; no new architectural pattern required.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM-HIGH | Versions verified directly against npm registry; architectural recommendations cross-checked across 2+ sources |
| Features | MEDIUM | Cross-referenced web sources and competitor analysis (Comeau, Abramov), but limited primary-source depth on some claims (e.g. overreacted.io marked LOW internally) |
| Architecture | MEDIUM | Cross-checked against official Next.js/MDX docs plus independent tutorials; content-collections exact API surface flagged as needing verification at implementation time |
| Pitfalls | MEDIUM | Technical findings (hydration, RSC boundaries, bundle splitting) are MEDIUM; anecdotal findings (scope creep patterns, hiring-manager red flags) explicitly flagged LOW by the source research |

**Overall confidence:** MEDIUM

### Gaps to Address

- **MDX rendering library conflict:** STACK.md recommends next-mdx-remote/rsc v6.0.0 (content/route decoupling, RSC-native per its own changelog). ARCHITECTURE.md and PITFALLS.md instead recommend @next/mdx (compile-time, via next.config.js), citing next-mdx-remote's RSC support as explicitly unstable upstream. **This must be resolved in Phase 1 planning** -- likely via a targeted research-phase pass checking the current (2026) status of next-mdx-remote/rsc's RSC stability claim against its own release notes, since the conflicting research predates or postdates different evidence. If @next/mdx is chosen instead, note it couples content files to route files directly (page-based MDX), which changes the recommended content/ decoupling structure from ARCHITECTURE.md and the velite/content-collections value proposition from STACK.md -- this is not a small implementation detail, it affects the project structure.
- **Velite vs @content-collections/core:** Both research files treat this as a low-stakes, roughly-equivalent choice. No further research needed; pick one in Phase 1 and move on.
- **Exact content-collections/Velite API surface:** ARCHITECTURE.md flags this as the lowest-certainty area since these are smaller, faster-moving packages than Next.js itself -- verify exact compileMDX/schema API against live docs at implementation time rather than trusting the code samples in research verbatim.
- **Shiki/rehype-pretty-code peer version range:** STACK.md explicitly flags this as needing verification against the installed package's package.json at install time rather than trusting shiki@latest.

## Sources

### Primary (HIGH confidence)
- npm registry (registry.npmjs.org) -- direct version/publish-date verification for next, react, velite, next-mdx-remote, rehype-pretty-code, shiki, tailwindcss, contentlayer, and related packages
- nextjs.org/docs (App Router, MDX guide, Server/Client Components, mdx-components file convention) -- official documentation baseline

### Secondary (MEDIUM confidence)
- velite.js.org, content-collections.dev, rehype-pretty.pages.dev, tailwindcss.com -- library maintainer documentation
- joshwcomeau.com and associated "How I Built My Blog v2" / Sandpack playground posts -- competitor feature analysis
- github.com/vercel/next.js discussions (#50897, #58575) -- official repo discussion threads on MDX/RSC integration
- react.dev use-client reference docs -- official boundary-model documentation
- github.com/contentlayerdev/contentlayer issues + wisp.blog writeup -- corroborated Contentlayer abandonment

### Tertiary (LOW confidence)
- Medium/dev.to case studies on hydration errors, bundle-size reduction, and "over-engineered portfolio" hiring-manager red flags -- anecdotal, included for directional signal only, not load-bearing
- Hacker News community sentiment on personal technical blogging scope creep -- anecdotal
- profy.dev hiring-manager survey on portfolio websites -- self-reported survey, larger sample than typical blog post but still LOW-MEDIUM

---
*Research completed: 2026-06-29*
*Ready for roadmap: yes*
