import { newsService } from "~/server/services/news.service";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const { id } = getRouterParams(event);
  await newsService.delete(Number(id));
  return { success: true };
});
