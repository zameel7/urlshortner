# trim.it - URL Shortener

A simple URL shortener built with the same tech stack as the qrcodegen app: Next.js 16, React 19, TypeScript, Firebase (Auth + Firestore), CSS Modules, and Remixicon.

## Features

- Shorten long URLs to shareable links (`/s/{slug}`)
- Google sign-in and access code (coupon) gate
- Dashboard: create short links, view history, edit or delete links
- Click count tracking on each short link
- Optional share/info page at `/l/{slug}` for a short link

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Firebase**

   - Create a [Firebase project](https://console.firebase.google.com/) and enable Authentication (Google) and Firestore.
   - Create a Web app and copy the config into `.env.local` (see `.env.example`).
   - Link the project: `firebase use --add` and select your project (or set `.firebaserc`).
   - Deploy Firestore rules and indexes: `firebase deploy --only firestore`. This uses `firestore.rules` and `firestore.indexes.json` (composite index on `shortlinks`: `userId` ASC + `createdAt` DESC for dashboard link history).
   - In Firestore, create the **users** and **coupons** collections as in qrcodegen if you use the plan/coupon flow. Create coupons with fields: `isUsed` (boolean), and optionally `usedBy`, `usedAt` for redemption.

3. **Seed coupons (optional)**

   The seed script uses the **Firebase Admin SDK** so it bypasses security rules (no sign-in). You must provide a service account key:

   - Firebase Console → Project settings → Service accounts → **Generate new private key** → save the JSON (e.g. `serviceAccountKey.json`) and add it to `.gitignore`.
   - Run:

   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json npm run seed-coupons
   ```

   This creates 50 coupon codes in the `coupons` collection. Without `GOOGLE_APPLICATION_CREDENTIALS`, the script would get **PERMISSION_DENIED** because the client SDK runs unauthenticated; the Admin SDK with a service account bypasses rules.

4. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See `.env.example`. Copy it to `.env.local` and fill in your Firebase config.

## Routes

- `/` – Landing; enter URL to shorten (redirects to login or dashboard)
- `/login` – Google sign-in
- `/plan` – Access code (coupon) entry
- `/dashboard` – Shorten form + link history (auth + subscribed only)
- `/s/[slug]` – Redirect: resolve short link, increment click count, redirect to long URL
- `/l/[slug]` – Share/info page for a short link (short URL, long URL, click count)
