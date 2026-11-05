# Database setup

The application uses Prisma ORM with MySQL/MariaDB. Server-side API routes and services query the database through Prisma; browser components call route handlers and never connect to MySQL directly.

## Local development with Docker

1. Copy `.env.example` to `.env.local` and set the `MYSQL_*` values.
2. Start MySQL from the project root with `docker compose --env-file .env.local up -d mysql`.
3. For a new local database, run `npm run prisma:migrate:deploy` to apply the checked-in Prisma migrations. If your existing Docker volume was initialized with the old SQL schema, back it up and baseline it once with `npx prisma migrate resolve --applied 0001_init` instead. This records the already-created schema without dropping its data.
4. Start the app with `npm run dev`.
5. Stop MySQL with `docker compose down`; data remains in the named volume. To reset local data, `docker compose down -v` permanently deletes the local database.

Compose credentials are for development only and must not be reused in production.

## Set up the database in Spaceship cPanel

1. Create a MySQL database and database user in cPanel, and grant that user access to the database.
2. Set the application's private `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_DATABASE` environment variables.
3. For a new empty database, run `npm run prisma:migrate:deploy` from the deployed application directory. Do not run `prisma migrate dev` against production.
4. For a database already created with the previous SQL schema, take a backup, verify it includes the current tables and the `company_settings` and CMS tables, then baseline the initial migration once it exists with `npx prisma migrate resolve --applied 0001_init`. Continue applying future checked-in migrations with `npm run prisma:migrate:deploy`.
5. Run `npm run prisma:generate` before creating the first admin account. Put `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_ORGANIZATION`, and a unique `ADMIN_PASSWORD` of at least 14 characters in ignored `.env.local`, then run `npm run admin:create`. The bootstrap script refuses an existing email and does not expose admin role selection in public registration.
6. Sign in at `/portal/login`. Staff accounts enter the operations dashboard; buyer and supplier accounts enter `/portal`.

Keep database credentials private. Remove `ADMIN_PASSWORD` after creating the initial admin account.

## Schema changes

Edit `prisma/schema.prisma`, then create a migration against a local development database with `npx prisma migrate dev --name describe_change`. Commit the resulting `prisma/migrations` files and apply them in other environments with `npm run prisma:migrate:deploy`. Regenerate the Prisma client with `npm run prisma:generate`; production builds also generate it before building Next.js.

## Cloudinary media storage

Create a Cloudinary account and add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` to `.env.local` locally or the hosted app's private environment settings. The secret stays server-side. The media API accepts JPG, PNG, WebP, and AVIF images up to 10 MB and stores URLs and alt text in MySQL. Admins manage uploads at `/admin/content/media`.

The homepage editor is at `/admin/content/home`. It saves drafts to MySQL, previews them locally in a separate browser tab, and updates the public homepage only when a staff member publishes. The public homepage reads published content only.

## Request lifecycle

1. A buyer or supplier creates an account and submits a sourcing request.
2. The request is saved with a unique reference and a `submitted` status.
3. Staff review the request in **Client requests** and create an engagement with its initial client-visible update.
4. Staff post progress updates and maintain its stage/next action. The client portal shows the engagement stage, milestones, and update timeline for that signed-in account only.
