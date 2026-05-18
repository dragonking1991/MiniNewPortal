import { test, expect } from "@playwright/test";

test.describe("Admin Panel", () => {
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin";

  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/admin");

    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("should login with valid credentials", async ({ page }) => {
    await page.goto("/admin/login");

    await page.fill("input[type='text']", adminUsername);
    await page.fill("input[type='password']", adminPassword);

    await page.click("button[type='submit']");

    await expect(page).toHaveURL(/\/admin/);
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.goto("/admin/login");

    await page.fill("input[type='text']", "wronguser");
    await page.fill("input[type='password']", "wrongpass");

    await page.click("button[type='submit']");

    await expect(page.locator("text=Login failed")).toBeVisible();
  });

  test("should display admin dashboard after login", async ({ page }) => {
    await page.goto("/admin/login");

    await page.fill("input[type='text']", adminUsername);
    await page.fill("input[type='password']", adminPassword);
    await page.click("button[type='submit']");

    await page.waitForURL(/\/admin$/);

    await expect(page.locator("text=Total Categories")).toBeVisible();
    await expect(page.locator("text=Total News")).toBeVisible();
  });

  test("should navigate to categories management", async ({ page }) => {
    await page.goto("/admin/login");

    await page.fill("input[type='text']", adminUsername);
    await page.fill("input[type='password']", adminPassword);
    await page.click("button[type='submit']");

    await page.click("a:has-text('Manage Categories')");

    await expect(page).toHaveURL(/\/admin\/categories/);
  });

  test("should navigate to news management", async ({ page }) => {
    await page.goto("/admin/login");

    await page.fill("input[type='text']", adminUsername);
    await page.fill("input[type='password']", adminPassword);
    await page.click("button[type='submit']");

    await page.click("a:has-text('Manage News')");

    await expect(page).toHaveURL(/\/admin\/news/);
  });

  test("should logout", async ({ page }) => {
    await page.goto("/admin/login");

    await page.fill("input[type='text']", adminUsername);
    await page.fill("input[type='password']", adminPassword);
    await page.click("button[type='submit']");

    await page.waitForURL(/\/admin$/);

    await page.click("button:has-text('Logout')");

    await expect(page).toHaveURL("/");
  });

  test("should have admin navigation sidebar", async ({ page }, testInfo) => {
    await page.goto("/admin/login");

    await page.fill("input[type='text']", adminUsername);
    await page.fill("input[type='password']", adminPassword);
    await page.click("button[type='submit']");

    if (testInfo.project.name.includes("mobile")) {
      await page.click("button[aria-label='Toggle admin navigation']");
    }

    await expect(page.locator("aside")).toBeVisible();
    await expect(page.locator("a:has-text('Dashboard')")).toBeVisible();
    await expect(page.locator("a:has-text('Categories')")).toBeVisible();
    await expect(page.locator("a:has-text('News')")).toBeVisible();
  });

  test("should redirect to login after logout when opening protected admin route", async ({ page }) => {
    await page.goto("/admin/login");

    await page.fill("input[type='text']", adminUsername);
    await page.fill("input[type='password']", adminPassword);
    await page.click("button[type='submit']");
    await page.waitForURL(/\/admin$/);

    await page.click("button:has-text('Logout')");
    await expect(page).toHaveURL("/");

    await page.goto("/admin/news");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
