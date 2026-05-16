import { categoryService } from "~/server/services/category.service";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const { id } = getRouterParams(event);
  await categoryService.delete(Number(id));
  return { success: true };
});
