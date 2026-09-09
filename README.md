# Denis Hain — iOS-Inspired Developer Portfolio

A modern, iOS-inspired full-stack portfolio with a secure admin panel, dynamic content management, and PDF resume generation.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (iOS design system) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| PDF | @react-pdf/renderer |
| Animations | Framer Motion |
| Hosting | Vercel |

---

## Features

- **iOS-inspired design** — Glassmorphism, rounded cards, SF-style typography, gradient orbs
- **Secure authentication** — Supabase Auth with protected admin routes via Next.js middleware
- **Dynamic portfolio** — All sections (profile, skills, projects, experience, training) editable via admin panel
- **PDF resume generator** — One-click download of a professionally formatted PDF from live data
- **Responsive** — Mobile-first design that looks great on all screens
- **SEO ready** — Proper metadata, og:image, and semantic HTML

---

## Project Structure

```
SFR-Portfolio-08-2026/
├── app/
│   ├── page.tsx                    # Public portfolio (SSR from Supabase)
│   ├── layout.tsx                  # Root layout + Toast
│   ├── globals.css                 # iOS design tokens + global styles
│   ├── auth/
│   │   ├── login/page.tsx          # Admin login page
│   │   └── callback/route.ts       # OAuth callback
│   └── admin/
│       ├── layout.tsx              # Protected admin layout + sidebar
│       ├── dashboard/page.tsx      # Admin overview
│       ├── profile/page.tsx        # Edit personal info
│       ├── projects/page.tsx       # Manage projects (CRUD)
│       ├── skills/page.tsx         # Manage skills (CRUD)
│       ├── experience/page.tsx     # Manage work experience (CRUD)
│       ├── trainings/page.tsx      # Manage certifications (CRUD)
│       └── resume/page.tsx         # Generate & download PDF
├── components/
│   ├── portfolio/                  # Public portfolio sections
│   │   ├── Navigation.tsx          # Floating iOS nav bar
│   │   ├── Hero.tsx                # Animated hero with gradient orbs
│   │   ├── About.tsx               # Bio, stats, contact info
│   │   ├── Skills.tsx              # Filterable skill pills by category
│   │   ├── Experience.tsx          # Expandable timeline cards
│   │   ├── Projects.tsx            # Filterable project grid
│   │   ├── Trainings.tsx           # Provider-grouped certification list
│   │   ├── Contact.tsx             # Contact form + quick links
│   │   └── Footer.tsx              # Minimal footer
│   ├── admin/
│   │   └── Sidebar.tsx             # Collapsible admin sidebar (desktop + mobile)
│   └── resume/
│       ├── ResumePDF.tsx           # @react-pdf/renderer PDF document
│       └── ResumeDownloadButton.tsx # Client-side PDF generator + downloader
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   └── server.ts               # Server Supabase client (RSC)
│   └── defaultData.ts              # Fallback data (CV content hardcoded)
├── types/index.ts                  # TypeScript interfaces
├── middleware.ts                   # Auth guard for /admin routes
├── supabase/
│   ├── schema.sql                  # Database schema + RLS policies
│   └── seed.sql                    # Pre-populated CV data
├── README.md
└── SETUP.md                        # Step-by-step setup guide
```

---

## Pages

| URL | Description |
|---|---|
| `/` | Public portfolio (all sections) |
| `/auth/login` | Admin login |
| `/admin/dashboard` | Admin home |
| `/admin/profile` | Edit name, bio, contact |
| `/admin/projects` | Add/edit/delete projects |
| `/admin/skills` | Add/delete skills by category |
| `/admin/experience` | Add/edit/delete work history |
| `/admin/trainings` | Add/edit/delete certifications |
| `/admin/resume` | Preview stats + download PDF |

---

## Quick Start

See [SETUP.md](./SETUP.md) for the full step-by-step guide.

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in Supabase credentials
cp .env.local.example .env.local

# 3. Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## License

MIT — free to use for your own portfolio.
# SFR-Portfolio-08-2026
