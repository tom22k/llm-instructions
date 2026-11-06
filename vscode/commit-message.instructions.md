---
description: "Use when writing, proposing, or reviewing Git commit messages or splitting changes into commits: subject format type(context): summary, type selection, body bullet rules, commit ordering"
---

# Commit Message Instructions

Run `git log --oneline -20` first; where the repository's history or instruction files use a different convention, follow theirs.

## Subject

- A single line, `type(context): summary`, under 72 characters.
- `type`, chosen by effect rather than activity:
  - `feat`: new user-visible capability.
  - `fix`: corrects wrong behaviour; the subject names the symptom, not the code.
  - `refactor`: no behaviour change. If behaviour, error propagation, or user-visible output changes, it is `fix` or `feat`, not `refactor`.
  - `perf`: faster or lighter with identical behaviour.
  - `docs`: documentation or comment-only changes.
  - `test`: tests only.
  - `chore`: build, tooling, configuration, dependencies.
- `context`: the deepest directory common to the primary change, without a leading `src/`, e.g. `api/users`, `core`, `forms/options`, `docs`. Use the top-level folder for changes spanning siblings.
- `summary`: lower-case imperative ("add", not "added"/"adds"), no trailing period. State the outcome, never "update file", "fix bug", "address review", or "misc changes".
- Append `!` after the context for a breaking change, e.g. `feat(api)!: require tenant id on all requests`, and explain the break in the body.
- If the summary needs "and" or two types, it is two commits.
- Examples:
  - `feat(ribbon/shapes): add custom percentage option for Harvey balls`
  - `fix(forms/options): show full font names in options font pickers`
  - `perf(core): read slide shapes in a single pass`

## Body

- Add a body only if the change is non-trivial and the subject cannot carry it. Otherwise stop at the subject line.
- Separate subject and body with one blank line.
- One bullet per distinct logical change, grouping related extractions/renames, not one per file/edit.
- Each bullet: one line, no wrapping, short imperative statement, brief 2-4 word reasoning, optional bare rule/issue ID(s) in parentheses at the end. No filler.
- Do not restate the subject or list file names, except for renames and moves.
- Name any behaviour change explicitly in its own bullet, even within a `fix` or `feat`.
- Punctuation limited to commas, slashes, parentheses, full-stops - no em-dashes or colons.
- Example:

  ```
  refactor(core/parser): harden input parsing against empty documents

  - Extract magic numbers into named constants for readability
  - Guard against null selection before dereferencing shape range
  - Replace string concatenation in loop with a builder for performance (S1643)
  ```

## Splitting and Presenting Commits

- Order commits so that each one builds and passes tests on its own; put prerequisite extractions or renames before the commits that rely on them.
- Keep mechanical changes (renames, reordering members, comment clean-up) apart from logic changes so the logic diff stays readable.
- Documentation that tracks a structural change goes in the same commit as that change; standalone documentation fixes get their own `docs` commit.
- For each proposed commit, give: the message in a fenced code block, the files (or hunks, when a file is split across commits), and the PR it belongs to.
