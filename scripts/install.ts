import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { AGENT_NAMES, AGENTS, listFiles, type Agent, type Env } from "./agents";
import { REPO_ROOT } from "./build";

export type Outcome = "created" | "unchanged" | "updated" | "conflict";
export type Copy = { source: string; target: string };
export type Result = { target: string; outcome: Outcome };

export async function planCopies(sourceDir: string, targetOf: (path: string) => string): Promise<Copy[]> {
	const paths = await listFiles(sourceDir, "**/*");
	return paths.map((path) => ({ source: join(sourceDir, path), target: targetOf(path) }));
}

/** Performs every copy; writes nothing if any target differs and force is false. */
export async function install(copies: readonly Copy[], force: boolean): Promise<Result[]> {
	const planned = await Promise.all(
		copies.map(async ({ source, target }) => {
			const bytes = await Bun.file(source).bytes();
			const existing = Bun.file(target);
			let outcome: Outcome = "created";
			if (await existing.exists()) {
				const conflictOutcome = force ? "updated" : "conflict";
				outcome = Buffer.compare(bytes, await existing.bytes()) === 0 ? "unchanged" : conflictOutcome;
			}
			return { target, outcome, bytes };
		}),
	);

	if (!planned.some((entry) => entry.outcome === "conflict")) {
		const writes = planned.filter((entry) => entry.outcome === "created" || entry.outcome === "updated");
		await Promise.all(writes.map((entry) => Bun.write(entry.target, entry.bytes)));
	}
	return planned.map(({ target, outcome }) => ({ target, outcome }));
}

/** Lists installed files matching pattern with no counterpart in sourceDir, e.g. ones since renamed or deleted here. */
export async function findUnmanaged(sourceDir: string, targetDir: string, pattern: string): Promise<string[]> {
	if (!existsSync(targetDir)) {
		return [];
	}
	const paths = await listFiles(targetDir, pattern);
	return paths.filter((path) => !existsSync(join(sourceDir, path)));
}

/** Parses an agent name or "all"; returns undefined for anything else. */
export function parseSelection(input: string | null): readonly Agent[] | undefined {
	const value = input?.trim().toLowerCase();
	if (value === "all") {
		return AGENT_NAMES;
	}
	const agent = AGENT_NAMES.find((name) => name === value);
	return agent === undefined ? undefined : [agent];
}

if (import.meta.main) {
	const args = process.argv.slice(2);
	const force = args.includes("--force");
	const choices = [...AGENT_NAMES, "all"].join(", ");
	const answer = args.find((arg) => !arg.startsWith("--")) ?? prompt(`Install for which agent (${choices})?`);
	const agents = parseSelection(answer);
	if (agents === undefined) {
		console.error(`Unknown agent "${answer ?? ""}". Choose one of: ${choices}.`);
		process.exit(2);
	}

	const env: Env = { home: homedir(), vars: process.env };
	const copies = await Promise.all(
		agents.map((agent) => planCopies(join(REPO_ROOT, agent), (path) => AGENTS[agent].installPath(path, env))),
	);
	const results = await install(copies.flat(), force);
	for (const { target, outcome } of results) {
		console.log(`${outcome.padEnd(9)} ${target}`);
	}
	const unmanaged = await Promise.all(
		agents.map(async (agent) => {
			const rules = AGENTS[agent].rules;
			if (rules === undefined) {
				return [];
			}
			const targetDir = AGENTS[agent].installPath(rules.dir, env);
			const paths = await findUnmanaged(join(REPO_ROOT, agent, rules.dir), targetDir, `**/*${rules.suffix}`);
			return paths.map((path) => join(targetDir, path));
		}),
	);
	for (const path of unmanaged.flat()) {
		console.log(`unmanaged ${path} (not in this repo; delete it if stale)`);
	}

	const conflicts = results.filter((result) => result.outcome === "conflict").length;
	if (conflicts > 0) {
		console.error(`\nNothing written: ${conflicts} installed file(s) differ from this repo. Re-run with --force to overwrite them.`);
		process.exit(1);
	}
	console.log(`\nInstalled for ${agents.join(", ")}.`);
}
