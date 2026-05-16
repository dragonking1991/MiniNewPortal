export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();

  // Fail-fast on missing critical config
  const required = ["jwtSecret", "adminUsername", "adminPassword"];
  for (const key of required) {
    if (!config[key]) {
      throw new Error(`Missing required runtime config: ${key}`);
    }
  }

  // Hydrate auth store
  const authStore = useAuthStore();
  await authStore.hydrate();
});
