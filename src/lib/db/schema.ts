import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  hashedPassword: text('hashed_password').notNull()
});

export const entries = sqliteTable('entries', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  pageNumber: integer('page_number').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  size: integer('size').notNull() // Size in bytes
});