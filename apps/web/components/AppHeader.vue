<template>
  <header class="bg-white shadow sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <NuxtLink to="/" class="text-2xl font-bold text-blue-600">{{ siteName }}</NuxtLink>
      <nav class="flex gap-4">
        <NuxtLink to="/" class="hover:text-blue-600">Home</NuxtLink>
        <NuxtLink v-if="authStore.isAuthenticated" to="/admin" class="hover:text-blue-600">Admin</NuxtLink>
        <NuxtLink v-else to="/admin/login" class="hover:text-blue-600">Login</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const config = useRuntimeConfig();
const siteName = config.public.siteName || "Mini News Portal";
</script>
