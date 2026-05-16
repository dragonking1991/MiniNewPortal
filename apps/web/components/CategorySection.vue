<template>
  <section class="mb-8">
    <h2 class="text-2xl font-bold mb-4">
      <NuxtLink :to="`/category/${category.slug}`" class="hover:text-blue-600">{{ category.name }}</NuxtLink>
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NewsCard v-for="item in news" :key="item.id" :news="item" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Category, News } from "@mnp/shared";

defineProps<{
  category: Category;
  news: News[];
}>();
</script>
