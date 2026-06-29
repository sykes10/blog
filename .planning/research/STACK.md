# Stack Research

**Domain:** Next.js + MDX technical blog with embedded live interactive React component demos and static code snippets
**Researched:** 2026-06-29
**Confidence:** MEDIUM-HIGH (versions verified directly against npm registry; architectural recommendations cross-checked across multiple independent sources, no single-source claims carried as fact)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.2.x (App Router) | Framework, routing, RSC, build/serve | Author's explicit choice (per PROJECT.md). Next.js 16 ships Turbopack stable by default, React Compiler stable, and a routing/prefetch overhaul — all relevant to a content-heavy site with islands of client interactivity. App Router's RSC-by-default model is the right fit: static post content (MDX prose, syntax-highlighted code) renders on the server with zero JS shipped, while only the interactive demo components opt into `"use client"`. |
| React | 19.2.x | UI runtime | Required peer of Next.js 16. React 19's Server Components + Actions model is what makes the "static page with islands of interactivity" architecture cheap — no extra framework needed to get partial hydration. |
| TypeScript | 5.x (use 5.7+; do **not** adopt the npm `typescript@6.0.3` tag blindly — confirm it's stable, not a prerelease tag, before pinning) | Type safety across content schemas, component props, MDX component registry | A single-author blog with a growing library of "Building Blocks" demo components benefits heavily from typed props on every embeddable component and typed frontmatter (via Zod-validated content schemas, see below). |
| Tailwind CSS | 4.x (4.3+) | Styling | CSS-first config (`@theme` in CSS, no `tailwind.config.js` required), 5x faster full builds, 100x faster incremental builds. For a blog where prose typography and demo component styling both matter, the perf win and simpler theming model (no JS config drift) are worth adopting now rather than starting on v3 and migrating later. |

### Content Layer (MDX pipeline)

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| `next-mdx-remote` (`/rsc` entrypoint) | 6.0.0 | Compile MDX content stored in a `content/` directory into React elements at render time, on the server | **Use this, not `@next/mdx`.** v6.0.0 (published Feb 2026) is RSC-native: `<MDXRemote source={...} components={...} />` is an async Server Component, built on MDX v3, with React 19 support. This decouples content (`content/posts/*.mdx`, `content/components/*.mdx`) from route structure (`app/posts/[slug]/page.tsx`), which matters because this project has two distinct tracks (Building Blocks, Anatomy of X) that need shared layout/cross-linking logic the route file can own rather than duplicating per MDX file. |
| `velite` | 0.4.0 | Type-safe content collection layer: validates frontmatter with Zod, generates typed data + `.d.ts`, watches `content/` in dev | **Use this over Contentlayer (confirmed abandoned) and as the first choice over `content-collections`.** Velite turns your `content/` directory into a typed, validated data layer at build time — define a Zod schema per collection (`posts`, `buildingBlocks`, `anatomy`), get full TypeScript autocomplete for frontmatter (title, slug, tags, crossLinks, hasLiveDemo, etc.) with zero runtime cost. Framework-agnostic and lightweight (fewer runtime deps than the alternatives), which fits a single-author repo with no need for a heavier plugin/adapter ecosystem. |
| `@content-collections/core` + `@content-collections/next` | 0.15.x | Alternative content collection layer | **Viable alternative, not the default pick** — see Alternatives below. |
| `zod` | 4.x | Schema validation for frontmatter (used internally by Velite, also reusable for any client-side validation, e.g. future contact/comment forms) | Already a dependency of Velite; declaring it directly avoids surprises on a major-version bump and lets you write your own schemas (e.g. typing the `relatedBuildingBlocks: string[]` cross-link field called out in PROJECT.md). |

### Code Highlighting

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| `shiki` | 1.x or 4.x pinned (verify exact peer range required by `rehype-pretty-code` 0.14.3, which targets `shiki ^1.0.0` — do not blindly install `shiki@latest` without checking this) | Syntax highlighting engine | Shiki uses the same TextMate grammar engine as VS Code, giving accurate JSX/TSX highlighting — directly relevant since every Building Blocks post embeds React/TSX snippets. Prism (the historical default) has had stalled v2 development since August 2022 and materially weaker JSX fidelity. |
| `rehype-pretty-code` | 0.14.3 | Rehype plugin wrapping Shiki for Markdown/MDX pipelines | Build-time highlighting (no client JS shipped for code blocks), supports line highlighting (`{1,3-5}` syntax), word highlighting, and a transformer pipeline (`@rehype-pretty/transformers` adds a copy-button transformer out of the box). This is the de facto standard rehype plugin for Shiki+MDX as of 2025/2026 — confirmed via multiple independent technical blog writeups and its active GitHub release cadence. |
| `@rehype-pretty/transformers` | latest matching `rehype-pretty-code` 0.14.x | Adds copy-to-clipboard button transformer to code blocks | Avoids hand-rolling a copy button via a client component wrapped around every `<pre>` — ships as a Shiki transformer instead. |

### Supporting Remark/Rehype Plugins

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `remark-gfm` | 4.0.1 | GitHub-Flavored Markdown (tables, strikethrough, task lists, autolinks) | Always — technical writing regularly needs tables (e.g. comparing approaches) and the Anatomy of X posts will likely need task-list-style breakdowns. |
| `rehype-slug` | 6.0.0 | Auto-generates `id` attributes on headings | Always — needed for in-page anchor links and a future table-of-contents component on long Anatomy of X posts. |
| `rehype-autolink-headings` | 7.1.0 | Wraps heading text in a self-link `<a>` for deep-linking | Always — pairs with `rehype-slug`; lets readers/hiring managers link directly to a specific section of a long architecture breakdown. |

### Interactive Demo Embedding (the core differentiator of this blog)

| Approach | Purpose | When to Use |
|---------|---------|-------------|
| **Component registry via `mdx-components.tsx`** (the file Next.js requires at the project root for App Router MDX) | Map MDX-usable tags directly to *real* implementations of the components being taught (e.g. `<Button>`, `<Input>`) | **This is the primary mechanism — use it for nearly all "live interactive demo" requirements in PROJECT.md.** The `useMDXComponents()` export returns an object mapping tag names to components; register your actual design-system component (not a sandboxed copy) so the live demo IS the real, production component. Demo wrapper components (e.g. `<ButtonDemo variant="primary" />` that renders the real `<Button>` plus interactive controls to flip props) must be marked `"use client"` since they need state/event handlers — MDX content itself stays a Server Component, so only the small demo islands hydrate. This directly satisfies the "islands of interactivity even on otherwise static/content-heavy pages" architecture implication flagged in PROJECT.md. |
| `@codesandbox/sandpack-react` | Full editable/runnable code sandbox embedded inline (multi-file, npm deps, bundler in-browser) | **Reserve for Anatomy of X posts only, and only if/when a full runnable mini-app demo (e.g. a simplified booking flow) earns its complexity/bundle-size cost.** This is what react.dev uses for its docs, so it is a credible, well-maintained choice — but it ships a real bundler to the client and is heavier than this blog needs for component-level demos. |
| `react-live` | Lightweight live-editable single-snippet preview (type code, see render update) | Only if a later requirement emerges for "let the reader edit this snippet and see it update live" on a Building Block post. Not needed for the v1 requirement set (demos are author-curated, not reader-editable per PROJECT.md's scope). |

**Recommendation: do not adopt Sandpack or react-live for v1.** PROJECT.md's actual requirement is "live interactive demo where it adds value, static code + screenshots otherwise" — that is satisfied entirely by the component-registry pattern (real components rendered live with prop controls), which is simpler, faster, and ships less client JS than either sandboxing library. Revisit Sandpack specifically if/when an Anatomy of X post needs a runnable multi-file mini-app rather than a single component demo.

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `eslint` + `eslint-config-next` | Linting, kept in sync with Next.js version | Ships via `create-next-app`; keep it. |
| `@next/eslint-plugin-next` | Next.js-specific lint rules (e.g. catches `<img>` instead of `next/image`, App Router pitfalls) | Bundled with the above config in recent `create-next-app` scaffolds. |
| Vercel (or equivalent static-friendly host) | Deployment | Not strictly required research, but worth noting: a fully static/MDX-in-repo blog with no CMS fits zero-config deployment on Vercel; ISR/ on-demand revalidation is unnecessary here since content only changes via git commits and redeploys. |

## Installation

```bash
# Scaffold (App Router, TypeScript, Tailwind, ESLint)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-turbopack=false

# MDX rendering (RSC-native)
npm install next-mdx-remote@^6.0.0

# Type-safe content collection layer
npm install velite@^0.4.0
npm install -D zod@^4.0.0

# Syntax highlighting pipeline
npm install rehype-pretty-code@^0.14.3 shiki@^1.0.0
npm install @rehype-pretty/transformers

# Markdown ecosystem plugins
npm install remark-gfm@^4.0.1 rehype-slug@^6.0.0 rehype-autolink-headings@^7.1.0

# (Only if/when a full runnable sandbox is needed for an Anatomy of X post)
npm install @codesandbox/sandpack-react@^2.20.0
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|--------------------------|
| `next-mdx-remote/rsc` + `velite` (content lives in `content/`, decoupled from routes) | `@next/mdx` (MDX files are the route pages directly, e.g. `app/posts/my-post/page.mdx`) | Use `@next/mdx` if you want zero content-layer abstraction and are fine with each post being its own route file under `app/`. This is simpler for a handful of posts but gets unwieldy once you need shared frontmatter-driven listing pages (e.g. an index of all Building Blocks posts with tags) — which this project needs from day one (two tracks, cross-linking). Decoupled content wins here. |
| `velite` | `@content-collections/core` + `@content-collections/next` | Choose `content-collections` if you want first-party Fumadocs-style adapters or if Velite's framework-agnostic build step proves awkward in your dev loop. Both are actively maintained, Zod-based, and roughly equivalent in capability as of this research; Velite is recommended as the slightly lighter, more framework-agnostic default, but this is a low-stakes choice — either is fine, and migration cost between them is low since both just produce typed JSON. |
| `rehype-pretty-code` (Shiki wrapper) | `@shikijs/rehype` directly | Use `@shikijs/rehype` if you want a thinner abstraction with fewer opinionated defaults and are comfortable building your own line/word-highlighting and copy-button logic. `rehype-pretty-code` is recommended because it bundles these common needs (line highlighting syntax, transformer ecosystem) that a technical blog with lots of annotated code snippets will use immediately. |
| Component-registry pattern for demos | Sandpack | See note above — Sandpack is the right call only when a demo needs to be a runnable multi-file mini-app rather than a live instance of a real component. |
| Tailwind CSS v4 | Tailwind CSS v3 | Use v3 only if a specific plugin or community theme you depend on hasn't migrated to v4's CSS-first config yet. For a greenfield project with no legacy Tailwind config, there is no reason to start on v3. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Contentlayer / `contentlayer` / `next-contentlayer` | Confirmed abandoned — last npm publish 2023-06-29 (verified directly against the npm registry), no releases since, maintainer publicly stated lack of funding. Known to break on newer Next.js App Router versions. Starting a new project on this in 2026 would mean building on dead infrastructure from day one. | `velite` or `@content-collections/core` |
| Prism (`prismjs`) as the primary highlighter | Development on Prism v2 has stalled since August 2022; weaker JSX/TSX grammar fidelity than Shiki, which matters heavily here since nearly every code snippet in this blog is React/TSX. | `shiki` via `rehype-pretty-code` |
| `next-mdx-remote`'s pre-v5 `serialize()`/`<MDXRemote>` client-rendering pattern, or `@mdx-js/react`'s `MDXProvider` context approach | RSC does not support React Context, so the old `MDXProvider`-context way of injecting custom components does not work in the App Router. Pre-v5 next-mdx-remote required a separate serialize step and forced the consuming page into being a Client Component, defeating the static/RSC-by-default benefit this project wants. | `next-mdx-remote/rsc` (v6, async Server Component, `components` prop passed directly to `<MDXRemote>`) |
| Building a custom live-code sandbox/bundler from scratch | High effort, high maintenance burden, for a problem (showing a real component live) that the MDX component-registry pattern already solves with far less code. | Component registry via `mdx-components.tsx`; reserve Sandpack only for the rare multi-file runnable demo |
| A headless CMS (Contentful, Sanity, etc.) | Explicitly out of scope per PROJECT.md — single-author git workflow with code demos embedded directly in content is the whole point; a CMS reintroduces a content/code separation this project is designed to avoid. | MDX files committed to the repo, validated by Velite |

## Stack Patterns by Variant

**If a Building Blocks post needs only a static code example (no live demo):**
- Use a fenced code block in MDX (` ```tsx `), rendered through the `rehype-pretty-code` pipeline.
- No client component, no hydration cost — fully static, server-rendered HTML.

**If a Building Blocks post needs a live interactive demo of a real component:**
- Build a small `"use client"` demo wrapper component (e.g. `ButtonDemo.tsx`) that imports and renders the actual production component plus whatever controls (variant switcher, disabled toggle) make sense.
- Register it in `mdx-components.tsx` (or import and use it directly inside the `.mdx` file as JSX — both work with `next-mdx-remote/rsc`).
- This is an island of interactivity inside an otherwise static page — exactly the architecture PROJECT.md anticipates.

**If an Anatomy of X post is architecture-only (per PROJECT.md, acceptable when the feature is too complex for a v1 demo):**
- No demo component needed at all — diagrams (could be plain images, or a component like `<ArchitectureDiagram />` if you want them interactive later) plus prose and static code snippets covering the key pieces.

**If an Anatomy of X post does include a working demo of a complex feature (e.g. a simplified booking flow):**
- This is the one case where Sandpack may be justified — a multi-file, runnable mini-app demo is a fundamentally different shape than a single-component demo.
- Default to a simpler hand-built `"use client"` demo component first; only reach for Sandpack if the demo genuinely needs to show multiple files/modules interacting.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|------------------|-------|
| `next@16.2.x` | `react@19.2.x`, `react-dom@19.2.x` | Next.js 16 requires React 19; do not pin React 18 — App Router RSC features used throughout this stack assume React 19. |
| `next-mdx-remote@6.0.0` | MDX v3, React 19, Next.js App Router only (no Pages Router support claimed for `/rsc` entrypoint) | If any part of the app must remain on the Pages Router, this combination does not apply — verify before mixing routers. |
| `rehype-pretty-code@0.14.3` | `shiki@^1.0.0` (peer range as published) | **Verify before installing `shiki@latest` (registry currently shows `shiki@4.3.0`).** If `rehype-pretty-code` 0.14.3 truly only supports the `^1.0.0` peer range, pin Shiki to a 1.x version explicitly (`npm install shiki@^1.0.0`) rather than letting npm resolve to the newest major. Confirm the actual supported range against the installed `rehype-pretty-code` package's `package.json` at install time, since this detail is more volatile than the other version claims in this document. |
| `velite@0.4.0` | `zod` (peer, any reasonably recent 3.x/4.x — confirm exact range in Velite's `package.json` at install time) | Velite's Zod integration is core to its schema API; a major Zod version bump could be breaking — check Velite's changelog before bumping Zod independently. |
| `tailwindcss@4.x` | `@tailwindcss/postcss` (companion package, replaces the old `tailwindcss` PostCSS plugin entry) | v4 setup requires `postcss.config.mjs` with `@tailwindcss/postcss`, not the v3-style `tailwindcss` + `autoprefixer` PostCSS plugin pair. `create-next-app@latest --tailwind` should scaffold this correctly for new projects. |

## Sources

- npm registry (`registry.npmjs.org`) — direct version/publish-date lookups for `next`, `react`, `velite`, `@content-collections/core`, `next-mdx-remote`, `@next/mdx`, `rehype-pretty-code`, `shiki`, `tailwindcss`, `@codesandbox/sandpack-react`, `react-live`, `zod`, `rehype-slug`, `remark-gfm`, `rehype-autolink-headings`, `contentlayer` — HIGH confidence (primary source, verified directly, not training data)
- [nextjs.org/blog/next-16](https://nextjs.org/blog/next-16) and [nextjs.org/docs/app/guides/mdx](https://nextjs.org/docs/app/guides/mdx) — MEDIUM confidence (official docs, surfaced via web search rather than direct fetch)
- [github.com/contentlayerdev/contentlayer/issues/429](https://github.com/contentlayerdev/contentlayer/issues/429) and [wisp.blog/blog/contentlayer-has-been-abandoned-what-are-the-alternatives](https://www.wisp.blog/blog/contentlayer-has-been-abandoned-what-are-the-alternatives) — MEDIUM confidence, cross-checked against npm registry publish date (HIGH confidence corroboration)
- [github.com/hashicorp/next-mdx-remote/releases](https://github.com/hashicorp/next-mdx-remote/releases) and [npmjs.com/package/next-mdx-remote](https://www.npmjs.com/package/next-mdx-remote) — MEDIUM confidence (RSC API shape, v6 migration notes)
- [velite.js.org/guide/with-nextjs](https://velite.js.org/guide/with-nextjs) and [github.com/zce/velite](https://github.com/zce/velite) — MEDIUM confidence
- [github.com/sdorra/content-collections](https://github.com/sdorra/content-collections) and [dub.co/blog/content-collections](https://dub.co/blog/content-collections) — MEDIUM confidence
- [rehype-pretty.pages.dev](https://rehype-pretty.pages.dev/) and [github.com/rehype-pretty/rehype-pretty-code/releases](https://github.com/rehype-pretty/rehype-pretty-code/releases) — MEDIUM confidence
- [tailwindcss.com/blog/tailwindcss-v4](https://tailwindcss.com/blog/tailwindcss-v4) and [tailwindcss.com/docs/guides/nextjs](https://tailwindcss.com/docs/guides/nextjs) — MEDIUM confidence
- [nextjs.org/docs/app/api-reference/file-conventions/mdx-components](https://nextjs.org/docs/app/api-reference/file-conventions/mdx-components) — MEDIUM confidence (component registry pattern)
- [sandpack.codesandbox.io](https://sandpack.codesandbox.io/) and [github.com/FormidableLabs/react-live](https://github.com/FormidableLabs/react-live) — MEDIUM confidence

**Note on confidence methodology:** Context7 MCP tools were unavailable in this execution environment (no `mcp__context7__*` tools registered, and no `ctx7` CLI fallback installed), so library documentation claims rely on WebSearch results cross-checked against direct npm registry queries wherever a verifiable fact (version number, publish date) was available. Architectural/pattern claims (component registry, RSC limitations) are corroborated across 2+ independent sources per the verification protocol; no single-source claim is presented as HIGH confidence.

---
*Stack research for: Next.js + MDX technical blog with interactive component demos*
*Researched: 2026-06-29*
