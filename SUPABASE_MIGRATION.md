# SQLite to Supabase Postgres Migration

The application currently uses `node:sqlite` and `data/platform.db`. Adding a `DATABASE_URL` environment variable alone does not switch the runtime to Postgres. This repository includes an export utility that produces a reviewed SQL migration for Supabase.

## Export the current SQLite database

From the repository root, run:

```bash
node scripts/export-sqlite-to-supabase.mjs data/platform.db > supabase-migration.sql
```

Review the generated file before applying it. It contains `CREATE TABLE` statements and `INSERT ... ON CONFLICT DO NOTHING` statements for the existing tables and rows.

## Apply it in Supabase

Open the Supabase project SQL Editor and run the generated `supabase-migration.sql`. For a production database, apply it first to a new Supabase project or a staging schema and verify row counts for `app_users`, `mentors`, `trading_strategies`, `wallets`, `notifications`, and the operational tables.

Use Supabase's **transaction pooler** connection string for a serverless Hostinger deployment. Store it only as a server-side environment variable named `DATABASE_URL`; never expose it through a `NEXT_PUBLIC_*` variable.

## Important runtime limitation

This codebase still executes SQLite statements directly through `DatabaseSync`. The export utility migrates the schema and data, but it does **not** switch application queries to Postgres. Do not point the current runtime at a Supabase URL and expect the application to work. A complete runtime cutover requires replacing the adapter and converting SQLite-specific syntax such as `?` placeholders, `INSERT OR IGNORE`, `datetime('now')`, and SQLite DDL throughout the API routes.

Until that adapter cutover is completed, keep `data/platform.db` persistent on Hostinger and back it up before deployments. The account recovery flow already stores reset tokens and expiry timestamps in that SQLite database.

## Account recovery flow

The current frontend exposes **Forgot password?** on the sign-in form. The backend creates a one-hour reset token, and the reset form consumes it once to replace the bcrypt password hash. In production, configure an email provider or notification transport if reset links should be delivered by email; otherwise the API returns a development reset URL for the user-facing recovery flow.
