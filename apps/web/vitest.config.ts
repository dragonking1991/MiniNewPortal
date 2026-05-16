import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    // Exclude E2E tests from unit test runner
    exclude: ["**/e2e/**", "node_modules", ".nuxt"]
  }
});
