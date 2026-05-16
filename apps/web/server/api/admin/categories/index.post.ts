import { categoryService } from "~/server/services/category.service";
import { categoryCreateSchema } from "@mnp/shared";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const { body } = await validate(event, { body: categoryCreateSchema });
  return categoryService.create(body as any);
});
