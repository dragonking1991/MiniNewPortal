import { categoryRepo } from "../repositories/category.repo";
import { newsRepo } from "../repositories/news.repo";
import { CategoryHasNewsError, NotFoundError, ConflictError } from "./errors";

export const categoryService = {
  async listWithNewsCount() {
    return categoryRepo.findAllWithNewsCount();
  },

  async getById(id: number) {
    const category = await categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundError("Category", String(id));
    }
    return category;
  },

  async getBySlug(slug: string) {
    const category = await categoryRepo.findBySlug(slug);
    if (!category) {
      throw new NotFoundError("Category", slug);
    }
    return category;
  },

  async create(input: { name: string; slug: string }) {
    const existing = await categoryRepo.findBySlug(input.slug);
    if (existing) {
      throw new ConflictError(`Category slug already exists: ${input.slug}`);
    }

    return categoryRepo.create(input);
  },

  async update(id: number, input: { name?: string; slug?: string }) {
    const category = await categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundError("Category", String(id));
    }

    if (input.slug && input.slug !== category.slug) {
      const existing = await categoryRepo.findBySlug(input.slug);
      if (existing) {
        throw new ConflictError(`Category slug already exists: ${input.slug}`);
      }
    }

    return categoryRepo.update(id, input);
  },

  async delete(id: number) {
    const category = await categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundError("Category", String(id));
    }

    const { total } = await newsRepo.list({
      page: 1,
      limit: 1,
      categoryId: id
    });

    if (total > 0) {
      throw new CategoryHasNewsError(id, total);
    }

    const deleted = await categoryRepo.delete(id);
    if (!deleted) {
      throw new NotFoundError("Category", String(id));
    }

    return true;
  }
};
