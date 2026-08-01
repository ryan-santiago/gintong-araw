# Method of Procedure (MOP) — Deploy Gintong Araw to Vercel

| | |
|---|---|
| **System** | Gintong Araw HOA Membership Management System |
| **Target platform** | Vercel (Hobby / Free tier) |
| **Database** | Neon Serverless Postgres |
| **Prepared** | 2026-08-01 |
| **Repository** | https://github.com/ryan-santiago/gintong-araw |

## 1. Purpose

Deploy the application (Members CRUD + QR-based Attendance) to a public, HTTPS-accessible production environment on Vercel's free Hobby plan.

## 2. Scope

Covers first-time production deployment: platform account setup, OAuth provider configuration, database migration, environment variable configuration, deployment, and post-deploy verification. Does not cover ongoing CI/CD tuning or custom domain DNS beyond the basic add step.

## 3. Pre-requisites

- [ ] GitHub account with push access to `ryan-santiago/gintong-araw` (repo already exists and `main` is up to date)
- [ ] Vercel account, signed in via GitHub (https://vercel.com/signup) — free Hobby plan
- [ ] Access to the Neon project/console for the database currently used in development
- [ ] Access to the GitHub OAuth App settings (used for "Sign in with GitHub")
- [ ] Access to the Google Cloud Console OAuth client (used for "Sign in with Google")
- [ ] Local `.env` file values on hand (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `GITHUB_CLIENT_ID/SECRET`, `GOOGLE_CLIENT_ID/SECRET`) — do not commit this file, it is git-ignored

## 4. Risk / Impact Notes

- This procedure creates a new public production deployment. It does not modify the existing Neon database schema (already migrated) unless Step 6 Option B (new database) is chosen.
- Vercel Hobby plan is licensed for personal/non-commercial use. An HOA's internal membership tool for its own community fits this; re-evaluate if the app is ever operated commercially (e.g. by a paid property management company).
- Rollback is low-risk: Vercel keeps every deployment and allows instant rollback to a previous one (Section 10).

## 5. Environment Variables Reference

Set these in the Vercel project (Settings → Environment Variables → Production). Do not paste values into chat, tickets, or version control.

| Variable | Source | Notes |
|---|---|---|
| `DATABASE_URL` | Neon console → Connection Details | Use the pooled connection string |
| `BETTER_AUTH_SECRET` | Existing local `.env` value | Reuse the same secret to keep session signing consistent, or generate a new one for production (see step 8) |
| `BETTER_AUTH_URL` | Your production URL | e.g. `https://gintong-araw.vercel.app` — set after Step 7 assigns the domain |
| `NEXT_PUBLIC_APP_URL` | Same as above | Must match `BETTER_AUTH_URL` |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth App | See Step 6 for callback URL update |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console OAuth client | See Step 6 for callback URL update |

## 6. Procedure

### Step 1 — Decide the production URL up front
Pick the Vercel project name (Vercel will assign `https://<project-name>.vercel.app` unless a custom domain is attached later). Decide this before Step 6/8 so the OAuth callback URLs and env vars can be set correctly in one pass.

> Chosen project name / URL: `___________________________`

### Step 2 — Create the Vercel project
1. Log in to https://vercel.com with GitHub.
2. **Add New → Project**, select `ryan-santiago/gintong-araw`.
3. Framework preset should auto-detect **Next.js**. Leave build/output settings default (`next build`, no `vercel.json` required).
4. **Do not click Deploy yet** — configure environment variables first (Step 4), otherwise the first build will fail auth/DB checks at runtime.

### Step 3 — Prepare the database
Choose one:

- **Option A (recommended for first deploy): reuse the existing Neon database.** It already has all migrations applied (including `attendance`, verified 2026-08-01). No action needed — just copy its connection string into `DATABASE_URL` in Step 4.
- **Option B: provision a separate production database** (Neon branch or new project), for isolation from dev data:
  1. Create the new database/branch in the Neon console, copy its connection string.
  2. From your local machine, temporarily point `DATABASE_URL` at it and run:
     ```
     npx drizzle-kit migrate
     ```
     (Use `migrate`, not the `db:push` npm script — `db:push` also runs `generate`, which would try to create a new migration from a schema diff; the schema hasn't changed, only the migration files need to be replayed against the new database.)
  3. Confirm the `attendance`, `members`, `user`, `session`, `account`, `verification` tables exist in the new database before proceeding.

### Step 4 — Set environment variables in Vercel
In the Vercel project → Settings → Environment Variables, add all variables from Section 5 for the **Production** environment. Leave `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` set to your Step 1 URL.

### Step 5 — Deploy
Trigger the first deployment (either the pending one from Step 2, or **Deployments → Redeploy** if variables were added after an initial failed build). Wait for build to complete.

### Step 6 — Update OAuth provider redirect URIs
Once the production URL is live, add the production callback URLs alongside the existing localhost ones (do not remove the localhost ones — they're still needed for local dev):

- **GitHub** (https://github.com/settings/developers → your OAuth App → Authorization callback URL): add
  `https://<project-name>.vercel.app/api/auth/callback/github`
- **Google** (Google Cloud Console → APIs & Services → Credentials → your OAuth client → Authorized redirect URIs): add
  `https://<project-name>.vercel.app/api/auth/callback/google`

### Step 7 — (Optional) Attach a custom domain
Vercel project → Settings → Domains → add domain, follow the DNS instructions from your registrar. If done, repeat Step 6 with the custom domain instead of `*.vercel.app`, and update `BETTER_AUTH_URL`/`NEXT_PUBLIC_APP_URL` (Step 4) to match, then redeploy.

### Step 8 — Secrets hygiene (optional but recommended)
If `BETTER_AUTH_SECRET` was previously only used in local dev, consider generating a fresh secret for production (`openssl rand -base64 32` or equivalent) rather than reusing the dev one, to keep dev and prod sessions cryptographically isolated.

## 7. Post-Deployment Verification

Perform against the live production URL:

- [ ] `/sign-in` loads over HTTPS with a valid certificate (padlock, no warnings)
- [ ] Sign in via GitHub succeeds and redirects back into the app
- [ ] Sign in via Google succeeds and redirects back into the app
- [ ] Sign in via email/password succeeds (create a test account if needed)
- [ ] `/members` loads, list renders, create/edit/delete a test member works
- [ ] `/attendance` loads, table renders
- [ ] "Take Attendance" opens the dialog and the browser prompts for camera permission (proves HTTPS is correctly recognized by the browser's `getUserMedia` check)
- [ ] Scanning a real printed member QR code records attendance and shows a success toast
- [ ] Re-scanning the same member same day shows the "already marked present" toast
- [ ] Clicking a member row shows their attendance history
- [ ] Delete the test member/account created for this verification pass

## 8. Rollback Procedure

If a deployment introduces a regression:
1. Vercel project → **Deployments** tab.
2. Locate the last known-good deployment.
3. Click **⋯ → Promote to Production** (instant, no rebuild required).
4. If the issue was caused by a database migration (Option B path), the migration itself is not automatically reverted — assess whether the schema change needs a manual down-migration before further deploys.

## 9. Known Free-Tier Limits (Vercel Hobby)

- ~100 GB bandwidth/month, serverless function execution capped at 10s per invocation — comfortably sufficient for this app's scale.
- One concurrent build; deployments queue rather than run in parallel.
- Personal/non-commercial use only per Vercel's terms (see Section 4).

## 10. Sign-off

| Role | Name | Date |
|---|---|---|
| Deployed by | | |
| Verified by | | |
