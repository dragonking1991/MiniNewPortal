<template>
  <div>
    <div class="mb-4 flex flex-wrap gap-2">
      <button @click="showForm = !showForm" class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
        {{ showForm ? "Cancel" : "Add Category" }}
      </button>
    </div>
    <form v-if="showForm" @submit.prevent="save" class="mb-6 space-y-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <input v-model="form.name" type="text" placeholder="Category Name" class="w-full rounded border border-slate-300 px-3 py-2 text-sm" required />
      <input v-model="form.slug" type="text" placeholder="Category Slug" class="w-full rounded border border-slate-300 px-3 py-2 text-sm" required />
      <button type="submit" class="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700">Save</button>
    </form>
    <div class="space-y-3">
      <div v-for="cat in categories" :key="cat.id" class="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="font-semibold text-slate-900">{{ cat.name }} ({{ getNewsCount(cat) }} news)</h3>
          <p class="text-sm text-slate-600">{{ cat.slug }}</p>
        </div>
        <button @click="deleteCategory(cat.id)" class="self-start rounded bg-red-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-700 sm:self-auto">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from "@mnp/shared";

interface CategoryListResponse {
  items: Category[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

definePageMeta({ middleware: "admin-auth", layout: "admin" });

const showForm = ref(false);
const form = ref({ name: "", slug: "" });
const { data: categoryData, refresh } = await useFetch<CategoryListResponse>("/api/admin/categories");
const categories = computed(() => categoryData.value?.items ?? []);

async function save() {
  await $fetch("/api/admin/categories", {
    method: "POST",
    body: form.value
  });
  form.value = { name: "", slug: "" };
  showForm.value = false;
  refresh();
}

async function deleteCategory(id: number) {
  if (confirm("Delete this category?")) {
    await $fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    refresh();
  }
}

function getNewsCount(category: Category) {
  return ((category as Category & { newsCount?: number }).newsCount ?? 0);
}
</script>
