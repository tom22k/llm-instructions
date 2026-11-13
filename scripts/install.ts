import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const SOURCE_DIR = join(import.meta.dir, "..", "copilot");

async function listFiles(dir: string, pattern: string): Promise<string[]> {
	// Bun.Glob yields backslash-separated paths on Windows.
	const paths = await Array.fromAsync(new Bun.Glob(pattern).scan({ cwd: dir }));
	return paths.map((path) => path.replaceAll("\\", "/")).sort();
}

export type Outcome = "created" | "unchanged" | "updated" | "conflict";
export type Result = { path: string; outcome: Outcome };

/** Copies every file under sourceDir to targetDir; writes nothing if any target differs and force is false. */
export async function install(sourceDir: string, targetDir: string, force: boolean): Promise<Result[]> {
	const paths = await listFiles(sourceDir, "**/*");
	const planned = await Promise.all(
		paths.map(async (path) => {
			const source = await Bun.file(join(sourceDir, path)).bytes();
			const target = Bun.file(join(targetDir, path));
			let outcome: Outcome = "created";
			if (await target.exists()) {
				const conflictOutcome = force ? "updated" : "conflict";
				outcome = Buffer.compare(source, await target.bytes()) === 0 ? "unchanged" : conflictOutcome;
			}
			return { path, outcome, source };
		}),
	);

	if (!planned.some((entry) => entry.outcome === "conflict")) {
		const writes = planned.filter((entry) => entry.outcome === "created" || entry.outcome === "updated");
		await Promise.all(writes.map((entry) => Bun.write(join(targetDir, entry.path), entry.source)));
	}
	return planned.map(({ path, outcome }) => ({ path, outcome }));
}

/** Lists installed instruction files with no counterpart in sourceDir, e.g. ones since renamed or deleted here. */
export async function findUnmanagedInstructions(sourceDir: string, targetDir: string): Promise<string[]> {
	const installed = join(targetDir, "instructions");
	if (!existsSync(installed)) {
		return [];
	}
	const paths = await listFiles(installed, "**/*.instructions.md");
	return paths.filter((path) => !existsSync(join(sourceDir, "instructions", path)));
}

if (import.meta.main) {
	const force = process.argv.includes("--force");
	// Copilot uses COPILOT_HOME in place of ~/.copilot when it is set.
	const targetDir = process.env["COPILOT_HOME"] ?? join(homedir(), ".copilot");

	const results = await install(SOURCE_DIR, targetDir, force);
	for (const { path, outcome } of results) {
		console.log(`${outcome.padEnd(9)} ${path}`);
	}
	for (const path of await findUnmanagedInstructions(SOURCE_DIR, targetDir)) {
		console.log(`unmanaged instructions/${path} (not in this repo; delete it if stale)`);
	}

	const conflicts = results.filter((result) => result.outcome === "conflict").length;
	if (conflicts > 0) {
		console.error(`\nNothing written: ${conflicts} installed file(s) in ${targetDir} differ from this repo. Re-run with --force to overwrite them.`);
		process.exit(1);
	}
	console.log(`\nInstalled to ${targetDir}.`);
}
