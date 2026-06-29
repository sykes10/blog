# Frontend Blueprints

## What This Is

Frontend Blueprints is a knowledge base for engineers who want to build production-ready frontend products. The focus isn't frameworks or APIs, but how real-world interfaces are designed, implemented, and evolved — UX, architecture, state management, accessibility, performance, analytics, and engineering trade-offs. The site is built around two content types: **Blueprints** (comprehensive, multi-perspective analyses of complete features — "how would you design and build this for production?") and **Patterns** (focused explorations of a single reusable concept — component, behaviour, or engineering technique — "what's the best way to solve this recurring problem?"). Blueprints are composed of Patterns; a Pattern can be referenced by many Blueprints, forming a connected knowledge base. Built on Next.js, authored in MDX.

## Core Value

Every Blueprint or Pattern must give the reader a production-grade mental model — not a tutorial — for that piece of the system: timeless content covering the "why" and the trade-offs as much as the "how," readable by a hiring manager wanting to understand how the author thinks, or an engineer who needs a reference next time they face the same problem.

## Business Context

- **Customer**: Hiring managers evaluating the author, and frontend engineers looking to deepen their knowledge
- **Revenue model**: None — this is a reputation/portfolio asset, not monetized
- **Success metric**: Depth and clarity of content; reach (shares, engagement); hiring conversations sparked

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Patterns track: focused articles on a single reusable concept (component, behaviour, or engineering technique), each covering the problem it solves, when to use/not use it, trade-offs, common mistakes, accessibility, performance, edge cases, and implementation considerations
- [ ] Code examples per Pattern article, chosen case-by-case: live interactive demo where it adds value, static code + screenshots otherwise
- [ ] Blueprints track: comprehensive, multi-perspective analyses of complete production features (e.g. LLM chat, search, authentication, checkout), covering user goals, journeys, UI anatomy, state/data model, interactions, edge cases, a11y, performance, security, analytics, architecture, and testing strategy — depth chosen per feature, not every perspective mandatory for every post
- [ ] Blueprints reference the Patterns they're composed of; Patterns can be referenced by multiple Blueprints (many-to-many cross-linking)
- [ ] Blueprints include a working demo where feasible; architecture-only is acceptable when the feature is too complex for a v1 demo
- [ ] Posts authored as MDX files committed to the repo (no CMS)
- [ ] Site built on Next.js

### Out of Scope

- Headless CMS / non-technical editing — MDX-in-repo fits the single-author workflow and keeps code demos embeddable directly in content; revisit only if external editors are ever needed
- Live demos for every Blueprint — architecture breakdown ships first when a feature is too complex for a working demo; demo can follow later
- Framework-specific tutorials — content stays timeless and valuable regardless of framework/technology churn

## Context

- Single author, frontend engineer, building this as a portfolio/reputation asset rather than a quick experiment
- Two readerships: hiring managers assessing how the author thinks and approaches problems, and frontend engineers looking to widen their knowledge
- v1 success bar: a handful of Pattern articles live and worth sharing; the Blueprints track can follow once Patterns is established
- Some code examples need to run live in the browser (interactive demos), which has architectural implications — likely islands of interactivity even on otherwise static/content-heavy pages
- Repo was empty prior to this initialization (no existing scaffold, no package.json) — fully greenfield
- **Guiding principles** (from the author's content strategy): think in systems, not components; prioritize production-ready solutions over framework-specific tutorials; cover the "why" as much as the "how"; always discuss trade-offs and edge cases; write timeless content; keep Blueprints comprehensive and Patterns focused; treat every UI element as a product decision, not just a visual component

## Constraints

- **Tech stack**: Next.js — explicit choice by the author over alternatives like Astro
- **Authoring**: MDX files in the repo, not a headless CMS — keeps code demos embeddable directly in content and fits a single-author git workflow

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js over Astro | Author's explicit preference; React ecosystem fits embedded interactive demos well | — Pending |
| MDX-in-repo over headless CMS | Single author, wants code demos embedded directly in content, fits git workflow | — Pending |
| Code examples: live demo or static, case-by-case | Not every example needs interactivity; decided per post based on complexity/benefit | — Pending |
| Blueprints: architecture first, demo optional | Demos deferred when feature complexity makes a working demo impractical for v1 | — Pending |
| Renamed Building Blocks → Patterns, Anatomy of X → Blueprints; broadened Patterns beyond UI components to behaviours/engineering/UX techniques | Author's content strategy doc clarified the site as a connected knowledge base (Patterns compose into Blueprints, many-to-many), not just a components-vs-features split | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-29 after content-strategy revision*
