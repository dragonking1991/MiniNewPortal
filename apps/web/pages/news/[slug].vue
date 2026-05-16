<template>
  <div>
    <AppHeader />
    <main class="max-w-4xl mx-auto px-4 py-8">
      <NewsDetail :article="article" />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import type { NewsDetail } from "@mnp/shared";

const route = useRoute();
const slug = route.params.slug as string;

const { data: article } = await useFetch<NewsDetail>(`/api/news/${slug}`);
</script>
