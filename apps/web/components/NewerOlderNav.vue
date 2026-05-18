<template>
  <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
    <NuxtLink
      v-if="olderSlug"
      :to="`/news/${olderSlug}`"
      class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
    >
      Older Post
    </NuxtLink>
    <span v-else class="hidden sm:block" aria-hidden="true"></span>

    <NuxtLink
      v-if="newerSlug"
      :to="`/news/${newerSlug}`"
      class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:text-right"
    >
      Newer Post
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  olderSlug: string | null;
  newerSlug: string | null;
}>();
</script>
