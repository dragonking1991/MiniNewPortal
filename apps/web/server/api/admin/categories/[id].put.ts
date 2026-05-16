import { categoryService } from "~/server/services/category.service";
import { categoryUpdateSchema } from "@mnp/shared";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const { id } = getRouterParams(event);
  const { body } = await validate(event, { body: categoryUpdateSchema });
  return categoryService.update(Number(id), body as any);
});
