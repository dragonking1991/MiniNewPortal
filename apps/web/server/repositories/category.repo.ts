import { count, eq, sql } from "drizzle-orm";
import { db } from "../db/client";
import { categories, news } from "../db/schema";

export type CategoryCreateInput = {
  name: string;
  slug: string;
};

export type CategoryUpdateInput = Partial<CategoryCreateInput>;

export const categoryRepo = {
  async findAllWithNewsCount() {
    return db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        newsCount: sql<number>`cast(${count(news.id)} as int)`
      })
      .from(categories)
      .leftJoin(news, eq(news.categoryId, categories.id))
      .groupBy(categories.id)
      .orderBy(categories.name);
  },

  async findById(id: number) {
    const rows = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return rows[0] ?? null;
  },

  async findBySlug(slug: string) {
    const rows = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    return rows[0] ?? null;
  },

  async create(input: CategoryCreateInput) {
    const rows = await db.insert(categories).values(input).returning();
    return rows[0];
  },

  async update(id: number, input: CategoryUpdateInput) {
    const rows = await db
      .update(categories)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();

    return rows[0] ?? null;
  },

  async delete(id: number) {
    const rows = await db.delete(categories).where(eq(categories.id, id)).returning({ id: categories.id });
    return rows.length > 0;
  }
};
