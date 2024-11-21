import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { db } from "./db";

const adapter = new BetterSqlite3Adapter(db, {
  user: "users",
  session: "sessions"
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username
    };
  }
});