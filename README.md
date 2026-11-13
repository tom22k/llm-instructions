# llm-instructions

Personal collection of instruction files for LLMs, chiefly GitHub Copilot Chat.

## Contents

| File | Target | Description | Applies |
| --- | --- | --- | --- |
| [copilot/copilot-instructions.md](copilot/copilot-instructions.md) | Copilot in VS Code, CLI | Core style and engineering rules | Every request |
| [copilot/instructions/typescript.instructions.md](copilot/instructions/typescript.instructions.md) | Copilot in VS Code, CLI | TypeScript and Bun conventions | `*.ts`, `*.tsx` files |
| [copilot/instructions/python.instructions.md](copilot/instructions/python.instructions.md) | Copilot in VS Code, CLI | Python conventions | `*.py` files |
| [copilot/skills/audit/SKILL.md](copilot/skills/audit/SKILL.md) | Copilot in VS Code, CLI | Batched audit and findings workflow | `/audit`, or asking for a review or audit |
| [copilot/skills/propose-commits/SKILL.md](copilot/skills/propose-commits/SKILL.md) | Copilot in VS Code, CLI | Commit split and message format | `/propose-commits`, or asking for commits |
| [copilot/skills/propose-pull-requests/SKILL.md](copilot/skills/propose-pull-requests/SKILL.md) | Copilot in VS Code, CLI | PR grouping, title and body | `/propose-pull-requests`, or asking for PRs |
| [templates/AGENTS.md](templates/AGENTS.md) | Any agent reading `AGENTS.md` | Per-repository skeleton | Copied into a repository |
| [browser/general.instructions.md](browser/general.instructions.md) | Any LLM | General behaviour | Non-coding chats |
| [browser/coding.instructions.md](browser/coding.instructions.md) | Copilot Chat on github.com | Condensed `copilot-instructions.md` | Coding chats |

`copilot/` mirrors the Copilot user folder (`~/.copilot`). `copilot-instructions.md` applies to every request; files in `instructions/` apply only when the agent works on files matching their `applyTo`; skills hold task workflows and load on demand.

## Usage

### Copilot in VS Code and Copilot CLI

Copy `copilot/` into `~/.copilot` (or `$COPILOT_HOME` if set) with:

```sh
bun scripts/install.ts
```

- New and identical files are installed or skipped silently.
- If any installed file differs from this repository, nothing is written and the differing files are listed as `conflict`. Check them for edits worth keeping, then re-run with `--force` to overwrite.
- Installed `*.instructions.md` files with no counterpart here are listed as `unmanaged`; delete them by hand if they are stale copies.

Re-run after every change, and start a new chat for it to take effect. The Copilot harness does not read the VS Code profile prompts folder, and the deprecated Local harness is removed in February 2027.

### GitHub Copilot Chat in the browser

`browser/coding.instructions.md` has no front matter and is not loaded by VS Code. Paste its contents into the personal instructions of Copilot Chat on github.com. It is a condensed restatement of `copilot/copilot-instructions.md`, so update both when changing a rule.

### Skills

Each folder in `copilot/skills/` is a self-contained skill whose folder name equals its `name`. Each runs as a slash command (`/audit`, `/propose-commits`, `/propose-pull-requests`), and the agent also loads it when a request matches its `description`. `copilot-instructions.md` refers to them by name.

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
