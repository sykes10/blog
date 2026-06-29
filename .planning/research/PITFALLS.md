# Pitfalls Research

**Domain:** Solo-developer technical blog (Next.js + MDX) with embedded interactive React component demos, built as a hiring-manager-facing portfolio asset
**Researched:** 2026-06-29
**Confidence:** MEDIUM (cross-checked technical findings on hydration, RSC boundaries, MDX tooling, and bundle splitting are MEDIUM; anecdotal/single-source findings on scope creep, blog abandonment, and code drift are explicitly flagged LOW)

## Critical Pitfalls

### Pitfall 1: Building infrastructure instead of shipping posts (scope creep into a full CMS/design system)

**What goes wrong:**
The author builds an elaborate authoring pipeline — a custom MDX component registry, a generic "design system" for demo components, theming infrastructure, a tagging/search system, RSS, newsletter integration — before a single Building Blocks post ships. The "platform" becomes the project; the writing that the platform exists to support never happens.

**Why it happens:**
For a frontend engineer, building tooling is more comfortable and more "showable" than writing prose. Every piece of infrastructure feels like progress and is individually justifiable ("I'll need search eventually," "I'll need a generic demo wrapper eventually"). There's no external deadline forcing a ship, so the scope boundary erodes one reasonable-sounding addition at a time — the classic scope-creep pattern where "one extra page" turns into rebuilding the whole CMS. This is the single failure mode the project's own `PROJECT.md` worries about (note the explicit "no CMS" and "live demos only where it adds value" decisions already in place).

**How to avoid:**
- Define a hard "v0 toolchain" list up front (MDX renderer, one demo-embedding mechanism, syntax highlighting, basic layout) and write everything else on an explicit Out-of-Scope list with "revisit after N posts ship" conditions — mirrors the project's own constraint pattern.
- Ship the first Building Blocks post with the ugliest acceptable version of every piece of infrastructure it touches. Polish only what gets reused by post 2 and 3.
- Treat "I'll need this eventually" as a signal to defer, not build now — eventually is not a phase.

**Warning signs:**
- Multiple weeks pass with commits only to config, components, or tooling directories and zero commits to `content/` or `posts/`.
- A "demo component library" or "design system" package exists with more components than the number of published posts.
- The phrase "before I write the first post I should set up X" recurs more than once.

**Phase to address:**
Address in the earliest "foundation/scaffolding" phase by capping its deliverable at exactly what post #1 needs, and add a roadmap gate: phase 2 cannot start until post #1 is published.

---

### Pitfall 2: Demo components that aren't actually accessible (undermining the a11y message)

**What goes wrong:**
A Building Blocks post about, say, an accessible combobox or modal ships with a live demo that fails basic keyboard navigation, has no focus trap, or breaks under a screen reader — while the prose praises ARIA best practices. Automated checks (axe-core, Lighthouse) pass, creating false confidence, because automated scanners only catch known structural rules (missing labels, contrast, alt text) and cannot verify keyboard flow, focus management, or actual screen-reader experience for custom interactive widgets.

**Why it happens:**
The author optimizes for "the demo looks right" rather than "the demo behaves right." A11y bugs in interactive widgets are invisible to mouse-only manual testing and to automated scanners alike — they only surface via keyboard-only and screen-reader testing, which most developers skip because it's slower and less familiar than clicking around. For this specific project, this pitfall is reputationally worse than a generic accessibility bug: the entire content angle of Building Blocks posts is "this is how to do it correctly," so a broken demo directly contradicts the post's thesis in front of the audience (hiring managers, frontend engineers) most likely to notice.

**How to avoid:**
- For every interactive demo, require: full keyboard operability (Tab/Shift+Tab/Enter/Escape/Arrow keys as appropriate), visible focus indicators, and one screen-reader pass (VoiceOver or NVDA) before the post is marked done.
- Run automated scans (axe-core via Playwright/Cypress) as a baseline gate, but explicitly exercise interactive states first (open the menu, focus the input) before invoking the scan — a static-page scan misses state-dependent violations entirely.
- Write the a11y section of the post only after manually testing the demo, not from general knowledge of the pattern — drift between "what the post claims" and "what the demo does" is itself a pitfall (see Pitfall 3).

**Warning signs:**
- A11y verification step is "ran axe, zero violations" with no mention of keyboard-only or screen-reader testing.
- The demo component was copy-pasted from a UI library without the author re-verifying its accessibility claims.
- Focus styles are suppressed (`outline: none`) anywhere in demo component CSS without a replacement focus indicator.

**Phase to address:**
Address in the demo-component-authoring phase (or per-post production checklist) — make manual keyboard + screen-reader pass a required UAT step for any post tagged as having a live demo, not an optional nice-to-have.

---

### Pitfall 3: MDX prose/code drift — the article's code block diverges from the actual demo's source

**What goes wrong:**
The post shows a code snippet ("here's how you'd implement this") that is hand-typed or copy-pasted at the time of writing. The live demo embedded a few paragraphs later runs a real component file. Over time the component gets refactored (props renamed, a bug fixed, an a11y issue patched) but the static code block in the MDX is never updated, so the article teaches an outdated or subtly wrong version of the code sitting right next to a demo running the corrected version.

**Why it happens:**
MDX naturally encourages embedding a live component import (`<Demo />`) alongside a separately-authored fenced code block (` ```tsx ... ``` `) showing "the code," because that's the path of least resistance in every MDX tutorial example. There is no automatic linkage between the two — the code block is just markdown text. Any subsequent edit to the real component has zero pressure to also touch the article. This is a known sharp edge in MDX/docs tooling generally: documentation that isn't tied to the actual source as a single source of truth drifts, and live-code-demo tooling has documented sync limitations between the editable demo instance and the displayed source.

**How to avoid:**
- Treat the component source file as the only place code is authored. Use a build-time mechanism to pull the displayed code block directly from the source file (e.g. import raw file contents via a loader/plugin, or a rehype/remark plugin that reads from a file path and injects it as the code block) rather than hand-pasting.
- If full automation isn't feasible for v1, add a lightweight CI check or pre-publish checklist step: "diff the pasted snippet against the live source file" before merging any post that touches a previously-published demo component.
- Prefer showing the actual imported component's real file (or a clearly-labeled excerpt with a path comment) over a paraphrased/simplified version — paraphrasing for readability is exactly where drift starts, because the paraphrase is never re-validated after refactors.

**Warning signs:**
- Code blocks in MDX are static text with no association to a file path or import.
- A demo component has been edited (git log shows changes) more recently than the post that embeds it.
- Two posts show the "same" component with code blocks that don't match each other.

**Phase to address:**
Address in the MDX pipeline / demo-embedding phase — decide the code-display mechanism (raw file import vs. hand-pasted) before the first post ships, since retrofitting this after several posts exist means re-auditing all of them.

---

### Pitfall 4: Shipping every demo's JavaScript on every page (bundle bloat from interactive islands)

**What goes wrong:**
Each Building Blocks/Anatomy post embeds one or more interactive demos. If demo components are imported normally (not dynamically) and/or globally registered in a shared MDX provider, their JS — and any heavy dependencies they pull in (code editors, charting libs, animation libraries) — ends up in the bundle for pages that don't even render that demo, or worse, in a shared chunk loaded on every page including the homepage and post listing.

**Why it happens:**
Next.js automatically code-splits per route, but it does NOT automatically isolate component-level code within a page — that requires deliberate `dynamic(() => import(...), { ssr: false })` (or React's lazy + Suspense) for anything demo-specific. It's easy to wire up a global `MDXProvider`/`mdx-components.tsx` that imports all known demo components eagerly so "any post can use any demo," which silently makes every demo's dependencies part of a shared bundle. For a single-author blog whose core value proposition is engineering quality, a slow or bloated page is a direct, visible contradiction of that value proposition to the exact audience (hiring managers) evaluating it.

**How to avoid:**
- Each demo component is dynamically imported per-post, scoped to the MDX file that uses it — never globally registered for eager loading.
- Set a bundle budget per post page (e.g. First Load JS target) and check it with `@next/bundle-analyzer` before publishing; treat budget regressions as a blocking issue, not a follow-up.
- Default to `ssr: false` only for demos that genuinely need browser-only APIs; prefer hydration-friendly demos (no `ssr:false`) where possible to keep content visible without a JS-loading flash.
- Keep heavy third-party libraries (code playgrounds, chart libraries) out of shared layout/header code entirely — they should only ever be reachable from the specific post that needs them.

**Warning signs:**
- `next build` output shows a large shared/common chunk that includes demo-specific library code.
- The blog's homepage or post index First Load JS is meaningfully larger than a content-only page should be.
- Adding a new demo to one post increases the bundle size of unrelated pages.

**Phase to address:**
Address in the architecture/demo-embedding phase — establish the per-post dynamic-import convention and a bundle-size check as part of the initial scaffolding, before the second or third demo is built (the pattern is much cheaper to enforce from post #1 than to retrofit across many posts later).

---

### Pitfall 5: Misplacing the Server/Client Component boundary in the MDX rendering pipeline

**What goes wrong:**
To make a demo interactive, the author marks an entire layout, the MDX wrapper, or `mdx-components.tsx` itself with `'use client'` "to make things work," rather than scoping `'use client'` to just the specific interactive leaf component. This silently converts the whole article — all the static prose, headings, and code blocks — into client-rendered code, eliminating the RSC/SSR benefits Next.js's App Router is supposed to provide and ballooning the client bundle for pages that are 95% static text.

**Why it happens:**
`'use client'` errors ("you're importing a component that needs `useState` ... this React Hook only works in a Client Component") are confusing for developers new to the App Router's module-graph-based boundary model, and the fastest way to silence the error is to slap `'use client'` on the file that's failing — which is often a shared wrapper, not the actual interactive piece. The directive marks a boundary in the *module dependency graph*, not the *render tree*, so placing it too high pulls everything imported beneath it into the client bundle.

**How to avoid:**
- Keep the MDX content pipeline (the page route, the MDX compiler, `mdx-components.tsx` for non-interactive elements) as server components by default.
- Extract every genuinely interactive demo into its own small client component file with `'use client'` at the top of *that file only*, and import it into the (server) MDX content as a leaf node.
- Pass any server-fetched or static data into client demo components as serializable props rather than importing server-only utilities directly inside a client component.
- When `next-mdx-remote` is used, note its RSC integration is explicitly called out as unstable upstream — `@next/mdx` (compile-time MDX via `next.config`) integrates more predictably with the App Router/RSC model for in-repo content and is the safer default for this project's MDX-in-repo constraint.

**Warning signs:**
- `'use client'` appears at the top of `mdx-components.tsx`, a layout file, or the MDX page route itself, rather than only in individual demo component files.
- The client bundle for a content-only post (no demos) is unexpectedly large.
- Adding an unrelated static MDX shortcode (e.g. a custom blockquote) requires touching a client component file.

**Phase to address:**
Address in the MDX pipeline / Next.js architecture phase, when deciding the MDX rendering approach (`@next/mdx` vs `next-mdx-remote`) and the component-registration pattern — this is a foundational decision that's expensive to unwind once dozens of posts depend on the wrong boundary placement.

---

### Pitfall 6: Hiring-manager-facing over-engineering signal (the over-engineered side project pattern)

**What goes wrong:**
The blog itself — not just any single demo — becomes the kind of artifact that signals poor engineering judgment to the exact audience it's meant to impress: excessive use of trendy/unnecessary technology for a blog (e.g. a custom GraphQL layer, a microservices "backend" for a static content site, a hand-rolled CMS, exotic state management for what is fundamentally server-rendered content), disproportionate complexity relative to the problem (a personal blog) being solved.

**Why it happens:**
A blog meant to "showcase how I think" creates pressure to demonstrate breadth of technical skill, which gets misapplied as "use as many advanced techniques as possible" rather than "use the right amount of engineering for the problem, and explain the reasoning." Reviewer/hiring-manager research on this exact pattern is explicit: an over-engineered todo-list/note-taking side project using many cutting-edge technologies is a documented red flag pattern recruiters associate with poor engineering judgment — the same risk applies directly to an over-engineered blog/portfolio site, since it is just as visible an artifact.

**How to avoid:**
- Every non-obvious technical choice in the codebase should be the kind of decision the blog itself could write a post about — if a choice can't be justified in one sentence of "why," it's probably overbuilt for this project.
- Resist adding infrastructure "to show I know X" unless X is actually load-bearing for a published post's content needs.
- The MDX-in-repo / no-CMS / Next.js choices already recorded in `PROJECT.md` are the right instinct — keep auditing new additions against that same "does this serve a shipped post" bar.

**Warning signs:**
- A piece of infrastructure exists primarily to demonstrate a skill rather than to serve a post.
- The README/architecture is more complex to explain than any single published post.
- Time spent on infra in a given week exceeds time spent writing, repeatedly.

**Phase to address:**
This is a standing review criterion across all phases rather than a single phase — apply it explicitly at each phase-completion review ("does this serve a shipped or imminently-shippable post?") and especially before any phase that adds new tooling/infrastructure.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|-----------------|------------------|
| Hand-paste code blocks instead of importing from source file | Faster to write the first post | Drift between article and real component over time (Pitfall 3) | Acceptable only for genuinely standalone, never-reused snippets unconnected to a live demo |
| Global `MDXProvider` eagerly registers all demo components | One-time setup, "just works" everywhere | Bundle bloat across all pages (Pitfall 4) | Never acceptable once more than 1-2 demos exist |
| `'use client'` on a shared wrapper to silence a hook error | Makes the error go away immediately | Whole-page client bundle, loses RSC benefits (Pitfall 5) | Never acceptable — always push the directive down to the leaf |
| Skipping manual a11y testing, relying on axe-core only | Faster per-post turnaround | Ships broken a11y demos under an a11y-focused post (Pitfall 2) | Never acceptable for Building Blocks posts (a11y is the post's thesis); more tolerable for purely visual Anatomy posts with no interactive demo |
| Building a generic "demo wrapper" component before the second post needs one | Feels like good architecture | Premature abstraction shaped by guesses, not real second use case | Acceptable to defer until the 2nd or 3rd demo reveals the actual shared shape needed |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|-------------------|
| `next-mdx-remote` | Used for in-repo content despite import/export restrictions and explicitly-unstable RSC support | Prefer `@next/mdx` (compile-time, via `next.config.js`) for in-repo MDX with native import/export and a more App-Router-native model |
| MDX + `mdx-components.tsx` | Missing or misconfigured root `mdx-components.tsx`, causing "Add the use client directive" errors at build time | Define `mdx-components.tsx` at the app root exactly per Next.js App Router docs; verify it doesn't itself need `'use client'` for the components it just maps (most don't) |
| Bundle analyzer tooling | Treated as a one-time check rather than a recurring gate | Run `@next/bundle-analyzer` (or Turbopack's built-in module graph inspector) on every phase/PR that adds a new demo, not just once at project setup |
| axe-core / automated a11y tools | Treated as sufficient proof of accessibility | Use as a baseline gate only; pair with manual keyboard and screen-reader passes for every interactive demo |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|------------------|
| Eager-loaded demo libraries (code editors, chart libs) in shared chunks | Large First Load JS on pages with no demos | Dynamic-import demo components per-post with `ssr: false` where needed | Becomes visible by the 2nd-3rd demo; compounds with every additional post |
| `'use client'` placed too high in the MDX render tree | Entire article ships as client JS instead of server-rendered HTML | Push `'use client'` to leaf demo components only | Breaks SSR/streaming benefits immediately, worsens linearly with post length |
| No per-route bundle budget | Bundle creep goes unnoticed until a Lighthouse/PageSpeed score regresses visibly | Set and check a First Load JS budget per post type as part of the publish checklist | Noticeable once 5-10 posts with varied demos exist and nobody's been tracking trend |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Live "playground"-style demos that eval arbitrary user-typed code client-side (e.g. a Sandpack/react-live editor) | XSS or runaway resource usage if the sandboxing isn't genuinely isolated | If using a live code-editing demo, use a properly sandboxed runtime (e.g. Sandpack's iframe-based execution) rather than `eval`/`new Function` in the main page context; for this project's stated needs (showcasing components, not a public code playground), prefer non-editable interactive demos over fully arbitrary live-editable ones |
| MDX content treated as fully trusted because "I wrote it" | Low risk here since single-author/no external contributions, but worth noting if contribution workflows are ever opened up | Keep MDX-in-repo (no external editor access) as currently scoped; re-evaluate sandboxing/sanitization only if external contributions are ever allowed |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-------------------|
| Demo loads with a layout shift / flash of unstyled content while client JS hydrates | Reader perceives the site as janky right where it's trying to prove engineering quality | Reserve layout space for demos (fixed min-height containers) and prefer SSR-friendly demos over `ssr:false` where the demo doesn't strictly need browser-only APIs |
| Demo embedded with no static fallback for JS-disabled/slow connections | Reader on a slow connection or with JS issues sees a broken hole in the article | Pair every live demo with a static code/screenshot fallback or graceful loading state, consistent with the project's existing "live demo or static, case-by-case" decision |
| Code block shown without the demo it describes actually matching (Pitfall 3) | Reader (especially a fellow engineer) loses trust in the post's technical accuracy | Single-source code blocks from the real component file (see Pitfall 3 prevention) |

## "Looks Done But Isn't" Checklist

- [ ] **Interactive demo:** Often missing keyboard-only operability — verify full Tab/Enter/Escape/Arrow-key flow manually, not just an axe-core pass.
- [ ] **Code block next to a live demo:** Often silently diverged from the real component source after a later refactor — verify the snippet still matches the actual file before publishing or republishing a post.
- [ ] **"Done" demo component:** Often missing a non-JS/loading-state fallback — verify the post still reads sensibly with the demo unmounted or loading.
- [ ] **Published post bundle:** Often quietly bloated by a demo's dependency leaking into a shared chunk — verify with bundle analyzer that unrelated pages didn't grow.
- [ ] **`'use client'` boundary:** Often placed on a wrapper/layout rather than the leaf component — verify by checking which files actually require client-only APIs, not just which file throws the error.
- [ ] **Cross-link from Anatomy post to Building Blocks post:** Often added once and never re-verified — verify the link still points to current, accurate content as both posts evolve.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|----------------|------------------|
| Over-built infra, zero posts shipped | MEDIUM | Freeze all infra work; ship the next post using only what currently exists, however imperfect; let real post #2/#3 needs drive the next infra change |
| Demo found inaccessible after publishing | LOW–MEDIUM | Patch the live component (single source of truth means the fix propagates to the displayed code too, if Pitfall 3's prevention is in place); add a changelog/correction note if the post made an explicit a11y claim that was wrong |
| Code/demo drift discovered | LOW | Diff the live component against the article's code block, update the snippet (or migrate to file-sourced snippets to prevent recurrence) |
| `'use client'` boundary misplaced across many posts | MEDIUM–HIGH | Identify the actual interactive leaf in each affected post, extract to its own client component, move `'use client'` down; re-verify bundle sizes per post afterward |
| Bundle bloat discovered late (many posts already published) | MEDIUM | Run bundle analyzer across all post routes, identify shared-chunk culprits, convert to dynamic imports retroactively, starting with the highest-traffic posts first |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|-------------------|----------------|
| Scope creep / CMS-before-content | Foundation/scaffolding phase (cap deliverable to post #1's needs) | Roadmap gate: phase 2 cannot start until post #1 is published |
| Inaccessible demos undermining a11y message | Demo-component-authoring phase / per-post UAT | Manual keyboard + screen-reader pass required before marking any a11y-themed post done |
| MDX/code drift | MDX pipeline / demo-embedding phase | Code blocks sourced from the real component file (build-time import), or a documented pre-publish diff check |
| Bundle bloat from shipping all demo JS everywhere | Architecture / demo-embedding phase | Per-post dynamic-import convention plus bundle-analyzer check on every phase that adds a demo |
| Misplaced Server/Client boundary | MDX pipeline / Next.js architecture phase | `'use client'` audit — confirm it appears only in leaf demo component files, never in `mdx-components.tsx` or layouts |
| Over-engineered portfolio signal | Standing review criterion, every phase | At each phase-completion review, confirm the addition serves a shipped or imminently-shippable post |

## Sources

- [Text content does not match server-rendered HTML — Next.js docs](https://nextjs.org/docs/messages/react-hydration-error) — MEDIUM (official docs)
- [Next.js Hydration Errors: Causes, Fixes, Prevention Checklist (Medium, 2026)](https://medium.com/@blogs-world/next-js-hydration-errors-in-2026-the-real-causes-fixes-and-prevention-checklist-4a8304d53702) — LOW, cross-checked against official docs → MEDIUM
- [Component hydration with MDX in Next.js and Nx](https://blog.nrwl.io/component-hydration-with-mdx-in-next-js-and-nx-90f46ea0431c) — LOW
- [Next.js Guides: Package Bundling](https://nextjs.org/docs/app/guides/package-bundling) — MEDIUM (official docs)
- [Code Splitting in Next.js: Reduced Initial Bundle Size by 70% (Medium)](https://medium.com/@sohail_saifi/code-splitting-in-next-js-how-i-reduced-initial-bundle-size-by-70-73a4c328cc6c) — LOW, directionally consistent with multiple similar case studies → MEDIUM
- [Automated accessibility testing with axe-core (Last Call Media)](https://lastcallmedia.com/blog/automated-accessibility-testing-axe-core-how-were-baking-a11y-every-build) — LOW
- [Playwright: Accessibility testing docs](https://playwright.dev/docs/accessibility-testing) — MEDIUM (official docs)
- [dequelabs/axe-core GitHub](https://github.com/dequelabs/axe-core) — MEDIUM (official source)
- [React Server Components in 2026: Patterns, Pitfalls, and When to Actually Use Them (jsmanifest)](https://jsmanifest.com/react-server-components-patterns-pitfalls-2026) — LOW, consistent with React/Next.js official docs → MEDIUM
- ['use client' directive — React official docs](https://react.dev/reference/rsc/use-client) — MEDIUM (official docs)
- [Navigating the Pitfalls of React Server Components (Leapcell)](https://leapcell.io/blog/navigating-the-pitfalls-of-react-server-components) — LOW, cross-checked → MEDIUM
- [Limitations of next-mdx-remote and an Alternative Approach](https://www.mdxblog.io/blog/next-mdx-remote-limitations) — LOW, cross-checked against multiple sources → MEDIUM
- [Using mdx provider in a server component — vercel/next.js discussion #50897](https://github.com/vercel/next.js/discussions/50897) — MEDIUM (official repo discussion)
- [I Analyzed 100 Tech Lead Portfolios: 5 Red Flags to Recruiters (Medium)](https://medium.com/@sohail_saifi/i-analyzed-100-tech-lead-portfolios-these-5-projects-are-red-flags-to-recruiters-04d03303d445) — LOW (anecdotal/single author claim, not a rigorous study)
- [Don't waste time on a (React) portfolio website — 60+ hiring managers survey (profy.dev)](https://profy.dev/article/portfolio-websites-survey) — LOW–MEDIUM (self-reported survey, larger sample than typical blog post)
- [mdx-deck-live-code GitHub](https://github.com/JReinhold/mdx-deck-live-code) — LOW (single project's documented limitation, used as illustrative pattern only)
- [Why It's OK to Over-engineer Your Blog (freeCodeCamp)](https://www.freecodecamp.org/news/why-its-ok-to-overengineer-your-blog/) — LOW (contrarian anecdote, included for balance but not load-bearing)
- Hacker News threads on personal technical blogging (various, 2024-2026) — LOW (anecdotal community sentiment, no rigorous data)

---
*Pitfalls research for: Next.js + MDX technical blog with embedded interactive component demos*
*Researched: 2026-06-29*
