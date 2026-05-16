import { newsService } from "~/server/services/news.service";
import { paginationQuerySchema } from "@mnp/shared";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const parsed = paginationQuerySchema.parse({
    page: query.page ? Number(query.page) : 1,
    limit: query.limit ? Number(query.limit) : 20,
    categoryId: query.categoryId ? Number(query.categoryId as string) : undefined,
    categorySlug: query.categorySlug as string | undefined
  });

  // Build filter object without undefined values to satisfy exactOptionalPropertyTypes
  const filterObj: any = {
    page: parsed.page,
    limit: parsed.limit
  };

  if (parsed.categoryId !== undefined) {
    filterObj.categoryId = parsed.categoryId;
  }

  if (parsed.categorySlug !== undefined) {
    filterObj.categorySlug = parsed.categorySlug;
  }

  const result = await newsService.listPublished(filterObj);

  return {
    ...result,
    hasMore: result.items.length === parsed.limit
  };
});
