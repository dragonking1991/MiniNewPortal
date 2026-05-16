import { defineStore } from "pinia";
import type { News } from "@mnp/shared";

export const useAdminNewsStore = defineStore("adminNews", () => {
  const items = ref<News[]>([]);
  const page = ref(1);
  const limit = ref(20);
  const total = ref(0);
  const categoryId = ref<number | null>(null);
  const status = ref<"DRAFT" | "PUBLISHED" | null>(null);
  const loading = ref(false);

  const setFilters = (opts: { categoryId?: number | null; status?: "DRAFT" | "PUBLISHED" | null }) => {
    categoryId.value = opts.categoryId ?? null;
    status.value = opts.status ?? null;
    page.value = 1;
  };

  const fetch = async () => {
    loading.value = true;
    try {
      const result: any = await $fetch("/api/admin/news", {
        query: {
          page: page.value,
          limit: limit.value,
          ...(categoryId.value && { categoryId: categoryId.value }),
          ...(status.value && { status: status.value })
        }
      });
      items.value = result.items;
      total.value = result.total;
    } finally {
      loading.value = false;
    }
  };

  const updateOptimistic = (id: number, updates: Partial<News>) => {
    const index = items.value.findIndex((n) => n.id === id);
    if (index >= 0) {
      items.value[index] = { ...items.value[index], ...updates };
    }
  };

  return {
    items,
    page,
    limit,
    total,
    categoryId,
    status,
    loading,
    setFilters,
    fetch,
    updateOptimistic
  };
});
