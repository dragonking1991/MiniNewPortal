import Database from "better-sqlite3";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { migrate as migrateSqlite } from "drizzle-orm/better-sqlite3/migrator";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/mini_news_portal";
const migrationsFolder = "./drizzle";

function applySqliteConstraintsMigration(sqlite: Database.Database) {
  sqlite.pragma("foreign_keys = ON");

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      status TEXT NOT NULL CHECK(status IN ('DRAFT', 'PUBLISHED')),
      published_at TEXT,
      view_count INTEGER NOT NULL DEFAULT 0,
      category_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS news_view_daily (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      news_id INTEGER NOT NULL,
      view_date TEXT NOT NULL,
      view_count INTEGER NOT NULL DEFAULT 0,
      UNIQUE(news_id, view_date),
      FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_news_category_published ON news(category_id, published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_news_view_daily_date_count ON news_view_daily(view_date, view_count DESC);
  `);
}

async function migrate() {
  if (databaseUrl.startsWith("file:")) {
    const filename = databaseUrl.slice("file:".length) || "./mini-news-portal.sqlite";
    const sqlite = new Database(filename);

    try {
      const db = drizzleSqlite(sqlite);
      try {
        migrateSqlite(db, { migrationsFolder });
        console.log(`Applied SQLite migrations from ${migrationsFolder}`);
      } catch {
        applySqliteConstraintsMigration(sqlite);
        console.log("Applied SQLite fallback migration with equivalent constraints");
      }
    } finally {
      sqlite.close();
    }

    return;
  }

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    const db = drizzlePg(pool);
    await migratePg(db, { migrationsFolder });
    console.log(`Applied PostgreSQL migrations from ${migrationsFolder}`);
  } finally {
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
