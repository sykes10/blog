# Feature Research

**Domain:** Frontend-engineering technical blog (two content tracks: "Building Blocks" component deep-dives, "Anatomy of X" architecture breakdowns)
**Researched:** 2026-06-29
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features readers assume exist. Missing these makes the site feel unfinished or unprofessional — a bad signal for the hiring-manager audience specifically.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Syntax-highlighted code blocks | Every technical blog has this; unhighlighted code reads as amateur | LOW | Use Shiki or rehype-highlight server-side at build time — zero client JS cost, themeable, supports 180+ languages |
| Readable typography & responsive layout | Baseline reading experience; broken-on-mobile is an instant credibility loss for a frontend engineer's own blog | LOW | Mobile-first is non-negotiable — a frontend blog with a broken mobile layout actively undermines the "impress hiring managers" goal |
| Dark mode (no flash of wrong theme) | Expected default in 2026 dev-tool-adjacent sites; flash-of-wrong-theme reads as an unsolved CSS problem on a CSS-literate audience | LOW–MEDIUM | Use `next-themes` with blocking inline script, or cookie-based SSR theme resolution; theme MUST resolve before first paint, not after hydration |
| SEO essentials: Open Graph tags, meta description, canonical URLs | Needed for link previews when shared on Twitter/LinkedIn/Slack — primary distribution channel for this blog | LOW | Next.js Metadata API covers this natively per-route |
| Structured data (JSON-LD, Article/BlogPosting schema) | Improves discoverability and rich-result eligibility; signals technical rigor | LOW | Google's recommended format; doesn't touch visible markup |
| XML sitemap | Crawler discovery baseline | LOW | Next.js `sitemap.ts` route handler generates this automatically from content metadata |
| RSS/Atom feed | Tech-audience readers still subscribe via feed readers; signals respect for an engineering-literate audience | LOW–MEDIUM | Generate from the same content source used for MDX route generation |
| Reading time estimate | Minor but expected affordance on long-form technical content | LOW | `reading-time` npm package, computed at build time from MDX content |
| Table of contents / heading anchors | Essential for long architecture-breakdown posts (Anatomy of X will run long); lets readers jump to relevant sections and lets others deep-link | LOW–MEDIUM | `rehype-slug` + `rehype-autolink-headings` for anchors; TOC sidebar/inline component built from the heading tree |
| Tags/categories for content organization | Baseline navigation for any multi-post site; becomes load-bearing here because of the two-track structure | LOW | Should map to the two tracks (Building Blocks / Anatomy of X) as primary categories, with finer-grained tags (a11y, performance, react, etc.) cutting across both |
| Code block copy button | Universal expectation on technical content; tiny papercut if missing | LOW | Trivial client-side island |
| Fast page loads / good Core Web Vitals | A frontend engineer's blog being slow is a direct credibility failure — this audience will check Lighthouse | LOW–MEDIUM | Static generation (SSG) for all content pages; islands of interactivity only where demos require client JS |

### Differentiators (Competitive Advantage)

Features that set this blog apart from the median technical blog. These should map directly to the project's stated Core Value (teaching depth + demonstrating engineering thinking).

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Live interactive component demos embedded in posts | Directly proves frontend competence — a hiring manager sees working code, not just a description; a learning engineer can manipulate props/state to build intuition (this is what makes Josh Comeau's blog the gold standard in this space) | MEDIUM–HIGH | Use Sandpack for demos needing live editing + npm imports (heaviest, ~400KB+ gzip); use lighter custom React components for bespoke single-purpose widgets where a full sandbox is overkill. Decide case-by-case per project's existing requirement |
| Accessibility-focused callouts/sections per Building Blocks post | Differentiates from generic "here's a button component" posts; signals senior-level thinking since a11y is consistently the most-skipped consideration in component writeups | LOW–MEDIUM | Structured callout component (keyboard interactions, ARIA attributes, focus management, contrast) — modeled on design-system docs patterns (IBM Carbon's dedicated a11y tab is the reference pattern) |
| Design-system-readiness framing per component | No other personal blog does this consistently — most component tutorials stop at "here's how it works," not "here's how this scales into a design system." This is a genuine differentiator tied to the project's stated focus | MEDIUM | Structured sections per post: API shape, variant/theming strategy, composition patterns, when to extract vs inline |
| Cross-linking between Building Blocks and Anatomy of X posts | Unique to this site's two-track structure; demonstrates compounding knowledge architecture (a hiring manager sees systems thinking: "this person designed their own content to build on itself") | LOW–MEDIUM | Requires structured frontmatter (e.g. `relatedBuildingBlocks: [slug]`) resolved into bidirectional link components at build time; cross-linking should connect related "spoke" articles directly, not just route through a hub page |
| Architecture-breakdown diagrams for Anatomy of X posts | Visual systems diagrams (data flow, component boundaries) are rare in typical blogs but exactly what differentiates an "architecture breakdown" from a tutorial | MEDIUM | Can start as static SVG/image assets; interactive diagrams are a stretch goal, not v1 |
| Annotated/step-through code walkthroughs | Useful specifically for Anatomy of X posts walking through a complex feature's implementation incrementally | MEDIUM | Code Hike is purpose-built for this (step-by-step highlighting, used by Next.js's own docs) — lighter weight than Sandpack since no live editing needed |
| "How I built this" / build-log meta-post | A post about the blog's own architecture is a known genre move (Josh Comeau, Dan Abramov-adjacent authors all do this) — doubles as a Building Blocks/Anatomy of X case study about the site itself | LOW | Cheap to produce, high credibility signal, demonstrates the exact skills being marketed |
| Case-study framing on top posts | Survey data on hiring-manager-facing portfolios consistently flags "what did you own, what was hard, why does it matter" framing as more persuasive than generic tutorial framing | LOW | Editorial/writing practice more than a technical feature — but worth an explicit content template |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create disproportionate cost or risk for a single-author portfolio blog with no CMS and no monetization goal.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|------------------|-------------|
| Comments system (Disqus, giscus, utterances) | "Engagement" and reader feedback feel valuable | Disqus is ad-laden and privacy-invasive; GitHub-based options (giscus/utterances) require readers to have GitHub accounts and add a maintenance/moderation burden disproportionate to a single-author portfolio site. Per PROJECT.md, this is explicitly out of v1 scope already in spirit (no CMS, single author) | Link to a GitHub Discussions repo or just expose social-share links; let conversation happen on the platform where it's shared (Twitter/LinkedIn/HN) |
| Multi-author CMS / headless CMS | Seems like "future-proofing" for collaborators | PROJECT.md already explicitly rejects this — MDX-in-repo fits single-author git workflow and keeps demos embeddable; a CMS adds infrastructure and an editing abstraction layer with zero current users | Stay with MDX files in repo; revisit only if external editors are ever needed (already documented decision) |
| Newsletter / email capture | Common "growth" feature on technical blogs (Josh Comeau has one) | Adds an email-service dependency, a signup-conversion-optimization rabbit hole, and ongoing list-management overhead — disproportionate for a v1 whose stated success metric is "hiring conversations sparked," not audience size | RSS feed already covers discovery for engaged readers; revisit post-v1 if traffic and goals justify it |
| Full-text client-side search (Algolia, Pagefind, etc.) | Useful once content volume is large | At v1 scale ("a handful of Building Blocks posts"), a search index is solving a problem that doesn't exist yet — tags/categories and a clean homepage listing are sufficient navigation for a few dozen posts | Defer until post count grows past easy browsability (~20-30 posts); Pagefind is the lightweight static-search option to revisit then |
| Live demo for every Anatomy of X post | Seems consistent/thorough to always ship a working demo | PROJECT.md already flags this as a trap — some Anatomy of X subjects (e.g. a full booking system) are too complex for a faithful v1 interactive demo and forcing one either ships something misleadingly simplified or blocks publication entirely | Architecture-breakdown-only is an explicitly acceptable outcome; add a demo later if/when scope allows (already documented decision) |
| Heavy animation/motion design as a default across all pages | Looks polished, and Comeau's blog proves it can work | Animation-as-default raises implementation cost on every single post and risks distracting from the teaching content, which is the actual core value; also a performance/Core-Web-Vitals risk if not done carefully | Reserve interactivity/motion budget for where it demonstrates the concept being taught (e.g. an animated diagram in a post about animation) rather than decorating the whole site uniformly |
| Heavyweight sandbox (Sandpack) for every code example | Consistency argument: "use the same tool everywhere" | Sandpack's ~400KB+ gzip bundle on every post tanks load performance if used indiscriminately — directly contradicts the "fast, well-engineered site" signal this blog needs to send | Tiered approach already implied by PROJECT.md: static code + screenshots by default, live demo (lightest tool that fits: custom component > react-live > Sandpack) only where interactivity adds real teaching value |

## Feature Dependencies

```
Tags/categories for content organization
    └──requires──> Content frontmatter schema (track, tags, related-post slugs)

Cross-linking between Building Blocks and Anatomy of X
    └──requires──> Tags/categories for content organization
    └──requires──> Content frontmatter schema (relatedBuildingBlocks field)

Table of contents / heading anchors
    └──requires──> rehype-slug + rehype-autolink-headings in MDX pipeline

Live interactive component demos
    └──requires──> Client-component "island" boundary in otherwise-static MDX pages
    └──enhances──> Building Blocks posts (proves the component works)
    └──enhances──> Anatomy of X posts (proves the architecture works, where feasible)

Accessibility-focused callouts ──enhances──> Design-system-readiness framing
    (both depend on a consistent per-post structural template existing first)

RSS/Atom feed
    └──requires──> Same content source/build step used for MDX route generation

Dark mode (no flash) ──conflicts with nothing, but──requires careful ordering:
    └──requires──> Theme resolution logic running before first paint (architectural constraint, not just a UI toggle)

Full-text search ──conflicts with── v1 scope (deferred; revisit at higher post-count)

Heavyweight sandbox (Sandpack) for every demo ──conflicts with── Fast page loads / Core Web Vitals
    (resolved by tiered tool selection, not by avoiding interactivity altogether)
```

### Dependency Notes

- **Cross-linking requires content frontmatter schema:** Bidirectional links between a Building Blocks post and the Anatomy of X posts that reference it can't be hand-maintained reliably once there are more than a few posts — needs a structured field (e.g. `relatedBuildingBlocks: ["button", "input"]`) resolved into link components at build time. This must be designed before either content track scales past 2-3 posts.
- **Live demos require an explicit client/server boundary decision:** Per PROJECT.md, the architecture needs "islands of interactivity even on otherwise static/content-heavy pages." This is a foundational Next.js App Router decision (which components are Server Components vs Client Components) that should be settled early, not per-post.
- **Accessibility callouts and design-system-readiness framing both depend on a per-post structural template:** Building Blocks posts need a consistent shape (intro → behavior → a11y → scalability/design-system-readiness → code) for the differentiator to compound across posts rather than reading as one-off bonus content on a single post.
- **Heavyweight sandbox conflicts with fast page loads:** Resolved by the project's own stated approach — case-by-case choice between static code+screenshots, lightweight live editing, and full sandbox — rather than standardizing on one tool everywhere.
- **Full-text search conflicts with v1 scope:** Not a technical conflict, a prioritization one — building search infrastructure before there's enough content to need it is wasted effort that should be deferred.

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed for the "handful of Building Blocks posts live and worth sharing" bar from PROJECT.md.

- [ ] Syntax-highlighted code blocks — non-negotiable baseline for a code-heavy blog
- [ ] Responsive, readable typography — mobile breakage is disqualifying for this audience
- [ ] Dark mode, flash-free — expected default, cheap with `next-themes`
- [ ] SEO basics: Open Graph, meta tags, JSON-LD Article schema, sitemap — needed from post #1 since sharing is the primary distribution channel
- [ ] RSS feed — low cost, signals respect for the technical-reader audience
- [ ] Reading time + table of contents/heading anchors — needed once Anatomy of X posts run long
- [ ] Tags/categories mapped to the two tracks — foundational navigation, also unlocks cross-linking later
- [ ] Code block copy button — trivial, expected
- [ ] Per-post structural template for Building Blocks (a11y, scalability, design-system-readiness sections) — this is the core differentiator; must exist from post #1, not bolted on later
- [ ] Case-by-case code examples: static code+screenshot by default, lightweight live demo (custom component or react-live) where it clearly adds value — matches PROJECT.md's existing decision
- [ ] Cross-linking field in frontmatter (even if Anatomy of X hasn't shipped yet, build the schema now so it's not a retrofit)

### Add After Validation (v1.x)

Features to add once Building Blocks track is established and Anatomy of X begins.

- [ ] Anatomy of X track with architecture-breakdown structure and explicit cross-links back to Building Blocks — triggered once the Building Blocks track has enough posts to link from
- [ ] Sandpack-based full interactive sandbox — triggered when a specific post's teaching goal genuinely requires live npm-import editing, not by default
- [ ] Code Hike-style annotated step-through code walkthroughs — triggered by an Anatomy of X post that needs to narrate an implementation incrementally
- [ ] Architecture diagrams (static SVG to start) for Anatomy of X — triggered by the first Anatomy of X post

### Future Consideration (v2+)

Features to defer until content volume or goals justify the investment.

- [ ] Full-text search (Pagefind or similar) — defer until post count exceeds easy browsability (~20-30 posts)
- [ ] Newsletter — defer until there's a clear growth goal beyond "hiring conversations sparked"
- [ ] Interactive (not just static) architecture diagrams — nice-to-have polish, not core to the teaching value
- [ ] Comments — only reconsider if reader feedback becomes a stated goal; default is to stay out

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Syntax highlighting | HIGH | LOW | P1 |
| Responsive/readable layout | HIGH | LOW | P1 |
| Dark mode (flash-free) | MEDIUM | LOW | P1 |
| SEO (OG, JSON-LD, sitemap) | HIGH | LOW | P1 |
| RSS feed | MEDIUM | LOW | P1 |
| Reading time + TOC | MEDIUM | LOW | P1 |
| Tags/categories (two-track mapping) | HIGH | LOW | P1 |
| Per-post structural template (a11y/scalability/design-system) | HIGH | MEDIUM | P1 |
| Cross-linking frontmatter schema | HIGH | LOW | P1 |
| Case-by-case live demos (lightweight tier) | HIGH | MEDIUM | P1 |
| Anatomy of X track + diagrams | HIGH | MEDIUM | P2 |
| Sandpack full sandbox (selective use) | MEDIUM | HIGH | P2 |
| Code Hike step-through walkthroughs | MEDIUM | MEDIUM | P2 |
| Full-text search | LOW (at v1 scale) | MEDIUM | P3 |
| Newsletter | LOW | MEDIUM | P3 |
| Comments | LOW | MEDIUM | Anti-feature |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Josh Comeau (joshwcomeau.com) | Overreacted.io (Dan Abramov) | Our Approach |
|---------|-------------------------------|-------------------------------|--------------|
| Interactive demos | Heavy investment — custom Demo component shell, drag-to-explore graphs, React Spring/Framer Motion animation | None — pure text and static code blocks | Middle ground: live demos only where they demonstrably teach better than static code, per PROJECT.md's explicit case-by-case decision |
| Visual design | Distinctive, animation-rich, signature micro-interactions (SVG icon hovers, view transitions) | Deliberately minimal, no decoration, content-only | Lean toward Comeau's direction but budget it — motion/interactivity reserved for posts where it demonstrates the concept, not site-wide decoration |
| Content structure | Single-track long-form essays/guides | Single-track short-form posts | Two-track structure (Building Blocks / Anatomy of X) with explicit cross-linking — not seen in either reference site, this is the structural differentiator |
| Code playground tooling | Built and writes about his own Sandpack-based "world-class" playground | Plain static code blocks | Tiered: static code by default, Sandpack/react-live selectively, matching project's stated complexity/benefit tradeoff |
| Newsletter | Has one | Unknown/not prominent | Anti-feature for v1 — defer per this research |
| Comments | Not prominent in research found | None found | Anti-feature for v1 |
| Accessibility-as-content-focus | Not a primary content angle | Not a primary content angle | Differentiator — explicit a11y sections per Building Blocks post is not common practice in either reference site, making it a genuine point of distinction |

## Sources

- [Josh W. Comeau's blog](https://www.joshwcomeau.com/) — MEDIUM confidence (websearch, cross-referenced across multiple queries)
- [How I Built My Blog v2 — Josh W. Comeau](https://www.joshwcomeau.com/blog/how-i-built-my-blog-v2/) — MEDIUM confidence
- [A World-Class Code Playground with Sandpack — Josh W. Comeau](https://www.joshwcomeau.com/react/next-level-playground/) — MEDIUM confidence
- [overreacted.io — Dan Abramov's blog](https://overreacted.io/) — LOW confidence (limited detail surfaced in search; site itself is the primary source, not deeply analyzed)
- [Top Storybook Documentation Examples — Supernova.io](https://www.supernova.io/blog/top-storybook-documentation-examples-and-the-lessons-you-can-learn) — MEDIUM confidence
- [Storybook accessibility testing docs](https://storybook.js.org/docs/writing-tests/accessibility-testing) — MEDIUM confidence
- [Sandpack — CodeSandbox](https://sandpack.codesandbox.io/) and [GitHub repo](https://github.com/codesandbox/sandpack) — MEDIUM confidence
- [Build an interactive blog with React and Sandpack — LogRocket](https://blog.logrocket.com/build-interactive-blog-with-react-sandpack/) — MEDIUM confidence
- [next-themes — GitHub](https://github.com/pacocoursey/next-themes) — MEDIUM confidence
- [Next.js MDX guide — nextjs.org](https://nextjs.org/docs/app/guides/mdx) — MEDIUM confidence
- [Frontend Developer Portfolio guide — GreatFrontEnd](https://www.greatfrontend.com/blog/frontend-developer-portfolio) — MEDIUM confidence
- [A Designer's Guide to Documenting Accessibility — Stéphanie Walter](https://stephaniewalter.design/blog/a-designers-guide-to-documenting-accessibility-user-interactions/) — MEDIUM confidence
- [Designing Blog Taxonomy for UX and SEO — Digital Ink](https://digitalinkco.com/blog/designing-blog-taxonomy-for-ux-and-seo/) — MEDIUM confidence
- [Replacing Disqus with Giscus — justinmklam.com](https://www.justinmklam.com/posts/2025/08/replacing-disqus-with-giscus/) — MEDIUM confidence

---
*Feature research for: Frontend-engineering technical blog (Building Blocks + Anatomy of X tracks)*
*Researched: 2026-06-29*
