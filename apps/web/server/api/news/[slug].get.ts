import { newsService } from "~/server/services/news.service";

export default defineEventHandler(async (event) => {
  const { slug } = getRouterParams(event);
  return newsService.getDetailBySlug(slug);
});
