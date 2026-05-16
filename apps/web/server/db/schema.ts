import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";

export const newsStatusEnum = pgEnum("news_status", ["DRAFT", "PUBLISHED"]);

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    slugUnique: uniqueIndex("categories_slug_unique").on(table.slug)
  })
);

export const news = pgTable(
  "news",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull(),
    summary: varchar("summary", { length: 500 }).notNull(),
    content: text("content").notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    status: newsStatusEnum("status").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    viewCount: integer("view_count").default(0).notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    slugUnique: uniqueIndex("news_slug_unique").on(table.slug),
    categoryPublishedIdx: index("idx_news_category_published").on(table.categoryId, table.publishedAt),
    publishedIdx: index("idx_news_published").on(table.publishedAt)
  })
);

export const newsViewDaily = pgTable(
  "news_view_daily",
  {
    id: serial("id").primaryKey(),
    newsId: integer("news_id")
      .notNull()
      .references(() => news.id, { onDelete: "cascade" }),
    viewDate: date("view_date").notNull(),
    viewCount: integer("view_count").default(0).notNull()
  },
  (table) => ({
    newsDateUnique: uniqueIndex("news_view_daily_news_id_view_date_unique").on(table.newsId, table.viewDate),
    viewDateCountIdx: index("idx_news_view_daily_date_count").on(table.viewDate, table.viewCount)
  })
);
