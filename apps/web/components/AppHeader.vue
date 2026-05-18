<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
      <NuxtLink to="/" class="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">{{ siteName }}</NuxtLink>

      <button
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 md:hidden"
        type="button"
        aria-label="Toggle navigation menu"
        :aria-expanded="isMenuOpen"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span v-if="!isMenuOpen" aria-hidden="true">Menu</span>
        <span v-else aria-hidden="true">Close</span>
      </button>

      <nav class="hidden items-center gap-2 text-sm font-medium md:flex" aria-label="Primary">
        <NuxtLink to="/" class="rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Home</NuxtLink>
        <NuxtLink
          v-if="authStore.isAuthenticated"
          to="/admin"
          class="rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Admin
        </NuxtLink>
        <NuxtLink
          v-else
          to="/admin/login"
          class="rounded-md bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Login
        </NuxtLink>
      </nav>
    </div>

    <div v-if="isMenuOpen" class="border-t border-slate-200 bg-white md:hidden">
      <nav class="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6" aria-label="Mobile">
        <NuxtLink to="/" class="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100" @click="closeMenu">Home</NuxtLink>
        <NuxtLink
          v-if="authStore.isAuthenticated"
          to="/admin"
          class="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          @click="closeMenu"
        >
          Admin
        </NuxtLink>
        <NuxtLink
          v-else
          to="/admin/login"
          class="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          @click="closeMenu"
        >
          Login
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRuntimeConfig } from "#app";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const config = useRuntimeConfig();
const route = useRoute();
const siteName = config.public.siteName || "Mini News Portal";
const isMenuOpen = ref(false);

function closeMenu() {
  isMenuOpen.value = false;
}

watch(() => route.fullPath, closeMenu);
</script>
