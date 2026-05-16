import { newsService } from "~/server/services/news.service";

export default defineEventHandler(async () => {
  return newsService.mostViewedToday(5);
});
