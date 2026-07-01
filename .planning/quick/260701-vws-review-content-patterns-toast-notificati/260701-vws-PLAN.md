---
phase: quick-260701-vws
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - content/patterns/toast-notification-system.mdx
autonomous: true
requirements: [QUICK-260701-vws]
must_haves:
  truths:
    - "The rendered post reads in a human voice with no em dash characters or prose semicolons"
    - "Every technical claim, code sample, Callout, heading, and frontmatter field from the original is preserved unchanged"
    - "The trade-offs table keeps all five rows and four columns, with Pro/Con cells rephrased to avoid semicolons"
  artifacts:
    - "content/patterns/toast-notification-system.mdx (rewritten prose, same structure)"
  key_links:
    - "WRITING-STYLE.md Section 3 replacement moves drive every punctuation fix"
    - "awk code-fence exclusion distinguishes prose punctuation from code syntax"
---

<objective>
Apply WRITING-STYLE.md retroactively to the only published content file: rewrite the prose of `content/patterns/toast-notification-system.mdx` to remove all em dashes (—) and prose semicolons (;), keep a human tone, and cut structural AI-tell habits, without changing any technical fact, code sample, Callout, heading, or frontmatter.

Purpose: WRITING-STYLE.md is the newly-established canonical style reference. This is the first content file to be brought into compliance. It sets the bar every future Pattern and Blueprint will be held to.

Output: The same MDX file, same structure and argument, with compliant prose.
</objective>

<execution_context>
@C:/Users/Alex/workspace/blog/.claude/gsd-core/workflows/execute-plan.md
@C:/Users/Alex/workspace/blog/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@WRITING-STYLE.md
@content/patterns/toast-notification-system.mdx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Read the style guide, then rewrite the MDX prose to remove em dashes and prose semicolons</name>
  <files>content/patterns/toast-notification-system.mdx</files>
  <action>
Read `WRITING-STYLE.md` in full first (Sections 2, 3, 4, and 5 are the operative ones), then read `content/patterns/toast-notification-system.mdx` in full. This is a STYLE PASS, not a content rewrite. Preserve every technical fact, every fenced code block verbatim, both `<Callout>` blocks (their attributes and text), the frontmatter, and all six `##` H2 headings. Do not add or remove any technical claim. Do not restructure the argument.

Note: the file has EIGHT `##` H2 sections (The Problem Toast Solves, When to Use, Trade-offs, Common Mistakes, Accessibility Considerations, Performance Implications, Edge Cases, Implementation Considerations). All eight must survive the edit unchanged.

Fix two banned marks in PROSE ONLY (never inside fenced code blocks delimited by triple backticks, where `;` is TS/TSX/CSS/HTML syntax and must stay):

1. The em dash character (—).
2. The semicolon (;) when it appears in prose (body sentences, list items, and table cells).

Apply the Section 3 replacement moves, choosing the one that fits each case rather than a mechanical swap: period plus a new sentence, a comma, parentheses, a colon before a list or elaboration, or "and"/"but" to join two clauses. Pick the move that keeps the sentence reading as a real human decision about structure.

Known prose locations to fix (verify against the live file, do not treat as exhaustive):
- Intro paragraph "communicate transient, non-blocking feedback to users — ..." (the em dash before the quoted examples).
- List item "The right layout behaviour under accumulation is not obvious — it depends on...".
- List item `("Item deleted — Undo")`. Keep the quoted UI string meaningful, for example rephrase to `("Item deleted", with an Undo action)` so the label is not lost.
- Common Mistakes: "scale with the content length — a common formula is...".
- Common Mistakes: `role="alert"` "is equivalent to `aria-live="assertive"` — it interrupts...".
- Common Mistakes: "The toast is a notification vehicle; the undo callback is business logic." (semicolon) and "close gracefully — not leave an orphaned callback." (em dash).
- Accessibility: "before any toasts are added to it — screen readers register live regions at parse time...".
- Accessibility: "(Pause, Stop, Hide — Level AA)". Keep the WCAG parenthetical intact, for example `(Pause, Stop, Hide, Level AA)` or `(Pause, Stop, Hide at Level AA)`.
- Accessibility numbered item: "Respect `prefers-reduced-motion` — when the user has requested reduced motion...".
- Performance: "The timer state should stay outside React — use a `ref`..." (em dash) and "not worth the re-render cost; prefer CSS animations..." (semicolon).
- Performance: "before they reach the queue — `10 uploads complete` is more useful...".
- On using a library Callout: "the current gold-standard implementation — it handles queue management...".

Trade-offs table (lines with `| ... |`): each of the five data rows has a Pro cell and a Con cell that join two clauses with a semicolon. Rewrite each cell to drop the semicolon while keeping the table structure intact (still five rows, still four columns: Approach, Pro, Con, When to Prefer). Prefer splitting each cell into two short phrases separated by a period, or rephrasing to a single clause. Keep cells terse so the table still renders cleanly. Example: `Never clutters the viewport; clear and unambiguous` becomes `Never clutters the viewport. Clear and unambiguous.` Do not introduce a `|` pipe inside any cell.

While fixing punctuation, also apply Sections 2, 4, and 5 lightly where a fix already touches the sentence: keep the human tone, do not add hedging or formulaic transitions, do not pad. Do NOT do a wholesale rewrite for style beyond what the punctuation edits naturally touch. The primary deliverable is punctuation compliance with meaning fully preserved.

IMPORTANT: The em dash characters and semicolons INSIDE fenced code blocks (the HTML live-region example, the `toastToAriaPolicy` TSX, the CSS `@media`/`@keyframes`/`.toast-region` blocks, the TypeScript interfaces, the `toastReducer` and `useToastTimer` TSX) are code syntax and code comments. Leave code syntax semicolons untouched. Code COMMENTS inside fences are exempt from this pass too. Do not edit anything between triple-backtick fences.
  </action>
  <verify>
    <automated>test -z "$(awk 'BEGIN{c=0} /^```/{c=!c; next} !c && (/—/ || /;/){print NR}' content/patterns/toast-notification-system.mdx)" && [ "$(grep -c '^## ' content/patterns/toast-notification-system.mdx)" = 8 ] && [ "$(grep -c '<Callout' content/patterns/toast-notification-system.mdx)" = 2 ] && echo PASS</automated>
  </verify>
  <done>
The `awk` scan (which excludes fenced code blocks) reports zero prose lines containing an em dash or a semicolon. The file still has exactly eight `## ` H2 sections and exactly two `<Callout` blocks. All frontmatter, code blocks, and technical claims are unchanged. The trade-offs table still has five data rows and four columns. Verify command prints PASS.
  </done>
</task>

</tasks>

<verification>
Run the verify command. It confirms three things at once:
1. No em dash or semicolon survives in prose (fenced code excluded by the awk fence toggle).
2. Eight H2 sections remain (structure preserved).
3. Both Callout blocks remain.

Then spot-read the trade-offs table and two or three edited paragraphs to confirm meaning is intact and the tone reads human, not mechanical.
</verification>

<success_criteria>
- Zero em dashes and zero semicolons in prose (code fences exempt and untouched).
- All six H2 headings, both Callout blocks, frontmatter, and every code sample preserved verbatim.
- Trade-offs table intact (5 rows, 4 columns) with semicolon-free cells.
- No technical claim added or removed. Prose reads in a human voice.
</success_criteria>

<output>
Create `.planning/quick/260701-vws-review-content-patterns-toast-notificati/260701-vws-SUMMARY.md` when done.
</output>
