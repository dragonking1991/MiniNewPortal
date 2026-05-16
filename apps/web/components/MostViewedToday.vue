<template>
  <section class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 mb-8">
    <h2 class="text-2xl font-bold mb-4">Most Viewed Today</h2>
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <NuxtLink v-for="item in news" :key="item.newsId" :to="`/news/${item.slug}`" class="bg-blue-400 bg-opacity-50 rounded p-3 hover:bg-opacity-75 transition">
        <p class="font-bold line-clamp-2">{{ item.title }}</p>
        <p class="text-sm opacity-90">{{ item.viewCount }} views</p>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  news: any[];
}>();
</script>
