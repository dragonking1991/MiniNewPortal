import { defineStore } from "pinia";
import type { AuthMe } from "@mnp/shared";

export const useAuthStore = defineStore("auth", () => {
  const username = ref<string | null>(null);
  const isAuthenticated = ref(false);

  const login = async (user: string, pass: string) => {
    const data: any = await $fetch("/api/auth/login", {
      method: "POST",
      body: { username: user, password: pass }
    });
    username.value = data.username;
    isAuthenticated.value = true;
    return data;
  };

  const logout = async () => {
    await $fetch("/api/auth/logout", { method: "POST" });
    username.value = null;
    isAuthenticated.value = false;
  };

  const hydrate = async () => {
    try {
      const data: any = await $fetch("/api/auth/me");
      username.value = data.username;
      isAuthenticated.value = true;
    } catch {
      username.value = null;
      isAuthenticated.value = false;
    }
  };

  return {
    username,
    isAuthenticated,
    login,
    logout,
    hydrate
  };
});
