---
phase: quick-260701-was
plan: 01
subsystem: content
tags: [writing-style, patterns-page, punctuation]
dependency-graph:
  requires: []
  provides: []
  affects: [app/patterns/page.tsx]
tech-stack:
  added: []
  patterns: []
key-files:
  created: []
  modified:
    - app/patterns/page.tsx
decisions:
  - "Used a colon (per WRITING-STYLE.md Section 3 replacement move) to introduce the list following each sentence, replacing the banned em dash"
metrics:
  duration: "2 minutes"
  completed: 2026-07-01
status: complete
---

# Quick Task 260701-was: Remove em dashes from patterns page Summary

Replaced the two remaining em dash characters in `app/patterns/page.tsx` (metadata description and page subtitle) with colons, per `WRITING-STYLE.md` Section 3's ban on the em dash in prose.

## What Changed

**File:** `app/patterns/page.tsx`

1. **Metadata description (line 7):** "Focused explorations of reusable frontend concepts — components, behaviours, and engineering techniques." became "Focused explorations of reusable frontend concepts: components, behaviours, and engineering techniques."

2. **Page subtitle (lines 20-21):** "Focused explorations of a single reusable concept — component, behaviour, or engineering technique." became "Focused explorations of a single reusable concept: component, behaviour, or engineering technique."

Both replacements use a colon, per `WRITING-STYLE.md`'s guidance: "To introduce a list or an elaboration, use a colon." This is a direct fit since both sentences use the em dash to introduce an elaborating list. Meaning and tone are unchanged.

The Tailwind CSS custom property syntax (`text-(--foreground)`, `text-(--muted)`, `text-(--border)`) was left untouched, as required.

## Verification

Ran the plan's automated verify command:

```bash
! grep -n '—' app/patterns/page.tsx && grep -q 'text-(--foreground)' app/patterns/page.tsx
```

Result: passed. No em dash remains in the file, and the CSS variable syntax is intact.

## Deviations from Plan

None - plan executed exactly as written.

## Commit

- `fb1329f`: fix(quick-260701-was): remove em dashes from patterns page prose

## Self-Check: PASSED

- FOUND: app/patterns/page.tsx (modified, no em dash, CSS variables intact)
- FOUND: fb1329f in git log
