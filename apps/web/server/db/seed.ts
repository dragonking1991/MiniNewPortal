import { desc, eq } from "drizzle-orm";
import { db } from "./client";
import { categories, news, newsViewDaily } from "./schema";

function makeSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

async function seed() {
  const categorySeeds = [
    { name: "Politics", slug: "politics" },
    { name: "Business", slug: "business" },
    { name: "Technology", slug: "technology" },
    { name: "Lifestyle", slug: "lifestyle" }
  ] as const;

  const existingCategories = await db.select().from(categories);

  if (existingCategories.length === 0) {
    const now = new Date();
    await db.insert(categories).values(categorySeeds.map((item) => ({
      ...item,
      createdAt: now,
      updatedAt: now
    })));
  }

  const allCategories: Array<typeof categories.$inferSelect> = await db
    .select()
    .from(categories)
    .orderBy(categories.id);
  const categoryIdBySlug = new Map<string, number>(allCategories.map((item) => [item.slug, item.id]));

  const publishedPerCategory = 8;
  let sequence = 0;
  const newsRows: Array<typeof news.$inferInsert> = [];

  for (const category of categorySeeds) {
    const categoryId = categoryIdBySlug.get(category.slug);

    if (!categoryId) {
      throw new Error(`Category not found after seeding: ${category.slug}`);
    }

    for (let i = 1; i <= publishedPerCategory; i += 1) {
      sequence += 1;
      const title = `${category.name} Update ${i}`;
      newsRows.push({
        title,
        slug: makeSlug(`${category.slug}-update-${i}`),
        summary: `${category.name} summary ${i}`,
        content: `${title} detailed content for seeded data.`,
        imageUrl: `https://picsum.photos/seed/${category.slug}-${i}/1200/675`,
        status: "PUBLISHED",
        publishedAt: hoursAgo(sequence),
        viewCount: 40 + sequence,
        categoryId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    for (let i = 1; i <= 2; i += 1) {
      const title = `${category.name} Draft ${i}`;
      newsRows.push({
        title,
        slug: makeSlug(`${category.slug}-draft-${i}`),
        summary: `${category.name} draft summary ${i}`,
        content: `${title} draft content.`,
        imageUrl: null,
        status: "DRAFT",
        publishedAt: null,
        viewCount: 0,
        categoryId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }

  const existingNews = await db.select().from(news);

  if (existingNews.length === 0) {
    await db.insert(news).values(newsRows);
  }

  const publishedNews: Array<{ id: number; publishedAt: Date | null }> = await db
    .select({ id: news.id, publishedAt: news.publishedAt })
    .from(news)
    .where(eq(news.status, "PUBLISHED"))
    .orderBy(desc(news.publishedAt));

  const today = new Date();
  const todayValue = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, "0")}-${String(today.getUTCDate()).padStart(2, "0")}`;

  const existingDailyRows = await db.select().from(newsViewDaily);

  if (existingDailyRows.length === 0) {
    await db.insert(newsViewDaily).values(
      publishedNews.slice(0, 12).map((row, index) => ({
        newsId: row.id,
        viewDate: todayValue,
        viewCount: 10 + (12 - index) * 3
      }))
    );
  }

  console.log(`Seed completed: ${allCategories.length} categories, ${publishedNews.length} published rows.`);
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
