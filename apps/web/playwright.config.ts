import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3010",
    trace: "on-first-retry"
  },

  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chromium"] }
    },
    {
      name: "mobile-chromium",
      use: { ...devices["iPhone 13"] }
    }
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3010",
    reuseExistingServer: !process.env.CI
  },

  globalSetup: "./e2e/globalSetup.ts"
});
