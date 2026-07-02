---
status: testing
phase: 02-live-demos-patterns-track
source: [02-VERIFICATION.md]
started: 2026-07-02T15:48:16Z
updated: 2026-07-02T15:48:16Z
---

## Current Test

number: 1
name: Optimistic demo failure/rollback path (visible + screen-reader announced)
expected: |
  Navigate to /patterns/optimistic-updates and click the Like button repeatedly (the
  demo simulates a ~40% random failure rate, so a handful of clicks should trigger a
  failure). Also run this with NVDA + Firefox. On failure, the like count/state
  visually reverts to what it was before the click, a visible red error message
  appears ("Update failed. Please try again."), and the screen reader announces the
  error text through the role="status" region.
awaiting: user response

## Tests

### 1. Optimistic demo failure/rollback path (visible + screen-reader announced)
expected: |
  On failure, the like count/state visually reverts to what it was before the click,
  a visible red error message appears ("Update failed. Please try again."), and the
  screen reader announces the error text through the role="status" region. The failure
  is randomized (~40% of clicks) — click repeatedly until one fails.
result: [pending]

### 2. Keyboard-only pass across all three new interactive surfaces
expected: |
  Using only Tab/Shift+Tab/Enter/Space (no mouse), every interactive element across
  the Optimistic Updates demo button, the /patterns/category/* links, the /patterns
  tag filter chips, and the TOC links on a post page is reachable via Tab in a logical
  order, operable via Enter/Space, with a visible focus indicator.
result: [pending]

### 3. Table of contents scroll-spy active-heading highlight
expected: |
  Open a Pattern post (e.g. /patterns/toast-notification-system) and scroll through
  its sections. As each section heading enters the "reading zone" of the viewport, its
  corresponding TOC link gains aria-current="location" and a visible highlight
  (bold/foreground-colored), and the highlight moves to the next heading as you
  continue scrolling.
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps
