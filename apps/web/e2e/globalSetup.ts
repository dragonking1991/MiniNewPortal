import { chromium, type BrowserContext } from "@playwright/test";

async function globalSetup() {
  // In a real E2E setup, you might:
  // 1. Reset test database state
  // 2. Seed initial test data
  // 3. Authenticate and store session cookies
  // 4. Set up test admin user

  const browser = await chromium.launch();
  const context: BrowserContext = await browser.newContext();
  const page = await context.newPage();

  // Test that the app is reachable
  try {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    console.log("✓ Application is ready for testing");
  } catch (error) {
    console.error("✗ Application failed to load:", error);
    await browser.close();
    process.exit(1);
  }

  await context.close();
  await browser.close();
}

export default globalSetup;
