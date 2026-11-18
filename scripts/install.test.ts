/// <reference types="bun-types/test-globals" />
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { AGENTS } from "./agents";
import { findUnmanaged, install, parseSelection, planCopies, type Copy } from "./install";

let source: string;
let target: string;
let copies: Copy[];

beforeEach(async () => {
	source = await mkdtemp(join(tmpdir(), "install-src-"));
	target = await mkdtemp(join(tmpdir(), "install-dst-"));
	await Bun.write(join(source, "copilot-instructions.md"), "general");
	await Bun.write(join(source, "skills", "audit", "SKILL.md"), "audit");
	copies = await planCopies(source, (path) => join(target, path));
});

afterEach(async () => {
	await rm(source, { recursive: true, force: true });
	await rm(target, { recursive: true, force: true });
});

test("creates missing files, including nested folders", async () => {
	const results = await install(copies, false);

	expect(results.map((result) => result.outcome)).toEqual(["created", "created"]);
	expect(await Bun.file(join(target, "skills", "audit", "SKILL.md")).text()).toBe("audit");
});

test("reports identical files as unchanged", async () => {
	await install(copies, false);

	const results = await install(copies, false);

	expect(results.every((result) => result.outcome === "unchanged")).toBe(true);
});

test("writes nothing when an installed file differs and force is off", async () => {
	const edited = join(target, "copilot-instructions.md");
	await Bun.write(edited, "edited locally");

	const results = await install(copies, false);

	expect(results.find((result) => result.target === edited)?.outcome).toBe("conflict");
	expect(await Bun.file(edited).text()).toBe("edited locally");
	expect(await Bun.file(join(target, "skills", "audit", "SKILL.md")).exists()).toBe(false);
});

test("overwrites differing files with force", async () => {
	const edited = join(target, "copilot-instructions.md");
	await Bun.write(edited, "edited locally");

	const results = await install(copies, true);

	expect(results.find((result) => result.target === edited)?.outcome).toBe("updated");
	expect(await Bun.file(edited).text()).toBe("general");
});

test("lists installed files matching the pattern that are missing from the source", async () => {
	await Bun.write(join(source, "python.instructions.md"), "py");
	await Bun.write(join(target, "python.instructions.md"), "py");
	await Bun.write(join(target, "review.instructions.md"), "old");

	expect(await findUnmanaged(source, target, "**/*.instructions.md")).toEqual(["review.instructions.md"]);
});

test("reports unmanaged rules for all selected agents in order", async () => {
	const copilotRule = join(target, "copilot", "instructions", "old.instructions.md");
	const claudeRule = join(target, "claude", "rules", "old.md");
	await Promise.all([Bun.write(copilotRule, "old"), Bun.write(claudeRule, "old")]);
	const child = Bun.spawn([process.execPath, join(import.meta.dir, "install.ts"), "all"], {
		env: {
			...process.env,
			HOME: target,
			USERPROFILE: target,
			COPILOT_HOME: join(target, "copilot"),
			CLAUDE_CONFIG_DIR: join(target, "claude"),
			CODEX_HOME: join(target, "codex"),
		},
		stdin: "ignore",
		stdout: "pipe",
		stderr: "pipe",
	});

	const [stdout, stderr, exitCode] = await Promise.all([
		new Response(child.stdout).text(),
		new Response(child.stderr).text(),
		child.exited,
	]);

	expect(exitCode).toBe(0);
	expect(stderr).toBe("");
	expect(stdout).toContain(`unmanaged ${copilotRule}`);
	expect(stdout).toContain(`unmanaged ${claudeRule}`);
	expect(stdout.indexOf(`unmanaged ${copilotRule}`)).toBeLessThan(stdout.indexOf(`unmanaged ${claudeRule}`));
});

test("routes Codex skills to ~/.agents/skills and AGENTS.md to CODEX_HOME", () => {
	const env = { home: "/home/u", vars: { CODEX_HOME: "/codex" } };

	expect(AGENTS.codex.installPath("skills/audit/SKILL.md", env)).toBe(join("/home/u", ".agents", "skills", "audit", "SKILL.md"));
	expect(AGENTS.codex.installPath("AGENTS.md", env)).toBe(join("/codex", "AGENTS.md"));
});

test("parses a single agent, all, and rejects unknown or missing input", () => {
	expect(parseSelection(" Claude ")).toEqual(["claude"]);
	expect(parseSelection("all")).toEqual(["copilot", "claude", "codex", "gemini"]);
	expect(parseSelection("cursor")).toBeUndefined();
	expect(parseSelection(null)).toBeUndefined();
});
