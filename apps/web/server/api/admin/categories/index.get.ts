import { categoryService } from "~/server/services/category.service";
import { paginationQuerySchema } from "@mnp/shared";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const query = getQuery(event);

  const { page = 1, limit = 20 } = paginationQuerySchema.parse({
    page: query.page ? Number(query.page) : 1,
    limit: query.limit ? Number(query.limit) : 20
  });

  const categories = await categoryService.listWithNewsCount();
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    items: categories.slice(start, end),
    page,
    limit,
    total: categories.length,
    hasMore: end < categories.length
  };
});
