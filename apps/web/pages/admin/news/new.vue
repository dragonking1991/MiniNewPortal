<template>
  <div class="max-w-3xl">
    <h1 class="mb-6 text-2xl font-semibold tracking-tight text-slate-900">Create News</h1>
    <form @submit.prevent="save" class="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <input v-model="form.title" type="text" placeholder="Title" class="w-full rounded border border-slate-300 px-3 py-2 text-sm" required />
      <input v-model="form.slug" type="text" placeholder="Slug" class="w-full rounded border border-slate-300 px-3 py-2 text-sm" required />
      <textarea v-model="form.summary" placeholder="Summary" class="w-full rounded border border-slate-300 px-3 py-2 text-sm" required></textarea>
      <textarea v-model="form.content" placeholder="Content" class="h-48 w-full rounded border border-slate-300 px-3 py-2 text-sm" required></textarea>
      <input v-model="form.imageUrl" type="url" placeholder="Image URL" class="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
      <select v-model="form.categoryId" class="w-full rounded border border-slate-300 px-3 py-2 text-sm" required>
        <option value="">Select Category</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
      <select v-model="form.status" class="w-full rounded border border-slate-300 px-3 py-2 text-sm">
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
      </select>
      <input v-if="form.status === 'PUBLISHED'" v-model="form.publishedAt" type="datetime-local" class="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
      <button type="submit" class="w-full rounded bg-green-600 py-2 text-sm font-medium text-white transition hover:bg-green-700">Create</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Category } from "@mnp/shared";

interface CategoryListResponse {
  items: Category[];
}

definePageMeta({ middleware: "admin-auth", layout: "admin" });

const router = useRouter();
const { data: categoryData } = await useFetch<CategoryListResponse>("/api/admin/categories");
const categories = computed(() => categoryData.value?.items ?? []);

const form = ref({
  title: "",
  slug: "",
  summary: "",
  content: "",
  imageUrl: "",
  categoryId: "",
  status: "DRAFT",
  publishedAt: ""
});

async function save() {
  await $fetch("/api/admin/news", {
    method: "POST",
    body: {
      ...form.value,
      categoryId: Number(form.value.categoryId),
      publishedAt: form.value.publishedAt ? new Date(form.value.publishedAt) : null
    }
  });
  router.push("/admin/news");
}
</script>
