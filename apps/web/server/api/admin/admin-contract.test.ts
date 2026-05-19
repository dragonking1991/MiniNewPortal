import { describe, expect, it } from "vitest";
import { newsCreateSchema, newsUpdateSchema } from "../../../../../packages/shared/schemas";

describe("admin API payload contracts", () => {
  it("rejects create payload when required fields are missing", () => {
    const result = newsCreateSchema.safeParse({
      title: "Only title"
    });

    expect(result.success).toBe(false);
  });

  it("rejects create payload when categoryId is invalid", () => {
    const result = newsCreateSchema.safeParse({
      title: "T",
      slug: "s",
      summary: "sum",
      content: "content",
      status: "DRAFT",
      categoryId: 0
    });

    expect(result.success).toBe(false);
  });

  it("rejects update payload when categoryId is non-positive", () => {
    const result = newsUpdateSchema.safeParse({
      categoryId: -1
    });

    expect(result.success).toBe(false);
  });
});
