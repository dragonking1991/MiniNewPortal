import { newsService } from "~/server/services/news.service";
import { newsCreateSchema } from "@mnp/shared";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const { body } = await validate(event, { body: newsCreateSchema });
  return newsService.create(body as any);
});
