import { createServerFn } from "@tanstack/react-start";
import { sql } from "../db";
// Join-the-waitlist server action. Collected emails are stored in the team's
// Postgres database (Neon over HTTP, via src/db.ts) so the list survives
// restarts and exists on the live host — not a local JSONL file that sits on a
// wiped-backed overlay. DATABASE_URL must be connected (database card /
// Settings > Secrets); while it is missing the handler honestly reports an
// error instead of pretending the signup was recorded.

async function ensureTable(): Promise<void> {
  // Neon's serverless driver binds interpolated values as query parameters, so
  // DDL must ship as literal SQL text — this template has zero interpolations,
  // so it is sent exactly as written (no bound params). CREATE TABLE IF NOT
  // EXISTS is idempotent: safe to run on every subscribe; concurrent signups
  // at most race the catalog lookup and no-op. Plain serial/timestamptz types
  // need no custom casts over the HTTP driver.
  await sql()`CREATE TABLE IF NOT EXISTS waitlist (
    id serial primary key,
    email text unique not null,
    source text not null default 'site',
    created_at timestamptz not null default now()
  )`;
}

async function insertSignup(email: string, source: string): Promise<void> {
  // created_at is set server-side by the column default (now()); we deliberately
  // don't insert it. email is lowercased/trimmed by the caller.
  await sql()`INSERT INTO waitlist (email, source) VALUES (${email}, ${source})`;
}

/** Error codes Postgres reports for a unique-violation on insert. */
const UNIQUE_VIOLATION_CODES = new Set(["23505", "23P01"]);

export const subscribe = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { email: string; source?: string } }) => {
    const email = String(data?.email ?? "").trim().toLowerCase();
    const source = String(data?.source ?? "").trim() || "site";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false as const, message: "Please enter a valid email address." };
    }
    if (!process.env.DATABASE_URL) {
      return { ok: false as const, message: "Something went wrong. Please try again." };
    }
    try {
      await ensureTable();
      try {
        await insertSignup(email, source);
      } catch (err) {
        // Already on the list is not an error — re-subscribing shows success.
        const code = (err as { code?: string } | undefined)?.code;
        if (!code || !UNIQUE_VIOLATION_CODES.has(code)) throw err;
      }
      return { ok: true as const, message: "You're on the list. We'll let you know when something lovely arrives." };
    } catch (err) {
      console.error("waitlist subscribe failed", err);
      return { ok: false as const, message: "Something went wrong. Please try again." };
    }
  }
);