# Phase 2: Live Demos & Patterns Track - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-30
**Phase:** 2-Live Demos & Patterns Track
**Areas discussed:** New post topics

---

## New post topics

### Q1: Which additional categories to cover?

| Option | Description | Selected |
|--------|-------------|----------|
| Behaviours | How a UI behaves over time — optimistic updates, debounce/throttle, focus management, loading skeletons, form state machines. | ✓ |
| Engineering | Frontend system design — caching strategies, error boundaries, code splitting, SSR vs CSR tradeoffs, state architecture. | ✓ |
| UX | Interface decisions that shape the user experience — empty states, progressive disclosure, feedback patterns, multi-step flows. | ✓ |

**User's choice:** All three remaining categories (Behaviours, Engineering, UX)
**Notes:** User indicated interest in all categories; subsequent question clarified Phase 2 scope.

---

### Q2: How many new posts for Phase 2?

| Option | Description | Selected |
|--------|-------------|----------|
| 1 new post | One post in a second category. Faster to ship, easier to maintain quality. | ✓ |
| 2 new posts | Two posts covering two different categories. Recommended for a credible browsing library at launch. | |
| 3 new posts | One per remaining category (Behaviours, Engineering, UX). Comprehensive but heavier scope. | |

**User's choice:** 1 new post
**Notes:** Phase 2 ships Toast (existing, Components) + one new post. Additional Engineering and UX posts deferred.

---

### Q3: What topic for the new post?

| Option | Description | Selected |
|--------|-------------|----------|
| Optimistic updates (Behaviours) | How to update the UI before the server confirms — state machines, rollback, error recovery. Rich depth, relevant to any CRUD app. | ✓ |
| Error boundaries (Engineering) | React error boundaries as a resilience pattern — granular recovery, fallback UI design, telemetry hooks. | |
| Empty states (UX) | How to design and implement meaningful empty states — context-aware messaging, progressive disclosure, CTA placement. | |
| Let me describe it | I have a specific topic in mind — I'll type it. | |

**User's choice:** Optimistic updates (Behaviours)

---

### Q4: Live demo or static code examples?

| Option | Description | Selected |
|--------|-------------|----------|
| Live demo | Interactive component showing optimistic state, simulated network delay, and rollback on error. Satisfies PATT-02. | ✓ |
| Static code examples | Annotated code snippets — no interactive component needed. Simpler to author. | |
| Live demo on Toast instead | Add the live demo to the existing Toast post, keep Optimistic Updates as static examples. | |

**User's choice:** Live demo
**Notes:** Optimistic Updates becomes the PATT-02 deliverable for Phase 2.

---

## Areas Not Discussed (Claude's Discretion)

The following gray areas were presented but not selected for discussion — implementation is at Claude's discretion:

- **Category/tag browsing** (PATT-04): URL-based category routes vs. client-side filter on `/patterns`
- **Table of contents** (SITE-04): Inline at article top vs. sticky sidebar; visibility rule for post length

## Deferred Ideas

- Engineering category post (error boundaries, caching strategies) — deferred to Phase 3 or later
- UX category post (empty states, progressive disclosure) — deferred to Phase 3 or later
- Toast live demo (fire/stack/dismiss interactive) — deferred; Phase 2 demo effort goes to Optimistic Updates
