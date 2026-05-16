import { test, expect } from "@playwright/test";

test.describe("Public News Site", () => {
  test("should load homepage and display news", async ({ page }) => {
    await page.goto("/");
    
    // Check header exists
    await expect(page.locator("header")).toBeVisible();
    
    // Check title contains site name
    await expect(page).toHaveTitle(/Mini News Portal/i);
  });

  test("should display categories on homepage", async ({ page }) => {
    await page.goto("/");
    
    // Wait for categories to load
    await page.waitForSelector("h2");
    
    // Check that at least one category exists
    const categories = page.locator("section h2");
    await expect(categories).not.toHaveCount(0);
  });

  test("should navigate to category page", async ({ page }) => {
    await page.goto("/");
    
    // Click first category link
    await page.click("a[href^='/category/']");
    
    // Check URL changed to category page
    await expect(page).toHaveURL(/\/category\//);
  });

  test("should navigate to news detail page", async ({ page }) => {
    await page.goto("/");
    
    // Click first news card
    await page.click("a[href^='/news/']");
    
    // Check URL changed to news page
    await expect(page).toHaveURL(/\/news\//);
    
    // Check article content is visible
    await expect(page.locator("article")).toBeVisible();
  });

  test("should have pagination on category page", async ({ page }) => {
    await page.goto("/");
    
    // Navigate to a category
    await page.click("a[href^='/category/']");
    
    // Scroll to bottom to trigger infinite scroll
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 3));
    
    // Wait for new items to load
    await page.waitForTimeout(1000);
  });

  test("should display most viewed articles", async ({ page }) => {
    await page.goto("/");
    
    // Check for most viewed section
    await expect(page.locator("text=Most Viewed Today")).toBeVisible();
  });

  test("should have navigation links in header", async ({ page }) => {
    await page.goto("/");
    
    // Check header navigation
    await expect(page.locator("a[href='/']")).toBeVisible();
    
    // Check admin login link
    await expect(page.locator("a[href='/admin/login']")).toBeVisible();
  });

  test("should have footer", async ({ page }) => {
    await page.goto("/");
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check footer is visible
    await expect(page.locator("footer")).toBeVisible();
  });
});
