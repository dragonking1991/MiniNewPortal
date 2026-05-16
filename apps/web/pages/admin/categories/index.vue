<template>
  <div>
    <div class="mb-4 flex gap-2">
      <button @click="showForm = !showForm" class="bg-blue-600 text-white rounded px-4 py-2">
        {{ showForm ? "Cancel" : "Add Category" }}
      </button>
    </div>
    <form v-if="showForm" @submit.prevent="save" class="bg-white rounded-lg shadow-md p-6 mb-6">
      <input v-model="form.name" type="text" placeholder="Category Name" class="w-full border rounded px-3 py-2 mb-2" required />
      <input v-model="form.slug" type="text" placeholder="Category Slug" class="w-full border rounded px-3 py-2 mb-2" required />
      <button type="submit" class="bg-green-600 text-white rounded px-4 py-2">Save</button>
    </form>
    <div class="space-y-2">
      <div v-for="cat in categories ?? []" :key="cat.id" class="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
        <div>
          <h3 class="font-bold">{{ cat.name }} ({{ (cat as any).newsCount ?? 0 }} news)</h3>
          <p class="text-gray-600 text-sm">{{ cat.slug }}</p>
        </div>
        <button @click="deleteCategory(cat.id)" class="bg-red-600 text-white rounded px-3 py-1">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from "@mnp/shared";

definePageMeta({ middleware: "admin-auth" });

const showForm = ref(false);
const form = ref({ name: "", slug: "" });
const { data: categories, refresh } = await useFetch<Category[]>("/api/admin/categories");

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
</script>
