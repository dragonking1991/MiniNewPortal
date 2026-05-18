<template>
  <div class="grid grid-cols-1 gap-4">
    <AdminDashboard />
    <div class="flex flex-wrap gap-2">
      <NuxtLink to="/admin/categories" class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">Manage Categories</NuxtLink>
      <NuxtLink to="/admin/news" class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">Manage News</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ 
  middleware: "admin-auth",
  layout: "admin"
});
</script>
