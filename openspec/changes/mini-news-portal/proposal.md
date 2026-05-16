## Why

We need a Mini News Portal System that delivers categorized news to public readers and lets editors manage content through a back-office. The system must demonstrate a clean layered architecture (Transport / Service / Persistence), stateless JWT auth, and validated REST APIs — serving as a reference implementation for the team's training curriculum.

## What Changes

- Introduce a public-facing news website with home page (latest news per category + "Most Viewed Today"), category page (infinite-scroll lazy loading), and article detail page (with newer/older post navigation and view-count increment).
- Introduce a back-office admin panel with login/logout (hardcoded credentials issuing JWT) and CRUD for categories and news articles.
- Introduce a REST API layered as Transport → Service → Persistence, with cursor/offset pagination, input validation, and a defined HTTP error contract.
- Introduce a relational data model (Category 1—n News) with explicit NOT NULL and FK constraints, plus a per-day view counter.
- Introduce end-to-end Playwright test suites covering public site flows and back-office flows.

## Capabilities

### New Capabilities

- `public-news-site`: Public-facing UI for browsing news (home, category infinite scroll, detail with prev/next navigation, most-viewed-today widget).
- `backoffice-admin`: Admin SPA for category & news CRUD with login/logout UX and JWT session handling.
- `news-api`: REST API exposing public read endpoints and authenticated admin write endpoints, with pagination, validation, and standard error responses.
- `news-domain`: Domain/persistence layer defining Category & News entities, the 1—n relationship, view-counting service logic, and DB schema/constraints.
- `auth-jwt`: Stateless JWT authentication with hardcoded credential check, token issuance, and bearer-token authorization middleware.
- `e2e-tests`: Playwright test project covering public site and back-office happy paths and key error paths.

### Modified Capabilities

<!-- None — greenfield project -->

## Impact

- **New code**: backend API service, public web app, admin web app (or unified app), database schema/migrations, Playwright test project, CI scripts.
- **New dependencies**: web framework, ORM, JWT library, validation library, Playwright.
- **Infrastructure**: local PostgreSQL (or SQLite for dev), `.env` config for JWT secret and DB URL.
- **Docs**: ERD diagram, API contract, run/test instructions in README.
