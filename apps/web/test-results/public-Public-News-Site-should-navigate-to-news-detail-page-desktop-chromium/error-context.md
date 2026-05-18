# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public.spec.ts >> Public News Site >> should navigate to news detail page
- Location: e2e/public.spec.ts:28:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('article')
Expected: visible
Error: strict mode violation: locator('article') resolved to 15 elements:
    1) <article class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">…</article> aka getByRole('article').filter({ hasText: 'Lifestyle Update 1Lifestyle' })
    2) <article class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">…</article> aka getByRole('article').filter({ hasText: 'Lifestyle Update 2Lifestyle' })
    3) <article class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">…</article> aka getByRole('article').filter({ hasText: 'Lifestyle Update 3Lifestyle' })
    4) <article class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">…</article> aka getByRole('article').filter({ hasText: 'Lifestyle Update 4Lifestyle' })
    5) <article class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">…</article> aka getByRole('article').filter({ hasText: 'Lifestyle Update 5Lifestyle' })
    6) <article class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">…</article> aka getByRole('article').filter({ hasText: 'Politics Update 1Politics' })
    7) <article class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">…</article> aka getByRole('article').filter({ hasText: 'Politics Update 2Politics' })
    8) <article class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">…</article> aka getByRole('article').filter({ hasText: 'Politics Update 3Politics' })
    9) <article class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">…</article> aka getByRole('article').filter({ hasText: 'Politics Update 4Politics' })
    10) <article class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">…</article> aka getByRole('article').filter({ hasText: 'Politics Update 5Politics' })
    ...

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('article')

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
        - heading "Most Viewed Today" [level=2] [ref=e13]
        - generic [ref=e14]:
          - heading "Latest News" [level=1] [ref=e15]
          - generic [ref=e16]:
            - heading "Business" [level=2] [ref=e18]:
              - link "Business" [ref=e19] [cursor=pointer]:
                - /url: /category/business
            - generic [ref=e20]:
              - heading "Lifestyle" [level=2] [ref=e21]:
                - link "Lifestyle" [ref=e22] [cursor=pointer]:
                  - /url: /category/lifestyle
              - generic [ref=e23]:
                - article [ref=e24]:
                  - img "Lifestyle Update 1" [ref=e25]
                  - generic [ref=e26]:
                    - heading "Lifestyle Update 1" [level=3] [ref=e27]
                    - paragraph [ref=e28]: Lifestyle summary 1
                    - paragraph [ref=e29]: 5/15/2026
                    - link "Read article" [active] [ref=e30] [cursor=pointer]:
                      - /url: /news/lifestyle-update-1
                - article [ref=e31]:
                  - img "Lifestyle Update 2" [ref=e32]
                  - generic [ref=e33]:
                    - heading "Lifestyle Update 2" [level=3] [ref=e34]
                    - paragraph [ref=e35]: Lifestyle summary 2
                    - paragraph [ref=e36]: 5/15/2026
                    - link "Read article" [ref=e37] [cursor=pointer]:
                      - /url: /news/lifestyle-update-2
                - article [ref=e38]:
                  - img "Lifestyle Update 3" [ref=e39]
                  - generic [ref=e40]:
                    - heading "Lifestyle Update 3" [level=3] [ref=e41]
                    - paragraph [ref=e42]: Lifestyle summary 3
                    - paragraph [ref=e43]: 5/15/2026
                    - link "Read article" [ref=e44] [cursor=pointer]:
                      - /url: /news/lifestyle-update-3
                - article [ref=e45]:
                  - img "Lifestyle Update 4" [ref=e46]
                  - generic [ref=e47]:
                    - heading "Lifestyle Update 4" [level=3] [ref=e48]
                    - paragraph [ref=e49]: Lifestyle summary 4
                    - paragraph [ref=e50]: 5/15/2026
                    - link "Read article" [ref=e51] [cursor=pointer]:
                      - /url: /news/lifestyle-update-4
                - article [ref=e52]:
                  - img "Lifestyle Update 5" [ref=e53]
                  - generic [ref=e54]:
                    - heading "Lifestyle Update 5" [level=3] [ref=e55]
                    - paragraph [ref=e56]: Lifestyle summary 5
                    - paragraph [ref=e57]: 5/15/2026
                    - link "Read article" [ref=e58] [cursor=pointer]:
                      - /url: /news/lifestyle-update-5
            - generic [ref=e59]:
              - heading "Politics" [level=2] [ref=e60]:
                - link "Politics" [ref=e61] [cursor=pointer]:
                  - /url: /category/politics
              - generic [ref=e62]:
                - article [ref=e63]:
                  - img "Politics Update 1" [ref=e64]
                  - generic [ref=e65]:
                    - heading "Politics Update 1" [level=3] [ref=e66]
                    - paragraph [ref=e67]: Politics summary 1
                    - paragraph [ref=e68]: 5/16/2026
                    - link "Read article" [ref=e69] [cursor=pointer]:
                      - /url: /news/politics-update-1
                - article [ref=e70]:
                  - img "Politics Update 2" [ref=e71]
                  - generic [ref=e72]:
                    - heading "Politics Update 2" [level=3] [ref=e73]
                    - paragraph [ref=e74]: Politics summary 2
                    - paragraph [ref=e75]: 5/16/2026
                    - link "Read article" [ref=e76] [cursor=pointer]:
                      - /url: /news/politics-update-2
                - article [ref=e77]:
                  - img "Politics Update 3" [ref=e78]
                  - generic [ref=e79]:
                    - heading "Politics Update 3" [level=3] [ref=e80]
                    - paragraph [ref=e81]: Politics summary 3
                    - paragraph [ref=e82]: 5/16/2026
                    - link "Read article" [ref=e83] [cursor=pointer]:
                      - /url: /news/politics-update-3
                - article [ref=e84]:
                  - img "Politics Update 4" [ref=e85]
                  - generic [ref=e86]:
                    - heading "Politics Update 4" [level=3] [ref=e87]
                    - paragraph [ref=e88]: Politics summary 4
                    - paragraph [ref=e89]: 5/16/2026
                    - link "Read article" [ref=e90] [cursor=pointer]:
                      - /url: /news/politics-update-4
                - article [ref=e91]:
                  - img "Politics Update 5" [ref=e92]
                  - generic [ref=e93]:
                    - heading "Politics Update 5" [level=3] [ref=e94]
                    - paragraph [ref=e95]: Politics summary 5
                    - paragraph [ref=e96]: 5/16/2026
                    - link "Read article" [ref=e97] [cursor=pointer]:
                      - /url: /news/politics-update-5
            - generic [ref=e98]:
              - heading "Technology" [level=2] [ref=e99]:
                - link "Technology" [ref=e100] [cursor=pointer]:
                  - /url: /category/technology
              - generic [ref=e101]:
                - article [ref=e102]:
                  - img "Technology Update 1" [ref=e103]
                  - generic [ref=e104]:
                    - heading "Technology Update 1" [level=3] [ref=e105]
                    - paragraph [ref=e106]: Technology summary 1
                    - paragraph [ref=e107]: 5/15/2026
                    - link "Read article" [ref=e108] [cursor=pointer]:
                      - /url: /news/technology-update-1
                - article [ref=e109]:
                  - img "Technology Update 2" [ref=e110]
                  - generic [ref=e111]:
                    - heading "Technology Update 2" [level=3] [ref=e112]
                    - paragraph [ref=e113]: Technology summary 2
                    - paragraph [ref=e114]: 5/15/2026
                    - link "Read article" [ref=e115] [cursor=pointer]:
                      - /url: /news/technology-update-2
                - article [ref=e116]:
                  - img "Technology Update 3" [ref=e117]
                  - generic [ref=e118]:
                    - heading "Technology Update 3" [level=3] [ref=e119]
                    - paragraph [ref=e120]: Technology summary 3
                    - paragraph [ref=e121]: 5/15/2026
                    - link "Read article" [ref=e122] [cursor=pointer]:
                      - /url: /news/technology-update-3
                - article [ref=e123]:
                  - img "Technology Update 4" [ref=e124]
                  - generic [ref=e125]:
                    - heading "Technology Update 4" [level=3] [ref=e126]
                    - paragraph [ref=e127]: Technology summary 4
                    - paragraph [ref=e128]: 5/15/2026
                    - link "Read article" [ref=e129] [cursor=pointer]:
                      - /url: /news/technology-update-4
                - article [ref=e130]:
                  - img "Technology Update 5" [ref=e131]
                  - generic [ref=e132]:
                    - heading "Technology Update 5" [level=3] [ref=e133]
                    - paragraph [ref=e134]: Technology summary 5
                    - paragraph [ref=e135]: 5/15/2026
                    - link "Read article" [ref=e136] [cursor=pointer]:
                      - /url: /news/technology-update-5
    - contentinfo [ref=e137]:
      - generic [ref=e138]:
        - paragraph [ref=e139]: Mini News Portal
        - paragraph [ref=e140]: © 2026 Mini News Portal. All rights reserved.
  - generic:
    - img
  - generic [ref=e141]:
    - button "Toggle Nuxt DevTools" [ref=e142] [cursor=pointer]:
      - img [ref=e143]
    - generic "Page load time" [ref=e146]:
      - generic [ref=e147]: "-"
    - button "Toggle Component Inspector" [ref=e149] [cursor=pointer]:
      - img [ref=e150]
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
> 35 |     await expect(page.locator("article")).toBeVisible();
     |                                           ^ Error: expect(locator).toBeVisible() failed
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