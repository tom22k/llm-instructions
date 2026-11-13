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
	const trailingNewline = normalised.endsWith("\n") ? 1 : 0;
	const lines = normalised === "" ? 0 : normalised.split("\n").length - trailingNewline;
	return { count: lines, limit: MAX_LINES, unit: "lines" };
}

if (import.meta.main) {
	// Tracked plus untracked-but-not-ignored, so new files are checked before their first commit.
	const listing = Bun.spawnSync(["git", "ls-files", "--cached", "--others", "--exclude-standard", "*.md"]);
	if (listing.exitCode !== 0) {
		console.error(`git ls-files failed: ${listing.stderr.toString()}`);
		process.exit(2);
	}

	const paths = listing.stdout.toString().split("\n").filter((path) => path !== "");
	// Tracked files deleted from the working tree have no text to measure.
	const texts = await Promise.all(
		paths.map(async (path) => {
			const file = Bun.file(path);
			return (await file.exists()) ? file.text() : undefined;
		}),
	);

	let failed = false;
	for (const [index, path] of paths.entries()) {
		const text = texts[index];
		if (text === undefined) {
			continue;
		}
		const { count, limit, unit } = measure(path, text);
		const ok = count <= limit;
		failed ||= !ok;
		console.log(`${ok ? "ok  " : "FAIL"} ${path}: ${count}/${limit} ${unit}`);
	}
	process.exit(failed ? 1 : 0);
}
