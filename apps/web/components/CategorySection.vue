<template>
  <section class="space-y-4 sm:space-y-5">
    <h2 class="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
      <NuxtLink :to="`/category/${category.slug}`" class="transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">{{ category.name }}</NuxtLink>
    </h2>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
