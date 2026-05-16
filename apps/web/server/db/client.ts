import Database from "better-sqlite3";
import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/mini_news_portal";

type AppDb = NodePgDatabase<typeof schema>;

function createDb(): AppDb {
  if (databaseUrl.startsWith("file:")) {
    const filename = databaseUrl.slice("file:".length);
    const sqlite = new Database(filename || "./mini-news-portal.sqlite");
    return drizzleSqlite(sqlite, { schema }) as unknown as AppDb;
  }

  const pool = new Pool({
    connectionString: databaseUrl
  });

  return drizzlePg(pool, { schema });
}

export const db = createDb();
