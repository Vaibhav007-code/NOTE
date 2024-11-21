import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

// Create database connection
const sqlite = new Database('dabria.db');

// Initialize database with schema
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS entries (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    page_number INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    size INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

export const db = drizzle(sqlite, { schema });