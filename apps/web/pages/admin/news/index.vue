<template>
  <div>
    <div class="mb-4">
      <NuxtLink to="/admin/news/new" class="inline-flex rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">Add News</NuxtLink>
    </div>
    <div class="space-y-3">
      <div v-for="item in news ?? []" :key="item.id" class="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div class="flex-1">
          <h3 class="font-semibold text-slate-900">{{ item.title }}</h3>
          <p class="text-sm text-slate-600">{{ item.status }} • {{ item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Draft' }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <NuxtLink :to="`/admin/news/${item.id}/edit`" class="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-blue-700">Edit</NuxtLink>
          <button @click="deleteNews(item.id)" class="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-700">Delete</button>
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

definePageMeta({ middleware: "admin-auth", layout: "admin" });

const { data: newsData, refresh } = await useFetch<NewsList>("/api/admin/news");
const news = computed(() => newsData.value?.items);

async function deleteNews(id: number) {
  if (confirm("Delete this news?")) {
    await $fetch(`/api/admin/news/${id}`, { method: "DELETE" });
    refresh();
  }
}
</script>
