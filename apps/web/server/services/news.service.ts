import { eq, and } from "drizzle-orm";
import { db } from "../db/client";
import { news } from "../db/schema";
import { newsRepo, type NewsListFilters, type NewsCreateInput, type NewsUpdateInput } from "../repositories/news.repo";
import { viewRepo } from "../repositories/view.repo";
import { categoryService } from "./category.service";
import { NotFoundError, ConflictError, ValidationError } from "./errors";

export const newsService = {
  async listPublished(filters: { page: number; limit: number; categoryId?: number; categorySlug?: string }) {
    return newsRepo.list({
      ...filters,
      status: "PUBLISHED"
    });
  },

  async getDetailBySlug(slug: string) {
    const article = await newsRepo.findBySlug(slug, "PUBLISHED");
    if (!article) {
      throw new NotFoundError("Article", slug);
    }

    // Atomic increment view count and upsert daily view in a transaction
    const today = new Date();
    const todayValue = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, "0")}-${String(today.getUTCDate()).padStart(2, "0")}`;

    await db.transaction(async (tx) => {
      await tx
        .update(news)
        .set({ viewCount: (article.viewCount ?? 0) + 1, updatedAt: new Date() })
        .where(eq(news.id, article.id));

      await viewRepo.upsertAndIncrementToday(article.id, todayValue);
    });

    // Fetch updated article and siblings
    const [newer, older] = await Promise.all([
      newsRepo.findNewerSibling({ id: article.id, publishedAt: article.publishedAt }),
      newsRepo.findOlderSibling({ id: article.id, publishedAt: article.publishedAt })
    ]);

    return {
      ...article,
      viewCount: (article.viewCount ?? 0) + 1,
      newerSlug: newer?.slug ?? null,
      olderSlug: older?.slug ?? null
    };
  },

  async getById(id: number) {
    const article = await newsRepo.findById(id);
    if (!article) {
      throw new NotFoundError("Article", String(id));
    }
    return article;
  },

  async mostViewedToday(limit: number = 5) {
    const today = new Date();
    const todayValue = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, "0")}-${String(today.getUTCDate()).padStart(2, "0")}`;
    return viewRepo.topByDate(todayValue, limit);
  },

  async create(input: NewsCreateInput) {
    // Validate category exists
    await categoryService.getById(input.categoryId);

    // Check slug uniqueness
    const existing = await newsRepo.findBySlug(input.slug);
    if (existing) {
      throw new ConflictError(`News slug already exists: ${input.slug}`);
    }

    // If publishing, require publishedAt
    if (input.status === "PUBLISHED" && !input.publishedAt) {
      throw new ValidationError('Published news must have publishedAt set');
    }

    return newsRepo.create(input);
  },

  async update(id: number, input: NewsUpdateInput) {
    const article = await newsRepo.findById(id);
    if (!article) {
      throw new NotFoundError("Article", String(id));
    }

    // If category is being changed, validate it exists
    if (input.categoryId && input.categoryId !== article.categoryId) {
      await categoryService.getById(input.categoryId);
    }

    // If slug is being changed, check uniqueness
    if (input.slug && input.slug !== article.slug) {
      const existing = await newsRepo.findBySlug(input.slug);
      if (existing) {
        throw new ConflictError(`News slug already exists: ${input.slug}`);
      }
    }

    // If changing to published, require publishedAt
    if (input.status === "PUBLISHED" && !input.publishedAt && !article.publishedAt) {
      throw new ValidationError('Published news must have publishedAt set');
    }

    return newsRepo.update(id, input);
  },

  async delete(id: number) {
    const article = await newsRepo.findById(id);
    if (!article) {
      throw new NotFoundError("Article", String(id));
    }

    const deleted = await newsRepo.delete(id);
    if (!deleted) {
      throw new NotFoundError("Article", String(id));
    }

    return true;
  }
};
