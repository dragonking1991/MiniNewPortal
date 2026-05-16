<template>
  <article v-if="article" class="bg-white rounded-lg shadow-md p-6">
    <img v-if="article.imageUrl" :src="article.imageUrl" :alt="article.title" class="w-full h-80 object-cover rounded mb-4" />
    <h1 class="text-4xl font-bold mb-2">{{ article.title }}</h1>
    <p class="text-gray-600 mb-4">{{ article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Draft' }} • {{ article.viewCount }} views</p>
    <div class="prose max-w-none mb-6">{{ article.content }}</div>
    <NewerOlderNav :newer-slug="article.newerSlug" :older-slug="article.olderSlug" />
  </article>
</template>

<script setup lang="ts">
import type { NewsDetail } from "@mnp/shared";

defineProps<{
  article: NewsDetail | null;
}>();
</script>
