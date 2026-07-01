# Frontend Blueprints — Design System

## 1. Purpose & Status

This document is the project-wide visual/UI design reference for Frontend Blueprints — the single source of truth for typography, color, spacing, component visual language, and layout conventions. It sits alongside `PROJECT.md` at the repo root and is intended to be cited by future phase planning (including Phase 02 — Live Demos & Patterns Track) whenever a new page, component, or content type needs to stay visually consistent with what already exists.

**Status: partially realized.** The site chrome (header/footer), the home page, and the Pattern post layout exist today with real theme tokens and are documented below as fact, grounded directly in the source files (`app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/patterns/[slug]/page.tsx`, `components/mdx/Callout.tsx`). The Blueprint track (no route exists yet) and interactive demo "islands" (Phase 02 scope, not yet built) are **not yet implemented** — their entries in this document are explicitly labeled **PROPOSED** and extrapolated from existing patterns, not asserted as built.

## 2. Design Principles

Derived from `PROJECT.md`'s stated ethos:

1. **Content-first, chrome-minimal.** The reading experience (prose, code, callouts) is the product. UI chrome (header, nav, footer) stays quiet — small type, muted colors, no visual competition with content.
2. **RSC-static by default, islands of interactivity only where they earn it.** Pages render as static server-rendered HTML; only components that genuinely need client state (theme toggle, future interactive demos) hydrate as client islands. Visual design should make these islands *look* distinct from static prose, not just behave differently.
3. **Production-grade, not tutorial.** Every visual decision (a callout, a code block, a pill) should look like it belongs in a real shipped product, not a demo scaffold — polish reflects the "production-ready mental model" the content itself teaches.
4. **Every UI element is a product decision.** Spacing, color, and typography choices are treated deliberately (e.g. a distinct accent color, a deliberate reading-column width for prose) rather than left to framework defaults, even where a Tailwind default is genuinely still the right choice.
5. **Timeless, not trend-chasing.** Visual language favors restraint (neutral grays, a single accent hue, system-standard type scale) over stylistic flourishes that would date the site.

## 3. Typography

**Fonts** (loaded via `next/font/google` in `app/layout.tsx`, exposed as CSS variables consumed by `@theme` in `app/globals.css`):

| Role | Token | Value | Source |
|------|-------|-------|--------|
| Display / sans (headings, UI) | `--font-display`, `--font-sans` | `"Inter", system-ui, sans-serif` | `app/globals.css` `@theme`; wired via `next/font/google` `Inter` in `app/layout.tsx` |
| Monospace (code) | `--font-mono` | `"JetBrains Mono", "Fira Code", monospace` | `app/globals.css` `@theme`; wired via `next/font/google` `JetBrains_Mono` in `app/layout.tsx` |

Both fonts are applied at the `<html>` level via `next/font`'s `variable` option (`inter.variable`, `jetbrainsMono.variable`), and `body` sets `font-family: var(--font-sans)` as the base. The site logo/wordmark in the header uses the `font-display` utility class explicitly (`app/layout.tsx`).

**Observed type scale** (real Tailwind classes in use today):

| Context | Classes | Where |
|---------|---------|-------|
| Home hero H1 | `text-4xl sm:text-5xl font-semibold tracking-tight` | `app/page.tsx` |
| Pattern post title H1 | `text-3xl font-semibold tracking-tight` | `app/patterns/[slug]/page.tsx` |
| Section H2 | `text-xl font-semibold tracking-tight` | `app/page.tsx` |
| Card/listing title H3 | `text-base font-semibold` | `app/page.tsx` |
| Hero lead paragraph | `text-lg` | `app/page.tsx` |
| Post description | `text-base` | `app/patterns/[slug]/page.tsx` |
| Nav links, footer, meta text, pill labels | `text-sm` | `app/layout.tsx`, `app/patterns/[slug]/page.tsx` |
| Reading time, category pill | `text-xs` | `app/patterns/[slug]/page.tsx` |

**Prose vs. UI text distinction:**

- MDX post bodies use `@tailwindcss/typography`'s `.prose` class, applied as `prose dark:prose-invert max-w-none` on the `<article>` wrapper in `app/patterns/[slug]/page.tsx`. `globals.css` customizes `--tw-prose-links` to use the accent token (`var(--color-accent)` light, `var(--color-accent-light)` dark) so in-content links match the site's accent rather than the typography plugin's default link color.
- Site chrome, listings, and any non-MDX UI text use plain Tailwind utility classes directly (no `.prose` wrapper) — e.g. the home page's pattern listing, the header/footer, and pill/tag components.

## 4. Color Palette

**Semantic tokens** (`:root` for light, `.dark` for dark — defined in `app/globals.css`):

| Token | Light | Dark | Role |
|-------|-------|------|------|
| `--background` | `#ffffff` | `#0f1117` | Page background |
| `--foreground` | `#111827` | `#f1f5f9` | Primary text |
| `--muted` | `#6b7280` | `#94a3b8` | Secondary text (meta, nav links, descriptions) |
| `--border` | `#e5e7eb` | `#1e2937` | Dividers, header/footer borders, card separators |
| `--surface` | `#f9fafb` | `#161b27` | Elevated/panel background (defined; not yet consumed by a component in code today) |

**Accent tokens** (`@theme` block, `app/globals.css`):

| Token | Value | Role |
|-------|-------|------|
| `--color-accent` | `oklch(0.55 0.22 280)` (deep violet) | Primary actions (CTA buttons), links, hover states — light mode |
| `--color-accent-light` | `oklch(0.72 0.18 280)` (lighter violet) | Same role, dark-mode variant (higher lightness for contrast against dark backgrounds) |

**Consumption syntax used in code** (Tailwind v4 arbitrary-value-from-CSS-variable syntax):

- `bg-(--background)`, `text-(--foreground)`, `text-(--muted)`, `border-(--border)` — direct semantic-token utilities, theme-aware via the `.dark` class swap.
- `text-accent`, `bg-accent`, `hover:text-accent` — accent utilities generated by Tailwind from the `--color-accent` `@theme` token (Tailwind v4 auto-generates `bg-*`/`text-*`/`border-*` utilities for any `--color-*` token).
- Callout and pill components additionally use raw Tailwind palette colors (`blue-50`/`blue-400`, `green-50`/`green-400`, `amber-50`/`amber-400`, `red-50`/`red-400`, `zinc-100`/`zinc-800`) for semantic/neutral variants outside the core brand palette — see Section 6.

## 5. Spacing & Layout Scale

No custom spacing tokens are defined in `@theme` — spacing relies entirely on Tailwind v4's default 4px-based scale (`p-1` = 0.25rem, `p-4` = 1rem, etc.).

**Container conventions** (real values from `app/layout.tsx`, `app/page.tsx`, `app/patterns/[slug]/page.tsx`):

| Context | Max width | Padding | Notes |
|---------|-----------|---------|-------|
| Site chrome (header, footer) | `max-w-5xl` | `px-4 sm:px-6 lg:px-8` | `app/layout.tsx` |
| Home page | `max-w-5xl` | `px-4 py-16 sm:px-6 lg:px-8` | `app/page.tsx` |
| Pattern post reading column | `max-w-3xl` (narrower, for readability) | `px-4 py-12 sm:px-6 lg:px-8` | `app/patterns/[slug]/page.tsx` |

**Header:** `h-14`, `sticky top-0 z-40`, `border-b border-(--border)`, `bg-(--background)/90 backdrop-blur-sm` — translucent, blurred, stays above scrolled content (`app/layout.tsx`).

**Footer:** `border-t border-(--border)`, `py-6`, centered `text-sm text-(--muted)` tagline (`app/layout.tsx`).

## 6. Component Visual Language

### Established today

**Callout (`components/mdx/Callout.tsx`)** — the canonical example of a visually distinct "island" inside otherwise flowing prose:

- Escapes typography styling via the `not-prose` utility so it isn't subject to `.prose` margin/font overrides.
- `rounded-r-lg` (rounded only on the side away from the accent border — the border itself stays sharp).
- Left accent border: `border-l-4`, color varies by semantic type.
- Tinted background matching the border hue at low opacity/lightness.
- Four semantic variants, each with a distinct icon and color family:

| Type | Border/background | Icon |
|------|--------------------|------|
| `note` | blue-400 border, blue-50/blue-950 bg | ℹ |
| `tip` | green-400 border, green-50/green-950 bg | ✓ |
| `warning` | amber-400 border, amber-50/amber-950 bg | ⚠ |
| `danger` | red-400 border, red-50/red-950 bg | ✕ |

- Optional bold title row (`text-sm font-semibold`, icon + text) above body content (`text-sm text-(--foreground)`).

**Pills / tags:** `rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs` — used for both category pills and tag lists on Pattern posts (`app/patterns/[slug]/page.tsx`).

**Primary button** (home page CTA): `rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity` (`app/page.tsx`).

### PROPOSED — not yet built: Interactive demo islands (Phase 02 scope)

**Status: proposed.** No interactive demo component exists in the codebase today — the only in-prose custom "island" pattern currently implemented is `Callout`. The following is an extrapolation from the Callout pattern, intended as a starting point for Phase 02 design work, and should be validated/revised once real demo components are built:

- Reuse the `not-prose` escape hatch so demo components aren't subject to typography-plugin spacing/font rules.
- Use a bordered surface distinct from surrounding prose — likely `border border-(--border)` with `bg-(--surface)` (the `--surface` token is already defined in `globals.css` but not yet consumed by any component; a demo island would be its first real use).
- Maintain clear visual separation between the "live demo" region and any adjacent static code block, so a reader can tell at a glance which block is interactive vs. which is a static snippet.
- Rounded corners consistent with existing components (`rounded-lg`), rather than the asymmetric `rounded-r-lg` used by Callout (which exists specifically because of Callout's left border treatment).

This section must be revisited and updated to "decided" status once Phase 02 implements the first real demo component.

## 7. Layout Conventions by Content Type

### Pattern post (implemented — `app/patterns/[slug]/page.tsx`)

Structure, top to bottom:

1. Header block: category pill (`rounded-full bg-zinc-100 ...`) + reading time (`text-xs text-(--muted)`) on one row.
2. Title: `text-3xl font-semibold tracking-tight`.
3. Description: `mt-3 text-base text-(--muted)`.
4. Tag row (if tags present): wrapped pills, same visual treatment as the category pill.
5. Article body: `prose dark:prose-invert max-w-none` wrapping `<MDXRemote>` output — this is where Callouts, code blocks, and all MDX content render.
6. Footer: `border-t border-(--border) pt-8` with a "← Back to Patterns" link (`text-sm font-medium text-(--muted)`).

Entire page is constrained to `max-w-3xl` (narrower than site chrome) for readability of long-form prose.

### PROPOSED — not yet built: Blueprint post layout

**Status: proposed.** No Blueprint route or layout exists in the codebase yet (only `content/patterns/` and `app/patterns/` exist). The following is a proposal, not a built fact:

- Reuse the Pattern post's structural conventions (header block with category/reading-time, `text-3xl` title, description, tag row, `prose dark:prose-invert` body, `max-w-3xl` reading column, back-link footer) as the starting layout, since Blueprints and Patterns are both long-form MDX content and should feel like the same publication.
- Because a Blueprint is composed of multiple Patterns (many-to-many cross-linking per `PROJECT.md`), the Blueprint layout will need an additional structural element not present on Pattern posts today — e.g. a "Patterns referenced in this Blueprint" list or inline cross-link callouts — the exact visual treatment is undecided and should be designed when the Blueprint route is planned.
- Given Blueprints are described as more comprehensive/multi-perspective than Patterns, a table of contents (leveraging the already-wired `rehype-slug` + `rehype-autolink-headings` heading IDs) is a reasonable proposal for long Blueprint posts, though not yet implemented for either content type.

## 8. Code Block Styling

Implemented via the `rehype-pretty-code` + Shiki pipeline, configured in `app/patterns/[slug]/page.tsx`:

- Paired themes: `light: "github-light"`, `dark: "github-dark"` — Shiki renders both, and `globals.css` shows/hides the matching `[data-theme="light"]` / `[data-theme="dark"]` block based on whether the `.dark` class is active on `<html>`, so no client-side re-highlighting is needed on theme toggle.
- `<pre>` treatment (`globals.css`, scoped to `[data-rehype-pretty-code-figure] pre`): `border-radius: 0.5rem`, `padding: 1rem 1.25rem`, `overflow-x: auto` (allows wide snippets to scroll horizontally rather than wrap or overflow the reading column).
- The wrapping `<figure data-rehype-pretty-code-figure>` gets `margin: 1.5em 0` for consistent vertical rhythm within prose.
- Plugin order matters: `remark-gfm` → `rehype-slug` → `rehype-autolink-headings` → `rehype-pretty-code` (slug must run before autolink-headings since autolink depends on the `id` attributes slug generates; rehype-pretty-code runs last so it transforms `<pre><code>` after all other rehype passes).
