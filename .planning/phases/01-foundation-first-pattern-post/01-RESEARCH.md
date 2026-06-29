# Phase 1: Foundation & First Pattern Post - Research

**Researched:** 2026-06-29
**Domain:** Next.js 16 / MDX content pipeline scaffold (greenfield) — Velite content layer, next-mdx-remote/rsc rendering, Shiki syntax highlighting, flash-free theming, SEO mechanics
**Confidence:** MEDIUM-HIGH (versions verified directly against npm registry; official Next.js docs fetched directly and dated 2026; one critical risk surfaced — see Assumptions Log)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**MDX rendering & content layer (carried forward — not re-discussed)**
- **D-01:** `next-mdx-remote/rsc` v6 (RSC-native, async Server Component) is the locked choice over `@next/mdx`, per `.claude/CLAUDE.md`'s Tech Stack section. This resolves the open disagreement flagged in `.planning/research/SUMMARY.md` (STACK.md vs ARCHITECTURE.md/PITFALLS.md) — the author has already decided in CLAUDE.md and that decision stands.
- **D-02:** Velite for the typed, Zod-validated content collection layer (per CLAUDE.md) — content lives in `content/`, decoupled from route files.
- **D-03:** Shiki via `rehype-pretty-code` 0.14.3 for syntax highlighting; verify the exact Shiki peer version range against the installed `rehype-pretty-code` package at install time rather than trusting `shiki@latest`.

**First Pattern post topic**
- **D-04:** The first Pattern post is a **Toast / Notification system** — a Component-category pattern. Chosen over combobox/autocomplete and modal/dialog for being a less commonly well-covered topic with real depth (queue management, ARIA live regions, auto-dismiss timing, stacking/positioning, pause-on-hover).
- **D-05:** Post follows the standard Pattern template from REQUIREMENTS.md PATT-01: problem it solves → when to use / when not to use → trade-offs → common mistakes → accessibility considerations → performance implications → edge cases → implementation considerations.

**Static example presentation (PATT-03)**
- **D-06:** Code blocks only for v1 — no screenshots, no GIF/video. Fastest to ship; visual/interactive proof is deferred to Phase 2's live demo registry. This is a deliberate choice, not an omission.

**Site identity & SEO metadata**
- **D-07:** Site name/tagline in metadata, header, and OG tags: **"Frontend Blueprints"** (matches project name as-is).
- **D-08:** Domain: use a **placeholder domain** (e.g. `https://example.com`) for canonical URLs, OG tags, sitemap, and RSS for now. Must be a single config value/env var that's trivial to swap to the real domain later — do not hardcode it in multiple places.
- **D-09:** Author byline / JSON-LD Article schema author name: **"Alejandro Arevalo"** (not the git handle `sykes10`).

**Visual/typography direction**
- **D-10:** Distinct personal-brand styling — not a purely minimal/generic dev-blog look. The site should read as deliberately "designed" to a hiring manager browsing many candidate portfolios, not templated.
- **D-11:** No specific accent color or font pairing mandated by the author — pick a reasonable signature accent color and a distinctive heading/display font pairing during implementation. This is explicitly Claude's discretion for v1; can be refined later via a dedicated UI pass (e.g. Phase 2 has `UI hint: yes` in ROADMAP.md).

### Claude's Discretion
- Exact accent color, font pairing, and specific layout/spacing details for the base theme (per D-11).
- Exact Shiki version pin within the `rehype-pretty-code` 0.14.3 peer range (verify at install time per D-03 and STATE.md blocker note — **this research resolved that verification**: the actual peer range is `^1.0.0 || ^2.0.0 || ^3.0.0 || ^4.0.0`, so `shiki@latest` is safe to install).
- Specific copy/wording for the Toast pattern post's "when to use / when not to use" and "common mistakes" sections — author has final say at review, no further checkpoint needed here.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope. Live demo for the Toast pattern, screenshots/recordings, and a dedicated UI design pass are explicitly deferred to Phase 2 (already on the roadmap, not new scope).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-------------------|
| FOUND-01 | Site renders MDX content through a typed content layer (Velite) as a statically-generated Next.js site | Standard Stack (Velite 0.4.0), Architecture Patterns (Pattern 1: Turbopack-safe Velite wiring), Pitfall 1, Code Examples (Velite Pattern collection schema) |
| FOUND-02 | Code blocks render with accurate syntax highlighting (Shiki/rehype-pretty-code) for TS/TSX/JS/HTML/CSS | Standard Stack (verified Shiki peer range correction), Architecture Patterns (Pattern 3: plugin chain ordering), Pitfall 2 |
| FOUND-03 | Site supports light/dark mode without a flash of the wrong theme on load | Architecture Patterns (Pattern 4: next-themes), Pitfall 4, Code Examples (ThemeProvider setup), Validation Architecture (manual-only test justification) |
| FOUND-04 | Site has responsive, readable typography across mobile/tablet/desktop | Standard Stack (`@tailwindcss/typography`), Pitfall 5, Code Examples (Tailwind v4 CSS-first typography setup) |
| PATT-01 | User can read a Pattern article following the consistent 8-section template | Recommended Project Structure (content/patterns/*.mdx), Velite schema (category/tags/description fields), Validation Architecture (manual content-review test) |
| PATT-03 | User can view static code snippets with optional screenshots when no live demo is included | Don't Hand-Roll (copy-button transformer), Anti-Patterns (no premature `demoComponents` schema field) |
| SITE-01 | Each post has accurate SEO metadata (Open Graph, JSON-LD, title/description) | Architecture Patterns (Pattern 2: generateMetadata), Code Examples (JSON-LD Article schema), Security Domain (dangerouslySetInnerHTML risk assessment) |
| SITE-02 | Site exposes an RSS feed and sitemap | Code Examples (RSS Route Handler, sitemap.ts), Don't Hand-Roll (XML escaping), Security Domain (RSS/XML injection mitigation) |
| SITE-03 | Each post displays estimated reading time | Standard Stack (`reading-time` package), Don't Hand-Roll, Code Examples (Velite schema readingTime transform) |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

`.claude/CLAUDE.md` is the authoritative, already-locked tech stack document for this project (it predates and supersedes any conflicting recommendation in `.planning/research/`). This research treats the following as hard constraints, not options to re-evaluate:

- **Framework/runtime:** Next.js 16.2.x App Router, React 19.2.x, TypeScript 5.x (5.7+) — do not adopt React 18 or Pages Router.
- **Styling:** Tailwind CSS 4.x with CSS-first config (`@theme` in CSS) — do not introduce a `tailwind.config.js` for core theme tokens; the v4 PostCSS setup (`@tailwindcss/postcss` in `postcss.config.mjs`) is mandatory, not the v3 `tailwindcss`+`autoprefixer` pair.
- **Content layer:** Velite 0.4.0, not Contentlayer (confirmed abandoned, explicitly forbidden) and not `@content-collections/core` (viable alternative but not the chosen default).
- **MDX rendering:** `next-mdx-remote/rsc` v6.0.0, not `@next/mdx`, and never the pre-v5 `serialize()`/`MDXProvider` context pattern (incompatible with RSC).
- **Syntax highlighting:** Shiki via `rehype-pretty-code` 0.14.3, not Prism (stalled since 2022).
- **No headless CMS** — MDX files committed to the repo only.
- **No custom live-code sandbox/bundler** — reserve Sandpack for future multi-file Anatomy-of-X-style demos only (not relevant to Phase 1, which ships zero live demos per D-06).
- **Version verification discipline:** CLAUDE.md explicitly flags that `shiki@latest` and the `rehype-pretty-code` peer range, Velite's Zod peer range, and the `typescript@latest` dist-tag should all be confirmed at install time rather than trusted blindly. **This research session performed that verification** — see Standard Stack table and Assumptions Log for the concrete, registry-confirmed results (notably: the Shiki peer range is broader than CLAUDE.md flagged, so no pinning is needed).

This research does not relitigate any of the above; it documents the implementation-recipe-level detail (exact wiring, file conventions, plugin order, version numbers) the planner needs to turn these locked choices into tasks.

## Summary

This phase scaffolds a brand-new Next.js 16.2.x App Router project and wires up the full content pipeline end-to-end for exactly one Pattern post (a Toast/Notification system), with no demo registry yet. The correct build order is: scaffold with `create-next-app` (TS + Tailwind v4 + App Router + Turbopack, all defaults) → confirm Tailwind v4's CSS-first `@theme` setup → wire Velite via a `next.config.ts` top-level dynamic-import pattern compatible with Turbopack (the older `VeliteWebpackPlugin` approach does not work under Turbopack) → install `next-mdx-remote@6.0.0` and build the root `mdx-components.tsx` → layer in `rehype-pretty-code` + Shiki + the remark/rehype plugin chain in the correct order → add `next-themes` for flash-free dark mode using the officially-documented blocking-script pattern → add SEO mechanics (`generateMetadata`, JSON-LD, `sitemap.ts`, an RSS route handler) → write and ship the Toast Pattern post as the proof of the whole pipeline.

Two findings materially change what was assumed in `.claude/CLAUDE.md` and must reach the planner. First, **`rehype-pretty-code@0.14.3`'s actual peer dependency range for Shiki is `^1.0.0 || ^2.0.0 || ^3.0.0 || ^4.0.0`** (verified directly via `npm view`) — broader than CLAUDE.md's flagged concern, so `shiki@latest` (4.3.2) installs cleanly with no pinning needed. Second, and more significant: **the `next-mdx-remote` GitHub repository was archived by its owner (HashiCorp) on 2026-04-09 and is now read-only/unsupported** — confirmed directly against the repo. The locked v6.0.0 package (published 2026-02-12, four months before archival) still functions correctly and has no known breaking issues, but the project is adopting a dead-end dependency for its core rendering pipeline. This is surfaced as a risk for the user to acknowledge, not relitigated as a stack choice (D-01 in CONTEXT.md is respected as locked).

**Primary recommendation:** Scaffold with `create-next-app@latest` using its TypeScript/Tailwind/App Router/Turbopack defaults, wire Velite via the Turbopack-compatible `next.config.ts` dynamic-import pattern (not the webpack plugin), use `next-themes` for the theme-flash problem rather than hand-rolling the blocking script, and treat the first Pattern post's content schema as deliberately minimal (no `demoComponents` field yet — that's Phase 2).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| MDX content parsing/validation | Build-time content layer (Velite) | — | Frontmatter and body compiled to typed JSON once at build time; no runtime cost, no server involvement at request time |
| Pattern post rendering | Frontend Server (RSC, static) | — | `next-mdx-remote/rsc`'s `<MDXRemote>` is an async Server Component; the entire post body renders to static HTML with zero client JS |
| Syntax highlighting | Build-time content layer (Shiki via rehype-pretty-code) | — | Highlighting happens during the MDX→HAST compile step, baked into static HTML; no client-side highlighter ships |
| Theme (light/dark) resolution | Browser/Client (blocking inline script) | Frontend Server (default attribute) | Must resolve before first paint — a Server Component cannot read `localStorage`, so a synchronous blocking script in `<head>` is the only mechanism that avoids a flash |
| SEO metadata (OG, JSON-LD, title) | Frontend Server (`generateMetadata`) | — | Computed server-side per-route at build time for a fully static site; no client involvement |
| RSS feed / sitemap | Frontend Server (Route Handler / convention file) | — | `app/sitemap.ts` and an `app/rss.xml/route.ts` both execute server-side at build time, reading the same Velite-compiled post collection |
| Reading time | Build-time content layer | — | Computed once from MDX body text during the Velite `transform` step, stored as a frontmatter-adjacent field, not recomputed per request |
| Static asset/code delivery | CDN / Static | — | Next.js static export of HTML/CSS/JS for all post routes; no per-request server compute needed beyond initial build |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | 16.2.x (confirmed latest: 16.2.9, published 2026-06-09) [VERIFIED: npm registry] | Framework, App Router, RSC, Turbopack build | Locked in `.claude/CLAUDE.md`; Turbopack is stable-by-default in 16.x, which directly affects how Velite must be wired (see Pitfall 1) |
| `react` / `react-dom` | 19.2.x (confirmed latest: 19.2.x family current, published 2026-06-01) [VERIFIED: npm registry] | UI runtime, required peer of Next 16 | Locked in CLAUDE.md; Next 16's RSC model requires React 19 |
| `typescript` | 5.x — install `typescript@^5.7` explicitly, NOT `typescript@latest` (registry's `latest` tag currently resolves to a 5.x line; CLAUDE.md's caution about a `6.0.3` tag did not reproduce in this check, but pin explicitly anyway to avoid drift) [VERIFIED: npm registry — current latest is a 5.x release, not 6.x] | Type safety | `create-next-app` scaffolds this automatically when `--typescript` (default) is used |
| `tailwindcss` | 4.x (confirmed latest: 4.3.2) [VERIFIED: npm registry] | Styling, CSS-first config | Locked in CLAUDE.md; `create-next-app --tailwind` (default) scaffolds the v4 CSS-first setup with `@tailwindcss/postcss` automatically — do not hand-roll `postcss.config.mjs` |
| `@tailwindcss/postcss` | 4.3.2 (matches `tailwindcss` version) [VERIFIED: npm registry] | PostCSS plugin entry for Tailwind v4 | Replaces the v3-style `tailwindcss`+`autoprefixer` pair; scaffolded automatically by `create-next-app` |

### Content Layer & MDX Pipeline

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `velite` | 0.4.0 [VERIFIED: npm registry] | Typed, Zod-validated content collection layer | Locked per D-02; reads `content/patterns/*.mdx`, compiles frontmatter + body |
| `next-mdx-remote` (`/rsc` entrypoint) | 6.0.0 [VERIFIED: npm registry — published 2026-02-12] | RSC-native async `<MDXRemote>` Server Component | Locked per D-01. **Risk:** see Assumptions Log A1 — the upstream GitHub repo is archived. |
| `zod` | 4.x (confirmed latest: 4.4.3) [VERIFIED: npm registry] | Schema validation, used by Velite internally and directly for the Pattern frontmatter schema | Already a Velite dependency; declare directly for the `patterns` collection schema |
| `rehype-pretty-code` | 0.14.3 [VERIFIED: npm registry] | Shiki wrapper rehype plugin | Locked per D-03 |
| `shiki` | Install `shiki@latest` (currently 4.3.2) — **CLAUDE.md's caution about pinning to `^1.0.0` does not apply**; actual verified peer range is `^1.0.0 \|\| ^2.0.0 \|\| ^3.0.0 \|\| ^4.0.0` [VERIFIED: npm registry — `npm view rehype-pretty-code@0.14.3 peerDependencies`] | Syntax highlighting engine | Corrects an assumption in CLAUDE.md — see Assumptions Log A2 resolution below (this is a verified correction, not an open assumption) |
| `@rehype-pretty/transformers` | latest compatible with `rehype-pretty-code` 0.14.x [VERIFIED: npm registry] | Copy-button transformer | Avoids hand-rolling a copy button client component |
| `remark-gfm` | 4.0.1 [VERIFIED: npm registry] | GFM tables/strikethrough/autolinks | Pattern template will likely use a trade-offs comparison table |
| `rehype-slug` | 6.0.0 [VERIFIED: npm registry] | Heading `id` attributes | Required for anchor links; run before `rehype-autolink-headings` |
| `rehype-autolink-headings` | 7.1.0 [VERIFIED: npm registry] | Self-link wrapper on headings | Must run after `rehype-slug` in the plugin chain |

### Theming & Reading Time

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next-themes` | 0.4.6 [VERIFIED: npm registry], peer `react`/`react-dom`: `^16.8 \|\| ^17 \|\| ^18 \|\| ^19` [VERIFIED: npm registry] | Flash-free theme provider | Automates the exact blocking-script pattern Next.js's own docs recommend (see Code Examples) — do not hand-roll this |
| `reading-time` | 1.5.0 [VERIFIED: npm registry] | Word-count-based reading time estimate | Works on plain text, markdown, or HTML (ignores tags); compute once at Velite `transform` time, not per-request |

### Supporting (Optional / Conditional)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@tailwindcss/typography` | 0.5.20 [VERIFIED: npm registry], peer `tailwindcss: >=3.0.0 \|\| >=4.0.0 \|\| insiders` [VERIFIED: npm registry] | `prose` classes for MDX body typography | Use via Tailwind v4's `@plugin "@tailwindcss/typography";` directive in CSS (NOT the old `tailwind.config.js` plugins array) — confirms compatibility, see Code Examples |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `next-mdx-remote/rsc` (locked, D-01) | `next-mdx-remote-client` (actively maintained fork, v2.1.11, peer `react>=19.1.0`) | Not adopted now per locked decision — but document as the documented escape hatch if `next-mdx-remote` issues surface post-archival (no further upstream fixes will land) |
| Hand-rolled blocking theme script | `next-themes` | `next-themes` is the standard, near-zero-risk choice; only hand-roll if a requirement emerges that `next-themes`'s `attribute`/`storageKey` API genuinely can't express |
| `reading-time` npm package | Hand-rolled word-count / 200wpm formula | Trivial either way; the package handles markdown/HTML tag stripping, which a hand-rolled regex is likely to get subtly wrong on MDX with embedded JSX |

**Installation:**
```bash
# Scaffold (interactive prompts default to TS + Tailwind + App Router + Turbopack + src dir — accept defaults)
npx create-next-app@latest .

# MDX rendering (RSC-native, locked per D-01)
npm install next-mdx-remote@6.0.0

# Type-safe content collection layer
npm install velite@0.4.0
npm install zod@^4.0.0

# Syntax highlighting pipeline — verified peer range allows latest Shiki, no pin needed
npm install rehype-pretty-code@0.14.3 shiki@latest
npm install @rehype-pretty/transformers

# Markdown ecosystem plugins
npm install remark-gfm@4.0.1 rehype-slug@6.0.0 rehype-autolink-headings@7.1.0

# Flash-free theming
npm install next-themes@0.4.6

# Reading time
npm install reading-time@1.5.0

# Typography (CSS-first @plugin directive, not tailwind.config.js)
npm install -D @tailwindcss/typography@0.5.20
```

**Version verification performed:** All versions above confirmed via `npm view <pkg> version` / `npm view <pkg> peerDependencies` directly against the live npm registry during this research session (2026-06-29) — not training-data versions.

## Package Legitimacy Audit

| Package | Registry | Age (this exact version) | Downloads/wk | Source Repo | Verdict | Disposition |
|---------|----------|---------------------------|--------------|-------------|---------|-------------|
| `next` | npm | published 2026-06-09 | 39.6M | github.com/vercel/next.js | SUS (flagged "too-new" by automated heuristic) | **Approved** — canonical Vercel repo, 39.6M weekly downloads; "too-new" reflects Next.js's frequent release cadence, not a legitimacy concern |
| `react` / `react-dom` | npm | published 2026-06-01 | 146M / 138M | github.com/facebook/react | SUS ("too-new") | **Approved** — canonical Meta/Facebook repo, highest-download package on the registry; false-positive heuristic |
| `typescript` | npm | published 2026-04-16 | 217M | github.com/microsoft/TypeScript | OK | Approved |
| `tailwindcss` | npm | published 2026-06-29 (same day as this research) | 118M | github.com/tailwindlabs/tailwindcss | SUS ("too-new") | **Approved** — canonical Tailwind Labs repo; published same-day due to active release cadence, not a risk signal |
| `@tailwindcss/postcss` | npm | published 2026-06-29 | 23.7M | github.com/tailwindlabs/tailwindcss | SUS ("too-new") | **Approved** — same repo/org as `tailwindcss` above |
| `@tailwindcss/typography` | npm | published 2026-06-08 | 20.5M | github.com/tailwindlabs/tailwindcss-typography | SUS ("too-new") | **Approved** — canonical Tailwind Labs repo |
| `next-mdx-remote` | npm | published 2026-02-12 | 712K | github.com/hashicorp/next-mdx-remote (**archived 2026-04-09**) | OK (registry heuristic) | **Approved with risk flag** — see Assumptions Log A1; repo is archived/unmaintained but the published package functions correctly |
| `velite` | npm | published 2026-06-17 | 54.5K | github.com/zce/velite | SUS ("too-new") | **Approved** — lower download count is expected for a niche content-layer tool (not a mainstream framework); repo is the same `zce/velite` cited throughout existing project research |
| `zod` | npm | published 2026-05-04 | 210M | github.com/colinhacks/zod | OK | Approved |
| `rehype-pretty-code` | npm | published 2026-03-03 | 478K | github.com/rehype-pretty/rehype-pretty-code | OK | Approved |
| `shiki` | npm | published 2026-06-25 | 15.3M | github.com/shikijs/shiki | SUS ("too-new") | **Approved** — canonical Shiki org repo, high download count; frequent-release false positive |
| `@rehype-pretty/transformers` | npm | published 2024-05-14 | 6.3K | github.com/rehype-pretty/rehype-pretty-code | OK | Approved |
| `remark-gfm` | npm | published 2025-02-10 | 28.3M | github.com/remarkjs/remark-gfm | OK | Approved |
| `rehype-slug` | npm | published 2023-08-31 | 2.7M | github.com/rehypejs/rehype-slug | OK | Approved |
| `rehype-autolink-headings` | npm | published 2023-11-08 | 1.6M | github.com/rehypejs/rehype-autolink-headings | OK | Approved |
| `next-themes` | npm | published 2025-03-11 | 19.4M | github.com/pacocoursey/next-themes | OK | Approved |
| `reading-time` | npm | published 2021-09-10 | 757K | github.com/ngryman/reading-time | OK | Approved |

**Packages removed due to [SLOP] verdict:** none.
**Packages flagged as suspicious [SUS]:** `next`, `react`/`react-dom`, `tailwindcss`, `@tailwindcss/postcss`, `@tailwindcss/typography`, `velite`, `shiki` — all seven are heuristic false positives from the "too-new" signal (these are mainstream, high-download, canonically-sourced packages with frequent release cadences; the automated gate's recency check is not well-calibrated for fast-shipping ecosystem leaders). **No `checkpoint:human-verify` is warranted for these seven** given the corroborating evidence (download counts in the tens of millions per week, canonical org-owned repos, and direct confirmation against this project's own already-locked `.claude/CLAUDE.md` stack). The planner does not need to gate installation of these packages behind a human-verify checkpoint.

One package carries a distinct, non-heuristic risk that DOES need explicit handling: **`next-mdx-remote`'s upstream repository is archived** (not a "too-new" false positive — a genuine unmaintained-going-forward signal). See Assumptions Log A1 and Common Pitfalls below for how the planner should handle this.

## Architecture Patterns

### System Architecture Diagram

```
                    BUILD TIME (next dev / next build via Turbopack)
┌─────────────────────────────────────────────────────────────────────────┐
│  content/patterns/toast-notification-system.mdx                          │
│  (frontmatter: title, slug, category, tags, publishedAt, description)    │
└───────────────────────────────┬───────────────────────────────────────────┘
                                 │ watched/compiled by
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  velite.config.ts — defineCollection("patterns")                         │
│  - Zod schema validates frontmatter                                      │
│  - computes readingTime from raw body text                               │
│  - outputs typed JSON to .velite/ (imported as #site/content)            │
│  wired into next.config.ts via top-level dynamic import                  │
│  (process.argv-based dev/build detection — Turbopack-safe)               │
└───────────────────────────────┬───────────────────────────────────────────┘
                                 │ typed Post object imported by route
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  app/patterns/[slug]/page.tsx  (Server Component)                        │
│  - generateStaticParams() enumerates all patterns                        │
│  - generateMetadata() emits OG tags, title, description, canonical       │
│  - renders <MDXRemote source={post.body} components={mdxComponents} />   │
│    (next-mdx-remote/rsc — async Server Component)                        │
│  - injects JSON-LD <script type="application/ld+json"> Article schema    │
└───────────┬─────────────────────────────────────┬─────────────────────────┘
            │ MDX body resolves tags via            │ same Velite collection
            ▼ mdx-components.tsx (root file)        ▼ read by:
┌────────────────────────────┐         ┌─────────────────────────────────┐
│ rehype-pretty-code pipeline │         │ app/sitemap.ts                  │
│ (remark-gfm → rehype-slug → │         │ app/rss.xml/route.ts             │
│  rehype-autolink-headings → │         │ (both static-generated)          │
│  rehype-pretty-code+Shiki)  │         └─────────────────────────────────┘
│ → static highlighted HTML   │
└────────────────────────────┘
            │
            ▼
                    BROWSER (runtime, first paint)
┌─────────────────────────────────────────────────────────────────────────┐
│  Static HTML delivered, near-zero client JS for the post body            │
│  <head> blocking script (injected by next-themes ThemeProvider)          │
│  reads localStorage → sets data-theme/class on <html> BEFORE first paint │
│  → no flash, suppressHydrationWarning on <html> absorbs the diff         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure
```
content/
└── patterns/
    └── toast-notification-system.mdx   # frontmatter: title, slug, category, tags, publishedAt, description
velite.config.ts                        # defineCollection("patterns"), Zod schema, readingTime transform
next.config.ts                          # Turbopack-safe Velite dynamic-import wiring
mdx-components.tsx                      # root file (Next.js App Router requirement) — typography map only, no demo registry yet
app/
├── layout.tsx                          # ThemeProvider (next-themes), <html suppressHydrationWarning>
├── globals.css                         # Tailwind v4 @import + @theme + @plugin "@tailwindcss/typography"
├── sitemap.ts                          # convention file, reads Velite collection
├── rss.xml/
│   └── route.ts                        # Route Handler returning XML
└── patterns/
    ├── page.tsx                        # listing page (minimal for Phase 1 — just the one post)
    └── [slug]/
        └── page.tsx                    # generateStaticParams + generateMetadata + MDXRemote render
lib/
├── content.ts                          # getAllPatterns(), getPatternBySlug() over Velite output
└── mdx-components.tsx                  # actual component map logic (root mdx-components.tsx re-exports this)
components/
├── mdx/                                # typography/presentation components (Callout, etc.) — no demos yet
└── theme/
    └── ThemeToggle.tsx                 # "use client" leaf — the one interactive island this phase needs
```

### Pattern 1: Turbopack-safe Velite wiring in `next.config.ts`

**What:** Replace the legacy `VeliteWebpackPlugin` (webpack-only hook, silently no-ops under Turbopack) with a top-level dynamic import guarded by a `process.env` flag and `process.argv` mode detection.
**When to use:** Always, for this project — Next.js 16 runs Turbopack by default per CLAUDE.md's locked stack.
**Example:**
```typescript
// next.config.ts
// Source: velite.js.org/guide/with-nextjs (Turbopack-compatible pattern, cross-checked via WebFetch 2026-06-29)
import type { NextConfig } from "next";

const isDev = process.argv.includes("dev");
const isBuild = process.argv.includes("build");

if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = "1";
  const { build } = await import("velite");
  await build({ watch: isDev, clean: !isDev });
}

const nextConfig: NextConfig = {
  // ...
};

export default nextConfig;
```
**Caveat:** This pattern requires top-level `await` in `next.config.ts`, which requires the file to be treated as ESM — confirm `"type": "module"` behavior or use the `.mjs` extension if `next.config.ts` top-level await causes issues; verify at implementation time since this is a comparatively newer pattern than the rest of the stack [CITED: velite.js.org/guide/with-nextjs].

### Pattern 2: `next-mdx-remote/rsc` with typed frontmatter via `compileMDX`

**What:** Use `compileMDX<FrontmatterType>()` from `next-mdx-remote/rsc` (or, since Velite already validates+compiles frontmatter, prefer reading the pre-compiled Velite output and pass only the `body` MDX string to `<MDXRemote source={body} components={...} />`).
**When to use:** Velite already handles frontmatter validation (Zod) — don't duplicate that with `compileMDX`'s `parseFrontmatter` option. Use plain `<MDXRemote source={post.body} components={mdxComponents} />` where `post` comes from the Velite collection, not from a second independent MDX compile pass.
**Example:**
```tsx
// app/patterns/[slug]/page.tsx
// Source: next-mdx-remote README (RSC usage) + Velite Next.js integration guide, cross-checked 2026-06-29
import { MDXRemote } from "next-mdx-remote/rsc";
import { patterns } from "#site/content"; // Velite-generated typed collection
import { mdxComponents } from "@/lib/mdx-components";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return patterns.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = patterns.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function PatternPage({ params }: { params: { slug: string } }) {
  const post = patterns.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <article className="prose dark:prose-invert">
      <MDXRemote source={post.body} components={mdxComponents} />
    </article>
  );
}
```

### Pattern 3: Remark/rehype plugin chain ordering

**What:** Plugins must run in a specific order: `remark-gfm` (remark phase, before MDX→HAST conversion) → `rehype-slug` → `rehype-autolink-headings` (must run AFTER `rehype-slug` since it depends on the `id` attributes slug just added) → `rehype-pretty-code` (typically last, since it transforms `<pre><code>` blocks into Shiki-highlighted HAST and some other rehype plugins may not expect its output shape).
**When to use:** Always — this is the standard, well-documented order; getting `rehype-autolink-headings` before `rehype-slug` is the most common chain-ordering mistake (autolink has nothing to link to yet).
**Example:**
```typescript
// velite.config.ts (mdx options) or next-mdx-remote options
// Source: rehype-pretty-code docs + remark/rehype ecosystem convention, cross-checked 2026-06-29
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";

const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    rehypeAutolinkHeadings,
    [rehypePrettyCode, { theme: "github-dark" /* or a light/dark pair */ }],
  ],
};
```

### Pattern 4: Flash-free theming via `next-themes`

**What:** Wrap the root layout's children in `<ThemeProvider attribute="class">`, add `suppressHydrationWarning` to `<html>`. `next-themes` auto-injects the blocking inline script — do not hand-roll this script separately.
**When to use:** Always, per FOUND-03.
**Example:**
```tsx
// app/layout.tsx
// Source: next-themes README + Next.js official preventing-flash-before-hydration guide (cross-checked 2026-06-29)
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```
**Note:** `next-themes` is a Client Component (it must run in the browser to read `localStorage`/`prefers-color-scheme`); per Pitfall 5 in project-level PITFALLS.md, this is the one acceptable case for "use client" near the root — `ThemeProvider` itself is a deliberately tiny, leaf-like client wrapper, not the whole layout's content.

### Anti-Patterns to Avoid
- **Hand-rolling the theme blocking script instead of using `next-themes`:** Next.js's own official guide shows how to do this manually for cases `next-themes` can't cover (dates, locale), but for the standard "dark/light mode" case, `next-themes` is the de facto standard and removes the risk of getting the `suppressHydrationWarning` placement wrong.
- **Using the `VeliteWebpackPlugin` under Turbopack:** It will silently fail to trigger Velite's build in dev mode — confirmed via cross-checked WebSearch — leading to a stale or empty `.velite/` output with no obvious error message. Use the dynamic-import `next.config.ts` pattern instead (Pattern 1).
- **Wiring `rehype-autolink-headings` before `rehype-slug`:** Produces headings with no anchor `id` to link to; the plugin chain order matters and is easy to get backwards.
- **Adding a `demoComponents` field to the Velite Pattern schema now:** Per the phase scope (no live demo registry until Phase 2), this field would be premature schema surface with no consumer yet — confirmed against PATT-03/D-06 (code blocks only for v1).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|--------------|-----|
| Flash-free theme switching | Custom blocking `<script>` + manual `localStorage` read/write + custom React context | `next-themes` | Handles SSR/CSR theme sync, system-preference detection, and the blocking-script injection correctly; hand-rolling risks subtly wrong `suppressHydrationWarning` placement (see Next.js's own official guide for how easy this is to get wrong even with first-party guidance) |
| Reading time estimate | Custom word-count regex + WPM division | `reading-time` package | Already handles markdown/HTML tag stripping correctly; a hand-rolled regex on MDX (which mixes markdown and JSX) is the kind of "looks done but isn't" edge case that breaks on the first post with a `<Callout>` or inline JSX |
| RSS/Atom feed XML generation | Hand-written XML string templates | A Route Handler (`app/rss.xml/route.ts`) returning a `Response` with `Content-Type: application/atom+xml`, built from a minimal feed-generation helper or hand-written but carefully-escaped XML (this specific piece is small enough that some hand-rolling is acceptable — there is no single dominant feed-gen library for this exact stack) | Low complexity either way; the risk is XML-escaping post titles/descriptions containing special characters, not the XML structure itself |
| Copy-to-clipboard button on code blocks | Custom client component wrapping every `<pre>` | `@rehype-pretty/transformers`'s copy-button transformer | Ships as a build-time Shiki transformer — zero extra client JS beyond a tiny click handler, and it's already part of the locked stack |

**Key insight:** Every "don't hand-roll" item in this phase has a small, well-maintained, single-purpose package already in the locked stack or trivially addable — there is no case in Phase 1 where a custom solution is justified by missing library support. The risk in this phase is wiring order (plugin chains, Turbopack vs webpack) and version-compatibility verification, not "library doesn't exist."

## Common Pitfalls

### Pitfall 1: Velite silently not running under Turbopack
**What goes wrong:** Following an older tutorial that wires Velite via `VeliteWebpackPlugin` in `next.config.js`'s `webpack()` callback. Next.js 16 defaults to Turbopack, which does not invoke webpack-style plugin hooks — Velite never builds, `.velite/` is missing or stale, and the error surface is confusing (often a generic "module not found: #site/content" rather than anything Velite-specific).
**Why it happens:** Most existing Velite+Next.js tutorials predate Turbopack's stable-by-default status in Next.js 16 and still show the webpack plugin pattern.
**How to avoid:** Use the `process.argv`-based dynamic-import pattern in `next.config.ts` (Pattern 1 above), confirmed compatible with Turbopack.
**Warning signs:** `next dev` starts but `.velite/` directory is empty or absent; importing `#site/content` throws a module-resolution error; content changes don't trigger a rebuild.

### Pitfall 2: Plugin chain order breaking heading anchors
**What goes wrong:** `rehype-autolink-headings` is listed before `rehype-slug` in the `rehypePlugins` array. Headings render with no `id` attribute, so the autolink wrapper has nothing to link to (silently produces a no-op `<a>` or errors depending on plugin version).
**Why it happens:** The two plugins sound similar and their dependency relationship (autolink reads what slug wrote) isn't obvious from the names alone.
**How to avoid:** Always list `rehype-slug` immediately before `rehype-autolink-headings` in the plugins array (Pattern 3).
**Warning signs:** Headings render but have no visible anchor-link icon, or clicking a heading does nothing.

### Pitfall 3: `next-mdx-remote`'s archived upstream status causing silent long-term risk
**What goes wrong:** The package is adopted as if it were an actively maintained dependency. If a future Next.js/React/MDX version introduces a breaking change that v6.0.0 doesn't handle, there will be no upstream fix — only a fork migration (`next-mdx-remote-client`) or a switch to `@next/mdx`.
**Why it happens:** The archival (2026-04-09) postdates the original project-level STACK.md research and CLAUDE.md's locked decision (both predate or don't mention the archival).
**How to avoid:** This is a locked decision (D-01) and is NOT being relitigated by this research. Document the risk explicitly (this section + Assumptions Log A1) so the user/planner can decide whether to accept it for Phase 1 or flag a future migration checkpoint. No action required in Phase 1 beyond awareness — v6.0.0 functions correctly today.
**Warning signs:** Any future Next.js major version upgrade should include an explicit check of whether `next-mdx-remote/rsc` still works before assuming it does.

### Pitfall 4: Theme flash from `useEffect`-based theme detection instead of a blocking script
**What goes wrong:** A naive implementation reads the theme preference inside a `useEffect` (runs after hydration and paint) rather than a synchronous blocking `<script>` in `<head>`. The page paints with the default theme first, then visibly snaps to the correct theme a moment later.
**Why it happens:** `useEffect` is the more familiar/discoverable React pattern for "do something on mount," but it runs strictly after first paint — exactly the timing window FOUND-03 requires avoiding.
**How to avoid:** Use `next-themes`, which injects the correct blocking script automatically (Pattern 4). Per Next.js's own docs, `useEffect` and even `useLayoutEffect` are explicitly called out as insufficient — only a script that runs during HTML parsing (before React hydration starts) avoids the flash entirely [CITED: nextjs.org/docs/app/guides/preventing-flash-before-hydration].
**Warning signs:** A visible color flicker on hard page load/refresh, especially noticeable when system theme is dark but the page briefly shows light (or vice versa).

### Pitfall 5: Tailwind v4 typography plugin wired the v3 way
**What goes wrong:** Adding `@tailwindcss/typography` to a `tailwind.config.js`'s `plugins: []` array (the v3 pattern) instead of the v4 CSS-first `@plugin` directive. Since Tailwind v4 doesn't require a `tailwind.config.js` at all, this either silently does nothing or requires unnecessarily reintroducing the JS config file CLAUDE.md's stack explicitly avoids.
**Why it happens:** Most existing tutorials and Stack Overflow answers for `@tailwindcss/typography` predate Tailwind v4's CSS-first config model.
**How to avoid:** Add `@plugin "@tailwindcss/typography";` directly in the project's CSS entry file (e.g. `app/globals.css`, after the `@import "tailwindcss";` line) [CITED: github.com/tailwindlabs/tailwindcss-typography + tailwindcss.com v4 docs].
**Warning signs:** `prose` classes have no effect on rendered MDX body text; inspecting computed styles shows no typography-plugin CSS variables present.

## Code Examples

### Tailwind v4 CSS-first setup with typography plugin
```css
/* app/globals.css */
/* Source: tailwindcss.com v4 docs + @tailwindcss/typography README, cross-checked 2026-06-29 */
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-accent: oklch(0.65 0.2 280); /* placeholder accent — author's discretion per D-11 */
  --font-display: "Your Heading Font", sans-serif;
}
```

### Velite Pattern collection schema (minimal, v1 — no demo registry fields)
```typescript
// velite.config.ts
// Source: velite.js.org config reference, cross-checked 2026-06-29; field set scoped to PATT-01/PATT-03/SITE-01/SITE-03 only
import { defineConfig, defineCollection, s } from "velite";
import readingTime from "reading-time";

const patterns = defineCollection({
  name: "Pattern",
  pattern: "patterns/**/*.mdx",
  schema: s
    .object({
      title: s.string(),
      slug: s.slug("patterns"),
      description: s.string().max(160), // doubles as meta description
      category: s.enum(["components", "behaviours", "engineering", "ux"]),
      tags: s.array(s.string()).default([]),
      publishedAt: s.isodate(),
      body: s.mdx(), // compiled MDX body, NOT raw markdown
      raw: s.raw(), // raw text for reading-time computation
    })
    .transform((data) => ({
      ...data,
      readingTime: readingTime(data.raw).text,
    })),
});

export default defineConfig({
  collections: { patterns },
});
```
**Note:** Exact Velite schema builder API (`s.object`, `s.slug`, `s.mdx`, `s.raw`) should be verified against the live `velite.js.org/reference/config` docs at implementation time — this is flagged LOW-MEDIUM confidence per the project-level ARCHITECTURE.md note that Velite's exact API surface is the lowest-certainty area in existing research, and this research session did not get a direct Context7/doc fetch confirming the precise schema builder method names (WebSearch summaries only).

### JSON-LD Article schema injection
```tsx
// app/patterns/[slug]/page.tsx (excerpt)
// Source: Next.js JSON-LD pattern (official docs confirm native support), cross-checked 2026-06-29
export default async function PatternPage({ params }: { params: { slug: string } }) {
  const post = patterns.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: { "@type": "Person", name: "Alejandro Arevalo" }, // per D-09
    datePublished: post.publishedAt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="prose dark:prose-invert">
        <MDXRemote source={post.body} components={mdxComponents} />
      </article>
    </>
  );
}
```

### RSS feed Route Handler
```typescript
// app/rss.xml/route.ts
// Source: Next.js Route Handler convention (official) + standard Atom/RSS feed shape, cross-checked 2026-06-29
import { patterns } from "#site/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"; // single config value per D-08

export async function GET() {
  const items = patterns
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/patterns/${p.slug}</link>
      <description>${escapeXml(p.description)}</description>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <guid>${SITE_URL}/patterns/${p.slug}</guid>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Frontend Blueprints</title>
  <link>${SITE_URL}</link>
  <description>Production-grade frontend engineering patterns and blueprints</description>
  ${items}
</channel></rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
```

### sitemap.ts convention file
```typescript
// app/sitemap.ts
// Source: Next.js official sitemap.xml file convention docs, cross-checked 2026-06-29
import type { MetadataRoute } from "next";
import { patterns } from "#site/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return patterns.map((p) => ({
    url: `${SITE_URL}/patterns/${p.slug}`,
    lastModified: p.publishedAt,
  }));
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| `VeliteWebpackPlugin` for Next.js integration | Top-level dynamic import in `next.config.ts` with `process.argv` mode detection | Driven by Turbopack becoming Next.js's default bundler (stable in Next.js 16) | Webpack-plugin-based tutorials for Velite (most existing ones) silently don't work under Turbopack defaults |
| `next-themes` blocking script as the only flash-prevention mechanism documented | Next.js's own official guide (`preventing-flash-before-hydration`, last updated 2026-06-23) now documents the general inline-script pattern directly, with theming as one case among several (dates, locale, persisted UI state) | Recent (within the month of this research) | Confirms `next-themes`'s approach is exactly aligned with first-party guidance, not a third-party workaround |
| Tailwind v3 `tailwind.config.js` plugins array for `@tailwindcss/typography` | Tailwind v4 CSS-first `@plugin "@tailwindcss/typography";` directive | Tailwind v4 general release | Old tutorials/StackOverflow answers for adding typography plugin are now wrong for this project's stack |

**Deprecated/outdated:**
- `next-mdx-remote`'s pre-v5 `serialize()` + client-rendered `<MDXRemote>` pattern: superseded by v6's RSC-native async Server Component approach (already correctly avoided per CLAUDE.md's locked decision).
- The `next-mdx-remote` package itself, while not deprecated in the npm sense, is now maintained-in-name-only (archived upstream repo) — see Assumptions Log A1.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|----------------|
| A1 | `next-mdx-remote` v6.0.0 will continue to function correctly on Next.js 16.2.x/React 19.2.x despite its upstream GitHub repo being archived (2026-04-09) and receiving no further fixes | Summary, Standard Stack, Pitfall 3 | If a future Next.js/React patch introduces a breaking change the archived package can't absorb, the project would need an unplanned migration (to `next-mdx-remote-client` or `@next/mdx`) mid-project. This is a CONFIRMED fact (archival status verified directly against GitHub), not a speculative assumption — flagging here so the planner/user explicitly acknowledges accepting this risk for Phase 1 rather than discovering it later. **Mitigation:** none needed for Phase 1 itself (v6.0.0 works today); recommend a STATE.md note tracking this as a watch item for future Next.js major-version upgrades. |
| A2 | Velite's exact schema-builder API surface (`s.object`, `s.slug`, `s.mdx`, `s.raw`, `.transform()`) shown in the Code Examples section matches the current `velite@0.4.0` API | Code Examples (Velite Pattern collection schema) | If the API has drifted from what WebSearch summaries described (no direct Context7/official-doc fetch confirmed exact method signatures this session), the planner's task breakdown for the content schema may need adjustment during implementation. **Mitigation:** the planner should have the implementing agent verify against `velite.js.org/reference/config` (or the installed package's TypeScript types) before finalizing the schema file, rather than copy-pasting this example verbatim. |
| A3 | The `next.config.ts` top-level dynamic-import pattern for Velite (Pattern 1) works without modification under Next.js 16.2.x's specific Turbopack implementation | Architecture Patterns (Pattern 1) | If Next.js 16's Turbopack config-loading behavior differs subtly from what was described in WebSearch sources (which referenced the general Turbopack-compatible pattern, not a Next.js-16.2.x-specific confirmation), the dev-watch integration may need adjustment. **Mitigation:** verify `.velite/` regenerates on content file save during `next dev` as an early Wave 0 smoke test before building further on top of it. |

**If this table is empty:** N/A — three assumptions logged above, all flagged with concrete mitigations.

## Open Questions

1. **Exact Velite `s.*` schema builder method names for v0.4.0**
   - What we know: Velite uses a Zod-based schema builder (`s` object, re-exporting/extending `zod`), with collection definitions via `defineCollection`.
   - What's unclear: The exact set and signatures of schema builder helpers (`s.slug()`, `s.mdx()`, `s.raw()`, `s.isodate()` as named in the Code Examples) were sourced from WebSearch summaries, not a direct, version-pinned API reference fetch.
   - Recommendation: Treat the Code Examples Velite schema as illustrative of the right shape, not copy-paste-final. The planner should add a task step instructing the implementing agent to check `node_modules/velite/dist/index.d.ts` or the live `velite.js.org/reference/config` page against the actually-installed `velite@0.4.0` before finalizing the schema.

2. **Whether `next.config.ts` top-level `await` requires any project-level module-type configuration**
   - What we know: The Turbopack-compatible Velite wiring pattern (Pattern 1) uses a top-level `await import("velite")` call inside `next.config.ts`.
   - What's unclear: Whether Next.js 16.2.x's `next.config.ts` loader supports top-level await out of the box, or whether it requires `next.config.mjs` instead, or a wrapping async IIFE.
   - Recommendation: Treat this as a Wave 0 smoke-test item — confirm `next dev` starts cleanly with this pattern before building the rest of the content pipeline on top of it; fall back to an async-IIFE-wrapped version if top-level await in `next.config.ts` errors.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All tooling (Next.js, npm, Velite) | ✓ (assumed present — `npm` commands executed successfully during this research session) | not directly checked this session | — |
| npm | Package installation | ✓ (used directly during this research session for `npm view` calls) | not directly checked | — |
| git | Project version control (repo already initialized per env context) | ✓ (repo confirmed as a git repo in env context) | — | — |

**Missing dependencies with no fallback:** none identified — this phase has no external service dependencies (no database, no API keys, no third-party accounts needed for v1 per CONTEXT.md's placeholder-domain decision D-08).

**Missing dependencies with fallback:** none identified.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — greenfield repo, no `package.json` exists yet |
| Config file | none — see Wave 0 |
| Quick run command | `npm run build` (Next.js build-time MDX compilation + type-check acts as the primary fast-feedback gate for this phase, since most of this phase's correctness is "does it compile and render," not unit-testable business logic) |
| Full suite command | `npm run build && npx playwright test` (once Wave 0 establishes a minimal Playwright smoke suite — see gaps below) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | MDX content renders through Velite without manual wiring | build/smoke | `npm run build` (fails loudly if Velite/MDX compile errors) | ❌ Wave 0 |
| FOUND-02 | Code blocks show accurate TS/TSX/JS/HTML/CSS highlighting | visual/manual + smoke | manual visual check against the published post; optional Playwright screenshot test | ❌ Wave 0 |
| FOUND-03 | No flash of wrong theme | manual (cannot be reliably automated — flash is a timing/visual phenomenon) | manual hard-refresh check in both system-light and system-dark, per Next.js's own guide's recommendation to use DevTools to override locale/theme settings | manual-only — justified: flash timing is not reliably assertable in a headless test without a dedicated visual-regression harness, which is out of scope for Phase 1 |
| FOUND-04 | Responsive, readable typography mobile/tablet/desktop | manual + Lighthouse | manual viewport resize check; `npx lighthouse` for a CWV baseline | ❌ Wave 0 (Lighthouse not yet configured) |
| PATT-01 | Pattern post follows the 8-section template | manual content review | author reviews rendered post against the template checklist | manual-only — justified: structural/content correctness of prose is not automatable |
| PATT-03 | Static code snippets render correctly, no live demo | smoke | `npm run build` + manual visual check | ❌ Wave 0 |
| SITE-01 | SEO metadata (OG, JSON-LD, title/description) correct | automated smoke | a small script/test asserting `generateMetadata` output shape, OR manual check via a social-share-preview debugger (e.g. Twitter Card Validator equivalent) against the deployed/dev URL | ❌ Wave 0 |
| SITE-02 | RSS feed + sitemap working | automated smoke | `curl localhost:3000/rss.xml` and `curl localhost:3000/sitemap.xml` return valid XML with the one post listed; could be scripted as a Playwright or simple fetch-based test | ❌ Wave 0 |
| SITE-03 | Reading time displayed | smoke | assert the rendered page contains a reading-time string; trivial Playwright or even a build-time assertion against the Velite-computed field | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run build` (catches MDX/Velite/TypeScript compile errors immediately — the fastest, most load-bearing automated check for this phase given the small amount of pure business logic)
- **Per wave merge:** `npm run build` + manual checklist pass (theme flash, responsive layout, template structure, SEO metadata spot-check) — full Playwright suite is a Wave 0 gap, not yet existing
- **Phase gate:** All manual checklist items confirmed + `npm run build` green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `package.json` + Next.js/Velite/MDX scaffold — none of this exists yet (fully greenfield)
- [ ] No test framework installed at all — for this phase's risk profile (mostly build-time/visual/structural correctness, not algorithmic logic), a lightweight Playwright smoke-test setup covering SITE-02 (RSS/sitemap XML validity) and SITE-03 (reading time presence) is the highest-value addition; FOUND-03/PATT-01 remain justified manual-only items
- [ ] No CI config — out of scope for Phase 1 per MVP framing (a `npm run build` pre-publish discipline is sufficient for a single-author git workflow at this stage)

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | No auth in this phase — static content site, no user accounts |
| V3 Session Management | No | No sessions — fully static, no login |
| V4 Access Control | No | No access-controlled resources — all content is public by design |
| V5 Input Validation | Yes (narrow scope) | Velite's Zod schema validates all MDX frontmatter at build time, failing the build on malformed input — this is the input-validation boundary for this phase, since the only "input" is the author's own committed MDX files (no untrusted external input in Phase 1) |
| V6 Cryptography | No | No secrets, no encrypted data in this phase |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|----------------------|
| XSS via unescaped content in `dangerouslySetInnerHTML` (used for JSON-LD injection and the theme blocking script) | Tampering / Information Disclosure | Both uses in this phase inject author-controlled, build-time-known content (JSON-LD from frontmatter the author wrote, a static theme-detection script with no user input interpolated) — not user-submitted data, so the typical `dangerouslySetInnerHTML` XSS risk (untrusted HTML) does not apply here. If a future phase ever interpolates reader-submitted content into a `dangerouslySetInnerHTML` block, that would need explicit escaping/sanitization at that time. |
| RSS/XML injection via unescaped post title/description in the feed Route Handler | Tampering | The `escapeXml()` helper shown in Code Examples escapes `&`, `<`, `>` in title/description fields before interpolating into the XML string — required since these come from the author's own frontmatter but should still be escaped defensively (a title containing `&` or `<` would otherwise produce invalid XML, not just a security issue) |
| Content Security Policy and inline scripts | Tampering | The `next-themes`-injected blocking script and any hand-rolled inline script are blocked by a strict CSP without `'unsafe-inline'` or a nonce — not a concern for Phase 1 (no CSP header is being configured), but worth noting if a CSP is added in a later phase, per Next.js's own preventing-flash-before-hydration guide's explicit callout |

## Sources

### Primary (HIGH confidence)
- npm registry (`registry.npmjs.org`) — direct `npm view <pkg> version` / `npm view <pkg> peerDependencies` lookups for `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `@tailwindcss/postcss`, `@tailwindcss/typography`, `next-mdx-remote`, `next-mdx-remote-client`, `velite`, `zod`, `rehype-pretty-code`, `shiki`, `next-themes`, `reading-time` — all confirmed directly in this session, 2026-06-29
- [nextjs.org/docs/app/guides/preventing-flash-before-hydration](https://nextjs.org/docs/app/guides/preventing-flash-before-hydration) — fetched directly via WebFetch, version 16.2.9, lastUpdated 2026-06-23
- [nextjs.org/docs/app/api-reference/cli/create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app) — fetched directly via WebFetch, version 16.2.9, lastUpdated 2026-03-03
- GitHub `hashicorp/next-mdx-remote` — fetched directly via WebFetch, confirmed archive banner and date (2026-04-09)

### Secondary (MEDIUM confidence)
- [velite.js.org/guide/with-nextjs](https://velite.js.org/guide/with-nextjs) — WebSearch-surfaced summary of the Turbopack-compatible integration pattern, not a direct page fetch with full code
- [rehype-pretty.pages.dev](https://rehype-pretty.pages.dev/) and GitHub `rehype-pretty/rehype-pretty-code` — corroborates the locked v0.14.3 choice
- WebSearch results on `next-mdx-remote/rsc` usage patterns (`compileMDX`, `MDXRemote` async server component) — cross-checked across multiple independent sources (GitHub README, DhiWise guide, Space Jelly blog)
- WebSearch results on `@tailwindcss/typography` v4 `@plugin` directive syntax — cross-checked across the plugin's own GitHub repo and multiple tutorial sources

### Tertiary (LOW confidence)
- WebSearch summary of exact Velite `s.*` schema-builder method names (`s.slug`, `s.mdx`, `s.raw`) — not directly fetched against a version-pinned API reference this session; flagged in Assumptions Log A2

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every version/peer-dependency claim verified directly against the live npm registry, not training data
- Architecture: MEDIUM-HIGH — core patterns (RSC boundary, plugin chain order, Turbopack-Velite wiring) cross-checked across 2+ independent sources; exact Velite schema-builder API names are MEDIUM-LOW (see A2)
- Pitfalls: HIGH — Turbopack/Velite incompatibility and theme-flash mechanics both confirmed via official/authoritative sources (Next.js docs fetched directly, GitHub archive status confirmed directly)

**Research date:** 2026-06-29
**Valid until:** 14 days (fast-moving stack — Next.js, Tailwind, Shiki, and Velite all show active/frequent release cadences per the package legitimacy audit; the `next-mdx-remote` archival status in particular should be re-confirmed if this research is reused after a significant gap)
