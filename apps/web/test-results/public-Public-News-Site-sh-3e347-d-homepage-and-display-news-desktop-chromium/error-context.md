# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public.spec.ts >> Public News Site >> should load homepage and display news
- Location: e2e/public.spec.ts:4:3

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /Mini News Portal/i
Received string:  ""
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    14 × unexpected value ""

```

```yaml
- banner:
  - link "Mini News Portal":
    - /url: /
  - navigation "Primary":
    - link "Home":
      - /url: /
    - link "Login":
      - /url: /admin/login
- main:
  - heading "Most Viewed Today" [level=2]
  - heading "Latest News" [level=1]
  - heading "Business" [level=2]:
    - link "Business":
      - /url: /category/business
  - heading "Lifestyle" [level=2]:
    - link "Lifestyle":
      - /url: /category/lifestyle
  - article:
    - img "Lifestyle Update 1"
    - heading "Lifestyle Update 1" [level=3]
    - paragraph: Lifestyle summary 1
    - paragraph: 5/15/2026
    - link "Read article":
      - /url: /news/lifestyle-update-1
  - article:
    - img "Lifestyle Update 2"
    - heading "Lifestyle Update 2" [level=3]
    - paragraph: Lifestyle summary 2
    - paragraph: 5/15/2026
    - link "Read article":
      - /url: /news/lifestyle-update-2
  - article:
    - img "Lifestyle Update 3"
    - heading "Lifestyle Update 3" [level=3]
    - paragraph: Lifestyle summary 3
    - paragraph: 5/15/2026
    - link "Read article":
      - /url: /news/lifestyle-update-3
  - article:
    - img "Lifestyle Update 4"
    - heading "Lifestyle Update 4" [level=3]
    - paragraph: Lifestyle summary 4
    - paragraph: 5/15/2026
    - link "Read article":
      - /url: /news/lifestyle-update-4
  - article:
    - img "Lifestyle Update 5"
    - heading "Lifestyle Update 5" [level=3]
    - paragraph: Lifestyle summary 5
    - paragraph: 5/15/2026
    - link "Read article":
      - /url: /news/lifestyle-update-5
  - heading "Politics" [level=2]:
    - link "Politics":
      - /url: /category/politics
  - article:
    - img "Politics Update 1"
    - heading "Politics Update 1" [level=3]
    - paragraph: Politics summary 1
    - paragraph: 5/16/2026
    - link "Read article":
      - /url: /news/politics-update-1
  - article:
    - img "Politics Update 2"
    - heading "Politics Update 2" [level=3]
    - paragraph: Politics summary 2
    - paragraph: 5/16/2026
    - link "Read article":
      - /url: /news/politics-update-2
  - article:
    - img "Politics Update 3"
    - heading "Politics Update 3" [level=3]
    - paragraph: Politics summary 3
    - paragraph: 5/16/2026
    - link "Read article":
      - /url: /news/politics-update-3
  - article:
    - img "Politics Update 4"
    - heading "Politics Update 4" [level=3]
    - paragraph: Politics summary 4
    - paragraph: 5/16/2026
    - link "Read article":
      - /url: /news/politics-update-4
  - article:
    - img "Politics Update 5"
    - heading "Politics Update 5" [level=3]
    - paragraph: Politics summary 5
    - paragraph: 5/16/2026
    - link "Read article":
      - /url: /news/politics-update-5
  - heading "Technology" [level=2]:
    - link "Technology":
      - /url: /category/technology
  - article:
    - img "Technology Update 1"
    - heading "Technology Update 1" [level=3]
    - paragraph: Technology summary 1
    - paragraph: 5/15/2026
    - link "Read article":
      - /url: /news/technology-update-1
  - article:
    - img "Technology Update 2"
    - heading "Technology Update 2" [level=3]
    - paragraph: Technology summary 2
    - paragraph: 5/15/2026
    - link "Read article":
      - /url: /news/technology-update-2
  - article:
    - img "Technology Update 3"
    - heading "Technology Update 3" [level=3]
    - paragraph: Technology summary 3
    - paragraph: 5/15/2026
    - link "Read article":
      - /url: /news/technology-update-3
  - article:
    - img "Technology Update 4"
    - heading "Technology Update 4" [level=3]
    - paragraph: Technology summary 4
    - paragraph: 5/15/2026
    - link "Read article":
      - /url: /news/technology-update-4
  - article:
    - img "Technology Update 5"
    - heading "Technology Update 5" [level=3]
    - paragraph: Technology summary 5
    - paragraph: 5/15/2026
    - link "Read article":
      - /url: /news/technology-update-5
- contentinfo:
  - paragraph: Mini News Portal
  - paragraph: © 2026 Mini News Portal. All rights reserved.
- img
- button "Toggle Nuxt DevTools":
  - img
- text: 44 ms
- button "Toggle Component Inspector":
  - img
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
> 8  |     await expect(page).toHaveTitle(/Mini News Portal/i);
     |                        ^ Error: expect(page).toHaveTitle(expected) failed
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
  57 |     await expect(page.locator("a[href='/']")).toBeVisible();
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