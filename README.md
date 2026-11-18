# llm-instructions

Personal collection of instruction files for coding agents (GitHub Copilot, Claude Code, OpenAI Codex, Gemini CLI) and browser chats.

## Contents

`src/` is the single source of truth. `bun scripts/build.ts` generates one directory per agent from it; never edit those by hand.

| Source | Description | Applies |
| --- | --- | --- |
| [src/instructions.md](src/instructions.md) | Core style and engineering rules | Every request |
| [src/rules/typescript.md](src/rules/typescript.md) | TypeScript and Bun conventions | `*.ts`, `*.tsx` files |
| [src/rules/python.md](src/rules/python.md) | Python conventions | `*.py` files |
| [src/skills/audit/SKILL.md](src/skills/audit/SKILL.md) | Batched audit and findings workflow | Asking for a review or audit |
| [src/skills/propose-commits/SKILL.md](src/skills/propose-commits/SKILL.md) | Commit split and message format | Asking for commits |
| [src/skills/propose-pull-requests/SKILL.md](src/skills/propose-pull-requests/SKILL.md) | PR grouping, title and body | Asking for PRs |

| Generated | Main file | Rules | Installed to |
| --- | --- | --- | --- |
| [copilot/](copilot) | `copilot-instructions.md` | `instructions/*.instructions.md` (`applyTo`) | `$COPILOT_HOME`, else `~/.copilot` |
| [claude/](claude) | `CLAUDE.md` | `rules/*.md` (`paths`) | `$CLAUDE_CONFIG_DIR`, else `~/.claude` |
| [codex/](codex) | `AGENTS.md` | None | `$CODEX_HOME`, else `~/.codex`; skills to `~/.agents/skills` |
| [gemini/](gemini) | `GEMINI.md` | None | `~/.gemini` |

Codex and Gemini CLI have no path-scoped rules, so they do not receive the language rules. Each agent gets every skill.

| Other file | Target | Description |
| --- | --- | --- |
| [templates/AGENTS.md](templates/AGENTS.md) | Any agent reading `AGENTS.md` | Per-repository skeleton, copied into a repository |
| [browser/general.instructions.md](browser/general.instructions.md) | Any LLM | General behaviour for non-coding chats |
| [browser/coding.instructions.md](browser/coding.instructions.md) | Copilot Chat on github.com | Condensed `src/instructions.md` for coding chats |
| [browser/skills/cover-letter/SKILL.md](browser/skills/cover-letter/SKILL.md) | Chat apps that accept uploaded skills | Cover letter from a CV (Markdown or PDF), a job description and an optional candidate profile |
| [browser/skills/maths-tutor/SKILL.md](browser/skills/maths-tutor/SKILL.md) | Chat apps that accept uploaded skills | University-level maths explanations, and Socratic guidance through problems |

## Editing

Edit only `src/`, then regenerate and commit both:

```sh
bun scripts/build.ts
```

- Rules need `description` and `globs` front matter; the build converts it to each agent's format.
- `{{mainFile}}` is replaced with the agent's main file name, e.g. `CLAUDE.md`.
- `bun test` fails if the generated directories are stale.

## Usage

### Coding agents

```sh
bun scripts/install.ts [copilot|claude|codex|gemini|all] [--force]
```

Without an agent argument, the script asks for one.

- New and identical files are installed or skipped silently.
- If any installed file differs from this repository, nothing is written and the differing files are listed as `conflict`. Check them for edits worth keeping, then re-run with `--force` to overwrite.
- Installed rule files with no counterpart here are listed as `unmanaged`; delete them by hand if they are stale copies.

Re-run after every change, and start a new session for it to take effect. The Copilot harness does not read the VS Code profile prompts folder, and the deprecated Local harness is removed in February 2027.

### GitHub Copilot Chat in the browser

`browser/coding.instructions.md` has no front matter and is not loaded by any agent. Paste its contents into the personal instructions of Copilot Chat on github.com. It is a condensed restatement of `src/instructions.md`, so update both when changing a rule.

### Skills

Each folder in `src/skills/` is a self-contained [Agent Skill](https://agentskills.io/specification) whose folder name equals its `name`. Agents load a skill when a request matches its `description`; Copilot and Claude Code also run it as a slash command (`/audit`), and Codex as a mention (`$audit`). The main instructions refer to them by name.

### Cover letter skill

Upload `browser/skills/cover-letter/` as a skill, then attach a CV and a job description. Optionally attach a candidate profile with facts that persist across applications, copied from [assets/profile.template.md](browser/skills/cover-letter/assets/profile.template.md). Keep the filled-in profile outside this repository, since it holds personal data.

### Maths tutor skill

Upload `browser/skills/maths-tutor/` as a skill. Ask for a concept to get a direct explanation, or paste a problem and your attempt to be guided through it one question at a time. Ask for the solution to get it in full after one confirmation.

### Repository template

Copy `templates/AGENTS.md` to the root of a repository and fill in the placeholders. Copilot, Codex and other agents read `AGENTS.md`, so no separate `.github/copilot-instructions.md` is needed.

## Size Limits

- `browser/coding.instructions.md`: at most 4,000 characters, the limit for personal instructions on github.com.
- Every other Markdown file: at most 150 lines.

Check both with [Bun](https://bun.sh):

```sh
bun scripts/check-sizes.ts
bun test
```
