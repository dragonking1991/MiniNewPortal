<template>
  <div class="min-h-screen bg-slate-950 text-slate-50">
    <div class="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside class="border-b border-slate-800 bg-slate-900 p-6 lg:border-b-0 lg:border-r">
        <NuxtLink to="/admin" class="text-lg font-semibold tracking-tight text-white">
          Admin Panel
        </NuxtLink>
        <p class="mt-2 text-sm text-slate-400">Content operations</p>
      </aside>

      <main class="p-6 lg:p-10">
        <slot />
      </main>
    </div>
  </div>
</template>
