import { categoryService } from "~/server/services/category.service";
import type { CategoryWithNewsCount } from "@mnp/shared";

export default defineEventHandler(async (): Promise<any[]> => {
  return categoryService.listWithNewsCount();
});
