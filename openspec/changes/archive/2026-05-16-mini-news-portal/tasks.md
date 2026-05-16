## 1. Monorepo & Tooling Setup

- [x] 1.1 Initialize pnpm workspace with `apps/web` (Nuxt 3), `packages/shared` (Zod schemas + types), `e2e/`
- [x] 1.2 Add root tooling: TypeScript 5 with `strict: true` (shared `tsconfig.base.json`), ESLint + `@typescript-eslint` + `eslint-plugin-vue`, Prettier, Husky pre-commit, `tsc --noEmit` script
- [x] 1.3 Add root scripts: `dev`, `build`, `lint`, `typecheck` (runs `tsc --noEmit` in every package), `test`, `test:e2e`, `db:generate`, `db:migrate`, `db:seed`
- [x] 1.4 Create `.env.example` with `DATABASE_URL`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `NUXT_PUBLIC_SITE_NAME`
- [x] 1.5 Add lint rule (`eslint-plugin-boundaries` or custom) forbidding `server/api/**` → `server/repositories/**` direct imports
- [x] 1.6 Add GitHub Actions workflow running lint, Vitest, build, and Playwright

## 2. Nuxt App Setup

- [x] 2.1 Scaffold Nuxt 3 app in `apps/web` (`nuxi init`)
- [x] 2.2 Install modules: `@pinia/nuxt`, `@nuxtjs/tailwindcss`, `@nuxt/test-utils`
- [x] 2.3 Configure `nuxt.config.ts`: `ssr: true`, `routeRules` so `/admin/**` is `ssr: false` (SPA mode), runtime config for `jwtSecret`, `adminUsername`, `adminPassword`, public `apiBase`
- [x] 2.4 Set up Tailwind config and base layout (`app.vue`, `layouts/default.vue`, `layouts/admin.vue`)
- [x] 2.5 Enforce UI styling policy: Tailwind only; do not add Bootstrap CSS/BootstrapVue/Nuxt UI

## 3. Persistence Layer (server/db + repositories)

- [x] 3.1 Install `drizzle-orm`, `drizzle-kit`, `pg` (and `better-sqlite3` for tests)
- [x] 3.2 Define `server/db/schema.ts`:
  - `categories` (id PK, name NOT NULL, slug UNIQUE NOT NULL, timestamps)
  - `news` (id PK, title/slug/summary/content NOT NULL, image_url NULL, status CHECK in DRAFT|PUBLISHED, published_at NULL, view_count default 0, category_id FK NOT NULL ON DELETE RESTRICT, timestamps; indexes on `(category_id, published_at DESC)` and `(published_at DESC)`)
  - `news_view_daily` (id, news_id FK ON DELETE CASCADE, view_date DATE, view_count default 0, UNIQUE(news_id, view_date), index on `(view_date, view_count DESC)`)
- [x] 3.3 Configure `drizzle.config.ts` and `server/db/client.ts` (dialect switch postgres ↔ sqlite via `DATABASE_URL`)
- [ ] 3.4 Generate & run initial migration (`drizzle-kit generate` + migrator script)
- [x] 3.5 Implement `server/db/seed.ts` creating 4 categories and 30+ published news + a few drafts
- [x] 3.6 Implement repositories (no business logic):
  - `category.repo.ts` (find all with news counts, find by id/slug, insert, update, delete)
  - `news.repo.ts` (paginated list filters, find by slug, find newer/older siblings, insert, update, delete, atomic `incrementViewCount`)
  - `view.repo.ts` (upsert-and-increment today, top N for date)

## 4. Service Layer (server/services)

- [x] 4.1 `CategoryService` — list with newsCount, get by id/slug, create, update, delete-with-news-check (throws `CategoryHasNewsError`)
- [x] 4.2 `NewsService.listPublished({ page, limit, categoryId|categorySlug })` returning `{ items, page, limit, total, hasMore }`
- [x] 4.3 `NewsService.getDetailBySlug(slug)` — single DB transaction: load PUBLISHED article, atomically `view_count += 1`, upsert `news_view_daily(news_id, today)`, return article + `newerSlug` + `olderSlug`
- [x] 4.4 `NewsService.mostViewedToday(limit)` query
- [x] 4.5 `NewsService.create/update/delete` with category existence + slug conflict mapping
- [x] 4.6 `AuthService.login(username, password)` — constant-time compare against runtime config; signs JWT with `jose` (HS256, 1h)
- [x] 4.7 Vitest unit tests for view counter, sibling resolution edges (newest/oldest), validation, conflicts

## 5. Transport Layer (Nitro `server/api`)

- [x] 5.1 Define Zod schemas in `packages/shared` (Category, News, pagination query, login body, JWT payload) and export inferred TS types via `z.infer<typeof Schema>` so client and server share the exact same shapes
- [x] 5.2 Implement `server/utils/validate.ts` (`validate(event, { body?, query?, params? })`)
- [x] 5.3 Implement `server/middleware/01.error.ts` shaping `{ error: { code, message, details? } }` for `AppError` and `ZodError`
- [x] 5.4 Implement `server/utils/auth.ts` with `requireAdmin(event)` (reads `Authorization` header OR `mnp_token` cookie, verifies via `jose`)
- [ ] 5.5 Public endpoints:
  - `server/api/categories/index.get.ts`
  - `server/api/news/index.get.ts` (pagination + filter)
  - `server/api/news/most-viewed-today.get.ts`
  - `server/api/news/[slug].get.ts` (increments view counts)
- [ ] 5.6 Auth endpoints:
  - `server/api/auth/login.post.ts` (sets `mnp_token` httpOnly cookie via `setCookie`)
  - `server/api/auth/logout.post.ts` (clears cookie)
  - `server/api/auth/me.get.ts` (returns current admin or 401, used for client hydration)
- [ ] 5.7 Admin endpoints under `server/api/admin/categories/**` and `server/api/admin/news/**` — list (paginated), get, create (POST), update (PUT), delete — all call `requireAdmin(event)` first
- [ ] 5.8 Generate OpenAPI doc (e.g. `nitro-openapi` or hand-written `server/api/_openapi.get.ts`) served at `/api/_docs`

## 6. Pinia Stores & Composables (client state)

- [ ] 6.1 `stores/auth.ts` — `isAuthenticated`, `username`, `login()`, `logout()`; hydrates from `/api/auth/me` on app init
- [ ] 6.2 `stores/categories.ts` — caches public category list
- [ ] 6.3 `stores/news.ts` — public news cache + infinite-scroll state per category (`pagesByCategory`, `hasMoreByCategory`)
- [ ] 6.4 `stores/adminNews.ts` — admin list filters (category, status, page), optimistic update helpers
- [ ] 6.5 `composables/useApi.ts` — typed `$fetch` wrapper that maps API error envelope to thrown `ApiError`
- [ ] 6.6 `composables/useInfiniteScroll.ts` — `IntersectionObserver`-based helper used by category page

## 7. Public Pages (Vue SFCs, SSR)

- [ ] 7.1 `pages/index.vue` — fetch via `useFetch` on server: categories with latest 5 news each + `MostViewedToday` widget
- [ ] 7.2 `pages/category/[slug].vue` — initial SSR fetches page 1; client uses `useInfiniteScroll` + `news` store to load and append more
- [ ] 7.3 `pages/news/[slug].vue` — render article + `<NewerOlderNav>` component; show view count
- [ ] 7.4 Public components: `CategorySection.vue`, `NewsCard.vue`, `MostViewedToday.vue`, `NewerOlderNav.vue`, `AppHeader.vue`, `AppFooter.vue`
- [ ] 7.5 Custom `error.vue` for 404

## 8. Admin Pages (SPA-mode under `/admin`)

- [ ] 8.1 `middleware/admin-auth.ts` route middleware: redirects to `/admin/login` if `useAuthStore.isAuthenticated` is false (server-side checks cookie via SSR call to `/api/auth/me`)
- [ ] 8.2 `layouts/admin.vue` — sidebar nav, top bar with Logout button calling `authStore.logout()`
- [ ] 8.3 `pages/admin/login.vue` — form bound to Zod schema; on success redirects to `/admin`
- [ ] 8.4 `pages/admin/index.vue` — dashboard with quick counts
- [ ] 8.5 `pages/admin/categories/index.vue` — list + create/edit/delete dialogs
- [ ] 8.6 `pages/admin/news/index.vue` — paginated list with category/status filters (driven by `adminNews` store)
- [ ] 8.7 `pages/admin/news/new.vue` and `pages/admin/news/[id]/edit.vue` — form bound to the shared Zod schemas (via `@vee-validate/zod` or a thin wrapper) for client-side validation; maps API 400 `details` to per-field errors
- [ ] 8.8 Surface API 401/404/409 errors as toasts via a shared `useToast()` composable

## 9. Security Hardening

- [ ] 9.1 Fail-fast at Nuxt boot if `JWT_SECRET` / `ADMIN_USERNAME` / `ADMIN_PASSWORD` missing (runtime check in a server plugin)
- [ ] 9.2 Constant-time credential comparison in `AuthService`
- [ ] 9.3 `setCookie` flags: `httpOnly: true`, `secure: !dev`, `sameSite: 'lax'`, `maxAge: 3600`, `path: '/'`
- [ ] 9.4 Render news `content` safely (Vue interpolation escapes by default; if using `v-html` for rich content, sanitize with `DOMPurify`)
- [ ] 9.5 Document threat model & known limitations in README

## 10. Playwright E2E Tests

- [ ] 10.1 Scaffold `e2e/playwright` with `playwright.config.ts`; `webServer` builds & starts Nuxt (`pnpm build && node .output/server/index.mjs`) against a test DB
- [ ] 10.2 `globalSetup` resets test DB (drizzle migrator + seed) with deterministic data and a known admin credential set
- [ ] 10.3 Public tests:
  - home renders category sections + MostViewedToday widget
  - category page infinite scroll appends items without navigation
  - detail page increments view count between visits; Newer/Older navigation works
- [ ] 10.4 Admin tests:
  - invalid login shows error
  - valid login lands on `/admin` and `mnp_token` cookie is set
  - category CRUD round-trip
  - news CRUD: validation 400 inline error → retry success → edit → delete
  - logout clears cookie and `/admin/news` redirects to login
- [ ] 10.5 Worker-scoped unique slugs/titles for parallel safety
- [ ] 10.6 Wire `pnpm test:e2e` into CI; upload Playwright HTML report on failure

## 11. Documentation

- [ ] 11.1 README: tech stack (Nuxt 3 + Vue + Pinia + Drizzle), run/dev/test instructions, env vars, project layout
- [ ] 11.2 Export ERD diagram (mermaid) from design.md
- [ ] 11.3 Publish OpenAPI doc link and example curl requests for each endpoint
- [ ] 11.4 Add "swap a layer" guide listing the alternative options from design.md (D1)

## 12. Verification & Archive

- [ ] 12.1 Run `openspec validate mini-news-portal`
- [ ] 12.2 Run full test suite (`pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e`) and ensure green
- [ ] 12.3 Manual smoke test of every spec scenario
- [ ] 12.4 Archive the change via `openspec archive mini-news-portal`
