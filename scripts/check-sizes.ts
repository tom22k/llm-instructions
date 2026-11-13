const BROWSER_CODING_FILE = "browser/coding.instructions.md";
const MAX_BROWSER_CHARS = 4000;
const MAX_LINES = 150;

export type Measurement = { count: number; limit: number; unit: "characters" | "lines" };

export function measure(path: string, text: string): Measurement {
	// Pasted text reaches github.com with LF endings, so CRLF checkouts must not inflate the count.
	const normalised = text.replaceAll("\r\n", "\n");
	if (path === BROWSER_CODING_FILE) {
		return { count: [...normalised].length, limit: MAX_BROWSER_CHARS, unit: "characters" };
	}
	const lines = normalised === "" ? 0 : normalised.split("\n").length - (normalised.endsWith("\n") ? 1 : 0);
	return { count: lines, limit: MAX_LINES, unit: "lines" };
}

if (import.meta.main) {
	// Tracked plus untracked-but-not-ignored, so new files are checked before their first commit.
	const listing = Bun.spawnSync(["git", "ls-files", "--cached", "--others", "--exclude-standard", "*.md"]);
	if (listing.exitCode !== 0) {
		console.error(`git ls-files failed: ${listing.stderr.toString()}`);
		process.exit(2);
	}

	let failed = false;
	for (const path of listing.stdout.toString().split("\n")) {
		const file = Bun.file(path);
		if (path === "" || !(await file.exists())) {
			continue;
		}
		const { count, limit, unit } = measure(path, await file.text());
		const ok = count <= limit;
		failed ||= !ok;
		console.log(`${ok ? "ok  " : "FAIL"} ${path}: ${count}/${limit} ${unit}`);
	}
	process.exit(failed ? 1 : 0);
}
