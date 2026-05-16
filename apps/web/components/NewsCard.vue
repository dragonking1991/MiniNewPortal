<template>
  <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
    <img v-if="news.imageUrl" :src="news.imageUrl" :alt="news.title" class="w-full h-48 object-cover rounded mb-2" />
    <h3 class="font-bold text-lg mb-2 line-clamp-2">{{ news.title }}</h3>
    <p class="text-gray-600 text-sm line-clamp-3 mb-2">{{ news.summary }}</p>
    <p class="text-gray-500 text-xs">{{ news.publishedAt ? new Date(news.publishedAt).toLocaleDateString() : 'Draft' }}</p>
    <NuxtLink :to="`/news/${news.slug}`" class="text-blue-600 hover:underline text-sm mt-2 block">Read more →</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { News } from "@mnp/shared";

defineProps<{
  news: News;
}>();
</script>
