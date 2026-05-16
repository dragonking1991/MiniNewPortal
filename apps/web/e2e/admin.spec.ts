import { test, expect } from "@playwright/test";

test.describe("Admin Panel", () => {
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin";

  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/admin");
    
    // Should redirect to login page
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("should login with valid credentials", async ({ page }) => {
    await page.goto("/admin/login");
    
    // Fill login form
    await page.fill("input[type='text']", adminUsername);
    await page.fill("input[type='password']", adminPassword);
    
    // Submit form
    await page.click("button[type='submit']");
    
    // Should redirect to admin dashboard
    await expect(page).toHaveURL(/\/admin/);
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.goto("/admin/login");
    
    // Fill with invalid credentials
    await page.fill("input[type='text']", "wronguser");
    await page.fill("input[type='password']", "wrongpass");
    
    // Submit form
    await page.click("button[type='submit']");
    
    // Should stay on login page and show error
    await expect(page.locator("text=Login failed")).toBeVisible();
  });

  test("should display admin dashboard after login", async ({ page }) => {
    await page.goto("/admin/login");
    
    // Login
    await page.fill("input[type='text']", adminUsername);
    await page.fill("input[type='password']", adminPassword);
    await page.click("button[type='submit']");
    
    // Wait for dashboard
    await page.waitForURL(/\/admin$/);
    
    // Check dashboard elements
    await expect(page.locator("text=Total Categories")).toBeVisible();
    await expect(page.locator("text=Total News")).toBeVisible();
  });

  test("should navigate to categories management", async ({ page }) => {
    await page.goto("/admin/login");
    
    // Login
    await page.fill("input[type='text']", adminUsername);
    await page.fill("input[type='password']", adminPassword);
    await page.click("button[type='submit']");
    
    // Click manage categories link
    await page.click("a:has-text('Manage Categories')");
    
    // Check URL
    await expect(page).toHaveURL(/\/admin\/categories/);
  });

  test("should navigate to news management", async ({ page }) => {
    await page.goto("/admin/login");
    
    // Login
    await page.fill("input[type='text']", adminUsername);
    await page.fill("input[type='password']", adminPassword);
    await page.click("button[type='submit']");
    
    // Click manage news link
    await page.click("a:has-text('Manage News')");
    
    // Check URL
    await expect(page).toHaveURL(/\/admin\/news/);
  });

  test("should logout", async ({ page }) => {
    await page.goto("/admin/login");
    
    // Login
    await page.fill("input[type='text']", adminUsername);
    await page.fill("input[type='password']", adminPassword);
    await page.click("button[type='submit']");
    
    // Wait for dashboard
    await page.waitForURL(/\/admin$/);
    
    // Click logout button
    await page.click("button:has-text('Logout')");
    
    // Should redirect to home
    await expect(page).toHaveURL("/");
  });

  test("should have admin navigation sidebar", async ({ page }) => {
    await page.goto("/admin/login");
    
    // Login
    await page.fill("input[type='text']", adminUsername);
    await page.fill("input[type='password']", adminPassword);
    await page.click("button[type='submit']");
    
    // Check sidebar navigation
    await expect(page.locator("aside")).toBeVisible();
    await expect(page.locator("a:has-text('Dashboard')")).toBeVisible();
    await expect(page.locator("a:has-text('Categories')")).toBeVisible();
    await expect(page.locator("a:has-text('News')")).toBeVisible();
  });
});
