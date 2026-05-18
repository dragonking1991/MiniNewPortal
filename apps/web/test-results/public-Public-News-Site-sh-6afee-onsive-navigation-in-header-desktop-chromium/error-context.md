# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public.spec.ts >> Public News Site >> should have responsive navigation in header
- Location: e2e/public.spec.ts:54:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('a[href=\'/\']')
Expected: visible
Error: strict mode violation: locator('a[href=\'/\']') resolved to 2 elements:
    1) <a href="/" aria-current="page" class="router-link-active router-link-exact-active text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Mini News Portal</a> aka getByRole('link', { name: 'Mini News Portal' })
    2) <a href="/" aria-current="page" class="router-link-active router-link-exact-active rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Home</a> aka getByRole('link', { name: 'Home' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('a[href=\'/\']')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - link "Mini News Portal" [ref=e6] [cursor=pointer]:
        - /url: /
      - navigation "Primary" [ref=e7]:
        - link "Home" [ref=e8] [cursor=pointer]:
          - /url: /
        - link "Login" [ref=e9] [cursor=pointer]:
          - /url: /admin/login
  - main [ref=e10]:
    - generic [ref=e11]:
      - generic [ref=e12]:
        - heading "Most Viewed Today" [level=2] [ref=e13]
        - link "Lifestyle Update 1 1 views" [ref=e15] [cursor=pointer]:
          - /url: /news/lifestyle-update-1
          - paragraph [ref=e16]: Lifestyle Update 1
          - paragraph [ref=e17]: 1 views
      - generic [ref=e18]:
        - heading "Latest News" [level=1] [ref=e19]
        - generic [ref=e20]:
          - heading "Business" [level=2] [ref=e22]:
            - link "Business" [ref=e23] [cursor=pointer]:
              - /url: /category/business
          - heading "Lifestyle" [level=2] [ref=e25]:
            - link "Lifestyle" [ref=e26] [cursor=pointer]:
              - /url: /category/lifestyle
          - heading "Politics" [level=2] [ref=e28]:
            - link "Politics" [ref=e29] [cursor=pointer]:
              - /url: /category/politics
          - heading "Technology" [level=2] [ref=e31]:
            - link "Technology" [ref=e32] [cursor=pointer]:
              - /url: /category/technology
  - contentinfo [ref=e33]:
    - generic [ref=e34]:
      - paragraph [ref=e35]: Mini News Portal
      - paragraph [ref=e36]: © 2026 Mini News Portal. All rights reserved.
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Public News Site", () => {
  4  |   test("should load homepage and display news", async ({ page }) => {
  5  |     await page.goto("/");
  6  | 
  7  |     await expect(page.locator("header")).toBeVisible();
  8  |     await expect(page).toHaveTitle(/Mini News Portal/i);
  9  |   });
  10 | 
  11 |   test("should display categories on homepage", async ({ page }) => {
  12 |     await page.goto("/");
  13 | 
  14 |     await page.waitForSelector("h2");
  15 | 
  16 |     const categories = page.locator("section h2");
  17 |     await expect(categories).not.toHaveCount(0);
  18 |   });
  19 | 
  20 |   test("should navigate to category page", async ({ page }) => {
  21 |     await page.goto("/");
  22 | 
  23 |     await page.click("a[href^='/category/']");
  24 | 
  25 |     await expect(page).toHaveURL(/\/category\//);
  26 |   });
  27 | 
  28 |   test("should navigate to news detail page", async ({ page }) => {
  29 |     await page.goto("/");
  30 | 
  31 |     await page.click("a[href^='/news/']");
  32 | 
  33 |     await expect(page).toHaveURL(/\/news\//);
  34 | 
  35 |     await expect(page.locator("article")).toBeVisible();
  36 |   });
  37 | 
  38 |   test("should have pagination on category page", async ({ page }) => {
  39 |     await page.goto("/");
  40 | 
  41 |     await page.click("a[href^='/category/']");
  42 | 
  43 |     await page.evaluate(() => window.scrollBy(0, window.innerHeight * 3));
  44 | 
  45 |     await page.waitForTimeout(1000);
  46 |   });
  47 | 
  48 |   test("should display most viewed articles", async ({ page }) => {
  49 |     await page.goto("/");
  50 | 
  51 |     await expect(page.locator("text=Most Viewed Today")).toBeVisible();
  52 |   });
  53 | 
  54 |   test("should have responsive navigation in header", async ({ page }, testInfo) => {
  55 |     await page.goto("/");
  56 | 
> 57 |     await expect(page.locator("a[href='/']")).toBeVisible();
     |                                               ^ Error: expect(locator).toBeVisible() failed
  58 | 
  59 |     if (testInfo.project.name.includes("mobile")) {
  60 |       await page.click("button[aria-label='Toggle navigation menu']");
  61 |       await expect(page.locator("a[href='/admin/login']")).toBeVisible();
  62 |     } else {
  63 |       await expect(page.locator("a[href='/admin/login']")).toBeVisible();
  64 |     }
  65 |   });
  66 | 
  67 |   test("should not overflow horizontally on home page", async ({ page }) => {
  68 |     await page.goto("/");
  69 | 
  70 |     const hasOverflow = await page.evaluate(() => {
  71 |       return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  72 |     });
  73 | 
  74 |     expect(hasOverflow).toBeFalsy();
  75 |   });
  76 | 
  77 |   test("should have footer", async ({ page }) => {
  78 |     await page.goto("/");
  79 | 
  80 |     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  81 | 
  82 |     await expect(page.locator("footer")).toBeVisible();
  83 |   });
  84 | });
  85 | 
```