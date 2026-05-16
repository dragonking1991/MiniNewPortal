import { defineStore } from "pinia";
import type { CategoryWithNewsCount } from "@mnp/shared";

export const useCategoriesStore = defineStore("categories", () => {
  const categories = ref<any[]>([]);
  const loading = ref(false);

  const fetchCategories = async () => {
    loading.value = true;
    try {
      const response = await $fetch<any>("/api/categories");
      categories.value = response || [];
    } finally {
      loading.value = false;
    }
  };

  return {
    categories: readonly(categories),
    loading: readonly(loading),
    fetchCategories
  };
});
