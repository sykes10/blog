# Architecture Research

**Domain:** Next.js + MDX technical blog with embedded interactive React demos (two content tracks: Building Blocks, Anatomy of X)
**Researched:** 2026-06-29
**Confidence:** MEDIUM (cross-checked across official Next.js docs, multiple independent tutorials, and library maintainer sources; no single-source claims used for architectural decisions)

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         CONTENT LAYER (build-time)                    │
├──────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐   ┌───────────────────┐   ┌──────────────────┐    │
│  │ content/      │   │ content-collections │  │ Zod schemas      │    │
│  │ building-     │──▶│ (defineCollection,  │─▶│ (frontmatter:    │    │
│  │ blocks/*.mdx  │   │  compileMDX)        │  │  title, track,   │    │
│  │ content/      │   │                     │  │  relatedPosts,   │    │
│  │ anatomy/*.mdx │   │                     │  │  tags, demo refs)│    │
│  └──────────────┘   └─────────┬───────────┘   └──────────────────┘    │
├────────────────────────────────┴──────────────────────────────────────┤
│                    MDX RENDERING PIPELINE (server, RSC)               │
├──────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────┐   ┌─────────────────────────────────────┐    │
│  │ app/[track]/[slug]/  │  │  mdx-components.tsx (global map)    │    │
│  │ page.tsx             │─▶│  + per-render components prop       │    │
│  │ (generateStaticParams)│ │  (demo registry lookup)             │    │
│  └────────────────────┘   └──────────────┬──────────────────────┘    │
├────────────────────────────────────────────┴──────────────────────────┤
│         DEMO COMPONENT REGISTRY (client islands, "use client")        │
├──────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────────┐  │
│  │ Button    │  │ Input     │  │ Booking   │  │ ChatInterface       │  │
│  │ Demo      │  │ Demo      │  │ Demo      │  │ Demo (Anatomy)      │  │
│  │ (Building │  │ (Building │  │ (Anatomy  │  │                      │  │
│  │  Blocks)  │  │  Blocks)  │  │  of X)    │  │                      │  │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────────┘  │
├──────────────────────────────────────────────────────────────────────┤
│              SITE SHELL / LAYOUT (server, mostly static)              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────────┐  │
│  │ RootLayout    │ │ Track index   │ │ Cross-link / "Related Posts" │  │
│  │ (nav, theme)  │ │ pages (list   │ │ component (reads frontmatter │  │
│  │               │ │ per track)    │ │ relatedPosts/tags)            │  │
│  └──────────────┘ └──────────────┘ └──────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Content source files | Hold the actual prose + frontmatter metadata per post | `.mdx` files under `content/building-blocks/*.mdx` and `content/anatomy-of-x/*.mdx`, one file per post |
| Content layer (content-collections) | Parse frontmatter, validate with schema, compile MDX to a renderable tree at build time, expose typed post objects to the app | `content-collections` package (`defineCollection` + `compileMDX`), config in `content-collections.ts` at repo root |
| MDX rendering pipeline | Take a compiled post and render it as a page, injecting the right component map | `app/[track]/[slug]/page.tsx` + root `mdx-components.tsx` (global) + per-page `components` prop (registry) |
| Demo component registry | Single source of truth mapping a component *name* (used in MDX) to its real React implementation | `components/demos/index.tsx` exporting a `{ [name]: Component }` map, imported wherever MDX is rendered |
| Demo components (client islands) | Actual interactive implementations — the things being taught | `components/demos/Button/*.tsx`, `"use client"` at the top, self-contained, no dependency on page-level state |
| Cross-linking / taxonomy system | Connect Anatomy of X posts back to the Building Blocks posts they build on; list related posts within a track | Frontmatter fields (`relatedPosts: string[]`, `tags: string[]`, `track: "building-blocks" | "anatomy-of-x"`) resolved into typed links by content layer, rendered by a shared `<RelatedPosts>` component |
| Site shell / layout | Navigation, theme, per-track index pages, global chrome | `app/layout.tsx`, `app/building-blocks/page.tsx`, `app/anatomy-of-x/page.tsx` — server components, no client JS needed |

## Recommended Project Structure

```
/
├── content/
│   ├── building-blocks/
│   │   ├── button.mdx              # frontmatter: title, slug, tags, demoComponents
│   │   ├── input.mdx
│   │   └── ...
│   └── anatomy-of-x/
│       ├── booking-system.mdx      # frontmatter: relatedPosts: ["button","input"]
│       ├── llm-chat-interface.mdx
│       └── ...
├── content-collections.ts          # collection + Zod schema definitions, compileMDX config
├── components/
│   ├── demos/                      # the live, interactive components MDX renders
│   │   ├── index.ts                # registry: export const demoRegistry = { Button: ButtonDemo, ... }
│   │   ├── Button/
│   │   │   ├── ButtonDemo.tsx      # "use client" — the actual demo
│   │   │   └── ButtonDemo.module.css (or Tailwind classes)
│   │   ├── Input/
│   │   └── Booking/
│   ├── mdx/                        # MDX-typography components (Callout, CodeBlock, etc.)
│   │   ├── Callout.tsx
│   │   └── CodeBlock.tsx           # syntax highlighting for the static-code-example path
│   ├── content/                    # cross-linking / listing UI
│   │   ├── RelatedPosts.tsx
│   │   ├── PostCard.tsx
│   │   └── TrackNav.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── content.ts                  # helpers: getAllPosts(), getPostBySlug(), resolveRelated()
│   └── mdx-components.tsx          # merges mdx/ typography components + demos/ registry for render
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # homepage — could surface both tracks
│   ├── building-blocks/
│   │   ├── page.tsx                # track index/listing
│   │   └── [slug]/
│   │       └── page.tsx            # generateStaticParams + render
│   └── anatomy-of-x/
│       ├── page.tsx
│       └── [slug]/
│           └── page.tsx
├── mdx-components.tsx              # root-level required file (App Router convention)
└── next.config.ts                  # @next/mdx config (if used) + content-collections plugin wiring
```

### Structure Rationale

- **`content/<track>/`:** Splitting by track at the directory level (rather than a flat `content/posts/` with a `track` field only) makes the two-track structure visible in the filesystem and lets each track evolve its own frontmatter shape later without touching the other. The `track` field is still kept in frontmatter for typed querying.
- **`components/demos/` separate from `components/mdx/`:** Demos are the *subject matter* (what posts teach) and change per-post; `mdx/` components are *typography/presentation infrastructure* (callouts, code blocks) shared by every post. Keeping them in separate folders prevents the registry from being polluted by unrelated UI components.
- **`components/demos/index.ts` as a single registry:** This is the one file that maps a string name (used inside MDX as `<ButtonDemo />`) to the real implementation. It is the seam the roadmap should plan around — every new Building Blocks post that needs a live demo touches this file plus one new component folder, and nothing else.
- **`lib/mdx-components.tsx` vs root `mdx-components.tsx`:** The root file is a Next.js App Router *requirement* (must exist at that exact path, exports `useMDXComponents`) and should stay a thin re-export of the real logic in `lib/` to keep business logic testable and out of a framework-mandated file.
- **`lib/content.ts`:** Centralizes "get me all posts," "get me this slug," "resolve related posts," so page components stay thin and the cross-linking logic isn't duplicated between the two track route trees.

## Architectural Patterns

### Pattern 1: Content layer via content-collections (not raw fs reads, not Contentlayer)

**What:** Use `content-collections` to declare typed collections over `content/building-blocks/*.mdx` and `content/anatomy-of-x/*.mdx`, with a Zod schema validating frontmatter (title, slug, tags, relatedPosts, demoComponents) and `compileMDX` producing a render-ready body.
**When to use:** Any MDX-in-repo site that wants type-safe frontmatter and avoids hand-rolling `fs.readdir` + `gray-matter` + manual MDX compilation.
**Trade-offs:** Adds a build step and a config file (`content-collections.ts`); in exchange you get compile-time validation (a malformed `relatedPosts` entry fails the build, not silently breaks a link) and typed imports (`import { allPosts } from "content-collections"`).

**Example:**
```typescript
// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

const posts = defineCollection({
  name: "posts",
  directory: "content",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    track: z.enum(["building-blocks", "anatomy-of-x"]),
    tags: z.array(z.string()).default([]),
    relatedPosts: z.array(z.string()).default([]), // slugs of Building Blocks posts
    demoComponents: z.array(z.string()).default([]), // names looked up in the registry
  }),
  transform: async (doc, ctx) => ({
    ...doc,
    body: await compileMDX(ctx, doc),
  }),
});

export default defineConfig({ collections: [posts] });
```

### Pattern 2: Demo component registry, resolved at render time

**What:** Author MDX with a plain component reference (`<ButtonDemo variant="primary" />`); resolve that name against a central registry object passed into the MDX renderer's `components` prop, rather than each `.mdx` file importing its own demo component directly.
**When to use:** Whenever an interactive, real implementation should be embeddable by name inside content, and the same demo might be reused or referenced from more than one post (e.g. an Anatomy of X post could re-embed the same `ButtonDemo` it cross-links to).
**Trade-offs:** Slightly more indirection than a direct `import` in the MDX file. In exchange: the registry is the single place that knows "what demos exist," it's easy to audit, and it cleanly separates "static code block" posts (no registry entry needed) from "live demo" posts (reference a registry key) — which matches the project's stated case-by-case decision per post.

**Example:**
```tsx
// components/demos/index.ts
import { ButtonDemo } from "./Button/ButtonDemo";
import { InputDemo } from "./Input/InputDemo";

export const demoRegistry = {
  ButtonDemo,
  InputDemo,
} as const;

// lib/mdx-components.tsx
import { demoRegistry } from "@/components/demos";
import { Callout } from "@/components/mdx/Callout";

export function getMDXComponents() {
  return { ...demoRegistry, Callout };
}

// app/building-blocks/[slug]/page.tsx
import { MDXContent } from "@content-collections/mdx/react";
import { getMDXComponents } from "@/lib/mdx-components";

export default function Page({ post }) {
  return <MDXContent code={post.body} components={getMDXComponents()} />;
}
```

### Pattern 3: Islands architecture — server-rendered prose, client-island demos

**What:** The MDX prose itself renders as a React Server Component (zero client JS for the article body). Only the specific demo components are marked `"use client"`, and they are kept leaf-like — no demo component should require lifting state up into the page or into MDX itself.
**When to use:** Always, for this project. It directly matches the stated architectural implication in PROJECT.md ("islands of interactivity even on otherwise static/content-heavy pages").
**Trade-offs:** Requires discipline to keep `"use client"` boundaries small — if a demo component imports something that transitively imports a large client-only dependency, that cost is paid by every page embedding it. Keep demo components self-contained (manage their own local state with `useState`, don't reach into server data without an explicit fetch/props boundary).

**Example:**
```tsx
// components/demos/Button/ButtonDemo.tsx
"use client";
import { useState } from "react";

export function ButtonDemo() {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      aria-pressed={pressed}
      onClick={() => setPressed((p) => !p)}
      className="rounded-md px-4 py-2 ..."
    >
      {pressed ? "Pressed" : "Press me"}
    </button>
  );
}
```

## Data Flow

### Build-Time Flow (static generation)

```
.mdx file (content/building-blocks/button.mdx)
    ↓ (file watcher / build step)
content-collections: parse frontmatter → validate via Zod → compileMDX
    ↓
typed Post object { title, track, tags, relatedPosts, demoComponents, body }
    ↓ (imported by route)
app/[track]/[slug]/page.tsx: generateStaticParams() enumerates all posts
    ↓ (per route, at build time)
page.tsx renders <MDXContent code={post.body} components={getMDXComponents()} />
    ↓
MDXContent resolves each JSX tag in body against components map:
    - known HTML tag → styled via mdx-components.tsx global map
    - <ButtonDemo /> → resolved from demoRegistry → client island boundary
    ↓
Static HTML out (RSC payload), client JS bundle contains ONLY the demo islands
```

### Cross-Linking Flow

```
Anatomy of X post frontmatter: relatedPosts: ["button", "input"]
    ↓
lib/content.ts: resolveRelated(post) looks up each slug against
  the Building Blocks collection (typed, build-time safe — broken
  slug reference fails the build, doesn't 404 silently in prod)
    ↓
<RelatedPosts posts={resolved} /> rendered in Anatomy of X page,
  linking back to app/building-blocks/[slug]
    ↓
(Optional, future) Building Blocks post could expose a reciprocal
  "Used in: Anatomy of X / Booking System" backlink, computed by
  inverting the relatedPosts graph at build time in lib/content.ts
```

### Key Data Flows

1. **Content → Page:** MDX file frontmatter and body flow through content-collections' schema/compile step exactly once at build time; nothing about content parsing happens at request time, which keeps every post page a fully static route.
2. **Demo reference → Live component:** A string component name in MDX (`<ButtonDemo />`) is resolved against the registry object at render time, not at file-write time — this indirection is what lets the registry be the single owned seam for "what demos exist," and it is the most build-order-relevant decision: the registry must exist before any post can reference a demo.
3. **Cross-link slug → Resolved post:** `relatedPosts` frontmatter holds slugs, not URLs or duplicated titles — resolution to title/URL happens once in `lib/content.ts`, so renaming a Building Blocks post's slug only requires updating frontmatter references, not hunting for hardcoded links in prose.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| ~10-30 posts (v1 target) | Current structure is sufficient. Single `content-collections.ts`, flat per-track directories, manual `relatedPosts` frontmatter curation. |
| 30-100 posts | Consider splitting `content-collections.ts` schema per track if frontmatter diverges; introduce a lightweight tag index page; still no CMS needed. |
| 100+ posts / multi-author | Out of scope per PROJECT.md (single author, no CMS planned) — if ever revisited, this is the point to evaluate a headless CMS, but that is an explicit non-goal for this project. |

### Scaling Priorities

1. **First "bottleneck" (not a technical one):** Manually curating `relatedPosts` cross-links does not scale past a few dozen posts without a lightweight script to validate that every reference resolves (content-collections' Zod validation only confirms shape, not that the slug exists in the other collection — add a `transform`-time check or a small build script that errors on dangling references).
2. **Second consideration:** As more demo components accumulate, the registry file (`components/demos/index.ts`) grows linearly but stays trivial to navigate; no architectural change needed unless demo count reaches the point where lazy-loading individual demos (dynamic `import()` per registry entry) becomes worthwhile for bundle size — not a v1 concern at this post count.

## Anti-Patterns

### Anti-Pattern 1: Importing demo components directly inside each MDX file

**What people do:** `import { ButtonDemo } from "../../components/demos/Button/ButtonDemo"` at the top of every `.mdx` file that needs it.
**Why it's wrong:** MDX import statements work with `@next/mdx` page-based MDX but couple content files tightly to component file paths, make it harder to audit "what demos exist across the site," and break if using a content-layer tool (like content-collections) that compiles MDX as data rather than as a page module — import statements in MDX are a known limitation area for several pipelines.
**Do this instead:** Use the registry + `components` prop pattern (Pattern 2 above). Content files stay declarative (`<ButtonDemo />`), the registry is the only place that knows real file paths.

### Anti-Pattern 2: Treating "Anatomy of X" posts as a flat list with manual prose links to Building Blocks

**What people do:** Write `[see the Button post](/building-blocks/button)` as a plain markdown link inline in prose, with no structured frontmatter backing it.
**Why it's wrong:** These links rot silently — renaming a slug doesn't break the build, it just produces a dead link in production. There's also no way to programmatically render a "Related Building Blocks" section or compute reciprocal backlinks.
**Do this instead:** Model cross-links as structured frontmatter (`relatedPosts: ["button"]`) resolved by `lib/content.ts` at build time, validated against the actual collection so a typo fails the build. Inline prose links remain fine for *flavor text* but should not be the only mechanism for the architecturally important Anatomy → Building Blocks relationship the project depends on (per PROJECT.md requirement).

### Anti-Pattern 3: Making the entire post page a Client Component because one demo needs interactivity

**What people do:** Add `"use client"` to the top of `app/building-blocks/[slug]/page.tsx` because the page contains a demo, rather than isolating `"use client"` to the demo component itself.
**Why it's wrong:** This ships the entire article's rendering logic (and anything else the page imports) to the client, defeating the static-content benefit of Server Components and inflating the JS bundle for content that doesn't need it.
**Do this instead:** Keep the page component a Server Component; only the leaf demo component(s) carry `"use client"`. This is the islands-architecture pattern (Pattern 3) and is the single most important architectural rule for this project given the stated requirement of "live demos embedded in otherwise static long-form articles."

### Anti-Pattern 4: Picking Contentlayer as the content layer

**What people do:** Follow older (pre-2024) tutorials that recommend Contentlayer for Next.js + MDX.
**Why it's wrong:** Contentlayer has been effectively unmaintained since its main sponsor (Stackbit) was acquired by Netlify — multiple independent sources confirm this. Starting a greenfield project on an abandoned dependency creates avoidable maintenance risk.
**Do this instead:** Use `content-collections` (closer Next.js/RSC integration story, actively maintained, Zod-based) or `velite` (lighter-weight, framework-agnostic, also actively maintained) as the content layer.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| None required for v1 | — | No CMS, no database — content lives in the git repo per explicit PROJECT.md constraint. Deployment target (e.g. Vercel) is a hosting decision, not an architectural dependency, and is out of scope for this document. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Content layer ↔ MDX rendering pipeline | Typed post objects (content-collections build output) imported directly — no runtime API call | Build-time only; a content change requires a rebuild, which is expected and acceptable for a git-committed-MDX site |
| MDX rendering pipeline ↔ Demo registry | `components` prop passed into the MDX renderer at each page | The registry is a plain object import; no dynamic discovery mechanism needed at this scale |
| Building Blocks track ↔ Anatomy of X track | Frontmatter `relatedPosts` slugs resolved through `lib/content.ts` | One-directional by default (Anatomy → Building Blocks); reciprocal backlinks are a build-time-computed inversion of the same data, not a separate system |
| Site shell/layout ↔ both tracks | Track index pages (`app/building-blocks/page.tsx`, `app/anatomy-of-x/page.tsx`) query the same typed collection, filtered by `track` field | Keeps listing logic in `lib/content.ts`, not duplicated per track |

## Sources

- [Guides: MDX | Next.js (official docs)](https://nextjs.org/docs/app/guides/mdx) — HIGH-confidence baseline for `@next/mdx` and `mdx-components.tsx` conventions
- [File-system conventions: mdx-components.js | Next.js (official docs)](https://nextjs.org/docs/app/api-reference/file-conventions/mdx-components)
- [Content Collections — MDX sample (official docs)](https://www.content-collections.dev/samples/mdx)
- [ContentLayer has been Abandoned - What are the Alternatives? — Wisp CMS](https://www.wisp.blog/blog/contentlayer-has-been-abandoned-what-are-the-alternatives)
- [Migrating from Contentlayer to Content Collections — Dub](https://dub.co/blog/content-collections)
- [Refactoring ContentLayer to Velite — Mike van Peeren](https://www.mikevpeeren.nl/blog/refactoring-contentlayer-to-velite)
- [Building a blog with Next.js App Router and MDX — Alex Chan](https://www.alexchantastic.com/building-a-blog-with-next-and-mdx)
- [Getting started with Next.js 15 and MDX — DEV Community](https://dev.to/ptpaterson/getting-started-with-nextjs-15-and-mdx-305k)
- [@mdx-js/react — MDX official docs](https://mdxjs.com/packages/react/) (MDXProvider / shortcodes pattern)
- [Markdown for the component era — MDX official site](https://mdxjs.com/)
- [Getting Started: Server and Client Components | Next.js (official docs)](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Client-Server Component Boundaries | Vercel Academy](https://vercel.com/academy/nextjs-foundations/client-server-boundaries)
- [Taxonomies for Technical Documentation — Hedden Information Management](https://www.hedden-information.com/taxonomies-for-technical-documentation/)
- [What Is a Content Taxonomy? A Practical Guide — Heretto](https://www.heretto.com/blog/taxonomy)
- [MDX Blog (v14 App router) with `[slug]` path structure — vercel/next.js Discussion #58575](https://github.com/vercel/next.js/discussions/58575)

**Confidence note:** All claims above are cross-checked against the official Next.js/MDX documentation plus at least one independent secondary source (tutorial, library maintainer post, or GitHub discussion). The one area carrying slightly lower certainty is the exact current API surface of `content-collections` (e.g. precise `compileMDX` signature) — verify against the live `content-collections.dev` docs at implementation time, since this is a smaller, faster-moving package than Next.js itself.

---
*Architecture research for: Next.js + MDX technical blog with embedded interactive demos*
*Researched: 2026-06-29*
