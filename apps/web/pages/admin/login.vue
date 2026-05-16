<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
      <h1 class="text-2xl font-bold mb-6">Admin Login</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <input v-model="username" type="text" placeholder="Username" class="w-full border rounded px-3 py-2" required />
        <input v-model="password" type="password" placeholder="Password" class="w-full border rounded px-3 py-2" required />
        <button type="submit" class="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700">Login</button>
      </form>
      <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");
const error = ref("");

async function handleLogin() {
  try {
    await authStore.login(username.value, password.value);
    router.push("/admin");
  } catch (err: any) {
    error.value = err?.message || "Login failed";
  }
}
</script>
