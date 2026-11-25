---
name: blog-post-reviewer
description: >-
  Enforce <= 80-char line wrapping directly and provide advisory-only review on
  mechanics, flow, and Anti-Hero voice without rewrites.
---

# Blog Post Reviewer

Automatically enforces `<= 80`-character line wrapping on target files while
auditing drafts for technical accuracy, mechanics, and flow on a strictly
advisory basis—preserving the author's voice and anti-hero edge.

## Review Rules

1. **Advisory Only (Except Line Wrapping)**: All prose, mechanics, flow, and
   substance feedback is strictly advisory—never modify wording, punctuation,
   or structure directly; those changes must be reviewed and applied by the
   human author. The **only** direct file edit permitted (and required on every
   invocation) is reflowing lines to `<= 80` characters without changing words.
2. **Preserve Voice (No Full Rewrites)**: Propose surgical fixes only. Never
   smooth away the author's cadence, edge, or personality.
3. **No Manufactured Feedback**: Do not invent nitpicks or suggestions just to
   have output. If the piece is "good enough", reads well, and matches the
   intended tone, state clearly that no editorial changes are needed.
4. **Mechanics & Pacing**: Flag typos, homophones, comma splices, and abrupt
   transitions using concise before/after snippets. Explain tweaks briefly.
5. **Strict Line Wrapping (<= 80 chars — Auto-Applied)**: Hard limit on prose,
   comments, and callouts (except unbroken URLs or unbreakable tokens). On
   every prompt of this skill, automatically wrap offending lines in the target
   file(s) by adjusting line breaks/whitespace only, then verify with:
   ```bash
   python3 -c "import sys; [(len(l)>80) and print(f'{i}:{len(l)}') \
     for i,l in enumerate(open(sys.argv[1]).read().splitlines(),1)]" <file>
   ```
6. **Technical Substance**: Confirm opening has a clear thesis, concrete
   examples/diagrams, and actionable conclusions without hand-waving.

## Review Output Format

After auto-wrapping lines (if needed), provide a scannable bulleted critique—
never apply editorial edits directly or output full rewrites:
- **Summary**: Line-wrap status, tone, and syntax assessment.
- **Line Wrapping**: State whether lines were wrapped (and note any remaining
  unbreakable > 80-char lines such as long URLs).
- **Advisory Surgical Edits**: Before/after diff blocks grouped by section for
  human review, or state "No editorial changes needed — draft meets standards."
