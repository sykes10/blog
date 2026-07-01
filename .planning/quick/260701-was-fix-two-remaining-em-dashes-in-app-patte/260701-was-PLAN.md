---
phase: quick-260701-was
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/patterns/page.tsx
autonomous: true
requirements: []
must_haves:
  truths:
    - "The user-visible prose in app/patterns/page.tsx (metadata description and page subtitle) contains no em dash character"
    - "The Tailwind CSS variable syntax (text-(--foreground), text-(--muted), text-(--border)) is untouched"
  artifacts:
    - "app/patterns/page.tsx"
  key_links:
    - "WRITING-STYLE.md Section 3 bans the em dash in prose"
---

<objective>
Fix the two remaining em dashes in `app/patterns/page.tsx`:

1. Line 7, the page metadata `description`: "Focused explorations of reusable frontend concepts — components, behaviours, and engineering techniques."
2. Lines 20-21, the page subtitle rendered under the "Patterns" heading: "Focused explorations of a single reusable concept — component, behaviour, or engineering technique."

Both violate `WRITING-STYLE.md` Section 3 (no em dash in prose). Rewrite both to remove the em dash, keeping the same meaning and a human tone.

Output: The same file, two strings rewritten, everything else byte-identical.
</objective>

<context>
@WRITING-STYLE.md
@app/patterns/page.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Remove em dashes from patterns page metadata description and subtitle</name>
  <files>app/patterns/page.tsx</files>
  <action>
Open `app/patterns/page.tsx`.

1. Find the `metadata.description` string (line 7): "Focused explorations of reusable frontend concepts — components, behaviours, and engineering techniques." Rewrite to remove the em dash using a WRITING-STYLE.md Section 3 replacement move (a colon fits naturally, since the em dash introduces the list of concept types). Keep the same meaning and the list (components, behaviours, engineering techniques).

2. Find the subtitle `<p>` text (lines 20-21): "Focused explorations of a single reusable concept — component, behaviour, or engineering technique." Rewrite to remove the em dash the same way.

Do not touch anything else in the file, including the Tailwind CSS custom property syntax (`text-(--foreground)`, `text-(--muted)`, `text-(--border)`) used throughout. These are CSS variable references, not prose, and are unrelated to the punctuation ban.
  </action>
  <verify>
    <automated>! grep -n '—' app/patterns/page.tsx && grep -q 'text-(--foreground)' app/patterns/page.tsx</automated>
  </verify>
  <done>
`app/patterns/page.tsx` contains no em dash character in its user-visible prose. The metadata description and subtitle both read as natural, human sentences conveying the same meaning as before. The Tailwind CSS variable syntax is unchanged everywhere it appears. No other line in the file is modified.
  </done>
</task>

</tasks>

<verification>
- Run the verify command: no em dash in the file, CSS variable syntax still present.
- Spot-read both rewritten strings to confirm meaning and tone are preserved.
</verification>

<success_criteria>
Both remaining em dashes in app/patterns/page.tsx are removed. Nothing else in the file changed.
</success_criteria>

<output>
Create `.planning/quick/260701-was-fix-two-remaining-em-dashes-in-app-patte/260701-was-SUMMARY.md` when done.
</output>
