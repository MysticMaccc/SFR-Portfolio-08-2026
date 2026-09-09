# Complete Setup Guide

This guide covers everything from zero to a live portfolio on Vercel.

---

## Prerequisites

- **Node.js 18+** — Download from [nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js)
- **Git** — Download from [git-scm.com](https://git-scm.com)
- A **GitHub account** (free) — [github.com](https://github.com)
- A **Supabase account** (free) — [supabase.com](https://supabase.com)
- A **Vercel account** (free) — [vercel.com](https://vercel.com)

---

## Part 1 — Run Locally

### Step 1: Install dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

This installs all packages listed in `package.json`.

### Step 2: Create environment variables

Duplicate the example file:

```bash
# Windows (PowerShell)
Copy-Item .env.local.example .env.local

# Mac/Linux
cp .env.local.example .env.local
```

You'll fill in the Supabase values in Part 2.

### Step 3: Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> The portfolio shows your CV data even without Supabase — it falls back to hardcoded data from `lib/defaultData.ts`.

---

## Part 2 — Set Up Supabase

### Step 1: Create a project

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click **New Project**
3. Choose a name (e.g., `sfr-portfolio`) and a strong database password
4. Select the region closest to you (Singapore for PH)
5. Wait ~2 minutes for the project to be ready

### Step 2: Create the database tables

1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste it into the editor and click **Run** (`Ctrl+Enter`)

You should see "Success. No rows returned." — all tables were created.

### Step 3: Add project images support

1. In SQL Editor, open another **New Query**
2. Copy the entire contents of `supabase/project_images_migration.sql`
3. Paste and click **Run**

This creates the `project_images` table and the `project-images` storage bucket for photo uploads.

> **Important:** Run `schema.sql` first, then `project_images_migration.sql`. The images table references the projects table.

### Step 4: Get your API keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** — looks like `https://xxxxxxxxxxxx.supabase.co`
   - **anon / public key** — a long string starting with `eyJ...`

### Step 5: Update your `.env.local`

Open `.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_ADMIN_EMAIL=your@email.com
```

Save the file, then restart the dev server:

```bash
# Stop with Ctrl+C, then:
npm run dev
```

### Step 6: Create your admin account

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter your email and a strong password
4. Click **Create User**
5. Copy the **User UID** (a UUID like `550e8400-e29b-41d4-a716-446655440000`)

### Step 7: Seed the database with your CV data

1. Open `supabase/seed.sql` in a text editor
2. Replace `'YOUR_USER_ID_HERE'` with your actual User UID from Step 6
3. Go back to **SQL Editor** in Supabase, paste the modified `seed.sql` content, and click **Run**

Your portfolio now reads live data from Supabase.

### Step 8: Test the admin panel

1. Go to [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
2. Log in with the email and password you created in Step 6
3. You should be redirected to `/admin/dashboard`
4. Try editing your profile — changes appear instantly on the public portfolio

---

## Part 3 — Deploy to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial portfolio setup"
```

Create a new repository at [github.com/new](https://github.com/new), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/sfr-portfolio-08-2026.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Connect your GitHub account if needed
4. Select your `sfr-portfolio-08-2026` repository
5. Click **Import**

### Step 3: Add environment variables to Vercel

Before clicking Deploy, add your environment variables:

| Key                             | Value                         |
| ------------------------------- | ----------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key        |
| `NEXT_PUBLIC_ADMIN_EMAIL`       | Your admin email              |

Then click **Deploy**.

### Step 4: Get your live URL

Vercel gives you a URL like `https://sfr-portfolio-08-2026.vercel.app`.

### Step 5: Update Supabase Auth settings

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your Vercel URL: `https://sfr-portfolio-08-2026.vercel.app`
3. Under **Redirect URLs**, add: `https://sfr-portfolio-08-2026.vercel.app/auth/callback`
4. Click **Save**

Your portfolio is now live.

---

## Part 4 — Use a Custom Domain (Optional)

### On Vercel:

1. Go to your project → **Settings** → **Domains**
2. Add your domain (e.g., `sherwinroxas.dev`)
3. Follow the DNS instructions Vercel shows you

### On Supabase:

After adding your domain, update the **Site URL** and **Redirect URLs** to your custom domain.

---

## Site Structure

The portfolio is a multi-page Next.js app. Each section is its own page:

| URL             | Page            | Description                                  |
| --------------- | --------------- | -------------------------------------------- |
| `/`             | Home            | Full-screen hero with name, title, and links |
| `/about`        | About           | Bio, contact info, and career stats          |
| `/skills`       | Skills          | Technical skills grouped by category         |
| `/experience`   | Experience      | Work history with expandable responsibilities|
| `/projects`     | Projects        | Filterable project grid with photo gallery   |
| `/training`     | Training        | Certifications grouped by provider           |
| `/contact`      | Contact         | Contact form and direct contact links        |
| `/resume`       | Resume          | Public resume download page                  |
| `/auth/login`   | Admin Login     | Admin-only login page                        |
| `/admin/*`      | Admin Panel     | CMS to manage all portfolio content          |

---

## Managing Your Portfolio

### Editing content

1. Go to `https://your-vercel-url.vercel.app/auth/login`
2. Log in with your admin credentials
3. Use the sidebar to navigate:

| Section        | What you can do                                                               |
| -------------- | ----------------------------------------------------------------------------- |
| **Profile**    | Update name, title, bio, contact info, and links                              |
| **Projects**   | Add/edit/delete projects; upload multiple images per project                  |
| **Skills**     | Add skills by category with proficiency level (Beginner / Intermediate / Advanced) |
| **Experience** | Add work history entries with bullet-point responsibilities                   |
| **Training**   | Manage certifications with optional clickable URLs                            |
| **Resume**     | Preview completeness and download your PDF resume                             |

### Uploading project images

The Projects admin page includes a drag-and-drop image uploader:

1. Go to **Admin → Projects**
2. Click the pencil icon to **edit** an existing project (images require a saved project)
3. Scroll to the **Project Images** section at the bottom of the modal
4. Drag images in, or click **Upload Photos** to select files
5. Images appear as a banner on the project card on your portfolio
6. Visitors can click the image to open a full-screen gallery with navigation

> To add images to a new project: save it first, then reopen it to upload.

### Adding URLs to training items

1. Go to **Admin → Training**
2. Edit or create a course
3. Paste the certificate/course/file URL in the **Training / Certificate URL** field
4. Once saved, the entire training row on your portfolio becomes a clickable link that opens in a new tab

### Downloading the PDF resume

The PDF is always generated fresh from your current data:

1. Go to `/admin/resume` — or visit the public `/resume` page
2. Click **Download PDF Resume**
3. A formatted PDF downloads in the browser

### Updating your portfolio URL in the profile

After deploying, set your live URL in the profile so it appears in your About section and PDF resume:

1. Go to `/admin/profile`
2. Set **Portfolio URL** to your Vercel URL
3. Save

---

## Troubleshooting

**Portfolio shows hardcoded data, not Supabase data**

- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct in `.env.local`
- Restart the dev server after editing `.env.local`

**SQL error: "relation does not exist"**

- You ran `seed.sql` before `schema.sql`. Always run `schema.sql` first, then `project_images_migration.sql`, then `seed.sql`.

**Images not uploading in admin**

- Make sure you ran `project_images_migration.sql` — it creates both the table and the storage bucket
- Check that the storage bucket `project-images` exists in Supabase dashboard → Storage
- If the bucket is missing, run only the storage-related part of the migration SQL again

**Can't log in to admin**

- Check you created the user in Supabase **Authentication → Users**
- Check that the email/password match exactly
- Make sure the Supabase env vars are set and the dev server was restarted

**Admin redirects loop on Vercel**

- Make sure the Supabase **Site URL** is set to your Vercel URL (not localhost)
- Make sure the Redirect URL includes `/auth/callback`

**Changes in admin don't appear on the portfolio**

- The public portfolio uses server-side rendering — do a hard refresh (`Ctrl+Shift+R`)
- If still not showing, check RLS policies in `schema.sql`

**PDF download doesn't work**

- PDF is generated client-side — make sure JavaScript is enabled
- Try a different browser if it fails

---

## Local Development Reference

| Command         | Description                                 |
| --------------- | ------------------------------------------- |
| `npm run dev`   | Start dev server at localhost:3000          |
| `npm run build` | Build for production (run before deploying) |
| `npm run lint`  | Check for TypeScript/ESLint errors          |
| `npm start`     | Start production server locally             |
