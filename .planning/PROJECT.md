# Frontend Engineering Blog

## What This Is

A personal blog focused on frontend engineering, structured around two distinct tracks: **Building Blocks** (deep dives on common UI components — buttons, inputs, etc. — covering accessibility, scalability, and design-system readiness, with code examples) and **Anatomy of X** (architecture breakdowns of complex real-world features like booking systems and LLM chat interfaces, cross-linking back to relevant Building Blocks pieces). Built on Next.js, authored in MDX.

## Core Value

Each post must teach a frontend engineering concept thoroughly enough that a hiring manager reading it understands how the author thinks and structures engineering approaches, and another frontend engineer reading it leaves with usable knowledge.

## Business Context

- **Customer**: Hiring managers evaluating the author, and frontend engineers looking to deepen their knowledge
- **Revenue model**: None — this is a reputation/portfolio asset, not monetized
- **Success metric**: Depth and clarity of posts; reach (shares, engagement); hiring conversations sparked

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Building Blocks article track covering common UI components (buttons, inputs, etc.) discussing a11y, scalability, and design-system readiness
- [ ] Code examples per Building Blocks post, chosen case-by-case: live interactive demo where it adds value, static code + screenshots otherwise
- [ ] Anatomy of X article track covering complex real-world features (e.g. booking systems, LLM chat interfaces) as architecture breakdowns
- [ ] Anatomy of X posts cross-link back to the relevant Building Blocks posts they build on
- [ ] Anatomy of X posts include a working demo where feasible; architecture-only is acceptable when the feature is too complex for a v1 demo
- [ ] Posts authored as MDX files committed to the repo (no CMS)
- [ ] Site built on Next.js

### Out of Scope

- Headless CMS / non-technical editing — MDX-in-repo fits the single-author workflow and keeps code demos embeddable directly in content; revisit only if external editors are ever needed
- Live demos for every Anatomy of X post — architecture breakdown ships first when a feature is too complex for a working demo; demo can follow later

## Context

- Single author, frontend engineer, building this as a portfolio/reputation asset rather than a quick experiment
- Two readerships: hiring managers assessing how the author thinks and approaches problems, and frontend engineers looking to widen their knowledge
- v1 success bar: a handful of Building Blocks posts live and worth sharing; the Anatomy section can follow once Building Blocks is established
- Some code examples need to run live in the browser (interactive demos), which has architectural implications — likely islands of interactivity even on otherwise static/content-heavy pages
- Repo was empty prior to this initialization (no existing scaffold, no package.json) — fully greenfield

## Constraints

- **Tech stack**: Next.js — explicit choice by the author over alternatives like Astro
- **Authoring**: MDX files in the repo, not a headless CMS — keeps code demos embeddable directly in content and fits a single-author git workflow

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js over Astro | Author's explicit preference; React ecosystem fits embedded interactive demos well | — Pending |
| MDX-in-repo over headless CMS | Single author, wants code demos embedded directly in content, fits git workflow | — Pending |
| Code examples: live demo or static, case-by-case | Not every component example needs interactivity; decided per post based on complexity/benefit | — Pending |
| Anatomy posts: architecture first, demo optional | Demos deferred when feature complexity makes a working demo impractical for v1 | — Pending |

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
*Last updated: 2026-06-29 after initialization*
