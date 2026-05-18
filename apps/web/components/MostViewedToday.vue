<template>
  <section class="rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 p-4 text-white shadow-sm sm:p-6">
    <h2 class="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">Most Viewed Today</h2>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <NuxtLink
        v-for="item in news"
        :key="item.newsId"
        :to="`/news/${item.slug}`"
        class="rounded-xl border border-white/20 bg-white/10 p-3 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <p class="line-clamp-2 font-semibold">{{ item.title }}</p>
        <p class="mt-1 text-sm text-blue-50">{{ item.viewCount }} views</p>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  news: any[];
}>();
</script>
