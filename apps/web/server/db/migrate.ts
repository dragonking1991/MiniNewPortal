import Database from "better-sqlite3";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { migrate as migrateSqlite } from "drizzle-orm/better-sqlite3/migrator";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/mini_news_portal";
const migrationsFolder = "./drizzle";

async function migrate() {
  if (databaseUrl.startsWith("file:")) {
    const filename = databaseUrl.slice("file:".length) || "./mini-news-portal.sqlite";
    const sqlite = new Database(filename);

    try {
      const db = drizzleSqlite(sqlite);
      migrateSqlite(db, { migrationsFolder });
      console.log(`Applied SQLite migrations from ${migrationsFolder}`);
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
