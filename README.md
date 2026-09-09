# GOSAFE COSMETICS React Starter

Professional React/Vite product showcase with a lightweight admin dashboard.

## Important
The app uses localStorage as an instant browser cache and synchronizes the full admin state to Neon PostgreSQL through a Vercel serverless function.

## Local install
```bash
npm install
npm run dev
```
Open the URL shown by Vite (usually http://localhost:5173).

Admin: `http://localhost:5173/admin`

## Build
```bash
npm run build
npm run preview
```

## Vercel
You can push this folder to GitHub and import the repository in Vercel. Vercel detects Vite projects and builds them with the standard `npm run build` flow.

For a direct CLI deployment:
```bash
npm install -g vercel
vercel
vercel --prod
```

## Neon database setup
Create a Neon project, then run this SQL in the Neon SQL editor:
```sql
CREATE TABLE IF NOT EXISTS app_state (
	id TEXT PRIMARY KEY,
	data JSONB NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Add the Neon connection string as `DATABASE_URL` in Vercel Project Settings > Environment Variables. The API endpoint is `/api/data`; it reads the shared state with `GET` and saves it with `PUT`.

For local development, add `DATABASE_URL` to a `.env.local` file before running Vite. The app still works locally with its browser cache if the API is unavailable, and automatically uploads the current local state when the database is empty.

Uploaded logos are currently stored inside the JSON state as data URLs. For large production images, move them to object storage and save only their public URL in Neon.

## Clerk admin authentication
Create a Clerk application and add its publishable key to `.env.local`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
VITE_ADMIN_EMAILS=gosafegt@gmail.com,boliviansabu@gmail.com
```

Add both variables in Vercel. The public pages remain open, while `/admin` requires a Clerk account whose primary email is listed in `VITE_ADMIN_EMAILS`. Configure allowed sign-up and sign-in URLs in Clerk to include `/sign-in` and your deployed site URL.
