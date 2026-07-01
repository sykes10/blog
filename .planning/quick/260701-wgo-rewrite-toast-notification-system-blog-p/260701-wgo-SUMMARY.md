---
phase: quick
plan: 260701-wgo
subsystem: content
tags: [writing-style, mdx, style-guide, toast-notifications]

requires:
  - phase: quick-260701-vws
    provides: prior WRITING-STYLE.md-compliant rewrite of toast-notification-system.mdx
provides:
  - Two new documented rules in WRITING-STYLE.md (colon-as-dash-substitute ban, prefer-common-words)
  - Rewritten prose in content/patterns/toast-notification-system.mdx complying with the full rule set
affects: [future-content-writing, style-guide-enforcement]

tech-stack:
  added: []
  patterns:
    - "Bold lead-in list items end with a period, not a colon, before the explanatory clause"
    - "Mid-sentence colon clause-joins reworded to two sentences or and/so/because connectors"

key-files:
  created: []
  modified:
    - WRITING-STYLE.md
    - content/patterns/toast-notification-system.mdx

key-decisions:
  - "Placed the colon-as-dash-substitute rule directly after the existing 'Replacement moves' bullet list in Section 3, with an inline do/dont example, since that is where the sibling punctuation rules already live"
  - "Placed the prefer-common-words rule as a new paragraph following the sentence-length guidance in Section 3, described generically (no literal WCAG term quoted) so it reads as a general principle"
  - "For the WCAG 2.2.2 reference, kept the formal singular term in the direct citation (needed for lookup) but softened the follow-on reference from 'this criterion' to 'these guidelines' in running prose"

patterns-established:
  - "Colon rule: colons stay valid for introducing lists/elaborations; banned only when gluing two independent clauses like a dash would"

requirements-completed: [WRITING-STYLE-COLON-RULE, WRITING-STYLE-PLAIN-WORD-RULE, TOAST-POST-DASH-REWRITE]

coverage:
  - id: D1
    description: "WRITING-STYLE.md documents the colon-as-dash-substitute ban with a do/dont example"
    requirement: "WRITING-STYLE-COLON-RULE"
    verification:
      - kind: manual_procedural
        ref: "grep -ci colon WRITING-STYLE.md (returns 5, confirms new rule text and example present)"
        status: pass
    human_judgment: false
  - id: D2
    description: "WRITING-STYLE.md documents preferring common/everyday words over uncommon/formal ones"
    requirement: "WRITING-STYLE-PLAIN-WORD-RULE"
    verification:
      - kind: manual_procedural
        ref: "Read WRITING-STYLE.md Section 3, new paragraph after sentence-length guidance"
        status: pass
    human_judgment: false
  - id: D3
    description: "toast-notification-system.mdx prose rewritten to remove colon-as-dash-substitute usage, em/en dash connectors, and the formal singular WCAG term reference in running prose, with all code blocks byte-identical"
    requirement: "TOAST-POST-DASH-REWRITE"
    verification:
      - kind: manual_procedural
        ref: "git diff content/patterns/toast-notification-system.mdx (all hunks are prose-only); grep -c em/en dash counts (em dash count 2, both inside tsx code comments; en dash count 0)"
        status: pass
    human_judgment: false

duration: 12min
completed: 2026-07-01
status: complete
---

# Quick Task 260701-wgo: Rewrite toast notification system prose per new WRITING-STYLE.md rules Summary

**Added a colon-as-dash-substitute ban and a prefer-common-words rule to WRITING-STYLE.md, then rewrote toast-notification-system.mdx prose to comply, leaving all code blocks byte-identical.**

## Performance

- **Duration:** 12 min
- **Tasks:** 2 completed
- **Files modified:** 2

## Accomplishments
- WRITING-STYLE.md Section 3 now bans using a colon as a dash/double-hyphen substitute for joining clauses, with an inline do/dont example
- WRITING-STYLE.md now documents a rule preferring common, everyday words over uncommon/formal technical terms
- toast-notification-system.mdx bold lead-in list items (Queue management, Accessibility, Auto-dismiss timing, Stacking and positioning, and the four "Avoid toasts for" items) now end with a period instead of a colon before the explanatory clause
- Mid-sentence colon clause-joins (dismiss timer scaling, live region DOM timing, aria-atomic explanation, React re-render timer state, toast batching/collapsing) reworded into two sentences or reconnected with "and"/"so"/"because"
- The WCAG 2.2.2 follow-on reference ("this criterion") softened to the common plural "these guidelines" in running prose, while the direct citation (Success Criterion 2.2.2) is preserved for lookup purposes
- All fenced code blocks, inline code spans, and JSX/Callout tags confirmed byte-identical via git diff (only prose lines changed)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add two new rules to WRITING-STYLE.md** - `e4ab48d` (feat)
2. **Task 2: Rewrite toast-notification-system.mdx prose per full WRITING-STYLE.md rule set** - `35b2f68` (fix)

_Docs commit (SUMMARY.md, STATE.md) handled by orchestrator, not included above._

## Files Created/Modified
- `WRITING-STYLE.md` - Added colon-as-dash-substitute ban (with do/dont example) and prefer-common-words rule to Section 3
- `content/patterns/toast-notification-system.mdx` - Rewrote prose (bold lead-ins, mid-sentence clause joins, WCAG reference wording) to comply with the full rule set; code blocks untouched

## Decisions Made
- Colon rule placed directly after the existing "Replacement moves" bullets since it's a sibling punctuation rule, not a separate section
- Common-words rule described generically (no literal WCAG term named) so it reads as a reusable principle rather than a one-off fix
- Kept the formal WCAG citation identifier itself intact for lookup purposes; only the prose that refers back to it in running text was softened toward the plural/common form

## Deviations from Plan

None beyond the plan's own explicit scope. One additional mid-sentence colon-as-clause-glue instance was found during the full-file scan required by Task 2 ("The timer state should stay outside React: use a `ref`...") that wasn't named in the plan's four call-outs; it matched the same anti-pattern described in fix item 2 and item 4 (scan the full prose for other occurrences), so it was fixed under the plan's own instruction to scan for "any other" such usage rather than as an out-of-plan deviation.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- WRITING-STYLE.md now has a complete rule set covering dash-substitute colons and word-choice register; future content rewrites (including any remaining posts) can be checked against it directly
- toast-notification-system.mdx is now fully compliant with WRITING-STYLE.md; no further rewrite pass needed for this file

## Self-Check: PASSED

- FOUND: WRITING-STYLE.md
- FOUND: content/patterns/toast-notification-system.mdx
- FOUND: e4ab48d (git log --oneline --all confirms)
- FOUND: 35b2f68 (git log --oneline --all confirms)

---
*Phase: quick*
*Completed: 2026-07-01*
