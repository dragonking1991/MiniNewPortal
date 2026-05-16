<template>
  <div class="max-w-2xl">
    <h1 class="text-2xl font-bold mb-6">Edit News</h1>
    <form @submit.prevent="save" class="space-y-4 bg-white rounded-lg shadow-md p-6">
      <input v-model="form.title" type="text" placeholder="Title" class="w-full border rounded px-3 py-2" required />
      <input v-model="form.slug" type="text" placeholder="Slug" class="w-full border rounded px-3 py-2" required />
      <textarea v-model="form.summary" placeholder="Summary" class="w-full border rounded px-3 py-2" required></textarea>
      <textarea v-model="form.content" placeholder="Content" class="w-full border rounded px-3 py-2 h-48" required></textarea>
      <input v-model="form.imageUrl" type="url" placeholder="Image URL" class="w-full border rounded px-3 py-2" />
      <select v-model="form.status" class="w-full border rounded px-3 py-2">
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
      </select>
      <input v-if="form.status === 'PUBLISHED'" v-model="form.publishedAt" type="datetime-local" class="w-full border rounded px-3 py-2" />
      <button type="submit" class="w-full bg-green-600 text-white rounded py-2 hover:bg-green-700">Update</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { News } from "@mnp/shared";

definePageMeta({ middleware: "admin-auth" });

const router = useRouter();
const route = useRoute();
const id = route.params.id as string;

const { data: article } = await useFetch<News>(`/api/admin/news/${id}`);

const form = ref({
  title: "",
  slug: "",
  summary: "",
  content: "",
  imageUrl: "",
  status: "DRAFT",
  publishedAt: ""
});

watch(article, (val) => {
  if (val) {
    form.value = {
      title: val.title,
      slug: val.slug,
      summary: val.summary,
      content: val.content,
      imageUrl: val.imageUrl || "",
      status: val.status,
      publishedAt: val.publishedAt ? new Date(val.publishedAt).toISOString().slice(0, 16) : ""
    };
  }
}, { immediate: true });

async function save() {
  await $fetch(`/api/admin/news/${id}`, {
    method: "PUT",
    body: {
      ...form.value,
      publishedAt: form.value.publishedAt ? new Date(form.value.publishedAt) : null
    }
  });
  router.push("/admin/news");
}
</script>
