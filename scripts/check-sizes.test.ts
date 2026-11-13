import { expect, test } from "bun:test";
import { measure } from "./check-sizes";

test("counts lines with or without a trailing newline", () => {
	expect(measure("a.md", "").count).toBe(0);
	expect(measure("a.md", "x\ny").count).toBe(2);
	expect(measure("a.md", "x\r\ny\r\n").count).toBe(2);
});

test("fails other files above 150 lines", () => {
	expect(measure("a.md", "x\n".repeat(150))).toEqual({ count: 150, limit: 150, unit: "lines" });
	expect(measure("a.md", "x\n".repeat(151)).count).toBe(151);
});

test("counts browser file in characters, ignoring CR and counting code points", () => {
	expect(measure("browser/coding.instructions.md", "a\r\nb").count).toBe(3);
	expect(measure("browser/coding.instructions.md", "\u{1F600}").count).toBe(1);
	expect(measure("browser/coding.instructions.md", "x".repeat(4001))).toEqual({ count: 4001, limit: 4000, unit: "characters" });
});
