# LEAD MULTICHOICE Business Platform

Unified Next.js application for the public website, client portal, and staff operations area.

## Routes

- `/` and the public content pages serve the company website.
- `/portal` is the buyer and supplier account area for requests and engagement updates.
- `/admin` is the staff operations area. Staff review client requests, open engagements, and post client-visible updates.
- `/api` contains the server-side API. MySQL access stays in the server layer; client components use TanStack Query fetchers and hooks.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Sonner, TanStack Query, and MySQL/MariaDB through `mysql2`.

## Local development

Requires Node.js 20.9 or later and Docker Desktop. Copy `.env.example` to `.env.local`, then start MySQL. Docker initializes a fresh database from `database/schema.sql` automatically.

```sh
npm install
docker compose --env-file .env.local up -d mysql
npm run dev
```

Open `http://localhost:3000`. Create the first staff account with the `admin:create` script. Database, Cloudinary, and production setup are documented in [database/README.md](database/README.md).

Set `CLIENT_PORTAL_ENABLED=true` in `.env.local` when the database and portal are ready. When set to `false`, the public website remains available while client/admin sign-in, registration, tracking, dashboards, and protected APIs are disabled. `TRACKING_COOKIE_SECRET` is optional; if unset, the tracking access cookie uses `MYSQL_PASSWORD` for signing.

Client requests, engagements, milestones, updates, opportunities, tenders, shipments, activity entries, staff profiles, admin preferences, media metadata, and published homepage copy persist in MySQL. Older installations must apply migrations `002_admin_operations.sql`, `003_media_library.sql`, and `004_website_cms.sql` in order; fresh installs can import the current `database/schema.sql`.

The homepage has a draft, preview, and publish workflow in `/admin/content/home`, with four-language copy and Cloudinary hero media. Remaining website pages are still maintained in source files and can be added to the CMS next.
