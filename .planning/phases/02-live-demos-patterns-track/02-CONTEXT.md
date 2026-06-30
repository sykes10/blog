# Phase 2: Live Demos & Patterns Track - Context

**Gathered:** 2026-06-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Add an interactive demo registry and round out the Patterns track to a small but real browsable library. Delivers three capabilities: (1) live demo components embedded in Pattern posts via the existing component registry pattern; (2) category and tag filtering on the Patterns index; (3) a table of contents on long posts. Ships two Pattern posts total — the existing Toast post (Components) and a new Optimistic Updates post (Behaviours) with a live demo.

</domain>

<decisions>
## Implementation Decisions

### New Pattern Posts
- **D-01:** Phase 2 ships exactly two Pattern posts: the existing Toast/Notification System post (Components category, static code examples) plus one new post — **Optimistic Updates** (Behaviours category).
- **D-02:** The Optimistic Updates post includes a live, interactive demo that shows optimistic state, simulated network delay, and rollback on error — satisfying PATT-02.
- **D-03:** Phase 2 posts span two categories: Components (Toast) and Behaviours (Optimistic Updates). This satisfies success criterion #4.

### Demo Registry
- **D-04 (carried from Phase 1):** Demo components register in `lib/mdx-components.tsx` via `getMDXComponents()`. Demo wrapper components must be `"use client"` — the MDX post body stays a Server Component; only the demo island hydrates.
- **D-05:** The Optimistic Updates demo is the first live demo in the registry. Its implementation details (which specific actions the demo exposes beyond the core model) are Claude's discretion.

### Claude's Discretion
- **Category/tag browsing** (PATT-04): Implementation approach — URL-based category routes (`/patterns/components`) vs. client-side filter controls on the existing `/patterns` page. Either is acceptable; Claude chooses based on simplicity and SEO tradeoffs. The `category` and `tags` fields are already in the Velite schema; no schema changes needed.
- **Table of contents** (SITE-04): Placement (inline at article top vs. sticky sidebar on desktop) and visibility rule (all posts vs. posts above a heading-count threshold) — Claude decides.
- **Optimistic Updates demo interaction details**: Beyond the core model (optimistic state + simulated network delay + rollback on error), specific controls and visual presentation are Claude's discretion. A todo-list-style or like-count interaction is a natural fit — click updates UI immediately, simulated latency either confirms or rolls back.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & roadmap
- `.planning/REQUIREMENTS.md` — PATT-02, PATT-04, SITE-04 are the v1 requirements this phase delivers.
- `.planning/ROADMAP.md` §"Phase 2: Live Demos & Patterns Track" — phase goal, success criteria (4 items), mode (mvp).

### Tech stack & architecture
- `.claude/CLAUDE.md` — Technology Stack section: locks Next.js 16.2.x/React 19.2.x/Tailwind v4, `next-mdx-remote/rsc` v6, Velite, Shiki+rehype-pretty-code. Also defines the Component Registry pattern for demos (`mdx-components.tsx`, `"use client"` demo wrappers, `getMDXComponents()`). This is the authoritative implementation guide.

### Phase 1 decisions
- `.planning/phases/01-foundation-first-pattern-post/01-CONTEXT.md` — Prior decisions D-01 through D-11 carry forward. In particular: D-04 (Toast post = Components category), D-06 (code blocks only for Phase 1 — live demos deferred to Phase 2), D-10/D-11 (personal-brand styling, Claude's discretion on accent/fonts).

### Existing code (key files for Phase 2)
- `lib/mdx-components.tsx` — Demo component registry. New demo components register here via `getMDXComponents()`.
- `app/patterns/[slug]/page.tsx` — Pattern post page with MDX rendering pipeline. TOC component integrates here.
- `app/patterns/page.tsx` — Patterns index page. Category/tag browsing UI extends this page or branches from it.
- `velite.config.ts` — Pattern schema: `category` (enum: components/behaviours/engineering/ux) and `tags` (array) already defined — no schema changes needed.
- `lib/content.ts` — Content utility functions. Category/tag filtering helpers go here.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `getMDXComponents()` (`lib/mdx-components.tsx`): Demo registry entry point — import a demo component and add it to the returned map; it becomes usable as a JSX tag in MDX files. Callout is already registered here as the pattern to follow.
- `components/mdx/Callout.tsx`: Existing registered MDX component — follow its structure for new presentational components.
- `components/theme/ThemeProvider.tsx` / `ThemeToggle.tsx`: `"use client"` component pattern examples — model demo wrapper components after these.
- Category badge and tag chips in `app/patterns/page.tsx` (lines 26–55): Already renders category and tags per post — extend this visual language for the browsing filter UI.

### Established Patterns
- **Islands of interactivity**: MDX post body = Server Component (zero client JS shipped); demo components = `"use client"` islands. This is the core architecture for Phase 2 demos.
- **Tailwind CSS v4 custom properties**: `text-(--foreground)`, `text-(--muted)`, `bg-(--border)`, `text-accent` etc. — use these CSS-variable-backed tokens in all Phase 2 components.
- **Heading IDs already exist**: `rehype-slug` in the Phase 1 MDX plugin chain generates `id` attributes on every heading — TOC anchor links can reference these without additional processing.

### Integration Points
- `lib/mdx-components.tsx` `getMDXComponents()` → register the Optimistic Updates demo component here
- `app/patterns/page.tsx` → add category/tag filter controls or route links here
- `app/patterns/[slug]/page.tsx` → TOC component renders here (above or alongside the `<article>` element)
- `lib/content.ts` → add `getPatternsByCategory()` and `getPatternsByTag()` filtering helpers here

</code_context>

<specifics>
## Specific Ideas

- **Optimistic Updates demo model**: A todo-list-style or like-count interaction — clicking an action updates the UI immediately (optimistic), a simulated async delay either confirms or triggers a rollback. This is the canonical shape of an optimistic update demo and maps directly to the post's thesis.
- **Optimistic Updates post category**: `behaviours` — already in the Velite `category` enum, no schema change needed.

</specifics>

<deferred>
## Deferred Ideas

- **Engineering category post** (error boundaries, caching strategies, etc.) — deferred to Phase 3 or later. User indicated interest in this category but is only writing one new post for Phase 2.
- **UX category post** (empty states, progressive disclosure, etc.) — same; deferred to Phase 3 or later.
- **Toast live demo** — Phase 2 targets the Optimistic Updates post for the first live demo; a Toast demo (fire/stack/dismiss) could be added to that post in a later phase.

</deferred>

---

*Phase: 2-Live Demos & Patterns Track*
*Context gathered: 2026-06-30*
