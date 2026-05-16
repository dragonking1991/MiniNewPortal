# Database Layer Swap Guide

This application supports seamless switching between **PostgreSQL** (production) and **SQLite** (development) through Drizzle ORM's dialect abstraction.

## Architecture

The database client in [apps/web/server/db/client.ts](./server/db/client.ts) automatically selects the correct dialect based on the `DATABASE_URL` environment variable:

```typescript
const DATABASE_URL = process.env.DATABASE_URL;

if (DATABASE_URL?.startsWith("postgresql://")) {
  // Use PostgreSQL dialect
  db = drizzle(client, { schema, logger });
} else {
  // Use SQLite dialect (default)
  db = drizzle(client);
}
```

## Switching Between Databases

### Development (SQLite)

Default for development. Requires no setup.

1. **Remove or unset DATABASE_URL:**
```bash
unset DATABASE_URL
```

Or in `.env.local`:
```bash
# Leave DATABASE_URL unset or commented out
# DATABASE_URL=
```

2. **Start development server:**
```bash
pnpm dev
```

The app will create a SQLite database at `./app.db` (or configured path).

3. **Run migrations:**
```bash
pnpm db:migrate
```

### Production (PostgreSQL)

1. **Set DATABASE_URL to PostgreSQL connection string:**
```bash
export DATABASE_URL=postgresql://username:password@localhost:5432/mini_news_portal
```

Or in `.env.local`:
```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

2. **Connection string format:**
```
postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]
```

**Common parameters:**
- `sslmode=require` - Enforce SSL/TLS (recommended for production)
- `sslmode=disable` - Disable SSL (development only)
- `application_name=mini-news-portal` - Set app name in PostgreSQL logs

**Example with SSL:**
```bash
DATABASE_URL=postgresql://user:pass@prod-db.example.com:5432/mnp?sslmode=require
```

3. **Run migrations:**
```bash
pnpm db:migrate
```

4. **Start server:**
```bash
pnpm build && pnpm preview
```

## Migration Files

Migrations are stored in `apps/web/drizzle/` directory with dialect-specific SQL:

```
drizzle/
├── 0001_initial_schema.pgsql.sql  # PostgreSQL version
├── 0001_initial_schema.sqlite.sql # SQLite version
├── 0002_add_indexes.pgsql.sql
├── 0002_add_indexes.sqlite.sql
└── meta/
    └── ...
```

### Generating Migrations

When you modify the schema in [apps/web/server/db/schema.ts](./server/db/schema.ts):

1. Generate migrations for both dialects:
```bash
pnpm db:generate
```

2. Review generated SQL files in `drizzle/` directory

3. Apply migrations:
```bash
pnpm db:migrate
```

### SQL Differences

#### PostgreSQL
- Uses `pgEnum()` for enums (better type safety)
- Supports native ENUM types
- Uses `SERIAL` for auto-increment
- Supports UUID/JSON types

**Example:**
```sql
CREATE TYPE news_status AS ENUM ('DRAFT', 'PUBLISHED');
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  status news_status DEFAULT 'DRAFT'
);
```

#### SQLite
- Uses text with `CHECK` constraint for enums
- No native ENUM support
- Uses `AUTOINCREMENT` or `INTEGER PRIMARY KEY`
- Limited JSON support

**Example:**
```sql
CREATE TABLE news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  status TEXT DEFAULT 'DRAFT' CHECK(status IN ('DRAFT', 'PUBLISHED'))
);
```

## Data Migration

When migrating from SQLite to PostgreSQL (or vice versa) with existing data:

### Step 1: Export Data from Source Database

**From SQLite:**
```bash
sqlite3 app.db ".dump" > backup.sql
```

### Step 2: Transform Schema (if needed)

1. Drizzle migrations handle schema transformation
2. Manual data transformation may be needed for:
   - Enum value conversions
   - Type changes (e.g., TEXT to INTEGER)
   - Constraint changes

### Step 3: Import Data into Target Database

**To PostgreSQL:**
```bash
psql -U username -d mini_news_portal < transformed_data.sql
```

### Step 4: Verify Data Integrity

```bash
# Check row counts
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM news;

# Verify relationships
SELECT * FROM news WHERE category_id NOT IN (SELECT id FROM categories);
```

### Step 5: Run Application Tests

```bash
pnpm test           # Unit tests
pnpm test:e2e      # E2E tests
```

## Environment Setup Examples

### Local Development

`.env.local`:
```bash
# SQLite (default)
# DATABASE_URL not set

# Or explicit SQLite path
DATABASE_URL=file:./app.db
```

### Staging

`.env.staging`:
```bash
DATABASE_URL=postgresql://staging_user:staging_pass@staging-db.internal:5432/mini_news_portal?sslmode=require
JWT_SECRET=staging-secret-key-32-chars-min
ADMIN_USERNAME=staging_admin
ADMIN_PASSWORD=staging_password_123
```

### Production

`.env.production`:
```bash
DATABASE_URL=postgresql://prod_user:prod_pass@prod-db.aws.amazon.com:5432/mini_news_portal?sslmode=require&application_name=mini-news-portal&connect_timeout=10
JWT_SECRET=production-secret-key-32-chars-minimum-required
ADMIN_USERNAME=prod_admin
ADMIN_PASSWORD=generate_strong_random_password_here
```

## Connection Pooling

### SQLite
- No connection pooling needed
- Better-sql3 driver handles concurrent requests

### PostgreSQL
- Use connection pooling for production
- Recommended: PgBouncer or pgPool

**Example with pgBouncer:**
```bash
DATABASE_URL=postgresql://user:pass@pgbouncer-host:6432/mini_news_portal?sslmode=require
```

## Performance Considerations

### SQLite
- ✅ Zero setup, great for development
- ✅ File-based, easy backup
- ❌ Limited concurrency (locks entire file during writes)
- ❌ Not suitable for production with high traffic

### PostgreSQL
- ✅ Excellent concurrency with MVCC
- ✅ Advanced features (full-text search, JSON, arrays)
- ✅ Robust disaster recovery options
- ✅ Proven at scale
- ❌ Requires server management

## Troubleshooting

### "Cannot find SQLite driver"

```bash
pnpm install better-sqlite3
```

### "Password authentication failed"

1. Check PostgreSQL credentials in DATABASE_URL
2. Verify user has access to database:
```bash
psql -U username -d mini_news_portal
```

3. Check PostgreSQL server is running and accessible

### "Migration already applied"

Drizzle prevents duplicate migrations. If you need to re-run:

1. Delete entries from `drizzle_migrations` table:
```bash
DELETE FROM drizzle_migrations WHERE name = 'migration_name';
```

2. Re-run migration:
```bash
pnpm db:migrate
```

### "EACCES: permission denied" (SQLite)

Ensure write permissions on `./app.db` and parent directory:

```bash
chmod 666 app.db
chmod 755 ./
```

## Testing Different Databases

Run the same test suite against both databases:

```bash
# Test with SQLite
unset DATABASE_URL
pnpm test

# Test with PostgreSQL
export DATABASE_URL=postgresql://test_user:test_pass@localhost:5432/test_mnp
pnpm test
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test

on: [push]

jobs:
  test-sqlite:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm test:e2e

  test-postgresql:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
          POSTGRES_DB: test_mnp
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/test_mnp
        run: pnpm test
      - env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/test_mnp
        run: pnpm test:e2e
```

## Backup & Disaster Recovery

### SQLite Backup

```bash
cp app.db app.db.backup
# Or use your backup tool (rsync, S3, etc.)
```

### PostgreSQL Backup

```bash
# Full backup
pg_dump -U username -d mini_news_portal > backup.sql

# Compressed backup
pg_dump -U username -d mini_news_portal | gzip > backup.sql.gz

# Backup with password prompt
PGPASSWORD=password pg_dump -U username -d mini_news_portal > backup.sql
```

### PostgreSQL Restore

```bash
# From SQL dump
psql -U username -d mini_news_portal < backup.sql

# From compressed dump
gunzip < backup.sql.gz | psql -U username -d mini_news_portal
```

## References

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)
- [SQLite Documentation](https://www.sqlite.org/cli.html)
- [PgBouncer](https://www.pgbouncer.org/)
