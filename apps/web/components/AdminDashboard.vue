<template>
  <div class="grid grid-cols-4 gap-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-gray-600 text-sm">Total Categories</h3>
      <p class="text-3xl font-bold">{{ categories?.length ?? 0 }}</p>
    </div>
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-gray-600 text-sm">Total News</h3>
      <p class="text-3xl font-bold">{{ totalNews }}</p>
    </div>
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-gray-600 text-sm">Published</h3>
      <p class="text-3xl font-bold">{{ publishedCount }}</p>
    </div>
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-gray-600 text-sm">Drafts</h3>
      <p class="text-3xl font-bold">{{ draftCount }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category, News } from "@mnp/shared";

interface NewsList {
  items: News[];
  total: number;
}

const { data: categories } = await useFetch<Category[]>("/api/admin/categories");
const { data: newsData } = await useFetch<NewsList>("/api/admin/news");

const totalNews = computed(() => newsData.value?.total ?? 0);
const publishedCount = computed(() => newsData.value?.items?.filter((n: News) => n.status === "PUBLISHED")?.length ?? 0);
const draftCount = computed(() => newsData.value?.items?.filter((n: News) => n.status === "DRAFT")?.length ?? 0);
</script>
