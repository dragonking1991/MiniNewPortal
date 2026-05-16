# Mini News Portal Implementation Workflow (Review Doc)

## 0) Objective

Deliver a production-style training system with:
- Public news site (Home, Category lazy-load, Detail with Newer/Older)
- Admin backoffice (login/logout + category/news CRUD)
- Layered architecture (Transport → Service → Persistence)
- Stateless JWT auth
- Zod + TypeScript contract safety
- Playwright E2E coverage

## 1) Confirm Scope & Baseline

### Step 1.1
- Confirm this change is the active one: `mini-news-portal`.
- Confirm artifacts exist and are valid.

### Step 1.2
- Review these files before coding:
  - `proposal.md` (what and why)
  - `design.md` (tech decisions)
  - `specs/**/spec.md` (behavior contract)
  - `tasks.md` (checklist)

### Exit Criteria
- Everyone agrees stack is Nuxt 3 + Vue + Pinia + Drizzle + Zod + TypeScript with Tailwind-only UI (no Bootstrap frameworks).
- All required behaviors are traceable to specs.

## 2) Initialize Workspace & Tooling

### Step 2.1
- Create pnpm workspace structure:
  - `apps/web`
  - `packages/shared`
  - `e2e/playwright`

### Step 2.2
- Add TypeScript strict baseline (`tsconfig.base.json`, `strict: true`).
- Add ESLint + @typescript-eslint + eslint-plugin-vue + Prettier.
- Add Husky hooks for quality gate.

### Step 2.3
- Add scripts:
  - `dev`, `build`, `lint`, `typecheck`, `test`, `test:e2e`
  - `db:generate`, `db:migrate`, `db:seed`

### Step 2.4
- Add `.env.example` with required runtime settings.

### Exit Criteria
- `pnpm install` succeeds.
- `pnpm typecheck && pnpm lint` pass on empty scaffold.

## 3) Setup Nuxt 3 App

### Step 3.1
- Scaffold Nuxt app in `apps/web`.
- Enable TypeScript SFC usage (`<script setup lang="ts">`).

### Step 3.2
- Install and configure:
  - `@pinia/nuxt`
  - `@nuxtjs/tailwindcss`
  - `@nuxt/test-utils`
  - Keep UI stack Tailwind-only (do not install `bootstrap`, `bootstrap-vue`, or Nuxt UI kits)

### Step 3.3
- Configure `nuxt.config.ts`:
  - SSR enabled globally
  - `/admin/**` route rules in SPA mode
  - runtimeConfig for secrets and public values

### Exit Criteria
- `pnpm dev` starts the Nuxt app.
- Public and admin routes resolve.

## 4) Build Persistence Layer (Drizzle)

### Step 4.1
- Install Drizzle stack and DB drivers.

### Step 4.2
- Define DB schema:
  - `categories`
  - `news`
  - `news_view_daily`
- Include NOT NULL, UNIQUE, FK, and indexes exactly as spec.

### Step 4.3
- Configure migrations (`drizzle.config.ts`) and DB client.

### Step 4.4
- Generate and apply migration.
- Implement deterministic seed script.

### Exit Criteria
- Migration applies cleanly.
- Seed creates at least 4 categories and 30+ published news.

## 5) Implement Repository Layer

### Step 5.1
- Create repositories with DB-only logic:
  - `category.repo.ts`
  - `news.repo.ts`
  - `view.repo.ts`

### Step 5.2
- Ensure repositories do not contain business rules.

### Exit Criteria
- Repository tests or smoke scripts prove CRUD + query shape correctness.

## 6) Implement Service Layer

### Step 6.1
- Category service:
  - list/get/create/update/delete
  - enforce cannot delete category with news

### Step 6.2
- News service:
  - paginated published list
  - detail retrieval with atomic view increment
  - newer/older sibling resolution
  - most-viewed-today
  - admin create/update/delete

### Step 6.3
- Auth service:
  - constant-time credential compare
  - JWT signing with `jose`

### Exit Criteria
- Unit tests pass for:
  - view counter logic
  - sibling edge cases
  - conflict handling
  - auth pass/fail cases

## 7) Implement Transport Layer (Nitro API)

### Step 7.1
- Define shared Zod schemas in `packages/shared`.
- Export TS types with `z.infer`.

### Step 7.2
- Build validation helper (`validate(event, ...)`).
- Build global error middleware with unified envelope.

### Step 7.3
- Implement public endpoints:
  - `GET /api/categories`
  - `GET /api/news`
  - `GET /api/news/most-viewed-today`
  - `GET /api/news/:slug`

### Step 7.4
- Implement auth endpoints:
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`

### Step 7.5
- Implement protected admin endpoints under `/api/admin/**`.
- Gate with `requireAdmin(event)`.

### Exit Criteria
- API responds with correct status codes and error envelope.
- 400/401/404/409 behavior matches specs.

## 8) Build Client State and Composables

### Step 8.1
- Implement Pinia stores:
  - `auth`, `categories`, `news`, `adminNews`

### Step 8.2
- Implement composables:
  - `useApi` typed fetch wrapper
  - `useInfiniteScroll`

### Exit Criteria
- Stores are typed and pass typecheck without `any`.
- API errors are normalized for UI use.

## 9) Build Public UI Pages

### Step 9.1
- Home page:
  - latest-by-category sections
  - Most Viewed Today widget

### Step 9.2
- Category page:
  - initial page fetch
  - lazy loading with sentinel + IntersectionObserver

### Step 9.3
- Detail page:
  - full article render
  - Newer/Older links
  - updated view count

### Exit Criteria
- Public pages satisfy all scenarios in `public-news-site/spec.md`.

## 10) Build Admin UI Pages

### Step 10.1
- Add route middleware for `/admin/**` access control.

### Step 10.2
- Login/logout flow:
  - invalid login error
  - success redirect
  - cookie-based auth state hydration

### Step 10.3
- Category CRUD screens.

### Step 10.4
- News CRUD screens with field-level validation messages.

### Exit Criteria
- Admin pages satisfy all scenarios in `backoffice-admin/spec.md`.

## 11) Security Hardening

### Step 11.1
- Fail fast if secrets/credentials missing.

### Step 11.2
- Enforce secure cookie flags.

### Step 11.3
- Ensure no raw HTML rendering without sanitization.

### Exit Criteria
- Security checklist in design doc D7/D8/D9 is implemented.

## 12) Playwright End-to-End Testing

### Step 12.1
- Configure Playwright with webServer and test DB setup.

### Step 12.2
- Global setup:
  - migrate/reset test DB
  - seed deterministic data

### Step 12.3
- Public flow tests:
  - home rendering
  - category lazy loading
  - detail newer/older + view increment

### Step 12.4
- Admin flow tests:
  - invalid login
  - valid login
  - category CRUD
  - news CRUD + validation errors
  - logout redirect behavior

### Exit Criteria
- `pnpm test:e2e` passes locally and in CI.

## 13) Final Verification Gate

### Step 13.1
- Run full gate:
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm test`
  - `pnpm test:e2e`

### Step 13.2
- Validate OpenSpec change:
  - `openspec validate mini-news-portal`

### Step 13.3
- Manual smoke review against each spec scenario.

### Exit Criteria
- All automated and manual checks pass.
- Change is ready to archive.

## 14) Review Checklist (For Approvers)

- Architecture boundaries are enforced (Transport/Service/Persistence).
- Zod schemas are shared and reused by client + server.
- TypeScript strict mode is clean.
- JWT auth is stateless and cookie flags are secure.
- Public UX and admin UX both satisfy specs.
- Playwright tests cover core happy path and key error cases.
- No requirement from current specs is left unimplemented.
