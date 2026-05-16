## Context

Greenfield project for a Mini News Portal used as a training reference. Three concerns must be demonstrated clearly: (1) a public reader experience, (2) a back-office authoring experience, and (3) a layered REST API with stateless auth and validation. The stack must be approachable for trainees while reflecting real-world conventions.

## Goals / Non-Goals

**Goals:**
- Clear three-layer separation: Transport (HTTP/REST) → Service (business rules: view counting, auth) → Persistence (DB).
- Stateless JWT authentication for the back-office; no server-side sessions.
- Validated API inputs with consistent HTTP error contract.
- Public site supports infinite scroll on category pages and Newer/Older navigation on detail pages.
- ERD with explicit 1—n (Category → News), NOT NULL, and FK constraints.
- Playwright E2E tests covering both public and back-office flows.

**Non-Goals:**
- Real user registration, password reset, role hierarchy (admin is hardcoded).
- Rich text editor plugins, media uploads beyond a single image URL field.
- Multi-language/i18n.
- Production-grade caching/CDN, SSR streaming, or analytics pipelines.
- Comments, likes, subscriptions, ads, search relevance tuning.

## Decisions

### D1 — Tech stack (recommended, with options)

**Recommended (chosen for this spec):**
- **Language**: **TypeScript 5.x** in `strict` mode everywhere — `apps/web` (Vue SFCs use `<script setup lang="ts">`), `packages/shared`, `e2e/playwright`. No plain JS files.
- **Full-stack framework**: **Nuxt 3** (Vue 3 + TypeScript) — provides Vue SFC pages for the UI **and** a built-in Nitro server (`server/api/**`) that hosts the REST API. One app, one deploy, but layered cleanly inside.
- **UI**: **Vue 3** Composition API (`<script setup lang="ts">`) + **Tailwind CSS** (`@nuxtjs/tailwindcss`) only. Do not use Bootstrap CSS/BootstrapVue/Nuxt UI kits for this project. Public routes (`/`, `/category/[slug]`, `/news/[slug]`) use SSR for SEO; admin routes (`/admin/*`) are SPA-mode (client-only) under a route middleware.
- **State management**: **Pinia** (`@pinia/nuxt`) — one store per concern: `useAuthStore`, `useCategoriesStore`, `useNewsStore`, `useAdminNewsStore`. Stores are typed (no `any`). Server state is fetched via Nuxt's `useFetch` / `$fetch`; Pinia owns client-side UI state (current admin filters, optimistic updates, auth flag, infinite-scroll page cursor).
- **Validation & shared types**: **Zod** is the single source of truth for every API contract. Schemas live in `packages/shared` and TS types are derived with `z.infer<typeof Schema>`, so client (forms, stores) and server (Nitro handlers) share **the exact same shapes**:
  - Server: `validate(event, { body, query, params })` helper parses inputs and throws on failure.
  - Client: the same schemas drive form validation (e.g. via `@vee-validate/zod` or a thin wrapper) before submit.
  - 400 responses include `details: Array<{ field, message }>` mapped from `ZodError.issues`.
- **ORM**: **Drizzle ORM** — lightweight, SQL-first, fully type-safe, fits Nitro nicely. Migrations via `drizzle-kit`.
- **Database**: **PostgreSQL 16** (prod-like) with **SQLite** override for local dev/tests via Drizzle's dialect switch.
- **Auth**: JWT signed with **`jose`** (HS256). Token payload validated by a Zod schema on verify. Token stored in `httpOnly Secure SameSite=Lax` cookie `mnp_token` set via `setCookie(event, ...)`; server stays stateless.
- **Testing**: **Playwright** (TypeScript) for E2E; **Vitest** (TypeScript) for unit tests on services and Pinia stores; **@nuxt/test-utils** for component/integration tests. Test fixtures are typed from the same Zod-inferred types.
- **Tooling**: pnpm workspaces (`apps/web` — the Nuxt app, `packages/shared` — Zod schemas & inferred types, `e2e/playwright`), ESLint + `@typescript-eslint` + `eslint-plugin-vue` + Prettier, `tsc --noEmit` in CI, Husky pre-commit, GitHub Actions CI.

**Alternative options (pick when constraints differ):**

| Concern | Recommended | Alt A | Alt B |
|---|---|---|---|
| Full-stack framework | Nuxt 3 (Nitro server) | Vue 3 SPA + standalone Fastify/H3 API | Nuxt UI app + NestJS API (split) |
| State management | Pinia | VueUse `createGlobalState` | Provide/Inject + composables only |
| ORM | Drizzle | Prisma | Knex + raw SQL |
| DB | PostgreSQL | MySQL 8 | SQLite (training only) |
| Styling | Tailwind | UnoCSS | Nuxt UI / PrimeVue |
| Auth storage | httpOnly cookie | `Authorization` header + Pinia (memory) | Header + `localStorage` (less safe) |
| Validation | Zod (shared) | Valibot | Yup |
| JWT lib | `jose` | `jsonwebtoken` | Paseto (`paseto-ts`) |
| E2E | Playwright | Cypress | TestCafe |

> Trainees may swap one row at a time without breaking the architecture — e.g., Nuxt + Prisma, or Nuxt UI app + standalone NestJS API.

### D2 — Architecture (monorepo, layered inside one Nuxt app)

```
apps/
  web/                    # Nuxt 3 app (UI + Nitro API in one)
    app.vue
    pages/
      index.vue           # public home
      category/[slug].vue # public category (infinite scroll)
      news/[slug].vue     # public detail
      admin/
        login.vue
        index.vue         # admin dashboard
        categories/...
        news/...
    components/
      public/...
      admin/...
    stores/               # Pinia stores  (CLIENT STATE)
      auth.ts
      categories.ts
      news.ts
      adminNews.ts
    composables/          # useApi, useInfiniteScroll, etc.
    middleware/
      admin-auth.ts       # route middleware: redirect unauthenticated /admin/**
    server/               # Nitro — the REST API lives here
      api/
        categories/...
        news/...
        auth/
          login.post.ts
          logout.post.ts
        admin/
          categories/...
          news/...
      services/           # SERVICE LAYER — business rules (view count, siblings, auth)
        category.service.ts
        news.service.ts
        auth.service.ts
      repositories/       # PERSISTENCE LAYER — Drizzle queries only
        category.repo.ts
        news.repo.ts
        view.repo.ts
      db/
        schema.ts         # Drizzle table definitions
        client.ts         # drizzle() factory
        seed.ts
      middleware/
        01.error.ts       # global error envelope
      utils/
        jwt.ts            # sign/verify with jose
        validate.ts       # zod helper
        auth.ts           # requireAdmin(event)
packages/
  shared/                 # Zod schemas + TS types reused by client & server
e2e/
  playwright/             # Playwright tests
```

- The boundary between layers is enforced by directory + dependency rule:
  - **Transport** = files under `server/api/**` (Nitro event handlers) — may import services, never repositories or Drizzle directly.
  - **Service** = `server/services/**` — may import repositories; contains business rules (view counting, sibling resolution, login).
  - **Persistence** = `server/repositories/**` + `server/db/**` — only place that imports Drizzle.
- No reverse imports. Lint rule enforces it.
- Pinia stores live on the **client** only and call the Nitro API via typed `$fetch` wrappers; they never import server modules.

### D3 — Data model (ERD)

```
┌──────────────────────┐        ┌──────────────────────────────┐
│       Category       │ 1    n │            News              │
├──────────────────────┤────────├──────────────────────────────┤
│ id          PK       │        │ id              PK           │
│ name        NOT NULL │        │ title           NOT NULL     │
│ slug        UNIQUE   │        │ slug            UNIQUE       │
│ created_at  NOT NULL │        │ summary         NOT NULL     │
│ updated_at  NOT NULL │        │ content         NOT NULL     │
└──────────────────────┘        │ image_url       NULLABLE     │
                                │ status          NOT NULL     │ -- DRAFT | PUBLISHED
                                │ published_at    NULLABLE     │
                                │ view_count      NOT NULL = 0 │
                                │ category_id     FK NOT NULL  │ -- references Category(id) ON DELETE RESTRICT
                                │ created_at      NOT NULL     │
                                │ updated_at      NOT NULL     │
                                └──────────────────────────────┘

┌──────────────────────────────┐
│       NewsViewDaily          │   -- supports "Most Viewed Today" cheaply
├──────────────────────────────┤
│ id              PK           │
│ news_id         FK NOT NULL  │ -- references News(id) ON DELETE CASCADE
│ view_date       NOT NULL     │ -- DATE
│ view_count      NOT NULL = 0 │
│ UNIQUE(news_id, view_date)   │
└──────────────────────────────┘
```

Indexes: `News(category_id, published_at DESC)`, `News(published_at DESC)`, `NewsViewDaily(view_date, view_count DESC)`.

### D4 — Pagination strategy

- Public list endpoints support **offset pagination** (`?page=1&limit=10`, default 10, max 50) — simplest for trainees; supports infinite scroll by incrementing `page`.
- Optional cursor pagination (by `published_at,id`) documented as an alternative.

### D5 — View counting

- On article detail GET, Service layer increments `News.view_count` AND upserts `NewsViewDaily(news_id, today)` in one transaction.
- "Most Viewed Today" = `NewsViewDaily WHERE view_date = today ORDER BY view_count DESC LIMIT 5`.
- Bot/refresh abuse is out of scope (training).

### D6 — Newer/Older navigation

- Detail response includes `newerSlug` / `olderSlug` computed by Service:
  - Newer = next news in same category with `published_at > current.published_at` (ASC, LIMIT 1).
  - Older = previous (`<`, DESC, LIMIT 1).
- Null when none exists.

### D7 — Authentication (JWT, stateless)

- `POST /api/auth/login` accepts `{ username, password }`. Service compares against env-loaded hardcoded credentials (`ADMIN_USERNAME`, `ADMIN_PASSWORD`).
- Issues HS256 JWT with payload `{ sub: "admin", role: "admin", iat, exp }`, 1h expiry, secret from `JWT_SECRET`.
- Token returned in response body AND set as `httpOnly; Secure; SameSite=Lax` cookie `mnp_token`.
- `POST /api/auth/logout` clears the cookie.
- All `/api/admin/**` Nitro handlers go through a `requireAdmin(event)` util that reads the JWT from the `Authorization: Bearer` header OR the `mnp_token` cookie and verifies it with `jose`.
- On the client, `middleware/admin-auth.ts` route middleware reads the cookie (server side during SSR) and the `useAuthStore` Pinia state (client side) to gate `/admin/**` pages.
- No server session store → fully stateless.

### D8 — Error & validation contract

Standard JSON error envelope:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [ ... ] } }
```

| Case | Status |
|---|---|
| Success (GET/PUT/PATCH) | 200 |
| Created (POST) | 201 |
| Deleted | 204 |
| Invalid input / validation failure | 400 |
| Missing/invalid JWT | 401 |
| Authenticated but forbidden | 403 |
| Resource not found | 404 |
| Slug/title conflict | 409 |
| Unhandled server error | 500 |

Validation rules (news create/edit):
- `title`: required, string, 5–200 chars.
- `slug`: required, kebab-case `^[a-z0-9]+(-[a-z0-9]+)*$`, 5–220 chars, unique.
- `summary`: required, 10–500 chars.
- `content`: required, ≥ 20 chars.
- `imageUrl`: optional, valid http(s) URL, ≤ 500 chars.
- `categoryId`: required, must exist.
- `status`: enum `DRAFT|PUBLISHED`.
- `publishedAt`: required when `status=PUBLISHED`; ISO-8601.

Validation rules (category create/edit):
- `name`: required, 2–100 chars.
- `slug`: kebab-case, unique, 2–120 chars.

Implemented via **Zod schemas** in `packages/shared`, applied inside each Nitro handler with a small `validate(event, schema)` helper (parses `body`/`query`/`params`). A single error middleware (`server/middleware/01.error.ts`) catches thrown `AppError`s and Zod errors and shapes the JSON envelope.

### D9 — Lazy loading (infinite scroll)

- Category page calls `GET /api/news?categoryId=...&page=N&limit=10`.
- Client uses `IntersectionObserver` on a sentinel; when visible AND `hasMore=true`, fetches next page and appends.

### D10 — Playwright test scope

- **Public**: home renders sections + most-viewed; category infinite scroll loads more; detail page increments view count and shows newer/older links.
- **Admin**: login with valid/invalid creds; create/edit/delete category; create/edit/delete news with validation errors (400) and conflict (409); logout invalidates client access.
- Runs against a seeded test DB; `globalSetup` truncates + seeds; tests are parallel-safe by namespacing slugs.

## Risks / Trade-offs

- **Hardcoded admin credentials** → only safe because training-scope; mitigated by loading from `.env`, never committed, and documenting "replace before any deploy".
- **JWT in cookie + body** → small duplication; mitigated by documenting that the cookie is canonical and the body token is for tools/tests.
- **View counter race conditions under load** → acceptable for training; mitigated by DB-level `UPDATE ... SET view_count = view_count + 1` atomic statement.
- **Offset pagination drift** when new items are inserted mid-scroll → mitigated by ordering on `(published_at DESC, id DESC)`; documented as a known limitation; cursor pagination listed as upgrade path.
- **Single Next.js app for public + admin** simplifies deploy but couples release cycles → acceptable; can be split later.
- **Drizzle is SQL-first** (less magic than Prisma) → trainees see real SQL; mitigated by keeping repository interfaces between Service and Drizzle calls so the ORM stays swappable.
- **Nuxt mixes UI + API in one process** → simpler ops but couples release cycles; can be split (alt: Nuxt UI + standalone Nitro/NestJS) later.

## Best Practice Rules (Tech Stack)

### Nuxt 3 + Nitro

- Keep strict layer boundaries:
  - `server/api/**` is Transport only
  - `server/services/**` is Service only
  - `server/repositories/**` + `server/db/**` is Persistence only
- API handlers call services only; never call Drizzle directly from handlers.
- Use SSR for public routes and SPA mode only for `/admin/**`.
- Keep secrets in server runtime config only; never expose through public runtime config.
- Do not install or use Bootstrap CSS frameworks (`bootstrap`, `bootstrap-vue`, `@nuxt/ui`).

### Vue 3

- Use `<script setup lang="ts">` in all SFCs.
- Keep pages orchestration-focused; move reusable logic to composables.
- Keep reusable UI in components, not copied across pages.
- Keep template logic simple; do transformations in script/composables.

### Pinia

- Use one store per domain concern (`auth`, `categories`, `news`, `adminNews`).
- Use stores for client-side state, not as a replacement for server truth.
- Keep async calls in store actions/composables, not spread across components.
- Keep state/getters/actions fully typed (no `any`).

### TypeScript

- Enforce `strict: true` and fail CI on type errors (`tsc --noEmit`).
- Avoid `any`; when unavoidable, isolate and document it.
- Prefer narrow types and discriminated unions for status/error flows.
- Share DTO/types from `packages/shared` to avoid contract drift.

### Zod

- Define schemas once in `packages/shared` and derive TS types with `z.infer`.
- Validate all external input at the Transport boundary (body/query/params).
- Map `ZodError` to stable API error envelopes with field-level details.
- Reuse the same schemas in client forms to keep validation consistent.

### Drizzle ORM

- Keep DB access in repositories only.
- Use transactions for multi-step writes (view increment + daily upsert).
- Encode constraints in DB schema first (NOT NULL, FK, UNIQUE, CHECK).
- Keep indexes aligned with actual list/filter/sort query patterns.

### PostgreSQL

- Use UTC for timestamps and daily aggregation boundaries.
- Treat migration files as immutable after shared application.
- Keep seeds deterministic for reliable local and CI runs.
- Validate query plans for high-traffic endpoints.

### JWT + Auth

- Use short-lived access tokens (1 hour) and per-environment secrets.
- Set cookie flags: `httpOnly`, `sameSite=lax`, `secure` outside local dev.
- Verify token on every protected request (stateless auth).
- Use constant-time comparison for credential checks.
- Never log secrets, passwords, or raw tokens.

### API + Error Contract

- Keep error response shape stable: `{ error: { code, message, details? } }`.
- Use only documented status codes (400/401/403/404/409/500).
- Keep pagination response consistent (`items`, `page`, `limit`, `total`, `hasMore`).
- Keep update/delete behavior idempotent where possible.

### Playwright + Test Quality

- Cover both happy path and key negative scenarios for each feature.
- Reset/migrate/seed DB in global setup for deterministic tests.
- Use worker-scoped unique data for parallel safety.
- Use stable selectors (`data-testid`) instead of style-based selectors.
- Publish HTML test report artifacts on CI failure.

### CI/CD + Repository Hygiene

- Required merge gate: typecheck, lint, unit tests, e2e tests, openspec validate.
- Block merges on failing checks.
- Keep PR scope small and traceable to spec scenarios.
- Keep dependency updates regular and controlled.

### Documentation + Traceability

- Keep README operationally accurate (env vars, runbooks, troubleshooting).
- Keep API examples aligned with implemented handlers.
- Document training-scope limitations explicitly.
- Maintain mapping: spec scenario -> endpoint/page -> automated test.

## Migration Plan

Greenfield — no migration. Setup sequence:
1. `pnpm drizzle-kit generate` then `pnpm db:migrate` to create schema.
2. `pnpm db:seed` inserts 4 demo categories + ~30 news items + view counters.
3. `pnpm dev` runs the Nuxt app (UI + Nitro API) on `:3000`.
4. Rollback = drop DB & re-run.

## Open Questions

- Should the admin UI live under the same Nuxt app or a separate SPA? (Recommend same app with SPA-mode admin routes; revisit if scope grows.)
- Should "Most Viewed Today" reset at UTC midnight or server local time? (Recommend UTC for predictability.)
- Do we want soft-delete on News? (Out of scope unless requested.)
