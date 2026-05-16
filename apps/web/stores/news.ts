import { defineStore } from "pinia";
import type { News } from "@mnp/shared";

export const useNewsStore = defineStore("news", () => {
  const pagesByCategory = ref<Record<string, number>>({});
  const hasMoreByCategory = ref<Record<string, boolean>>({});
  const newsByCategory = ref<Record<string, News[]>>({});

  const appendNews = (categorySlug: string, items: News[], hasMore: boolean) => {
    if (!newsByCategory.value[categorySlug]) {
      newsByCategory.value[categorySlug] = [];
    }
    newsByCategory.value[categorySlug].push(...items);
    hasMoreByCategory.value[categorySlug] = hasMore;
    pagesByCategory.value[categorySlug] = (pagesByCategory.value[categorySlug] ?? 0) + 1;
  };

  const resetCategory = (categorySlug: string) => {
    newsByCategory.value[categorySlug] = [];
    pagesByCategory.value[categorySlug] = 0;
    hasMoreByCategory.value[categorySlug] = true;
  };

  return {
    pagesByCategory,
    hasMoreByCategory,
    newsByCategory,
    appendNews,
    resetCategory
  };
});
