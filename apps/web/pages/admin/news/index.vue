<template>
  <div>
    <div class="mb-4">
      <NuxtLink to="/admin/news/new" class="bg-blue-600 text-white rounded px-4 py-2">Add News</NuxtLink>
    </div>
    <div class="space-y-2">
      <div v-for="item in news ?? []" :key="item.id" class="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
        <div class="flex-1">
          <h3 class="font-bold">{{ item.title }}</h3>
          <p class="text-gray-600 text-sm">{{ item.status }} • {{ item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Draft' }}</p>
        </div>
        <div class="flex gap-2">
          <NuxtLink :to="`/admin/news/${item.id}/edit`" class="bg-blue-600 text-white rounded px-3 py-1">Edit</NuxtLink>
          <button @click="deleteNews(item.id)" class="bg-red-600 text-white rounded px-3 py-1">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { News } from "@mnp/shared";

interface NewsList {
  items: News[];
  total: number;
}

definePageMeta({ middleware: "admin-auth" });

const { data: newsData, refresh } = await useFetch<NewsList>("/api/admin/news");
const news = computed(() => newsData.value?.items);

async function deleteNews(id: number) {
  if (confirm("Delete this news?")) {
    await $fetch(`/api/admin/news/${id}`, { method: "DELETE" });
    refresh();
  }
}
</script>
