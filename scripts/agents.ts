import { join } from "node:path";

export const AGENT_NAMES = ["copilot", "claude", "codex", "gemini"] as const;
export type Agent = (typeof AGENT_NAMES)[number];

export type RuleMeta = { readonly description: string; readonly globs: string };
export type Env = { readonly home: string; readonly vars: Readonly<Record<string, string | undefined>> };

type AgentConfig = {
	readonly mainFile: string;
	// Agents without rules have no path-scoped instructions, so the language rules are omitted for them.
	readonly rules?: { readonly dir: string; readonly suffix: string; readonly frontMatter: (meta: RuleMeta) => string };
	/** Maps a "/"-separated path inside the agent's generated directory to its absolute install path. */
	readonly installPath: (path: string, env: Env) => string;
};

export const AGENTS: Readonly<Record<Agent, AgentConfig>> = {
	copilot: {
		mainFile: "copilot-instructions.md",
		rules: {
			dir: "instructions",
			suffix: ".instructions.md",
			frontMatter: ({ description, globs }) => `description: ${JSON.stringify(description)}\napplyTo: ${JSON.stringify(globs)}`,
		},
		installPath: (path, { home, vars }) => join(vars["COPILOT_HOME"] ?? join(home, ".copilot"), path),
	},
	claude: {
		mainFile: "CLAUDE.md",
		// Claude Code reads only `paths` from rule front matter.
		rules: { dir: "rules", suffix: ".md", frontMatter: ({ globs }) => `paths:\n  - ${JSON.stringify(globs)}` },
		installPath: (path, { home, vars }) => join(vars["CLAUDE_CONFIG_DIR"] ?? join(home, ".claude"), path),
	},
	codex: {
		mainFile: "AGENTS.md",
		// Codex reads user skills from ~/.agents/skills, not from CODEX_HOME.
		installPath: (path, { home, vars }) =>
			path.startsWith("skills/") ? join(home, ".agents", path) : join(vars["CODEX_HOME"] ?? join(home, ".codex"), path),
	},
	gemini: {
		mainFile: "GEMINI.md",
		installPath: (path, { home }) => join(home, ".gemini", path),
	},
};

export async function listFiles(dir: string, pattern: string): Promise<string[]> {
	// Bun.Glob yields backslash-separated paths on Windows.
	const paths = await Array.fromAsync(new Bun.Glob(pattern).scan({ cwd: dir }));
	return paths.map((path) => path.replaceAll("\\", "/")).sort((a, b) => a.localeCompare(b));
}
