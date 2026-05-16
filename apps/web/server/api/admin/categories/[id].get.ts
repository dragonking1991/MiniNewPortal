import { categoryService } from "~/server/services/category.service";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const { id } = getRouterParams(event);
  return categoryService.getById(Number(id));
});
