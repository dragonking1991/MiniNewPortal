export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  // Hydrate auth on first load
  if (!process.client || !authStore.isAuthenticated) {
    await authStore.hydrate();
  }

  if (!authStore.isAuthenticated) {
    return navigateTo("/admin/login");
  }
});
