/// <reference types="bun-types/test-globals" />
import { join } from "node:path";
import { AGENT_NAMES, listFiles } from "./agents";
import { build, parseRule, REPO_ROOT, SOURCE_DIR } from "./build";

test("converts rule front matter per agent and omits rules where unsupported", async () => {
	const output = await build(SOURCE_DIR);

	expect(output.get("copilot/instructions/python.instructions.md")).toStartWith(
		'---\ndescription: "Python conventions: type hints, pytest, standard-library idioms, logging"\napplyTo: "**/*.py"\n---\n',
	);
	expect(output.get("claude/rules/python.md")).toStartWith('---\npaths:\n  - "**/*.py"\n---\n');
	expect(output.get("claude/rules/python.md")).toContain("the personal `CLAUDE.md`");
	expect([...output.keys()].some((path) => path.startsWith("codex/rules") || path.startsWith("gemini/rules"))).toBe(false);
});

test("rejects a rule without globs", () => {
	expect(() => parseRule("bad", '---\ndescription: "x"\n---\nbody')).toThrow("globs");
});

test("committed agent directories match the output of scripts/build.ts", async () => {
	const expected = await build(SOURCE_DIR);
	const actual = new Map<string, string>();
	for (const agent of AGENT_NAMES) {
		for (const path of await listFiles(join(REPO_ROOT, agent), "**/*")) {
			actual.set(`${agent}/${path}`, (await Bun.file(join(REPO_ROOT, agent, path)).text()).replaceAll("\r\n", "\n"));
		}
	}

	// On failure, run `bun scripts/build.ts` and commit the result.
	expect(Object.fromEntries(actual)).toEqual(Object.fromEntries(expected));
});
