---
phase: quick-260701-vkm
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - WRITING-STYLE.md
autonomous: true
requirements: []
must_haves:
  truths:
    - "A WRITING-STYLE.md file exists at the repo root, alongside DESIGN.md and PROJECT.md."
    - "The doc states the blog uses a human tone across all Blueprints and Patterns."
    - "The doc bans em dashes, the -- substitute, and semicolons in prose, and names them explicitly."
    - "The doc has a section distinguishing explaining from over-explaining that tells authors to trust the reader."
    - "The doc lists AI-tell structural/formatting habits to avoid (formulaic transitions, hedging, rule-of-three padding, generic intros/outros, listy overuse)."
    - "The doc includes at least one concrete do/don't example pair."
  artifacts:
    - "WRITING-STYLE.md"
  key_links:
    - "WRITING-STYLE.md sits at repo root so future phase planning can cite it the way DESIGN.md is cited."
---

<objective>
Author a top-level `WRITING-STYLE.md` at the repo root that defines the blog's writing style guide for all authored content (Blueprints and Patterns).

Purpose: Give the single author (and any future planning that generates or reviews prose) one source of truth for voice, sentence-level punctuation rules, and the structural tells that make writing read as AI-generated. It sits alongside `DESIGN.md` (visual system) and `PROJECT.md` (project reference) so phase planning can cite it the same way it cites `DESIGN.md`.

Output: A single Markdown file, `WRITING-STYLE.md`, written in the same readable numbered-section style as `DESIGN.md`, and itself obeying the rules it documents (no em dashes, no `--`, no semicolons, human tone).
</objective>

<execution_context>
@C:/Users/Alex/workspace/blog/.claude/gsd-core/workflows/execute-plan.md
@C:/Users/Alex/workspace/blog/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@DESIGN.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Author WRITING-STYLE.md writing style guide</name>
  <files>WRITING-STYLE.md</files>
  <action>
Create `WRITING-STYLE.md` at the repo root (same directory as `DESIGN.md` and `PROJECT.md`). Match the readable, numbered-section prose-and-tables format used in `DESIGN.md`. The document itself must obey every rule it states: no em dash character, no `--` double-hyphen substitute, no semicolons, human tone, no over-explaining. Prefer periods, commas, and separate sentences over em dashes and semicolons.

Open with a short purpose statement: this is the project-wide writing style reference for all authored content (Blueprints and Patterns), it sits alongside `DESIGN.md` at the repo root, and future phase planning and content review should cite it. Tie the style back to the core value from `PROJECT.md`: content gives a production-grade mental model for a hiring manager or a referencing engineer, not a tutorial.

Include these sections:

1. Purpose and scope. What the doc governs (all MDX prose in Blueprints and Patterns) and who it serves (the single author, plus any planning that generates or reviews prose).

2. Voice and tone. Human, direct, opinionated where earned. Write like an experienced engineer explaining a decision to a peer, not a documentation bot. Favor concrete nouns and active verbs. Allow personality and stated opinions and trade-off judgments. State that the reader is a competent engineer, so the tone should respect that.

3. Sentence-level rules (the banned-punctuation list). Explicitly ban: the em dash character, the `--` double-hyphen substitute for an em dash, and the semicolon. Explain the replacement moves for each. For a break in thought, use a period and a new sentence, or a comma, or parentheses, or a colon when introducing a list or elaboration. For joining two related clauses, use a period or the word "and"/"but", not a semicolon. Add a short note that this keeps prose looking hand-written rather than machine-generated. Cover other sentence-level habits: vary sentence length, avoid a repetitive rhythm where every sentence is the same shape and length.

4. Explaining versus over-explaining. Trust the reader. Do not restate what a code sample already shows. Do not define terms a mid-level frontend engineer already knows. Cut padding and filler. Say the thing once, clearly, and move on. Contrast the goal (a production-grade mental model and the "why" behind a trade-off) against padding (recapping the obvious, hedging, and word-count filler). Make clear that trusting the reader is not the same as being terse to the point of unhelpful. Depth on the "why" and trade-offs is the point. The cut is padding, not substance.

5. Structural and formatting habits to avoid (the AI tells). List, with a one-line reason each: formulaic transition openers such as "Moreover,", "Furthermore,", "In conclusion,", "It's worth noting that"; excessive hedging ("arguably", "it could be said", stacked qualifiers); rule-of-three padding where three parallel items appear only for rhythm rather than because there are genuinely three; overuse of bulleted lists where prose would read better; generic intros and outros that restate the obvious or summarize what was just said; uniform, repetitive sentence rhythm; and over-signposting ("In this section, we will..."). Frame these as tells that make writing look AI-generated rather than human-written.

6. A do/don't example pair. Show at least one clearly labeled "Don't" prose snippet that violates several rules at once (an em dash or `--`, a semicolon, a formulaic transition, over-explaining), then a "Do" rewrite of the same idea that obeys the guide. Keep the example short and about a plausible frontend engineering topic so it reads as real. The "Don't" example is the one place the banned marks may appear, since it is demonstrating what to avoid. Add a brief line noting that the "Don't" block is illustrative and is the only sanctioned place those marks appear in the repo's prose.

Keep the whole document tight. It should be a reference the author actually rereads, not an exhaustive style bible. Do not pad it with the very filler it warns against.
  </action>
  <verify>
    <automated>test -f WRITING-STYLE.md && ! grep -n '—' WRITING-STYLE.md && ! grep -nE ' -- ' WRITING-STYLE.md && grep -qi 'semicolon' WRITING-STYLE.md && grep -qi 'over-explain' WRITING-STYLE.md && grep -qiE "do(n't| not)" WRITING-STYLE.md</automated>
  </verify>
  <done>
`WRITING-STYLE.md` exists at repo root. It contains all six sections (purpose/scope, voice and tone, sentence-level banned-punctuation rules, explaining vs over-explaining, structural AI-tell habits to avoid, and a do/don't example pair). The prose of the guide itself contains no em dash character, no `--` substitute, and no semicolon (the sole exception being marks shown inside the labeled "Don't" example). The banned-punctuation list explicitly names em dashes, `--`, and semicolons. The doc reads in a human tone and does not over-explain.
  </done>
</task>

</tasks>

<verification>
- `WRITING-STYLE.md` is present at the repo root next to `DESIGN.md` and `PROJECT.md`.
- The guide's own prose obeys its rules: no em dash, no `--`, no semicolon (except inside the labeled "Don't" example).
- All six required sections are present and each is substantive, not a placeholder.
- The banned-punctuation list names em dashes, `--`, and semicolons explicitly with replacement guidance.
- The do/don't example pair is concrete and labeled.
</verification>

<success_criteria>
The single author can open `WRITING-STYLE.md` and, in one read, know the tone to write in, the punctuation that is banned and what to use instead, how to avoid over-explaining, and which structural habits read as AI-generated. Future phase planning can cite this file the same way it cites `DESIGN.md`.
</success_criteria>

<output>
Create `.planning/quick/260701-vkm-create-a-writing-style-md-document-defin/260701-vkm-SUMMARY.md` when done.
</output>
