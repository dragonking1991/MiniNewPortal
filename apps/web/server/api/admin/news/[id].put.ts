import { newsService } from "~/server/services/news.service";
import { newsUpdateSchema } from "@mnp/shared";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const { id } = getRouterParams(event);
  const { body } = await validate(event, { body: newsUpdateSchema });
  return newsService.update(Number(id), body as any);
});
