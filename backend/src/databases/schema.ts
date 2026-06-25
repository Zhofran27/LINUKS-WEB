import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const users = pgTable ('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  nim: varchar('nim', { length: 50 }),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  is_active: integer('is_active').default(1).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const reports = pgTable('reports', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer('user_id').notNull().references(() => users.id),
  category_id: integer('category_id').notNull().references(() => categories.id),
  status_id: integer('status_id').notNull().references(() => statuses.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  chronology: text('chronology').notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  incident_date: timestamp('incident_date').notNull(),
  is_anonymous: integer('is_anonymous').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const report_files = pgTable('report_files', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  report_id: integer('report_id').notNull().references(() => reports.id),
  file_path: varchar('file_path', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
}, (table) => ({
  nameIdx: uniqueIndex('categories_name_idx').on(table.name),
}));

export const statuses = pgTable('statuses', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
}, (table) => ({
  nameIdx: uniqueIndex('statuses_name_idx').on(table.name),
}));
