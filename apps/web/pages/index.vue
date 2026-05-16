<template>
  <div>
    <AppHeader />
    <main class="max-w-7xl mx-auto px-4 py-8">
      <MostViewedToday :news="mostViewed ?? []" />
      <section>
        <h2 class="text-3xl font-bold mb-6">Latest News</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CategorySection v-for="cat in categories ?? []" :key="cat.id" :category="cat" :news="categoriesNews[cat.id] ?? []" />
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import type { Category, News } from "@mnp/shared";

const { data: categories } = await useFetch<Category[]>("/api/categories");
const { data: mostViewed } = await useFetch<News[]>("/api/news/most-viewed-today");

const categoriesNews = ref<Record<number, News[]>>({});

onMounted(async () => {
  for (const cat of categories.value ?? []) {
    const { data } = await useFetch<{ items: News[] }>(`/api/news?categoryId=${cat.id}&limit=5`);
    if (data.value?.items) {
      categoriesNews.value[cat.id] = data.value.items;
    }
  }
});
</script>
