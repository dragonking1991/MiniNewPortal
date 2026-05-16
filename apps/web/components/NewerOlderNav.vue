<template>
  <div class="flex gap-2 justify-between">
    <NuxtLink v-if="olderSlug" :to="`/news/${olderSlug}`" class="text-blue-600 hover:underline">← Older</NuxtLink>
    <NuxtLink v-if="newerSlug" :to="`/news/${newerSlug}`" class="text-blue-600 hover:underline">Newer →</NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  olderSlug: string | null;
  newerSlug: string | null;
}>();
</script>
