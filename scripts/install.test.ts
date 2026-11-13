import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { findUnmanagedInstructions, install } from "./install";

let source: string;
let target: string;

beforeEach(async () => {
	source = await mkdtemp(join(tmpdir(), "install-src-"));
	target = await mkdtemp(join(tmpdir(), "install-dst-"));
	await Bun.write(join(source, "copilot-instructions.md"), "general");
	await Bun.write(join(source, "skills", "audit", "SKILL.md"), "audit");
});

afterEach(async () => {
	await rm(source, { recursive: true, force: true });
	await rm(target, { recursive: true, force: true });
});

test("creates missing files, including nested folders", async () => {
	const results = await install(source, target, false);

	expect(results.map((result) => result.outcome)).toEqual(["created", "created"]);
	expect(await Bun.file(join(target, "skills", "audit", "SKILL.md")).text()).toBe("audit");
});

test("reports identical files as unchanged", async () => {
	await install(source, target, false);

	const results = await install(source, target, false);

	expect(results.every((result) => result.outcome === "unchanged")).toBe(true);
});

test("writes nothing when an installed file differs and force is off", async () => {
	await Bun.write(join(target, "copilot-instructions.md"), "edited locally");

	const results = await install(source, target, false);

	expect(results.find((result) => result.path === "copilot-instructions.md")?.outcome).toBe("conflict");
	expect(await Bun.file(join(target, "copilot-instructions.md")).text()).toBe("edited locally");
	expect(await Bun.file(join(target, "skills", "audit", "SKILL.md")).exists()).toBe(false);
});

test("overwrites differing files with force", async () => {
	await Bun.write(join(target, "copilot-instructions.md"), "edited locally");

	const results = await install(source, target, true);

	expect(results.find((result) => result.path === "copilot-instructions.md")?.outcome).toBe("updated");
	expect(await Bun.file(join(target, "copilot-instructions.md")).text()).toBe("general");
});

test("lists installed instruction files missing from the source", async () => {
	await Bun.write(join(source, "instructions", "python.instructions.md"), "py");
	await Bun.write(join(target, "instructions", "python.instructions.md"), "py");
	await Bun.write(join(target, "instructions", "review.instructions.md"), "old");

	expect(await findUnmanagedInstructions(source, target)).toEqual(["review.instructions.md"]);
});
