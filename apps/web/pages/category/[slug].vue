<template>
  <div>
    <h1 class="mb-6 text-2xl font-semibold capitalize tracking-tight text-slate-900 sm:text-3xl">{{ slug }}</h1>
    <div class="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
      <NewsCard v-for="item in news" :key="item.id" :news="item" />
    </div>
    <div v-if="hasMore" ref="observerTarget" class="py-8 text-center">
      <p v-if="isLoading" class="text-sm text-slate-600">Loading more...</p>
      <p v-else class="text-sm text-slate-500">Scroll for more</p>
    </div>
    <p v-else class="py-8 text-center text-sm text-slate-500">End of list</p>
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
