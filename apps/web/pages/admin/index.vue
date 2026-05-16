<template>
  <div class="grid grid-cols-1 gap-4">
    <AdminDashboard />
    <div class="flex gap-2">
      <NuxtLink to="/admin/categories" class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">Manage Categories</NuxtLink>
      <NuxtLink to="/admin/news" class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">Manage News</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ 
  middleware: "admin-auth",
  layout: "admin"
});
</script>
