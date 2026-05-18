# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Panel >> should logout
- Location: e2e/admin.spec.ts:72:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
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
      - generic [ref=e12]:
        - heading "Admin Login" [level=1] [ref=e13]
        - generic [ref=e14]:
          - textbox "Username" [ref=e15]: admin
          - textbox "Password" [ref=e16]: admin
          - button "Login" [active] [ref=e17] [cursor=pointer]
        - paragraph [ref=e18]: "[POST] \"/api/auth/login\": 401 Server Error"
    - contentinfo [ref=e19]:
      - generic [ref=e20]:
        - paragraph [ref=e21]: Mini News Portal
        - paragraph [ref=e22]: © 2026 Mini News Portal. All rights reserved.
  - generic:
    - img
  - generic [ref=e23]:
    - button "Toggle Nuxt DevTools" [ref=e24] [cursor=pointer]:
      - img [ref=e25]
    - generic "Page load time" [ref=e28]:
      - generic [ref=e29]: "43"
      - generic [ref=e30]: ms
    - button "Toggle Component Inspector" [ref=e32] [cursor=pointer]:
      - img [ref=e33]
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.describe("Admin Panel", () => {
  4   |   const adminUsername = process.env.ADMIN_USERNAME || "admin";
  5   |   const adminPassword = process.env.ADMIN_PASSWORD || "admin";
  6   | 
  7   |   test("should redirect to login when not authenticated", async ({ page }) => {
  8   |     await page.goto("/admin");
  9   | 
  10  |     await expect(page).toHaveURL(/\/admin\/login/);
  11  |   });
  12  | 
  13  |   test("should login with valid credentials", async ({ page }) => {
  14  |     await page.goto("/admin/login");
  15  | 
  16  |     await page.fill("input[type='text']", adminUsername);
  17  |     await page.fill("input[type='password']", adminPassword);
  18  | 
  19  |     await page.click("button[type='submit']");
  20  | 
  21  |     await expect(page).toHaveURL(/\/admin/);
  22  |   });
  23  | 
  24  |   test("should show error on invalid credentials", async ({ page }) => {
  25  |     await page.goto("/admin/login");
  26  | 
  27  |     await page.fill("input[type='text']", "wronguser");
  28  |     await page.fill("input[type='password']", "wrongpass");
  29  | 
  30  |     await page.click("button[type='submit']");
  31  | 
  32  |     await expect(page.locator("text=Login failed")).toBeVisible();
  33  |   });
  34  | 
  35  |   test("should display admin dashboard after login", async ({ page }) => {
  36  |     await page.goto("/admin/login");
  37  | 
  38  |     await page.fill("input[type='text']", adminUsername);
  39  |     await page.fill("input[type='password']", adminPassword);
  40  |     await page.click("button[type='submit']");
  41  | 
  42  |     await page.waitForURL(/\/admin$/);
  43  | 
  44  |     await expect(page.locator("text=Total Categories")).toBeVisible();
  45  |     await expect(page.locator("text=Total News")).toBeVisible();
  46  |   });
  47  | 
  48  |   test("should navigate to categories management", async ({ page }) => {
  49  |     await page.goto("/admin/login");
  50  | 
  51  |     await page.fill("input[type='text']", adminUsername);
  52  |     await page.fill("input[type='password']", adminPassword);
  53  |     await page.click("button[type='submit']");
  54  | 
  55  |     await page.click("a:has-text('Manage Categories')");
  56  | 
  57  |     await expect(page).toHaveURL(/\/admin\/categories/);
  58  |   });
  59  | 
  60  |   test("should navigate to news management", async ({ page }) => {
  61  |     await page.goto("/admin/login");
  62  | 
  63  |     await page.fill("input[type='text']", adminUsername);
  64  |     await page.fill("input[type='password']", adminPassword);
  65  |     await page.click("button[type='submit']");
  66  | 
  67  |     await page.click("a:has-text('Manage News')");
  68  | 
  69  |     await expect(page).toHaveURL(/\/admin\/news/);
  70  |   });
  71  | 
  72  |   test("should logout", async ({ page }) => {
  73  |     await page.goto("/admin/login");
  74  | 
  75  |     await page.fill("input[type='text']", adminUsername);
  76  |     await page.fill("input[type='password']", adminPassword);
  77  |     await page.click("button[type='submit']");
  78  | 
> 79  |     await page.waitForURL(/\/admin$/);
      |                ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  80  | 
  81  |     await page.click("button:has-text('Logout')");
  82  | 
  83  |     await expect(page).toHaveURL("/");
  84  |   });
  85  | 
  86  |   test("should have admin navigation sidebar", async ({ page }, testInfo) => {
  87  |     await page.goto("/admin/login");
  88  | 
  89  |     await page.fill("input[type='text']", adminUsername);
  90  |     await page.fill("input[type='password']", adminPassword);
  91  |     await page.click("button[type='submit']");
  92  | 
  93  |     if (testInfo.project.name.includes("mobile")) {
  94  |       await page.click("button[aria-label='Toggle admin navigation']");
  95  |     }
  96  | 
  97  |     await expect(page.locator("aside")).toBeVisible();
  98  |     await expect(page.locator("a:has-text('Dashboard')")).toBeVisible();
  99  |     await expect(page.locator("a:has-text('Categories')")).toBeVisible();
  100 |     await expect(page.locator("a:has-text('News')")).toBeVisible();
  101 |   });
  102 | 
  103 |   test("should redirect to login after logout when opening protected admin route", async ({ page }) => {
  104 |     await page.goto("/admin/login");
  105 | 
  106 |     await page.fill("input[type='text']", adminUsername);
  107 |     await page.fill("input[type='password']", adminPassword);
  108 |     await page.click("button[type='submit']");
  109 |     await page.waitForURL(/\/admin$/);
  110 | 
  111 |     await page.click("button:has-text('Logout')");
  112 |     await expect(page).toHaveURL("/");
  113 | 
  114 |     await page.goto("/admin/news");
  115 |     await expect(page).toHaveURL(/\/admin\/login/);
  116 |   });
  117 | });
  118 | 
```