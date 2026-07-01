# Phase 2: Live Demos & Patterns Track - Research

**Researched:** 2026-07-01
**Domain:** React 19 optimistic UI, Next.js App Router static filtering, MDX table-of-contents, manual accessibility verification
**Confidence:** MEDIUM (core APIs verified against official docs; ecosystem/pattern guidance cross-checked but not Context7-sourced — see Sources)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Phase 2 ships exactly two Pattern posts: the existing Toast/Notification System post (Components category, static code examples) plus one new post — **Optimistic Updates** (Behaviours category).
- **D-02:** The Optimistic Updates post includes a live, interactive demo that shows optimistic state, simulated network delay, and rollback on error — satisfying PATT-02.
- **D-03:** Phase 2 posts span two categories: Components (Toast) and Behaviours (Optimistic Updates). This satisfies success criterion #4.
- **D-04 (carried from Phase 1):** Demo components register in `lib/mdx-components.tsx` via `getMDXComponents()`. Demo wrapper components must be `"use client"` — the MDX post body stays a Server Component; only the demo island hydrates.
- **D-05:** The Optimistic Updates demo is the first live demo in the registry. Its implementation details (which specific actions the demo exposes beyond the core model) are Claude's discretion.

### Claude's Discretion

- **Category/tag browsing** (PATT-04): Implementation approach — URL-based category routes (`/patterns/components`) vs. client-side filter controls on the existing `/patterns` page. Either is acceptable; Claude chooses based on simplicity and SEO tradeoffs. The `category` and `tags` fields are already in the Velite schema; no schema changes needed.
- **Table of contents** (SITE-04): Placement (inline at article top vs. sticky sidebar on desktop) and visibility rule (all posts vs. posts above a heading-count threshold) — Claude decides.
- **Optimistic Updates demo interaction details**: Beyond the core model (optimistic state + simulated network delay + rollback on error), specific controls and visual presentation are Claude's discretion. A todo-list-style or like-count interaction is a natural fit.

### Deferred Ideas (OUT OF SCOPE)

- **Engineering category post** (error boundaries, caching strategies, etc.) — deferred to Phase 3 or later.
- **UX category post** (empty states, progressive disclosure, etc.) — deferred to Phase 3 or later.
- **Toast live demo** — Phase 2 targets the Optimistic Updates post for the first live demo; a Toast demo (fire/stack/dismiss) could be added in a later phase.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PATT-02 | User can view a live, interactive demo of the real implementation embedded in a Pattern article | `useOptimistic` API + rollback pattern (Architecture Patterns §1), demo registry wiring (§2), ARIA live region for status announcements (Security/A11y section, Pitfall 4) |
| PATT-04 | User can browse Pattern articles by category (Components, Behaviours, Engineering, UX) and by tag | Dynamic-segment static filtering pattern (Architecture Patterns §3), `getPatternsByCategory`/`getPatternsByTag` helper design |
| SITE-04 | Long posts have a table of contents with anchor links to headings | TOC + scroll-spy pattern (Architecture Patterns §4), reuse of `rehype-slug` heading ids already in the Phase 1 pipeline |

</phase_requirements>

## Summary

Phase 2 adds three independent capabilities on top of the Phase 1 foundation, and all three can be built with **zero new npm dependencies** — every required primitive (`useOptimistic`, `IntersectionObserver`, `generateStaticParams`, `rehype-slug` heading ids) is either already installed or a browser/React built-in. `npm view react version` confirms `19.2.7` is current against the pinned `19.2.4` in `package.json` — no action needed, existing pin is compatible.

The Optimistic Updates demo is the first live client-side island in the codebase. It should follow the exact shape already established by `ThemeToggle.tsx`: a small `"use client"` component, no external state library, co-located under `components/demos/`, registered in `lib/mdx-components.tsx`'s `getMDXComponents()` map exactly like `Callout`. React 19's `useOptimistic` hook (paired with `startTransition`) provides automatic rollback on thrown errors with no hand-rolled revert logic — the correct "don't hand-roll" call here is to use `useOptimistic` rather than building a manual previous-state-snapshot/restore mechanism.

For category/tag browsing, `searchParams`-based filtering forces the route to render dynamically, which conflicts with this project's fully-static, MDX-in-repo architecture (confirmed via official Next.js docs and community reports). The correct pattern is dynamic path segments — `/patterns/category/[category]` — enumerated via `generateStaticParams`, giving each category its own statically generated, SEO-indexable page. Tag filtering can follow the same shape (`/patterns/tag/[tag]`) or, given the likely small tag cardinality at this content scale (2 posts), a lighter-weight client-side chip filter on the existing `/patterns` index is also defensible — recommendation below.

The table of contents is a small client component (needed only for active-heading tracking via `IntersectionObserver`; the link list itself could be server-rendered but is simplest to keep in the same component). `rehype-slug` already runs in the Phase 1 MDX pipeline (`app/patterns/[slug]/page.tsx`), so heading `id` attributes already exist — no plugin changes needed. The TOC needs the heading list itself, which is not currently extracted anywhere; this is the one piece of new "plumbing" this phase requires (extracting headings from the raw MDX or compiled tree).

The accessibility blocker flagged in STATE.md (automated-only scanning is insufficient for a11y-themed content) is addressed with a lightweight manual verification workflow: a keyboard-only pass followed by a single screen-reader pass (NVDA+Firefox, since the dev machine is Windows), run once per phase before verification, targeting the three new interactive surfaces (demo, filter controls, TOC).

**Primary recommendation:** Use `useOptimistic` + `startTransition` for the demo (no manual rollback code), dynamic-segment routes for category browsing with a client-side chip filter for tags, a small client TOC component driven by `IntersectionObserver`, and a one-page manual accessibility checklist run against all three new interactive surfaces before phase verification.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Optimistic Updates demo (state, simulated delay, rollback) | Browser / Client | — | Pure client-side interaction; no real backend exists or is needed — the "network call" is a simulated `Promise` + `setTimeout`, entirely in-browser. `"use client"` island per D-04. |
| Demo registration (`getMDXComponents()`) | Frontend Server (SSR) | Browser / Client | The registry map itself executes server-side (it's imported into a Server Component page), but the component it maps to is a client island. Registration is server-tier plumbing; the rendered result hydrates client-side. |
| Category browsing (`/patterns/category/[category]`) | Frontend Server (SSR) | — | Statically generated at build time via `generateStaticParams`; no client JS required for the base browsing experience. Belongs entirely server/build tier for SEO and zero-JS delivery. |
| Tag filtering (chip UI) | Browser / Client | Frontend Server (SSR) | If implemented as a client-side filter (recommended for tags given small cardinality), filtering logic runs in the browser over a server-provided full list; if implemented as `/patterns/tag/[tag]` instead, it moves entirely to the SSR tier like category routing. |
| Table of contents (heading list + anchor links) | Frontend Server (SSR) | Browser / Client | The link list can be computed at build/render time server-side (heading extraction is pure data transform); only the *active heading highlight* (scroll-spy) requires a client-side `IntersectionObserver`, making this a hybrid: server-rendered links, client-hydrated active-state tracking. |
| Heading `id` generation | Frontend Server (SSR) | — | Already handled by `rehype-slug` in the existing MDX rehype pipeline (`app/patterns/[slug]/page.tsx`) — no new work, purely server-side at render time. |
| Manual accessibility verification | N/A (process, not architecture) | — | Not a runtime tier — a verification workflow performed against the rendered browser output using OS-level assistive technology (NVDA/VoiceOver), outside the application's own architecture. |

## Standard Stack

### Core

No new core dependencies required. Phase 2 is built entirely on the existing Phase 1 stack.

| Library | Version (installed) | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `react` | 19.2.4 (latest: 19.2.7 — patch-level drift, not urgent) [VERIFIED: npm registry] | `useOptimistic`, `startTransition` for the demo | Built-in React 19 hook purpose-built for exactly this use case (optimistic state + automatic rollback on error) [CITED: react.dev/reference/react/useOptimistic] |
| `next` | 16.2.9 [VERIFIED: npm registry, matches package.json] | `generateStaticParams` for category routes, `IntersectionObserver` client component for TOC | Already the project's framework; no new API surface beyond what Phase 1 established [CITED: nextjs.org/docs/app/api-reference/functions/generate-static-params] |
| `rehype-slug` | 6.0.0 (already installed, already wired in Phase 1 pipeline) | Heading `id` generation, consumed by the new TOC | Already a locked Phase 1 decision (`.claude/CLAUDE.md`); Phase 2 only consumes its output, doesn't add new config |

### Supporting

No new supporting libraries are required or recommended. A dedicated TOC library (e.g. `react-toc`, various npm scroll-spy packages) was considered and explicitly rejected — see Don't Hand-Roll and Alternatives below.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-rolled `useOptimistic` + `startTransition` demo | A demo state library (Zustand, Jotai) | Total overkill for a single local-state island; React 19's built-in hook was purpose-built for this exact optimistic-update-with-rollback shape. Adding a state library here would violate the project's minimal-dependency, greenfield-simplicity posture. |
| Dynamic-segment category routes (`/patterns/category/[category]`) | `searchParams`-based `?category=` filtering | `searchParams` forces the route to render dynamically, breaking full static generation — a real tradeoff for this project, which is fully static/MDX-in-repo by design [CITED: nextjs.org, community reports cross-checked]. Dynamic segments preserve `generateStaticParams` and per-category SEO metadata. |
| Client-side `IntersectionObserver` TOC | A TOC/scroll-spy npm package (e.g. `react-scrollspy`) | At 2 posts and a handful of headings, a ~40-line custom hook is simpler to own, has zero extra dependency surface, and avoids taking on an unmaintained/low-traffic package's API constraints. Revisit only if TOC needs grow substantially (e.g. nested multi-level TOC with scrollable sidebar virtualization). |
| Manual a11y checklist (keyboard + 1 screen reader) | Full automated a11y test suite (axe-core in CI) integrated this phase | STATE.md explicitly flags automated-only scanning as insufficient for a11y-themed content; a manual pass catches announcement quality and reading-order issues axe cannot. Automated axe scanning is not excluded — it can be added later as a *supplement*, not a replacement. |

**Installation:**
```bash
# No new packages required for Phase 2.
```

**Version verification:** `npm view react version` → `19.2.7` (installed: `19.2.4`, patch drift only, no breaking changes expected, no action required). `npm view next version` → `16.2.9` (matches installed exactly). No package.json changes needed for this phase.

## Package Legitimacy Audit

**Not applicable this phase** — Phase 2 introduces zero new external packages. All capabilities (optimistic UI, static filtering routes, table of contents, accessibility verification) are built from already-installed dependencies (React 19, Next.js 16, `rehype-slug`) or browser built-ins (`IntersectionObserver`). No `package-legitimacy check` run was necessary.

**Packages removed due to [SLOP] verdict:** none (no packages evaluated — none proposed)
**Packages flagged as suspicious [SUS]:** none

## Architecture Patterns

### System Architecture Diagram

```
Visitor requests /patterns
        │
        ▼
┌─────────────────────────────┐
│ app/patterns/page.tsx (RSC) │──reads──▶ #site/content (Velite output, build-time)
│  renders full pattern list  │
│  + tag chip filter (client) │
└──────────────┬───────────────┘
               │ visitor clicks a category link
               ▼
┌───────────────────────────────────────────┐
│ app/patterns/category/[category]/page.tsx │
│  generateStaticParams() enumerates the     │
│  4 category enum values at build time      │──reads──▶ getPatternsByCategory()
│  → statically generated per category        │            (lib/content.ts)
└──────────────┬──────────────────────────────┘
               │ visitor clicks a post
               ▼
┌─────────────────────────────────────────────┐
│ app/patterns/[slug]/page.tsx (RSC)           │
│  MDXRemote compiles raw MDX server-side       │──plugin chain──▶ remark-gfm →
│  <TableOfContents> (client island) renders     │                 rehype-slug →
│    heading links; IntersectionObserver tracks  │                 rehype-autolink-headings →
│    active heading client-side                  │                 rehype-pretty-code
│  <OptimisticUpdatesDemo> (client island) renders│
│    inside MDX body via getMDXComponents()       │
└──────────────┬────────────────────────────────┘
               │ visitor interacts with demo (click)
               ▼
┌────────────────────────────────────────┐
│ OptimisticUpdatesDemo ("use client")     │
│  useOptimistic(state, reducer)            │
│  → setOptimistic() inside startTransition │
│  → simulated delay (setTimeout/Promise)   │
│  → on reject: transition ends, React      │
│    auto-reverts to last committed state   │
│  → aria-live region announces result      │
└────────────────────────────────────────┘
```

### Recommended Project Structure
```
app/
├── patterns/
│   ├── page.tsx                       # index — full list + tag chip filter (client island)
│   ├── category/
│   │   └── [category]/
│   │       └── page.tsx               # NEW — static per-category listing (generateStaticParams)
│   └── [slug]/
│       └── page.tsx                   # EXISTING — add <TableOfContents> here
components/
├── demos/
│   └── OptimisticUpdatesDemo.tsx      # NEW — "use client" demo island (D-04/D-05)
├── mdx/
│   ├── Callout.tsx                    # EXISTING
│   └── TableOfContents.tsx            # NEW — "use client" (IntersectionObserver)
├── patterns/
│   └── TagFilter.tsx                  # NEW — "use client" chip filter (if client-side tags chosen)
lib/
├── content.ts                         # EXTEND — getPatternsByCategory(), getPatternsByTag(), getAllTags()
├── mdx-components.tsx                 # EXTEND — register OptimisticUpdatesDemo
└── toc.ts                             # NEW — extractHeadings(raw) helper for TOC data
content/
└── patterns/
    └── optimistic-updates.mdx         # NEW — Behaviours category, includes <OptimisticUpdatesDemo />
```

### Pattern 1: `useOptimistic` + `startTransition` with automatic rollback
**What:** React 19's built-in hook for showing an immediate UI update before an async action resolves, with automatic revert on failure — no manual snapshot/restore code.
**When to use:** Any UI where a user action should feel instant despite a real (or simulated) network round-trip, and where failure should cleanly restore the prior state.
**Example:**
```tsx
// Source: react.dev/reference/react/useOptimistic (fetched 2026-07-01)
"use client";

import { useState, useOptimistic, startTransition } from "react";

type Item = { id: string; liked: boolean };

export function OptimisticUpdatesDemo({ initial }: { initial: Item }) {
  const [item, setItem] = useState(initial);
  const [optimisticItem, setOptimisticItem] = useOptimistic(item);
  const [error, setError] = useState<string | null>(null);

  function handleToggle() {
    const next = { ...item, liked: !item.liked };

    startTransition(async () => {
      setError(null);
      setOptimisticItem(next); // shows immediately

      try {
        const confirmed = await simulateNetworkCall(next); // setTimeout + random reject
        setItem(confirmed); // commits real state on success
      } catch (err) {
        // No manual revert needed: the transition ends, optimisticItem
        // re-renders from `item` (unchanged), so the UI reverts automatically.
        setError(err instanceof Error ? err.message : "Update failed");
      }
    });
  }

  return (
    <div>
      <button onClick={handleToggle} aria-pressed={optimisticItem.liked}>
        {optimisticItem.liked ? "Liked" : "Like"}
      </button>
      {optimisticItem !== item && <span aria-hidden="true">Saving…</span>}
      <div role="status" aria-live="polite" className="sr-only">
        {error ? `Error: ${error}. Reverted.` : ""}
      </div>
    </div>
  );
}
```
**Note on the reducer overload:** `useOptimistic(state, updateFn)` also accepts a pure `(currentState, action) => nextState` reducer as the second argument for cases where the base state might change concurrently with the pending action — not required for a simple demo, but worth mentioning in the post's "implementation considerations" section since it's the more advanced form readers researching the pattern will eventually need. [CITED: react.dev/reference/react/useOptimistic]

### Pattern 2: Static category routes via `generateStaticParams`
**What:** A `/patterns/category/[category]` route that statically generates one page per category value at build time, rather than a `?category=` query-string filter.
**When to use:** Any filterable listing on a fully-static site where the filter dimension has a small, known set of values (here: the 4-value `category` enum already in the Velite schema) and SEO/shareable-URL value matters.
**Example:**
```tsx
// Source: nextjs.org/docs/app/api-reference/functions/generate-static-params (fetched 2026-07-01, v16.2.9 docs)
// app/patterns/category/[category]/page.tsx
import { notFound } from "next/navigation";
import { getPatternsByCategory } from "@/lib/content";

const CATEGORIES = ["components", "behaviours", "engineering", "ux"] as const;
type Category = (typeof CATEGORIES)[number];

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!CATEGORIES.includes(category as Category)) notFound();

  const patterns = getPatternsByCategory(category as Category);
  // ... render list, same visual language as app/patterns/page.tsx
}
```
**Why not `searchParams`:** Accepting `searchParams` in a page makes that route ineligible for full static generation — Next.js must render it dynamically to read request-time query values [CITED: nextjs.org community-verified pattern, cross-checked against GitHub discussion #58884 and Vercel Academy]. Dynamic segments avoid this entirely.

### Pattern 3: Client-side tag chip filter (lighter-weight companion to Pattern 2)
**What:** For tags — which have higher cardinality and less SEO value per-tag than the 4-value category enum — a `"use client"` chip filter on the existing `/patterns` index page that filters the already-fetched-server-side full pattern list in the browser.
**When to use:** When the filter dimension's cardinality is small/unbounded and not worth a full static route tree; when instant, no-navigation filtering (a nicer UX for browsing) is preferred over a dedicated shareable URL per tag.
**Example:**
```tsx
// components/patterns/TagFilter.tsx
"use client";
import { useState } from "react";
import type { Pattern } from "@/lib/content";

export function TagFilter({ patterns, allTags }: { patterns: Pattern[]; allTags: string[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const filtered = activeTag ? patterns.filter((p) => p.tags.includes(activeTag)) : patterns;

  return (
    <>
      <div role="group" aria-label="Filter by tag">
        {allTags.map((tag) => (
          <button
            key={tag}
            aria-pressed={activeTag === tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      {/* render `filtered` list */}
    </>
  );
}
```
**Tradeoff accepted:** Tag filter state is not deep-linkable (no dedicated URL per tag) with this approach. Given the phase ships only 2 posts with a handful of tags total, this is an acceptable simplicity/SEO tradeoff per CONTEXT.md's explicit delegation of this choice to Claude's discretion. If tag deep-linking becomes a requirement later, the same `/patterns/tag/[tag]` dynamic-segment pattern from Pattern 2 can be applied without restructuring the data layer (`getPatternsByTag()` already exists).

### Pattern 4: Table of contents with `IntersectionObserver` scroll-spy
**What:** A client component that renders a heading link list and highlights the currently-visible heading using `IntersectionObserver`, with `aria-current` on the active link.
**When to use:** Long-form posts where jump-to-section navigation improves usability (SITE-04). Placement/threshold are Claude's discretion per CONTEXT.md.
**Example:**
```tsx
// Source: pattern synthesized from css-tricks.com/table-of-contents-with-intersectionobserver
// and logrocket.com/create-table-contents-highlighting-react (fetched 2026-07-01, cross-checked, MEDIUM confidence)
"use client";
import { useEffect, useState } from "react";

type Heading = { id: string; text: string; depth: number };

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-110px 0px -60% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav aria-label="Table of contents">
      <ul>
        {headings.map((h) => (
          <li key={h.id} style={{ marginLeft: `${(h.depth - 2) * 12}px` }}>
            <a
              href={`#${h.id}`}
              aria-current={activeId === h.id ? "location" : undefined}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```
**Heading extraction (the one new plumbing piece):** Headings must be extracted from the post's raw MDX before render, since Velite's schema stores `raw` (unprocessed MDX text), not a pre-parsed heading tree. A `lib/toc.ts` helper using a lightweight regex or remark-based extraction (`## `/`### ` line matching, or `unified().use(remarkParse).use(remarkGfm)` walking the resulting mdast for `heading` nodes) produces `{ id, text, depth }[]` — the `id` values must match what `rehype-slug`'s GitHub-flavored slugification algorithm (lowercase, hyphenate, strip punctuation) will produce, or anchor links will silently 404-scroll. **Verify at implementation time** by comparing extracted-slug output against the actual rendered `id` attributes for at least one heading with punctuation/mixed case (e.g. an `##` heading containing a code term).

### Anti-Patterns to Avoid
- **Hand-rolled optimistic state (manual snapshot + restore array/object):** Don't build a "save previous state before mutating, restore on catch" pattern by hand — `useOptimistic` already does this correctly and is the React 19-idiomatic solution; a hand-rolled version is more code and more bug surface for an identical result.
- **`searchParams`-based category/tag filtering on a fully static site:** Breaks static generation for the filtered route, contradicting this project's architecture. Reserve `searchParams` only for capabilities that must be dynamic (none exist in this phase).
- **Injecting the `aria-live` container dynamically at the moment of the status change:** Screen readers may miss the announcement if the live region itself is added to the DOM at the same time its content changes. The live region element must exist in the DOM (even if empty) before the content update occurs.
- **A demo component that silently fails with no visible error state:** `useOptimistic`'s automatic revert restores the *visual* state, but without a paired `aria-live`/visible error message, sighted-but-not-looking-closely and screen-reader users alike may not notice the action failed. Always pair automatic rollback with an explicit failure indicator.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|--------------|-----|
| Optimistic state + rollback on error | A manual "save prior state, mutate, catch-and-restore" pattern with `useState` | `useOptimistic` + `startTransition` | Built into React 19, purpose-built for exactly this shape, handles the revert automatically when the transition's action throws — fewer lines, fewer bugs, and it's the pattern the post itself is teaching (using the hand-rolled version to demo the hook-based pattern would be an inconsistent example). |
| Heading-active-state tracking on scroll | A manual `scroll` event listener computing element `getBoundingClientRect()` on every scroll tick | `IntersectionObserver` | `IntersectionObserver` is async, off the main thread for intersection calculation, and avoids the well-known scroll-listener performance/jank problems (excessive re-renders, need for manual throttling/debouncing). |
| Static per-category pages on a filterable content type | Building a custom build-time script that pre-renders category HTML files outside Next.js's routing | `generateStaticParams` on a `[category]` dynamic segment | This is exactly the built-in mechanism Next.js provides for "known finite set of param values, statically generate one page per value" — reinventing it outside the framework's routing loses `next build`'s static optimization, ISR compatibility, and metadata generation integration. |

**Key insight:** Every "don't hand-roll" item in this phase has a first-party, already-installed answer (React 19 hook, Web Platform API, Next.js routing convention) — this phase should add zero new dependencies while still being fully idiomatic for its stack.

## Common Pitfalls

### Pitfall 1: Calling `setOptimistic` outside a Transition
**What goes wrong:** The optimistic value renders briefly, then reverts immediately — looks like a rendering bug, not an intentional revert.
**Why it happens:** `useOptimistic`'s setter is documented to only apply cleanly inside `startTransition` (or a form Action/Server Action); calling it in a plain synchronous event handler without wrapping produces a dev-mode warning and the value doesn't persist through the async work.
**How to avoid:** Always wrap the setter call and the subsequent async work in `startTransition(async () => { ... })`.
**Warning signs:** The demo's "optimistic" state flashes and reverts even on the success path, or a console warning about `useOptimistic` appears.

### Pitfall 2: Heading `id` mismatch between TOC links and rendered headings
**What goes wrong:** Clicking a TOC link doesn't scroll to the right heading (or doesn't scroll at all) because the `href="#slug"` doesn't match the actual `id` `rehype-slug` generated.
**Why it happens:** If heading text/ids are extracted independently (e.g. a hand-rolled slugify function in `lib/toc.ts`) rather than reading the actual post-render DOM/AST ids, slight differences in slugification rules (handling of punctuation, numbers, duplicate headings) cause drift.
**How to avoid:** Either derive the TOC heading list from the same rehype pipeline output the page already renders (so ids are guaranteed to match), or use `github-slugger` (the same underlying slugify library `rehype-slug` itself uses) if extracting from raw MDX text independently, rather than writing a custom slugify function.
**Warning signs:** TOC links present but clicking them does nothing, or scrolls to the top of the page instead of the target heading.

### Pitfall 3: Category route param not validated against the enum
**What goes wrong:** Visiting `/patterns/category/nonsense` either 500s, or (worse) silently renders an empty list with a 200 status instead of a proper 404.
**Why it happens:** `generateStaticParams` only pre-renders the *known* category values; without `notFound()` on an unmatched param and/or `dynamicParams` config, an out-of-range value visited at runtime could render blank rather than erroring cleanly.
**How to avoid:** Validate the `category` param against the same enum used in `velite.config.ts` (`["components", "behaviours", "engineering", "ux"]`) and call `notFound()` on a mismatch, matching the existing pattern already used in `app/patterns/[slug]/page.tsx` for unknown slugs.
**Warning signs:** A malformed category URL doesn't 404.

### Pitfall 4: Rollback is visually silent
**What goes wrong:** A user clicks the demo action, sees it "succeed" instantly (optimistic render), then a moment later it silently reverts with no explanation — reads as a broken/buggy demo rather than an intentional teaching moment about rollback.
**Why it happens:** `useOptimistic`'s automatic revert is a *rendering* behavior only; it does not include any built-in user-facing messaging.
**How to avoid:** Pair every rollback path with a visible (and `aria-live`-announced) error message so the failure is legible, not just a silent flicker. This is also the whole pedagogical point of the post — the demo should make the rollback moment obvious, not hide it.
**Warning signs:** Manual accessibility/UX testing shows the demo's failure state is indistinguishable from a rendering glitch.

### Pitfall 5: Automated accessibility scan treated as sufficient sign-off
**What goes wrong:** An axe/Lighthouse-only accessibility check passes, but the site still has real usability problems for screen reader / keyboard-only users (illogical focus order, unannounced dynamic content, TOC links unreachable by keyboard).
**Why it happens:** Automated scanners catch DOM-structural violations (missing alt text, contrast ratios, missing labels) but cannot evaluate reading order, announcement timing/quality, or whether an interaction is actually usable — this is exactly the gap STATE.md flags for this phase.
**How to avoid:** Run the manual verification workflow below (keyboard-only pass + one screen-reader pass) against all three new interactive surfaces before marking the phase verified. Automated scanning can supplement but not replace this.
**Warning signs:** Confidence in a11y based solely on "the CI a11y check is green."

## Code Examples

Verified patterns from official sources:

### `useOptimistic` minimal shape
```tsx
// Source: react.dev/reference/react/useOptimistic (fetched 2026-07-01)
const [optimisticState, setOptimistic] = useOptimistic(value, reducer?);
```

### Static params for a category segment
```tsx
// Source: nextjs.org/docs/app/api-reference/functions/generate-static-params (fetched 2026-07-01)
export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| Manual `isPending`/`error`/rollback state via `useState` + `useReducer` boilerplate | `useOptimistic` + `useActionState` (React 19) | React 19 stable release | Collapses what was previously ~30-40 lines of manual optimistic-update plumbing into a purpose-built hook with automatic revert semantics [CITED: multiple cross-checked sources, react.dev primary]. |
| `?query=` searchParams filtering on Next.js content sites | Dynamic path segments (`/category/[category]`) for known-finite filter dimensions, reserving `searchParams` for genuinely request-time state (pagination, sort on large dynamic datasets) | Established App Router guidance, reinforced by community reports of static-generation breakage | Preserves full static generation + per-filter SEO metadata on a site that is otherwise 100% statically generated. |

**Deprecated/outdated:**
- Scroll-position-based TOC highlighting via raw `scroll` event listeners with manual `getBoundingClientRect()` polling — superseded by `IntersectionObserver`, which is now broadly supported and is the current recommended approach across every source consulted.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The exact GitHub-flavored slugification algorithm `rehype-slug` uses (lowercase, strip punctuation, hyphenate, dedupe with `-1`/`-2` suffixes) will match a hand-written or `github-slugger`-based extraction in `lib/toc.ts` closely enough for anchor links to resolve correctly for all real post headings. | Architecture Patterns §4 (Pitfall 2) | If wrong for a specific heading (e.g. one with adjacent punctuation or an inline code span), that one TOC link would silently fail to scroll to the right target — low severity, easily caught by a manual click-through of every TOC link during verification, explicitly called out as a verify-at-implementation-time step above. |
| A2 | Client-side tag chip filtering (Pattern 3) is an acceptable interpretation of "Claude's discretion" for PATT-04's tag-browsing requirement, versus a dedicated `/patterns/tag/[tag]` static route. | Architecture Patterns §3 | If the user actually wanted deep-linkable tag URLs, this under-delivers slightly on shareability — low risk since CONTEXT.md explicitly frames this as Claude's discretion and the data-layer helper (`getPatternsByTag()`) supports either UI without rework. |
| A3 | NVDA+Firefox on Windows is the appropriate single screen-reader pairing for this project's manual a11y verification, given the stated dev environment is Windows 11. | Verification Architecture / Manual A11y Workflow | If the author also wants a macOS/VoiceOver+Safari pass (common practice for broader AT coverage), the recommended workflow under-covers — flagged explicitly as an open question below rather than silently assumed as sufficient. |
| A4 | `rehype-pretty-code`'s Shiki peer range (confirmed `^1.0.0 || ^2.0.0 || ^3.0.0 || ^4.0.0` per Phase 1 STATE.md resolution) remains compatible and requires no re-verification for Phase 2 — no code touching the Shiki pipeline is planned this phase. | Standard Stack | Negligible — Phase 2 makes no changes to the syntax-highlighting pipeline; this is inherited, not newly assumed. |

**If this table is empty:** N/A — see entries above; all are low-to-moderate risk and each has an explicit mitigation or is flagged as an open question.

## Open Questions (RESOLVED)

1. **Should the manual accessibility pass include macOS/VoiceOver in addition to NVDA/Windows?**
   - What we know: The dev environment is confirmed Windows 11 (per env metadata); NVDA+Firefox is a well-established, low-cost single-platform manual testing pairing.
   - What's unclear: Whether the author has access to a Mac for a VoiceOver pass, and whether project scope expects multi-AT coverage for a single-author blog at this stage.
   - Recommendation: Default the phase's manual verification workflow to NVDA+Firefox (Windows-native, zero additional setup) as the required minimum; note VoiceOver+Safari as an optional supplementary pass if a Mac is available, not a blocking requirement for phase completion.

2. **Should tag filtering get its own static route tree (`/patterns/tag/[tag]`) now, or is the client-side chip filter (Pattern 3) sufficient for v1?**
   - What we know: CONTEXT.md explicitly delegates this choice to Claude's discretion; only 2 posts and a small number of tags exist at this phase's content scale.
   - What's unclear: Whether future phases (with more Pattern posts) will retroactively want tag deep-linking, making the client-filter choice a to-be-revisited decision rather than a permanent one.
   - Recommendation: Ship the client-side chip filter for v1 (simpler, one less route tree to maintain at 2 posts), but keep `getPatternsByTag()` as a proper exported helper in `lib/content.ts` so a future `/patterns/tag/[tag]` route can be added without touching the data layer.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js / npm | Build, all phase work | ✓ | (project already scaffolded and building per Phase 1) | — |
| Playwright | Automated smoke/validation tests | ✓ | 1.61.1 | — |
| NVDA (Windows screen reader) | Manual accessibility verification workflow | Not verified this session — assumed installable (free, Windows-native) | — | If unavailable, Windows Narrator (built into Windows 11, no install needed) is an acceptable same-session fallback for the keyboard+announcement-quality checks, though NVDA has broader real-world usage share and is preferred when available. |
| A modern browser with `IntersectionObserver` support (Chrome/Firefox/Edge/Safari, all current versions) | TOC scroll-spy | ✓ (near-universal browser support; no polyfill needed for a 2026-era target) | — | — |

**Missing dependencies with no fallback:** none.

**Missing dependencies with fallback:** NVDA installation not verified this session — Windows Narrator is a viable same-machine fallback if NVDA setup is skipped.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright 1.61.1 (already configured, `tests/` directory, `npm test`) |
| Config file | `playwright.config.ts` (existing, runs against production build on `localhost:3000`) |
| Quick run command | `npx playwright test tests/patterns-demo.spec.ts` (new file, once created) |
| Full suite command | `npm run build && npm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|---------------------|-------------|
| PATT-02 | Demo click updates UI optimistically, then either confirms or shows a visible rollback/error state | smoke (Playwright, click + assert DOM text change) | `npx playwright test tests/patterns-demo.spec.ts -g "optimistic demo"` | ❌ Wave 0 |
| PATT-02 | Demo is keyboard-operable (button reachable via Tab, activatable via Enter/Space) | manual (keyboard-only pass) | — | ❌ Wave 0 — checklist item |
| PATT-04 | `/patterns/category/components` and `/patterns/category/behaviours` return 200 and list only posts in that category | smoke (Playwright, request assertions like existing `feed.spec.ts` style) | `npx playwright test tests/patterns-category.spec.ts` | ❌ Wave 0 |
| PATT-04 | `/patterns/category/nonsense` returns 404 | smoke | `npx playwright test tests/patterns-category.spec.ts -g "404"` | ❌ Wave 0 |
| PATT-04 | Tag filter (if client-side) narrows the visible list when a tag chip is clicked | smoke (Playwright, click + assert list length changes) | `npx playwright test tests/patterns-tag-filter.spec.ts` | ❌ Wave 0 |
| SITE-04 | TOC renders a link per heading; clicking a link scrolls to/activates the matching heading id | smoke (Playwright, click + assert URL hash or scroll position) | `npx playwright test tests/patterns-toc.spec.ts` | ❌ Wave 0 |
| SITE-04 | Active heading highlight updates on scroll (scroll-spy) | manual (visual check — brittle to assert reliably headless) | — | manual-only, justified: scroll-timing-dependent `IntersectionObserver` behavior is flaky in headless CI per Phase 1's own precedent (`smoke.spec.ts` already treats theme-flash timing as manual-only for the same reason) |
| PATT-02 (a11y) | `aria-live` region announces rollback/success to screen readers | manual (screen reader pass, NVDA+Firefox) | — | manual-only, justified: announcement *quality/timing* cannot be reliably asserted via DOM inspection alone |

### Sampling Rate
- **Per task commit:** `npx playwright test <relevant-spec-file>` (fast, scoped)
- **Per wave merge:** `npm run build && npm test` (full suite, matches existing Phase 1 practice)
- **Phase gate:** Full suite green + manual accessibility checklist (below) completed before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `tests/patterns-demo.spec.ts` — covers PATT-02 (optimistic demo interaction)
- [ ] `tests/patterns-category.spec.ts` — covers PATT-04 (category routes + 404 handling)
- [ ] `tests/patterns-tag-filter.spec.ts` — covers PATT-04 (tag filter, if client-side chip approach chosen)
- [ ] `tests/patterns-toc.spec.ts` — covers SITE-04 (TOC link presence + click-to-scroll)
- [ ] No new framework/config install needed — Playwright already configured project-wide.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|----------------|---------|-------------------|
| V2 Authentication | No | No auth surface in this phase — no login, no user accounts. |
| V3 Session Management | No | No sessions introduced. |
| V4 Access Control | No | All new routes (`/patterns/category/[category]`) are public, statically generated, read-only content — same trust model as existing `/patterns/[slug]`. |
| V5 Input Validation | Yes | The `category` route param must be validated against the fixed enum (`["components", "behaviours", "engineering", "ux"]`) before use, calling `notFound()` on mismatch — mirrors the existing `getPatternBySlug()` `notFound()` pattern in `app/patterns/[slug]/page.tsx`. No user-supplied free text is rendered anywhere in this phase (tag filter operates over author-controlled frontmatter values, not arbitrary user input). |
| V6 Cryptography | No | No cryptographic operations in this phase. |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|------------------------|
| Category route param used to construct a file path or query without validation (path traversal / injection via route param) | Tampering | Validate `category` against the fixed enum before any lookup; `notFound()` on mismatch. Since `getPatternsByCategory()` filters an in-memory array (not a filesystem/DB query built from the param), traversal risk is inherently low here, but explicit enum validation is still standard practice and cheap. |
| `dangerouslySetInnerHTML` misuse if TOC or demo content ever renders user-supplied text | Tampering / Injection | Not applicable this phase — no new `dangerouslySetInnerHTML` usage is planned; TOC heading text comes from author-controlled MDX content (same trust boundary as the existing JSON-LD injection in `app/patterns/[slug]/page.tsx`, which Phase 1's threat model already accepted as safe for author-controlled, build-time-known data). |
| Simulated "network" failure in the demo accidentally leaking a real error object (e.g. stack trace) into the visible UI | Information Disclosure | The demo's simulated rejection should throw/reject with a deliberately authored, generic message (e.g. `"Update failed — please try again"`), never `error.stack` or any internal detail, since this is demo/teaching code a reader may copy verbatim. |

## Sources

### Primary (HIGH confidence)
- `npm view react version` / `npm view next version` — direct registry lookups confirming installed versions are current (no drift beyond patch level) — [VERIFIED: npm registry]

### Secondary (MEDIUM confidence)
- [react.dev/reference/react/useOptimistic](https://react.dev/reference/react/useOptimistic) — fetched directly via WebFetch, official React docs — `useOptimistic` signature, parameters, return shape, transition requirement, minimal example — [CITED: react.dev/reference/react/useOptimistic]
- [nextjs.org/docs/app/api-reference/functions/generate-static-params](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) — fetched directly via WebFetch, official Next.js docs (v16.2.9-versioned page, matches installed version) — `generateStaticParams` signature, single/multiple dynamic segments, `notFound()`/`dynamicParams` interplay — [CITED: nextjs.org/docs/app/api-reference/functions/generate-static-params]
- WebSearch: "Next.js searchParams pagination prevents ISR / static generation" cross-checked against GitHub discussion #58884 and Vercel Academy `params vs searchParams` guidance — [CITED: multiple official/semi-official sources, cross-checked]

### Tertiary (LOW confidence)
- WebSearch: React 19 `useOptimistic` rollback behavior (multiple blog posts: freeCodeCamp, DEV Community, SitePoint) — used to corroborate but not as primary source; primary claims sourced from the react.dev WebFetch instead — [ASSUMED — cross-checked against MEDIUM-confidence primary source above, residual risk low]
- WebSearch: table-of-contents `IntersectionObserver` scroll-spy pattern (CSS-Tricks, LogRocket, tj.ie, benfrain.com) — pattern synthesized from multiple independent implementations, not from a single official spec — [ASSUMED]
- WebSearch: manual accessibility testing workflow / NVDA+Firefox, VoiceOver+Safari pairing recommendation — general industry guidance, not project-specific — [ASSUMED]
- WebSearch: ARIA live region politeness levels and DOM-presence timing — cross-checked against MDN's ARIA live regions guide title appearing in search results, but not directly WebFetched this session — [ASSUMED, MDN is authoritative if independently verified before implementation]
- WebSearch: `next-mdx-remote/rsc` client-component-inside-MDX-body support — general community confirmation (GitHub discussions, npm README), not independently WebFetched this session; however this is not new information — Phase 1's `01-RESEARCH.md` already established this pattern and Phase 1 code already proves it works (`Callout` is a registered MDX component today) — [ASSUMED, but corroborated by working Phase 1 code]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero new dependencies; all versions directly verified against npm registry.
- Architecture (useOptimistic, generateStaticParams): MEDIUM-HIGH — both core APIs fetched directly from official docs (react.dev, nextjs.org) this session.
- Architecture (TOC scroll-spy, tag filter UX): MEDIUM — pattern is well-established web development practice, cross-checked across multiple independent sources, but not sourced from a single canonical spec/doc.
- Pitfalls: MEDIUM — grounded in the official API docs (Pitfall 1, 3) plus one carried-forward precedent from Phase 1's own STATE.md/RESEARCH.md (Pitfall 5, the automated-a11y-insufficiency finding already flagged by the user before this research pass).
- Security: MEDIUM — ASVS mapping is straightforward for this phase's low-risk, no-auth, no-user-input surface; reasoning is sound but not independently cross-checked against an ASVS reference document this session.

**Research date:** 2026-07-01
**Valid until:** 2026-07-31 (30 days — stack is stable; React/Next.js minor-version drift unlikely to invalidate these specific API patterns within that window, per this project's own "30 days for stable" convention)
