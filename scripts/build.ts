import { rm } from "node:fs/promises";
import { join } from "node:path";
import { AGENT_NAMES, AGENTS, listFiles, type RuleMeta } from "./agents";

export const REPO_ROOT = join(import.meta.dir, "..");
export const SOURCE_DIR = join(REPO_ROOT, "src");
const MAIN_FILE_PLACEHOLDER = "{{mainFile}}";

type Rule = RuleMeta & { readonly name: string; readonly body: string };

async function readText(path: string): Promise<string> {
	// Normalise so CRLF checkouts generate the same output as LF ones.
	return (await Bun.file(path).text()).replaceAll("\r\n", "\n");
}

export function parseRule(name: string, text: string): Rule {
	const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
	const meta: unknown = match?.[1] === undefined ? undefined : Bun.YAML.parse(match[1]);
	if (match === null || typeof meta !== "object" || meta === null) {
		throw new Error(`src/rules/${name}.md: missing YAML front matter; add description and globs.`);
	}
	const { description, globs } = meta as Record<string, unknown>; // Narrowed field by field below.
	if (typeof description !== "string" || typeof globs !== "string") {
		throw new TypeError(`src/rules/${name}.md: front matter needs string fields description and globs.`);
	}
	return { name, description, globs, body: text.slice(match[0].length) };
}

/** Returns every generated file, keyed by its "/"-separated path from the repository root. */
export async function build(sourceDir: string): Promise<Map<string, string>> {
	const [main, ruleNames, skillPaths] = await Promise.all([
		readText(join(sourceDir, "instructions.md")),
		listFiles(join(sourceDir, "rules"), "*.md"),
		listFiles(join(sourceDir, "skills"), "**/*"),
	]);
	const [rules, skills] = await Promise.all([
		Promise.all(ruleNames.map(async (file) => parseRule(file.slice(0, -".md".length), await readText(join(sourceDir, "rules", file))))),
		Promise.all(skillPaths.map(async (path) => [path, await readText(join(sourceDir, "skills", path))] as const)),
	]);

	const output = new Map<string, string>();
	for (const agent of AGENT_NAMES) {
		const { mainFile, rules: ruleConfig } = AGENTS[agent];
		const add = (path: string, text: string): void => {
			output.set(`${agent}/${path}`, text.replaceAll(MAIN_FILE_PLACEHOLDER, mainFile));
		};
		add(mainFile, main);
		for (const [path, text] of skills) {
			add(`skills/${path}`, text);
		}
		if (ruleConfig === undefined) {
			continue;
		}
		for (const rule of rules) {
			add(`${ruleConfig.dir}/${rule.name}${ruleConfig.suffix}`, `---\n${ruleConfig.frontMatter(rule)}\n---\n${rule.body}`);
		}
	}
	return output;
}

if (import.meta.main) {
	const output = await build(SOURCE_DIR);
	// Agent directories are fully generated, so clearing them removes output for deleted sources.
	await Promise.all(AGENT_NAMES.map((agent) => rm(join(REPO_ROOT, agent), { recursive: true, force: true })));
	await Promise.all([...output].map(([path, text]) => Bun.write(join(REPO_ROOT, path), text)));
	console.log(`Generated ${output.size} files in ${AGENT_NAMES.map((agent) => agent + "/").join(", ")}.`);
}
