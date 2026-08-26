# GoPhotos
GoPhotos is a marketplace that connects customers with photographers. Photographers apply and are approved by an admin, customers discover and book photographers for jobs, delivered photo galleries are shared back with customers, and payment is handled through Stripe Connect.
Live deployment: https://go-photos.vercel.app
## How it works
- **Photographers apply** on the [`/apply`](src/app/apply) page. An admin reviews submissions on the [`/admin`](src/app/admin) dashboard and approves them via [`/api/applications/approve`](src/app/api/applications/approve/route.ts), which promotes the applicant's data into the photographer table and moves their portfolio images in S3.
- **Customers discover photographers** on [`/discover`](src/app/discover) and view individual profiles at `/discover/[photographerURL]`.
- **Customers and photographers message** each other through [`/messages`](src/app/messages) (backed by TalkJS) to negotiate a job, which creates a booking.
- **Bookings/jobs** are tracked on [`/bookings`](src/app/bookings) (customer view) and [`/jobs`](src/app/jobs) (photographer view).
- **Payment** happens through Stripe Checkout ([`/api/stripe`](src/app/api/stripe)); a Stripe webhook ([`/api/webhooks/stripe-webhooks`](src/app/api/webhooks/stripe-webhooks/route.ts)) marks the job as paid once checkout completes.
- **Galleries** are delivered at `/gallery/[jobId]` once the photographer uploads pictures.
- **User accounts** are managed by Clerk; a Clerk webhook ([`/api/webhooks/clerk-webhooks`](src/app/api/webhooks/clerk-webhooks/route.ts)) syncs new/updated Clerk users into the app's customer table, and [`src/middleware.ts`](src/middleware.ts) protects private routes and gates `/admin` behind an `admin` flag in the user's Clerk session metadata.
## Tech stack
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS
- **Auth:** [Clerk](https://clerk.com/) (`@clerk/nextjs`)
- **Database:** PostgreSQL, accessed directly with the `pg` client (see [`src/utils/db.ts`](src/utils/db.ts)); provisioning/migrations for the database are not part of this repo
- **File storage/delivery:** AWS S3 (uploads) + CloudFront (image delivery), via `@aws-sdk/*`
- **Payments:** Stripe (Checkout + Connect) for charging customers and paying out photographers
- **Messaging:** [TalkJS](https://talkjs.com/) for in-app chat between customers and photographers
- **Email:** [Resend](https://resend.com/) for transactional email
- **Analytics:** PostHog, plus Vercel Analytics/Speed Insights
- **Deployment:** Vercel
## Prerequisites
- Node.js 18.17 or later (required by Next.js 14)
- npm
- A PostgreSQL database
- Accounts/API keys for Clerk, Stripe, AWS (S3 + CloudFront), Resend, TalkJS, and PostHog (see [Environment variables](#environment-variables))
## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in real values (see below).
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).
## npm scripts
| Script | Description |
| --- | --- |
| `npm run dev` | Starts the Next.js development server |
| `npm run build` | Builds the app for production |
| `npm run start` | Runs the production build |
| `npm run lint` | Runs `next lint` |
There is a `prepare` script that installs Husky git hooks locally (skipped automatically when `$VERCEL` is set, i.e. during Vercel builds).
## Environment variables
`.env*` files are gitignored. `.env.example` in the repo root lists every variable name referenced in the code, without real values. Notable groups:
- **Clerk** — `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` are Clerk's standard variable names, read internally by `@clerk/nextjs` (not referenced explicitly via `process.env` in this repo). `CLERK_WEBHOOK_SECRET` verifies the incoming Clerk webhook.
- **Database** — `PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` configure the `pg` connection pool in [`src/utils/db.ts`](src/utils/db.ts).
- **AWS** — `AWS_REGION`, `AWS_BUCKET_NAME` for S3 uploads; `CLOUDFRONT_DOMAIN` and `CLOUDFRONT_DOMAIN_OPTIMIZED` for the CloudFront domains used to build public image URLs (the latter is also whitelisted in [`next.config.js`](next.config.js) for `next/image`).
- **Stripe** — `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
- **Resend** — `RESEND_API_KEY`.
- **TalkJS** — `NEXT_PUBLIC_TALK_DEV` (`"true"`/`"false"` toggle), `NEXT_PUBLIC_TALK_DEV_ID`, `NEXT_PUBLIC_TALK_PROD_ID`.
- **PostHog** — `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`.
- **Misc** — `bypass_vis` (optional, `"true"` to bypass photographer visibility checks on the discover page — used for testing).
## Repository layout
- `src/app` — Next.js App Router pages: `admin` (admin dashboard), `apply` (photographer application), `bookings` (customer bookings), `discover/[photographerURL]` (photographer discovery/profile), `gallery/[jobId]` (delivered photo galleries), `jobs` (photographer job list), `messages/[convoId]` (chat), `user-profile` (Clerk account pages), plus root `layout.tsx`, `page.tsx` (landing page), `providers.js` (PostHog provider), and `globals.css`.
- `src/app/api` — Route handlers grouped by domain: `applications` (submit/approve photographer applications), `database-updates` (job/chat/rating/profile mutations), `emails` (transactional email triggers), `images` (S3 upload/download/metadata), `invoice`, `share-profile`, `stripe` (checkout + Connect account setup), and `webhooks/{clerk-webhooks,stripe-webhooks}`.
- `src/components` — UI grouped by feature: `AdminPage`, `ApplyPage`, `BookingsPage`, `DiscoverPage`, `EmailTemplates`, `GalleryPage`, `Images`, `JobsPage`, `LandingPages`, `Layout`, `MessagesPage`, `ScrollingFeatures`, `UserProfilePage`.
- `src/actions` — Server actions (e.g. `setup-product-price.ts` creates the Stripe product/price for a job).
- `src/utils` — Shared helpers, including `db.ts` (Postgres queries), `fetchImages.ts` and `imageOptimization.ts` (S3/CloudFront helpers), `fonts.ts`, `cn.ts`, and `types.ts`.
- `src/middleware.ts` — Clerk route protection: public routes, admin-only routes, and the default "must be signed in" rule for everything else.
- `public/` — Marketing images and legal/contract PDFs (terms of service, privacy policy, photographer contract, invoice template).
## Deployment
The app is deployed on [Vercel](https://vercel.com/) at https://go-photos.vercel.app. Vercel runs `npm run build` / `npm run start` and sets `$VERCEL`, which skips the Husky install step in `prepare`. This repo does not document how the database or other backing services are provisioned; that is managed outside of this repo.
