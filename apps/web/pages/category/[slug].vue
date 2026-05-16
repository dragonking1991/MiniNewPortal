<template>
  <div>
    <AppHeader />
    <main class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">{{ slug }}</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <NewsCard v-for="item in news" :key="item.id" :news="item" />
      </div>
      <div v-if="hasMore" ref="observerTarget" class="py-8 text-center">
        <p v-if="isLoading" class="text-gray-600">Loading more...</p>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import type { News } from "@mnp/shared";

const route = useRoute();
const slug = route.params.slug as string;
const newsStore = useNewsStore();
const { target: observerTarget, isLoading } = useInfiniteScroll(loadMore);

const news = computed(() => newsStore.newsByCategory[slug] ?? []);
const hasMore = computed(() => newsStore.hasMoreByCategory[slug] !== false);

async function loadMore() {
  const result = await $fetch<{ items: News[]; hasMore: boolean }>(`/api/news?categorySlug=${slug}&page=${(newsStore.pagesByCategory[slug] ?? 0) + 1}`);
  newsStore.appendNews(slug, result.items, result.hasMore);
}

onMounted(async () => {
  if (!news.value.length) {
    await loadMore();
  }
});
</script>
