<template>
  <div class="min-h-screen bg-slate-950 text-slate-50">
    <div class="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside class="border-b border-slate-800 bg-slate-900 p-6 lg:border-b-0 lg:border-r">
        <NuxtLink to="/admin" class="text-lg font-semibold tracking-tight text-white">
          Admin Panel
        </NuxtLink>
        <p class="mt-2 text-sm text-slate-400">Content operations</p>
        <nav class="mt-8 space-y-2">
          <NuxtLink to="/admin" class="block px-3 py-2 rounded hover:bg-slate-800">Dashboard</NuxtLink>
          <NuxtLink to="/admin/categories" class="block px-3 py-2 rounded hover:bg-slate-800">Categories</NuxtLink>
          <NuxtLink to="/admin/news" class="block px-3 py-2 rounded hover:bg-slate-800">News</NuxtLink>
        </nav>
        <button @click="logout" class="mt-8 w-full bg-red-600 text-white rounded px-3 py-2">Logout</button>
      </aside>

      <main class="p-6 lg:p-10">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const authStore = useAuthStore();

async function logout() {
  await authStore.logout();
  router.push("/");
}
</script>
