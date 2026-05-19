import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("migration constraints", () => {
  it("keeps category to news FK with ON DELETE restrict", () => {
    const sql = readFileSync("./drizzle/0000_smiling_hairball.sql", "utf8");
    expect(sql).toContain('FOREIGN KEY ("category_id")');
    expect(sql).toContain("ON DELETE restrict");
  });

  it("keeps news view FK with ON DELETE cascade", () => {
    const sql = readFileSync("./drizzle/0000_smiling_hairball.sql", "utf8");
    expect(sql).toContain('FOREIGN KEY ("news_id")');
    expect(sql).toContain("ON DELETE cascade");
  });
});
