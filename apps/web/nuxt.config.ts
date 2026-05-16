import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: true,
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  css: ["~/assets/css/main.css"],
  routeRules: {
    "/admin/**": { ssr: false }
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET ?? "",
    adminUsername: process.env.ADMIN_USERNAME ?? "",
    adminPassword: process.env.ADMIN_PASSWORD ?? "",
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api"
    }
  },
  typescript: {
    strict: true,
    typeCheck: false,
    tsConfig: {
      extends: "../../../tsconfig.base.json"
    }
  }
});
