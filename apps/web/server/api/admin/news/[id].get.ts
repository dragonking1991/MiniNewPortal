import { newsService } from "~/server/services/news.service";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const { id } = getRouterParams(event);
  return newsService.getById(Number(id));
});
