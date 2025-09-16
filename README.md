# Google Calendar Scheduler App

A full‑stack scheduling app built with Next.js (App Router), Prisma, NextAuth (Google OAuth), and Google Calendar API. Buyers can book with Sellers, and tokens are stored securely using AES‑256‑GCM.

---

## Tech Stack
- Next.js 15 (App Router)
- React 19, TypeScript
- NextAuth.js (Google provider)
- Prisma ORM
- Google APIs (Calendar)
- TailwindCSS 4

---

## Quick Start

1) Clone and install
```bash
npm install
```

2) Configure environment
Create a `.env.local` in the project root:
```bash
# Web/App
AUTH_URL=http://localhost:3000
# NextAuth (recommended)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_32+ char secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Crypto key for encrypting refresh tokens (AES-256-GCM)
# Must be EXACTLY 32 bytes.
# Option A (hex): 64 hex characters (represents 32 bytes)
# Option B (utf8): 32 ASCII characters
CRYPTO_SECRET=put_64_hex_chars_or_32_ascii_chars_here
```

Generate strong secrets:
- PowerShell (Windows):
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- macOS/Linux:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Use the output for both `NEXTAUTH_SECRET` and `CRYPTO_SECRET` (as hex). If you use hex for `CRYPTO_SECRET`, keep all 64 characters.

3) Set up the database
```bash
npx prisma migrate dev
```

4) Start the app
```bash
npm run dev
```
Visit `http://localhost:3000`.

---

## Google OAuth Setup
Minimal steps (see `GOOGLE_OAUTH_SETUP.md` for screenshots and full details):
- Create OAuth 2.0 credentials in Google Cloud Console.
- Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- Add your Google account as a Test User while the app is in testing.
- Copy Client ID/Secret into `.env.local`.

Scopes requested by the app include:
- `openid email profile`
- `https://www.googleapis.com/auth/calendar.events`
- `https://www.googleapis.com/auth/calendar.readonly`

---

## Scripts
- `npm run dev`: Start Next.js in development
- `npm run build`: Production build
- `npm run start`: Start production server
- `npm run lint`: Lint code

---

## Important Environment Notes
- `CRYPTO_SECRET` is used by `lib/crypto.ts` to encrypt/decrypt Google refresh tokens with AES‑256‑GCM.
  - Hex form must be 64 hex characters (32 bytes).
  - UTF‑8 form must be exactly 32 ASCII characters (32 bytes).
  - Do not wrap values in quotes in `.env.local`.
- `NEXTAUTH_SECRET` is required by NextAuth for signing/encryption. Use a 32‑byte random value.
- `AUTH_URL`/`NEXTAUTH_URL` must match your running app URL.

---

## Troubleshooting
- Authentication error: Invalid key length
  - Ensure `CRYPTO_SECRET` is exactly 32 bytes.
    - If hex, it must be 64 characters of 0-9a-f.
    - If utf8, it must be 32 ASCII characters.
  - No quotes in `.env.local` values.
  - Restart the dev server after changing env vars.
  - Clear cookies for `localhost` and retry sign‑in.
  - Ensure `NEXTAUTH_SECRET` is set.

- Google “app not verified” or can’t sign in during testing
  - Add your email as a Test User in the OAuth consent screen.
  - Verify redirect URI matches exactly.
  - See `GOOGLE_OAUTH_SETUP.md` for details.

- Unable to read Calendar or create events
  - Confirm the requested scopes are approved in the consent screen.
  - Ensure tokens are present in DB and not expired.

---

## Project Structure (high level)
```text
app/                       # App Router routes & APIs
components/                # UI components
lib/                       # auth, google, db, crypto helpers
prisma/                    # Prisma schema & migrations
styles/, utils/, types/    # Styles, utilities, and shared types
```

---

## License
This project is for learning/demo purposes. Adapt as needed for your use case.
