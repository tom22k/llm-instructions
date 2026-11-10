# llm-instructions

Personal collection of instruction files for LLMs, chiefly GitHub Copilot Chat.

## Contents

| File | Target | Description | Applies |
| --- | --- | --- | --- |
| [vscode/general.instructions.md](vscode/general.instructions.md) | Copilot Chat in VS Code | Core style and engineering rules | Every request |
| [vscode/commit-message.instructions.md](vscode/commit-message.instructions.md) | Copilot Chat in VS Code | Commit message format | Writing commits |
| [vscode/pull-request.instructions.md](vscode/pull-request.instructions.md) | Copilot Chat in VS Code | PR grouping, title and body | Opening PRs |
| [vscode/review.instructions.md](vscode/review.instructions.md) | Copilot Chat in VS Code | Audit and findings workflow | Reviewing code |
| [browser/general.instructions.md](browser/general.instructions.md) | Any LLM | General behaviour | Non-coding chats |
| [browser/coding.instructions.md](browser/coding.instructions.md) | Copilot Chat on github.com | Condensed VS Code general rules | Coding chats |

The on-demand files are selected by VS Code from their `description` front matter; `general.instructions.md` links to them by relative path, so keep them in the same folder.

## Usage

### VS Code

Either copy the files in `vscode/` to the user prompts folder (`%APPDATA%\Code\User\prompts` on Windows), or point VS Code at this repository so edits apply without copying:

```jsonc
// settings.json
"chat.instructionsFilesLocations": {
 "C:/path/to/agent-instructions/vscode": true
}
```

### GitHub Copilot Chat in the browser

`general-browser-chat.instructions.md` has no front matter and is not loaded by VS Code. Paste its contents into the personal instructions of Copilot Chat on github.com. It is a condensed restatement of `general.instructions.md`, so update both when changing a rule.
