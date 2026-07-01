---
phase: quick-260701-vws
plan: 01
subsystem: content
tags: [style-compliance, mdx, patterns]
dependency-graph:
  requires: []
  provides: []
  affects: [content/patterns/toast-notification-system.mdx]
tech-stack:
  added: []
  patterns: [prose-punctuation-cleanup]
key-files:
  created: []
  modified:
    - content/patterns/toast-notification-system.mdx
decisions:
  - "Em dash before a list/elaboration replaced with a colon; em dash joining independent clauses replaced with a period and new sentence, or 'and'/'but' when the two clauses are tightly related"
  - "Trade-offs table Pro/Con cells with a semicolon split into two short sentences separated by a period, keeping the table at 5 rows x 4 columns"
  - "Quoted UI string \"Item deleted — Undo\" rephrased to \"Item deleted\", with an Undo action to preserve the label's meaning without an em dash"
metrics:
  duration: "~15 minutes"
  completed: 2026-07-01
status: complete
---

# Quick Task 260701-vws: Review content/patterns for toast-notification-system Summary

Rewrote the prose of `content/patterns/toast-notification-system.mdx` to remove every em dash and prose semicolon per WRITING-STYLE.md, without changing any technical claim, code sample, Callout, heading, or frontmatter.

## What Was Done

Read `WRITING-STYLE.md` in full (Sections 2-5) and `content/patterns/toast-notification-system.mdx` in full, then applied a punctuation-only style pass:

- Fixed 12 prose locations containing an em dash, replacing each with the Section 3 move that fit the sentence: a period and new sentence, a colon before an elaboration, "and"/"but" to join two clauses, or a comma-based rephrase for the quoted UI string example.
- Fixed 6 prose locations containing a semicolon, including 5 table rows (10 cells total, one Pro/Con pair per row) in the Trade-offs table, each split into two short sentences separated by a period.
- Left all em dashes and semicolons inside fenced code blocks (HTML live-region example, `toastToAriaPolicy` TSX, CSS `@media`/`@keyframes` blocks, TypeScript interfaces, `toastReducer` and `useToastTimer` TSX, and their code comments) completely untouched, since those are code syntax, not prose.

## Deviations from Plan

None. Plan executed exactly as written. All twelve identified prose locations from the plan's "Known prose locations to fix" list were confirmed against the live file via the awk fence-aware scan and fixed using the fitting Section 3 replacement move. No additional out-of-list prose punctuation was found beyond what the plan anticipated (the scan matched the plan's list one-to-one).

## Verification

Ran the plan's verification command:

```bash
test -z "$(awk 'BEGIN{c=0} /^```/{c=!c; next} !c && (/—/ || /;/){print NR}' content/patterns/toast-notification-system.mdx)" && [ "$(grep -c '^## ' content/patterns/toast-notification-system.mdx)" = 8 ] && [ "$(grep -c '<Callout' content/patterns/toast-notification-system.mdx)" = 2 ] && echo PASS
```

Result: `PASS`

- Zero prose em dashes or semicolons remain (fenced code blocks excluded by the awk toggle and confirmed untouched via diff review).
- All eight `## ` H2 sections present: The Problem Toast Solves, When to Use (and When Not To), Trade-offs, Common Mistakes, Accessibility Considerations, Performance Implications, Edge Cases, Implementation Considerations.
- Both `<Callout>` blocks (tip and note) present with attributes and text unchanged.
- Trade-offs table retains 5 data rows and 4 columns (Approach, Pro, Con, When to Prefer); no `|` pipe introduced inside any cell.
- Frontmatter, all code fences, and every technical claim confirmed unchanged via `git diff` review (17 insertions, 17 deletions, all within prose lines).

## Known Stubs

None. This was a prose punctuation pass on an existing complete file; no new stubs introduced.

## Threat Flags

None. Content-only MDX prose edit; no new network, auth, file-access, or schema surface introduced.

## Self-Check: PASSED

- FOUND: content/patterns/toast-notification-system.mdx
- FOUND: fdf7caf (commit hash)
