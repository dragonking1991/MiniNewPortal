<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <AppHeader />

    <main class="mx-auto w-full max-w-7xl px-4 py-6 sm:py-8 lg:px-6 lg:py-10">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
