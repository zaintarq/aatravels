# AA Travel Group

Next.js website for AA Travel Group — Umrah hotels & transport in Makkah and Madinah.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind
- **Firebase Auth** — email/password + username (Firestore profile)
- **Cloud Firestore** — enquiries, contacts, reviews, agents
- **Static hotel/package data** in `src/data/` (easy to extend)

## Setup

1. `npm install`
2. Copy `.env.example` → `.env` and fill Firebase + admin credentials
3. In Firebase Console:
   - Enable **Email/Password** auth
   - Create a **Firestore** database
   - Paste rules from `firestore.rules`
4. `npm run dev`

## Admin / staff access

1. Register normally at `/register`
2. In Firebase Console → Firestore → `users/{uid}`, set `isAdmin` to `yes` (or `true`)
3. Sign in at `/login` — Dashboard appears in the nav for staff

Users cannot change their own `isAdmin` flag (blocked in `firestore.rules`). Only you can flip it in the Console.

## Key routes

- `/` — home
- `/hotels`, `/hotels/[slug]` — hotels + reviews
- `/contact` — quotation form
- `/login`, `/register` — customer auth
- `/admin/login` — staff dashboard
