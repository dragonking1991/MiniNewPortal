# e2e-tests Specification

## Purpose
TBD - created by archiving change mini-news-portal. Update Purpose after archive.
## Requirements
### Requirement: Playwright project covers public site flows
The system SHALL include a Playwright test suite verifying the public site happy paths.

#### Scenario: Home page renders sections and most-viewed widget
- **WHEN** the test opens `/`
- **THEN** at least one category section and the "Most Viewed Today" widget are visible

#### Scenario: Category page infinite scroll loads more items
- **WHEN** the test scrolls to the bottom of a seeded category page with > 10 items
- **THEN** additional items are appended without a full navigation and the URL stays the same

#### Scenario: Detail page shows newer/older links and increments view count
- **WHEN** the test opens a published article and refreshes once
- **THEN** the displayed view count increases by 1 between visits, and clicking "Newer Post" or "Older Post" navigates to the expected sibling

### Requirement: Playwright project covers back-office flows
The system SHALL include a Playwright test suite verifying back-office authentication and CRUD.

#### Scenario: Invalid login shows error
- **WHEN** the test submits wrong credentials on `/admin/login`
- **THEN** an error message is visible and the URL remains `/admin/login`

#### Scenario: Valid login lands on admin dashboard
- **WHEN** the test submits valid credentials
- **THEN** the URL becomes `/admin` and the JWT cookie is present

#### Scenario: Category CRUD round-trip
- **WHEN** the test creates a unique category, edits its name, and deletes it
- **THEN** each step is visible in the list with the expected values

#### Scenario: News CRUD round-trip with validation
- **WHEN** the test attempts to create a news article with an empty title
- **THEN** a 400 validation error is shown inline; on retry with valid data the news appears in the list; subsequent edit and delete succeed

#### Scenario: Logout invalidates access
- **WHEN** the test clicks Logout and then navigates to `/admin/news`
- **THEN** it is redirected to `/admin/login`

### Requirement: Test environment isolation
The test suite SHALL run against a dedicated test database that is reset to a known seed before the run.

#### Scenario: Fresh test DB per run
- **WHEN** Playwright `globalSetup` executes
- **THEN** the test DB is migrated and seeded with deterministic data and credentials

#### Scenario: Parallel-safe data
- **WHEN** multiple workers run in parallel
- **THEN** tests create entities with worker-scoped slugs/titles to avoid collisions

