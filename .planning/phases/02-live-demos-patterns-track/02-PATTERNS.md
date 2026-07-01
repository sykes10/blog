# Phase 2: Live Demos & Patterns Track - Pattern Map

**Mapped:** 2026-07-01
**Files analyzed:** 10
**Analogs found:** 9 / 10

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|--------------------|------|-----------|-----------------|----------------|
| `components/demos/OptimisticUpdatesDemo.tsx` | component (client island) | event-driven | `components/theme/ThemeToggle.tsx` | role-match |
| `lib/mdx-components.tsx` (extend) | config/registry | request-response | `lib/mdx-components.tsx` (existing `Callout` registration) | exact |
| `components/mdx/TableOfContents.tsx` | component (client island) | transform + event-driven | `components/theme/ThemeToggle.tsx` | role-match |
| `lib/toc.ts` | utility | transform | `lib/content.ts` | role-match |
| `app/patterns/category/[category]/page.tsx` | route (server component) | CRUD (read/list) | `app/patterns/[slug]/page.tsx` | exact |
| `app/patterns/page.tsx` (extend) | route (server component) | CRUD (read/list) | `app/patterns/page.tsx` (itself, current version) | exact |
| `components/patterns/TagFilter.tsx` | component (client island) | event-driven | `components/theme/ThemeToggle.tsx` | role-match |
| `lib/content.ts` (extend: `getPatternsByCategory`, `getPatternsByTag`, `getAllTags`) | utility/service | CRUD (read) | `lib/content.ts` (existing `getAllPatterns`/`getPatternBySlug`) | exact |
| `content/patterns/optimistic-updates.mdx` | content (MDX) | static content | `content/patterns/toast-notification-system.mdx` | exact |
| `tests/patterns-demo.spec.ts`, `tests/patterns-category.spec.ts`, `tests/patterns-tag-filter.spec.ts`, `tests/patterns-toc.spec.ts` | test | request-response / event-driven | `tests/smoke.spec.ts`, `tests/feed.spec.ts` | exact |

## Pattern Assignments

### `components/demos/OptimisticUpdatesDemo.tsx` (component, event-driven)

**Analog:** `components/theme/ThemeToggle.tsx`

**Client-island directive + imports** (lines 1-4):
```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
```
Copy the `"use client"` directive placement (must be the very first line) and the local-only import style — no external state library, hooks imported directly from `react`. For the demo, swap in `useState`, `useOptimistic`, `startTransition` from `react` (per RESEARCH.md Pattern 1).

**Mount-guard / hydration-safety pattern** (lines 9-17, 23-32):
```tsx
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  ...
  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="size-9 rounded-md border border-transparent p-2 opacity-0"
        disabled
      />
    );
  }
```
The demo doesn't need a mount guard (no localStorage/system-preference dependency), but this shows the project's convention of guarding against hydration mismatch and rendering a stable-size placeholder — apply the same "no layout shift" discipline to the demo's loading/pending visual state.

**Event handler + `aria-label` pattern** (lines 19-21, 34-41):
```tsx
const toggle = () => {
  setTheme(resolvedTheme === "dark" ? "light" : "dark");
};
...
<button
  onClick={toggle}
  aria-label={
    resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"
  }
  className="size-9 rounded-md border border-zinc-200 bg-white p-2 text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
>
```
Copy: single `onClick` handler bound to a named function (not inline arrow logic scattered in JSX), descriptive `aria-label` reflecting the resulting state (not just "toggle"), Tailwind v4 CSS-variable-aware dark-mode class pairs (`dark:` variants alongside light defaults).

**Additional required pattern (from RESEARCH.md, not present in ThemeToggle):** wrap the state-mutating call in `startTransition`, and add a persistent (always-in-DOM) `role="status" aria-live="polite"` element for the rollback/error announcement — see RESEARCH.md Pattern 1 and Pitfall 4. This is new plumbing with no existing analog in the codebase since this is the first `useOptimistic`-based component.

---

### `lib/mdx-components.tsx` (config/registry, request-response)

**Analog:** itself — extend the existing file directly, don't create new one.

**Registration pattern** (lines 1-2, 63-67):
```tsx
import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/mdx/Callout";
...
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...
    // Presentational MDX component — registered as <Callout> in MDX content
    Callout,
    // Override the default components with any passed overrides
    ...components,
  };
}
```
For the new demo, add `import { OptimisticUpdatesDemo } from "@/components/demos/OptimisticUpdatesDemo";` at the top and add `OptimisticUpdatesDemo,` to the returned map, following the exact same one-line registration style as `Callout`. Note the existing comment on line 7 (`No demo-component registry entries — deferred to Phase 2`) should be updated/removed since Phase 2 is implementing this.

---

### `components/mdx/TableOfContents.tsx` (component, transform + event-driven)

**Analog:** `components/theme/ThemeToggle.tsx` (client-island shape) + `components/mdx/Callout.tsx` (MDX-consumable component props/JSDoc style)

**Client-island + `useEffect` cleanup pattern** (ThemeToggle lines 1, 15-17):
```tsx
"use client";
...
useEffect(() => {
  setMounted(true);
}, []);
```
Follow this for the `IntersectionObserver` setup — mount an observer in `useEffect`, and (per RESEARCH.md Pattern 4) return a cleanup function calling `observer.disconnect()`.

**Component doc-comment / props-interface convention** (Callout lines 1-9, 41-48):
```tsx
import type { ReactNode } from "react";

type CalloutType = "note" | "tip" | "warning" | "danger";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}
...
/**
 * Callout — a presentational aside/note box for use in MDX content.
 * Renders a styled block with an optional title and icon based on the type.
 *
 * Usage in MDX:
 *   <Callout type="warning" title="Heads up">Content here</Callout>
 */
```
Use this documentation style (purpose + usage example in a JSDoc block) for `TableOfContents`, and define a `Heading` type / `TableOfContentsProps` interface the same way `CalloutProps` is defined — named, exported-if-needed, colocated above the component.

**Styling convention** (Callout line 60):
```tsx
<div className="text-sm text-(--foreground) [&>p]:m-0">{children}</div>
```
Use the same Tailwind v4 CSS-variable tokens (`text-(--foreground)`, `text-(--muted)`, `border-(--border)`) seen throughout `app/patterns/page.tsx` and `app/patterns/[slug]/page.tsx` for the TOC's nav/link styling.

---

### `lib/toc.ts` (utility, transform)

**Analog:** `lib/content.ts`

**File header comment + centralization convention** (lines 1-6):
```typescript
// Centralized content-access layer over the Velite-compiled collection.
// Route files must import from here rather than #site/content directly,
// so the data-access surface is centralized and testable.
import { patterns } from "#site/content";

export type { Pattern } from "#site/content";
```
Follow the same "why this module exists" comment convention. `lib/toc.ts` should similarly be the single place heading-extraction logic lives, imported by `app/patterns/[slug]/page.tsx` rather than inlining a regex/remark walk in the route file.

**Pure function export style** (lines 18-23):
```typescript
/**
 * Returns the pattern matching the given slug, or undefined if not found.
 */
export function getPatternBySlug(slug: string) {
  return patterns.find((p) => p.slug === slug);
}
```
Model `extractHeadings(raw: string): Heading[]` the same way — a single JSDoc'd pure function, no class wrapper, explicit return-type inference left to TypeScript.

---

### `app/patterns/category/[category]/page.tsx` (route, CRUD read/list)

**Analog:** `app/patterns/[slug]/page.tsx`

**`generateStaticParams` pattern** (lines 34-39):
```tsx
export async function generateStaticParams() {
  const patterns = getAllPatterns();
  return patterns.map((p) => ({ slug: p.slug }));
}
```
For the category route, enumerate the fixed enum instead (per RESEARCH.md Pattern 2):
```tsx
const CATEGORIES = ["components", "behaviours", "engineering", "ux"] as const;
export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}
```

**`notFound()` validation pattern** (lines 73-84):
```tsx
export default async function PatternPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPatternBySlug(slug);

  // Return 404 for unknown slugs
  if (!post) {
    notFound();
  }
```
Copy directly: `await params`, look up via a `lib/content.ts` helper, call `notFound()` on a miss. For category, validate against the `CATEGORIES` array (RESEARCH.md Pitfall 3) before calling `getPatternsByCategory()`.

**`generateMetadata` pattern** (lines 46-71): reuse the same `SITE_URL` env-var constant, `metadataBase`, `alternates.canonical`, and `openGraph` shape — adjust `canonical`/`url` to `/patterns/category/${category}` and title/description to a category-specific string (e.g. `"Behaviours Patterns"`).

**List-rendering visual language** — reuse from `app/patterns/page.tsx` (see below) rather than re-deriving; the category page should render the same `<ul>` card-list markup, just pre-filtered.

---

### `app/patterns/page.tsx` (route, extend with tag filter)

**Analog:** itself (current implementation)

**List rendering + category badge / tag chip markup** (lines 10-58):
```tsx
export default function PatternsPage() {
  const patterns = getAllPatterns();
  ...
  <ul className="divide-y divide-(--border)">
    {patterns.map((pattern) => (
      <li key={pattern.slug} className="py-6">
        <a href={`/patterns/${pattern.slug}`} className="group block">
          ...
          <div className="mt-2 flex flex-wrap gap-2">
            {pattern.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
```
This is the exact visual language (rounded-full chip styling) `TagFilter.tsx`'s clickable chip buttons should match, just with `<button>` instead of `<span>` and `aria-pressed` added. Reuse the same Tailwind classes for chip look-and-feel consistency. The page itself should call `getAllTags()` and pass `patterns`/`allTags` down to a client `<TagFilter>` island wrapping this same list markup (server-fetched list, client-side filtered).

---

### `components/patterns/TagFilter.tsx` (component, event-driven)

**Analog:** `components/theme/ThemeToggle.tsx` (client-island shape, `aria-pressed`/`aria-label` conventions) — no existing filter-control analog in the codebase; this is new UI shape but follows established client-component conventions.

**`"use client"` + local `useState` pattern**: same as ThemeToggle lines 1, 11 (`const [mounted, setMounted] = useState(false);`) — use a simple local `useState<string | null>(null)` for `activeTag`, no external state management, matching the project's "no state library" convention already established.

RESEARCH.md's own code example (Architecture Patterns §3) is directly usable as the implementation skeleton; the codebase's contribution here is styling conventions (chip markup from `app/patterns/page.tsx` above) and the `aria-pressed` toggle-button convention from `ThemeToggle.tsx`.

---

### `lib/content.ts` (extend: `getPatternsByCategory`, `getPatternsByTag`, `getAllTags`)

**Analog:** itself (existing `getAllPatterns`, `getPatternBySlug`)

**Function style to copy exactly** (lines 8-23):
```typescript
/**
 * Returns all patterns sorted by publishedAt descending (newest first).
 */
export function getAllPatterns() {
  return patterns.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Returns the pattern matching the given slug, or undefined if not found.
 */
export function getPatternBySlug(slug: string) {
  return patterns.find((p) => p.slug === slug);
}
```
New helpers should match this exactly: single-sentence JSDoc, plain array method (`.filter`, `.flatMap`+`Set` for `getAllTags`), no external query layer, operating on the same imported `patterns` array from `#site/content`.

---

### `content/patterns/optimistic-updates.mdx` (content)

**Analog:** `content/patterns/toast-notification-system.mdx`

Not read in full (content file, not code pattern) — but per `velite.config.ts` schema (lines 14-26), frontmatter must include `title`, `slug` (auto via `s.slug("patterns")`), `description` (≤160 chars), `category: "behaviours"`, `tags: string[]`, `publishedAt`. Match the existing post's frontmatter block shape and heading structure (the "8-section template structure" referenced in `tests/smoke.spec.ts` comment, PATT-01) exactly, embedding `<OptimisticUpdatesDemo />` as inline JSX the same way `<Callout>` is presumably used in the Toast post.

---

### Test files

**Analog:** `tests/smoke.spec.ts` + `tests/feed.spec.ts`

**Route status + content assertion pattern** (smoke.spec.ts lines 19-36):
```typescript
test.describe("Pattern post route", () => {
  test("renders the post page with status 200, title, and reading time (FOUND-01 + SITE-03)", async ({
    page,
  }) => {
    const response = await page.goto(`/patterns/${PATTERN_SLUG}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText(PATTERN_TITLE);
    ...
  });

  test("returns 404 for an unknown slug", async ({ page }) => {
    const response = await page.goto("/patterns/does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
```
Use this exact shape for `tests/patterns-category.spec.ts` (200 for known categories, 404 for `/patterns/category/nonsense`) and `tests/patterns-demo.spec.ts` / `tests/patterns-toc.spec.ts` (goto page, locate element, assert text/attribute).

**Click + state-change wait pattern** (smoke.spec.ts lines 46-78):
```typescript
const toggle = page.getByRole("button", { name: /switch to .+ theme/i });
await expect(toggle).toBeVisible();
const initialClass = await htmlEl.getAttribute("class");
await toggle.click();
await page.waitForFunction(
  (cls) => document.documentElement.getAttribute("class") !== cls,
  initialClass,
  { timeout: 3000 }
);
```
Directly reusable shape for `patterns-demo.spec.ts` (click demo button, `waitForFunction` for optimistic text change) and `patterns-tag-filter.spec.ts` (click chip, wait for list-length change).

**Request-only (no browser) assertion pattern** (feed.spec.ts lines 12-29):
```typescript
test("GET /rss.xml returns 200 with XML content type and correct channel title", async ({
  request,
}) => {
  const response = await request.get("/rss.xml");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain("Frontend Blueprints");
});
```
Use `request.get()` (not `page.goto()`) for `patterns-category.spec.ts`'s pure status/body checks where no DOM interaction is needed — faster than full page navigation, matching the project's existing preference (see feed.spec.ts header comment: "plain request assertions... for fast feedback").

## Shared Patterns

### Tailwind v4 CSS-variable tokens
**Source:** `app/patterns/page.tsx`, `app/patterns/[slug]/page.tsx`, `components/mdx/Callout.tsx`
**Apply to:** All new components (`OptimisticUpdatesDemo`, `TableOfContents`, `TagFilter`)
```tsx
text-(--foreground)  text-(--muted)  border-(--border)  bg-zinc-100 dark:bg-zinc-800  hover:text-accent
```
Never hardcode hex colors; always use the established CSS-variable-backed utility classes or the `zinc`/`accent` palette already in use.

### `"use client"` island convention
**Source:** `components/theme/ThemeToggle.tsx`
**Apply to:** `OptimisticUpdatesDemo.tsx`, `TableOfContents.tsx`, `TagFilter.tsx`
Directive on line 1, component otherwise a plain named function export (not default export), local `useState`/`useEffect` only — no external state library, matching RESEARCH.md's "Don't Hand-Roll" guidance.

### Centralized data-access layer
**Source:** `lib/content.ts` header comment (lines 1-3)
**Apply to:** `lib/content.ts` extensions, `lib/toc.ts`
Route files (`app/patterns/**`) must import data-access functions from `lib/*.ts`, never reach into `#site/content` directly — preserves the "centralized and testable" data-access boundary already established.

### `notFound()` + enum/lookup validation
**Source:** `app/patterns/[slug]/page.tsx` lines 79-84
**Apply to:** `app/patterns/category/[category]/page.tsx`
Look up via helper, `if (!result) notFound();` — for category, additionally validate the raw param string against the `CATEGORIES` const array before calling the lookup helper (RESEARCH.md Pitfall 3).

### JSDoc-per-function documentation style
**Source:** `lib/content.ts` (every exported function has a one-to-two-line `/** ... */` block)
**Apply to:** All new exported functions in `lib/toc.ts`, `lib/content.ts` extensions

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `components/patterns/TagFilter.tsx` | component | event-driven | No existing client-side list-filter component in the codebase; closest is `ThemeToggle.tsx` for client-island conventions only. Use RESEARCH.md's Pattern 3 code example as the implementation skeleton, styled per `app/patterns/page.tsx`'s chip markup. |

## Metadata

**Analog search scope:** `app/`, `components/`, `lib/`, `content/patterns/`, `tests/`, `velite.config.ts`
**Files scanned:** 10 (all files read in full; none exceeded 2,000 lines)
**Pattern extraction date:** 2026-07-01
