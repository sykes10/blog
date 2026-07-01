---
phase: quick
plan: 260701-wgo
type: execute
wave: 1
depends_on: []
files_modified:
  - WRITING-STYLE.md
  - content/patterns/toast-notification-system.mdx
autonomous: true
requirements: [WRITING-STYLE-COLON-RULE, WRITING-STYLE-PLAIN-WORD-RULE, TOAST-POST-DASH-REWRITE]

must_haves:
  truths:
    - "WRITING-STYLE.md documents a rule against using a colon as an em-dash or double-hyphen substitute for joining clauses"
    - "WRITING-STYLE.md documents a rule preferring common, everyday words over uncommon or formal ones, using the plural colloquial form versus the formal technical singular as the example"
    - "content/patterns/toast-notification-system.mdx prose contains zero em dash characters and zero en dash characters used as clause connectors"
    - "content/patterns/toast-notification-system.mdx prose contains zero colons used as a dash substitute (colons introducing genuine lists or elaborations remain allowed)"
    - "content/patterns/toast-notification-system.mdx prose no longer uses the formal singular technical term where the common plural form reads more natural in running prose"
    - "All fenced code blocks and inline code spans in the mdx file are byte-identical to before the rewrite"
  artifacts:
    - "WRITING-STYLE.md"
    - "content/patterns/toast-notification-system.mdx"
  key_links:
    - "WRITING-STYLE.md Section 3 (Sentence-Level Rules) is the rule set the mdx rewrite must be checked against"
</must_haves>
---

<objective>
Add two new prose rules to WRITING-STYLE.md: a ban on using a colon as a dash substitute, and a preference for common words over uncommon/formal ones. Then rewrite the prose in content/patterns/toast-notification-system.mdx to comply with the full WRITING-STYLE.md rule set, including the two new rules. Code snippets and demo components are untouched.

Purpose: The toast-notification-system post currently uses colons as a stylistic stand-in for a dash in bold lead-in list items and in mid-sentence clause joins, and uses a formal singular technical term where the common plural form reads more natural. These are exactly the gaps the two new WRITING-STYLE.md rules close. This plan updates the style guide first, then applies it.

Output: Updated WRITING-STYLE.md with two new documented rules. Rewritten prose in content/patterns/toast-notification-system.mdx with meaning fully preserved, no colon-as-dash-substitute usage, no em dash or en dash characters in prose, and no unnecessarily formal or uncommon words, while every fenced code block, inline code span, and JSX component usage remains untouched.
</objective>

<execution_context>
@C:/Users/Alex/workspace/blog/.claude/gsd-core/workflows/execute-plan.md
@C:/Users/Alex/workspace/blog/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@WRITING-STYLE.md
@content/patterns/toast-notification-system.mdx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add two new rules to WRITING-STYLE.md</name>
  <files>WRITING-STYLE.md</files>
  <action>
Edit Section 3 ("Sentence-Level Rules") of WRITING-STYLE.md to add a new rule after the existing "Replacement moves" bullet list (after the semicolon-related bullet, before the "Beyond punctuation" paragraph that follows). Add a new bullet or a short new paragraph, whichever reads more naturally in place, stating: do not use a colon as a substitute for a dash or double-hyphen when joining two clauses. If a colon is being used to glue two independent thoughts together rather than to introduce a list or a genuine elaboration, rephrase into two sentences, or connect the clauses with "and," "so," or "because." State that colons remain fine for their traditional job of introducing a list or an elaboration, and that this new rule targets only the dash-substitute usage. Prefer avoiding a special-character connector altogether when in doubt.

Add a short do/don't pair illustrating this new colon rule. The "don't" example should show a bold lead-in term followed by a colon joining an unrelated clause, matching the anti-pattern actually present in the toast post's bullet lists (a bold term, then a colon, then an explanatory clause). The "do" example should rephrase the same content as two sentences, or reconnect the clauses with "and," "so," or "because."

Then add a new short paragraph (placed in Section 2 "Voice and Tone" or as a new item near the existing rules in Section 3, whichever location reads more naturally alongside existing content) documenting the second rule: prefer the common, everyday word over the grammatically precise but uncommon or formal one, even when the common word is slightly less precise, because it reads more natural and human. Illustrate with an example describing the plural colloquial form that people actually say in conversation versus the formal singular form found in technical standards documents (do not name the specific WCAG term as a literal quoted string here; describe the pattern generically so the rule reads as a general principle, not a one-off fix tied to a single document). Note this rule applies even when technical precision would favor the singular or formal term, since the target reader values natural phrasing over pedantic correctness.

Keep both additions consistent with the existing document voice (direct, opinionated, no filler) and do not disturb any other section's content or numbering. Do not introduce any em dash, double-hyphen, or semicolon in the new text, since the new rules apply to the document that states them.
  </action>
  <verify>
    <automated>grep -ci "colon" "C:/Users/Alex/workspace/blog/WRITING-STYLE.md"</automated>
  </verify>
  <done>WRITING-STYLE.md Section 3 (or an adjacent section) documents the colon-as-dash-substitute ban with a do/don't example, and a second rule preferring common/everyday words over uncommon/formal ones is documented elsewhere in the file, both written in the existing document voice with no em dashes, double-hyphens, or semicolons introduced.</done>
</task>

<task type="auto">
  <name>Task 2: Rewrite toast-notification-system.mdx prose per full WRITING-STYLE.md rule set</name>
  <files>content/patterns/toast-notification-system.mdx</files>
  <action>
Rewrite only the prose in content/patterns/toast-notification-system.mdx (headings, paragraphs, bullet list text, table cell text, and the frontmatter description if it needs it) to comply with the complete WRITING-STYLE.md rule set as updated in Task 1. Do not touch any fenced code block content (the html, tsx, css, and typescript blocks), inline code spans wrapped in backticks, or the Callout/JSX component tags themselves. Only the prose text that sits between and around them changes.

Specific known fixes required, verified by direct inspection of the current file:

1. Bold lead-in list items in the "Toast solves" bullet list and the "Avoid toasts for" bullet list currently use a colon to join the bold term to an explanatory clause (the Queue management, Accessibility, Auto-dismiss timing, and Stacking and positioning items near the top of the post, and the Errors-that-block-the-task, Confirmation-of-destructive-actions, Long-lived-status, and Critical-must-read-alerts items further down). Rephrase each so the bold term is followed by a period and a new sentence, or restructure the sentence with "and," "so," or "because," per the new colon rule. Preserve the bold term itself as the lead-in.
2. Several sentences use a colon mid-sentence to glue two independent clauses rather than to introduce a genuine list or elaboration: the sentence about the dismiss timer scaling with content length, the sentence about the live region needing to exist in the DOM before any toasts are added, the sentence about why aria-atomic being false is important, and the sentence about collapsing toasts before they reach the queue. Rephrase each into two sentences, or reconnect the clauses with "and," "so," or "because." Where a colon is already doing legitimate list-introduction or elaboration work per WRITING-STYLE.md's existing rule (for example, a colon that precedes a numbered list or a genuine one-item elaboration), leave it as is.
3. The WCAG reference naming the specific numbered success criterion, and the following sentence referring back to "this criterion" in the singular, should be reworded to favor the common plural form where it reads naturally in running prose. Keep the standard's actual reference identifiable enough that a reader could still look it up, but have the surrounding prose that refers back to it prefer the everyday plural word rather than the formal singular.
4. Scan the full prose (not code) for any other em dash or en dash character used as a clause connector and remove it using WRITING-STYLE.md's replacement moves: period plus new sentence, comma, parentheses, or "and"/"but." Do not alter any dash characters that appear inside code comments within fenced code blocks, since those are code, not prose, and are out of scope for this rewrite.
5. Scan the full prose for any other uncommon or formal word choices that could read more natural in the everyday form, and apply the same judgment as the criteria/criterion fix, without changing technical meaning.
6. Preserve all technical facts, numbers, code identifiers, and the overall structure (headings, list structure, table structure) exactly. Only prose wording and punctuation change.

After rewriting, re-read the full file once to confirm every fenced code block is byte-identical to the original, and that no new em dash, en dash, colon-as-dash-substitute, or semicolon has been introduced anywhere in the prose.
  </action>
  <verify>
    <automated>test "$(grep -c "—" "C:/Users/Alex/workspace/blog/content/patterns/toast-notification-system.mdx")" -le 2 &amp;&amp; test "$(grep -c "–" "C:/Users/Alex/workspace/blog/content/patterns/toast-notification-system.mdx")" -eq 0</automated>
  </verify>
  <done>content/patterns/toast-notification-system.mdx prose contains no colon-as-dash-substitute usage and no new em/en dash characters outside the two pre-existing code-comment occurrences inside the tsx fenced block, uses the common plural form instead of the formal singular WCAG term reference in running prose, meaning is fully preserved, and all fenced code blocks and inline code spans are unchanged from the original.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| None (content-only edit) | This plan edits static MDX prose and a markdown style guide; no user input, network call, or code execution path is introduced or modified. |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-quick-01 | Tampering | content/patterns/toast-notification-system.mdx code blocks | low | accept | Task 2 explicitly scopes the rewrite to prose only; the executor re-reads the file after editing to confirm every fenced code block is byte-identical to the original, preventing accidental changes to the working code examples. |
</threat_model>

<verification>
Run both verify commands after both tasks complete. Confirm WRITING-STYLE.md documents both new rules with the do/don't example intact, and confirm content/patterns/toast-notification-system.mdx has no unaddressed em/en dash or colon-as-dash-substitute usage in prose, with all code blocks unchanged. Manually diff the mdx file against git history to spot-check that no code block content shifted.
</verification>

<success_criteria>
WRITING-STYLE.md contains two new documented rules (colon-as-dash-substitute ban, prefer-common-words) consistent with the existing document voice. content/patterns/toast-notification-system.mdx prose is free of em dashes, en dashes used as connectors, and colon-as-dash-substitute usage, with the formal singular WCAG term reference softened toward the common plural form in surrounding prose, meaning fully preserved, and all code snippets and demo components byte-identical to before the rewrite.
</success_criteria>

<output>
Create `.planning/quick/260701-wgo-rewrite-toast-notification-system-blog-p/260701-wgo-SUMMARY.md` when done
</output>
</content>
