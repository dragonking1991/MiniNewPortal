import { newsService } from "~/server/services/news.service";
import { paginationQuerySchema } from "@mnp/shared";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const query = getQuery(event);

  const parsed = paginationQuerySchema.parse({
    page: query.page ? Number(query.page) : 1,
    limit: query.limit ? Number(query.limit) : 20,
    categoryId: query.categoryId ? Number(query.categoryId as string) : undefined,
    status: (query.status as "DRAFT" | "PUBLISHED") || undefined
  });

  // Build filter object without undefined values
  const filterObj: any = {
    page: parsed.page,
    limit: parsed.limit
  };

  if (parsed.categoryId !== undefined) {
    filterObj.categoryId = parsed.categoryId;
  }

  const result = await newsService.listPublished(filterObj);

  return {
    ...result,
    hasMore: result.items.length === parsed.limit
  };
});
