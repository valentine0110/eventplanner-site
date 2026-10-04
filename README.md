# Event Planer — Luxury Wedding & Event Planning Website

> A fully responsive, production-ready luxury wedding planner website built with React 19, Vite 7, Framer Motion, and Supabase. Features a dark editorial aesthetic, smooth page transitions, scroll animations, a live gallery, enquiry management, and a protected admin CMS.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Sections](#pages--sections)
- [Design System](#design-system)
- [Animations & Transitions](#animations--transitions)
- [Supabase Backend](#supabase-backend)
- [Admin CMS](#admin-cms)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [SEO & Performance](#seo--performance)
- [Accessibility](#accessibility)
- [Customisation Guide](#customisation-guide)

---

## Live Demo

**Website:** [https://event-site-e5c.pages.dev/](https://event-site-e5c.pages.dev/)

---

## Features

### 🎨 Frontend
- **Dark luxury editorial aesthetic** — ink (`#11100e`) and gold (`#b9935a`) palette with warm parchment backgrounds
- **Custom SPA router** — no React Router dependency; uses `history.pushState` + `popstate` for zero-overhead client-side navigation
- **Framer Motion page transitions** — `AnimatePresence` with `mode="wait"` fades and slides between all pages
- **Scroll-reveal animations** — every section animates into view via `motion.div whileInView`, hardware-accelerated and respects `prefers-reduced-motion`
- **Staggered mobile navigation** — clipPath curtain reveal with per-link stagger delay
- **Cinematic page heroes** — background images scale in on mount, with staggered title/copy entrance
- **Animated counters** — IntersectionObserver-triggered counting animations for proof stats
- **Mosaic gallery grid** — asymmetric CSS Grid layout with image zoom on hover
- **Filterable gallery** with lightbox — category filters, keyboard navigation (arrow keys + Escape), touch/swipe support, and focus trap
- **Auto-rotating testimonials** — 6-second interval carousel with manual prev/next controls
- **FAQ accordion** — CSS Grid `grid-template-rows` expand animation with rotating `+` icon
- **Scroll progress bar** — fixed gold gradient bar at the top of the viewport
- **Back-to-top button** — appears after 650px scroll, smooth scroll to top
- **WhatsApp floating button** — with pulse ring animation
- **Cookie consent banner** — localStorage-persisted, slide-up animation
- **Page loader** — full-screen animated brand intro on first load
- **Skip-to-content link** — keyboard accessibility
- **ErrorBoundary** — catches and displays runtime render errors gracefully

### 🗄️ Backend (Supabase)
- **Enquiry form submissions** — stored in Supabase `enquiries` table with full form fields
- **Live gallery** — images uploaded via Admin CMS are fetched from Supabase `gallery` table; falls back to static data if offline
- **Live testimonials** — managed from Admin CMS, fetched from Supabase `testimonials` table
- **Supabase Auth** — email/password authentication protecting the `/admin` route
- **Row Level Security** — RLS policies control public insert access and authenticated read/write

### 🔐 Admin CMS (`/admin`)
- **Protected login** — Supabase Auth email/password gate
- **Gallery management** — upload images to Supabase Storage, add title & category, delete entries
- **Testimonial management** — add, view, and delete client testimonials
- **Enquiry inbox** — view all contact form submissions with status management (New / Contacted / Booked / Closed)
- **Tabbed interface** — Gallery · Testimonials · Enquiries

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | 19.1.1 |
| Build Tool | Vite | 7.1.5 |
| Animations | Framer Motion | 14.x |
| Backend / DB | Supabase | 2.x |
| Icons | Lucide React | 1.48.x |
| Fonts | Google Fonts (Cormorant Garamond, DM Sans, Manrope) | — |
| Routing | Custom (`usePath` hook) | — |
| Styling | Vanilla CSS (3 files) | — |
| Deployment | Netlify / Cloudflare Pages | — |
| Language | JavaScript (JSX) | ES2022+ |

---

## Project Structure

```
event-planer-phone-responsive/
├── public/
│   └── _redirects              # Netlify SPA fallback redirect
├── src/
│   ├── main.jsx                # Root app — all pages, components, routing, animations
│   ├── Admin.jsx               # Protected admin CMS — gallery, testimonials, enquiries
│   ├── data.js                 # Static content — services, gallery, testimonials, FAQs, packages
│   ├── useData.js              # Custom hook — fetches live data from Supabase with static fallback
│   ├── supabaseClient.js       # Supabase client initialisation
│   ├── styles.css              # Core stylesheet — layout, components, responsive grid
│   ├── animations.css          # All motion & transitions — keyframes, hover effects, micro-interactions
│   └── polish.css              # Final polish layer — typography refinements, brand consistency
├── supabase/
│   └── setup.sql               # Full SQL schema — tables, RLS policies
├── index.html                  # Entry HTML — SEO meta, OG tags, font preloads, noscript
├── package.json
└── vite.config.js
```

---

## Pages & Sections

### `/` — Home
| Section | Description |
|---|---|
| **Hero** | Full-viewport dark hero with cinematic image, gradient overlay, orbit ring decoration, headline, CTA buttons, and scroll indicator |
| **Proof Strip** | 4-column animated counter strip — 500+ weddings, 41K+ Instagram, 7+ years, 24h response |
| **Introduction** | Brand story — editorial two-column layout with vertical text accent |
| **Services Grid** | 3-column service cards with hover image zoom, eyebrow, title, summary, and discover CTA |
| **Feature Banner** | Full-bleed destination weddings editorial banner with dark overlay |
| **Gallery Mosaic** | Asymmetric 6-tile mosaic preview linking to full gallery |
| **Testimonials** | Auto-rotating carousel with manual controls on dark background |
| **CTA** | Full-width dark call-to-action with decorative EP watermark |

### `/about` — About
| Section | Description |
|---|---|
| **Page Hero** | Animated hero with staggered entrance (image scale-in, meta, title, copy) |
| **Founder Story** | Two-column image + narrative with blockquote |
| **Values Grid** | 6-card grid — brand values with numbered entries |
| **Team** | 3-column team cards with monogram circles |
| **Timeline** | Dark section — 5-milestone vertical timeline with dot indicators |
| **CTA** | Shared CTA component |

### `/services` — Services
| Section | Description |
|---|---|
| **Page Hero** | Services page hero |
| **Service Detail List** | Full-page alternating 50/50 image + copy layout for all 6 services, each with: includes checklist, description, enquiry CTA |
| **Process** | 5-step process grid — Listen → Imagine → Plan → Execute → Celebrate |
| **FAQ** | Two-column accordion FAQ with animated expand |
| **CTA** | Shared CTA component |

### `/gallery` — Gallery
| Section | Description |
|---|---|
| **Filter Bar** | Category filter pills — All / Weddings / Décor / Receptions / Destination / Details |
| **Masonry Grid** | 12-column CSS Grid with variable span sizes and staggered reveal |
| **Lightbox** | Full-screen overlay with keyboard navigation, swipe support, and focus trap |
| **Instagram Strip** | Dark call-to-follow section |

### `/packages` — Packages
| Section | Description |
|---|---|
| **Page Hero** | Packages hero |
| **Package Cards** | 3-tier pricing — Blossom (₹1.5L+), Signature (₹4L+, featured), Limitless (Custom) |
| **Comparison Table** | Full feature comparison across all three tiers |
| **Add-ons Grid** | 8 popular add-on items with icons and starting prices |
| **CTA** | Shared CTA component |

### `/contact` — Contact
| Section | Description |
|---|---|
| **Page Hero** | Contact hero |
| **Enquiry Form** | Multi-field form — name, partner, phone, email, date, venue, service, guest count, budget, message, consent checkbox |
| **Contact Panel** | Dark side panel — location, phone, email, hours, WhatsApp & Instagram links |
| **Success State** | Animated success card on form submission |
| **Review Grid** | 3-column testimonial review cards |

### `/admin` — Admin CMS *(protected)*
- Email/password login via Supabase Auth
- **Gallery Tab** — upload image file + title + category → stores in Supabase Storage & DB; list with delete
- **Testimonials Tab** — add name + quote + type; list with delete
- **Enquiries Tab** — view all form submissions; update status per enquiry

---

## Design System

### Colour Palette

```css
--ink:       #11100e   /* Primary dark — nav, text, dark sections */
--ink-2:     #181613   /* Deeper dark — footer, loader */
--paper:     #f5f1e9   /* Warm parchment — main background */
--paper-2:   #fbf9f4   /* Lighter parchment — section alternates */
--gold:      #b9935a   /* Brand gold — accents, eyebrows, icons */
--gold-soft: #d5bc91   /* Muted gold — hero gradient, dark section em */
--muted:     #8b857c   /* Muted text */
--line:      rgba(17,16,14,.12)   /* Dividers on light */
--line-dark: rgba(245,241,233,.16) /* Dividers on dark */
```

### Typography

| Role | Font | Weights | Usage |
|---|---|---|---|
| `--display` | Cormorant Garamond | 300, 400, 500, 600, italic | Headlines, titles, display numbers |
| `--sans` | DM Sans | 300–700 | Body copy, paragraphs |
| `--ui` | Manrope | 400–700 | Labels, eyebrows, UI elements, buttons |

### Spacing & Layout
- **Container:** `min(calc(100% - 64px), 1400px)` — max 1400px wide with 32px side gutters
- **Sections:** `120px 0` vertical padding (80px on mobile, 60px on small)
- **Border Radius:** `2px` — intentionally minimal, editorial feel
- **Grid:** Primarily CSS Grid with 12-column gallery and asymmetric mosaic layouts

### Easing Tokens (CSS Custom Properties)
```css
--ease-spring:   cubic-bezier(0.16, 1, 0.3, 1)    /* Bouncy spring */
--ease-out:      cubic-bezier(0.2, 0.7, 0.2, 1)   /* Standard ease-out */
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1) /* Overshoot spring */
--ease-in-back:  cubic-bezier(0.36, 0, 0.66, -0.56) /* Pull back then go */
```

---

## Animations & Transitions

### Framer Motion
| Feature | Implementation |
|---|---|
| **Page transitions** | `AnimatePresence mode="wait"` + `motion.div` with `opacity` + `y` fade on route change |
| **Scroll reveals** | `Reveal` component using `motion.div whileInView` — triggers once per element as it enters viewport |
| **Mobile nav** | `clipPath: inset(0 0 100% 0)` curtain reveal with per-link `y` stagger |
| **Page hero** | Image `scale(1.08 → 1)` on mount; meta/title/copy staggered by 150–500ms |

### CSS Animations (`animations.css`)
- `@keyframes fadeUp` / `fadeDown` / `scaleIn` / `slideInLeft` / `slideInRight`
- `@keyframes shimmer` — button hover sheen sweep
- `@keyframes pulse` — WhatsApp floating button ring
- `@keyframes draw-line` — eyebrow accent line draw-in
- Hover lift on all cards (service, package, value, addon, team, review, process)
- Image zoom on gallery tiles, service cards, mosaic tiles
- Arrow diagonal slide on all link/button hover
- FAQ icon rotation on open

### Reduced Motion
All animations are disabled via `@media (prefers-reduced-motion: reduce)` — both the CSS `transition`/`animation` declarations and Framer Motion respects the OS preference automatically.

---

## Supabase Backend

### Tables

#### `enquiries`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key, auto-generated |
| `name` | TEXT | Client name (nullable) |
| `partner` | TEXT | Partner name (nullable) |
| `phone` | TEXT | **Required** |
| `email` | TEXT | |
| `date` | TEXT | Event date string |
| `venue` | TEXT | Venue / location |
| `service` | TEXT | Selected service |
| `guests` | TEXT | Guest count range |
| `budget` | TEXT | Budget range |
| `message` | TEXT | Free-text vision |
| `consent` | BOOLEAN | GDPR consent checkbox |
| `status` | TEXT | New / Contacted / Booked / Closed |
| `created_at` | TIMESTAMPTZ | Auto-set |

#### `gallery`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `src` | TEXT | Public image URL (Supabase Storage) |
| `title` | TEXT | Image caption |
| `category` | TEXT | wedding / decor / reception / destination / detail |
| `created_at` | TIMESTAMPTZ | Used for ordering |

#### `testimonials`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `quote` | TEXT | Testimonial text |
| `name` | TEXT | Couple / client name |
| `type` | TEXT | Wedding Couple / Destination Wedding / etc. |
| `created_at` | TIMESTAMPTZ | Used for ordering |

### Row Level Security (RLS)

```sql
-- Enquiries: anyone can insert (contact form), public can read
CREATE POLICY "Allow inserts for everyone" ON enquiries FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow reads"               ON enquiries FOR SELECT TO public USING (true);
CREATE POLICY "Allow updates"             ON enquiries FOR UPDATE TO public USING (true);
```

> ⚠️ **Note:** The current RLS policies are permissive (public read/write) to allow the admin panel to work without a server-side API. For production, tighten the SELECT and UPDATE policies to require Supabase Auth.

### `useData` Hook

The `useData` hook (`src/useData.js`) fetches live gallery and testimonials from Supabase on mount. If the fetch fails or returns empty results, it gracefully falls back to the static data defined in `src/data.js`. This means the site works even without a Supabase connection.

---

## Admin CMS

Navigate to **`/admin`** in the browser.

### Login
- Uses Supabase Auth (email + password)
- Create an admin user via your Supabase Dashboard → Authentication → Users → Invite User

### Gallery Tab
1. Select an image file from your device
2. Enter a title and choose a category
3. Click **Upload** — image is uploaded to Supabase Storage and a record is inserted into the `gallery` table
4. Live gallery on the site updates on next page load

### Testimonials Tab
1. Enter the couple name, quote, and type
2. Click **Save** — record is inserted into the `testimonials` table

### Enquiries Tab
- All contact form submissions appear here in reverse chronological order
- Use the status dropdown per enquiry to mark as: **New → Contacted → Booked → Closed**

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- A [Supabase](https://supabase.com) project (free tier is sufficient)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/event-planer.git
cd event-planer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set up the database

Copy the SQL from [`supabase/setup.sql`](./supabase/setup.sql) and run it in your **Supabase Dashboard → SQL Editor**.

### 5. Create an admin user

In your **Supabase Dashboard → Authentication → Users**, click **Invite User** and enter your email. Set a password via the email link received.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ Yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ Yes | Your Supabase anonymous (public) API key |

> Both variables must be prefixed with `VITE_` to be exposed to the browser by Vite.

> ⚠️ Never commit `.env.local` to version control. It is listed in `.gitignore`.

---

## Database Setup

Run the following in your Supabase SQL Editor (or use the file at `supabase/setup.sql`):

```sql
-- Enquiries table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT, partner TEXT, phone TEXT NOT NULL,
    email TEXT, date TEXT, venue TEXT, service TEXT,
    guests TEXT, budget TEXT, message TEXT,
    consent BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow inserts for everyone" ON public.enquiries
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow reads" ON public.enquiries
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow updates" ON public.enquiries
    FOR UPDATE TO public USING (true);
```

You will also need to create the **`gallery`** and **`testimonials`** tables via the Supabase Table Editor or your own SQL — minimum columns: `id` (UUID PK), `src` (text), `title` (text), `category` (text), `created_at` (timestamptz) for gallery; `id`, `quote`, `name`, `type`, `created_at` for testimonials.

For the gallery image upload to work, create a **Storage bucket** named `gallery-images` and set it to **public**.

---

## Scripts

```bash
npm run dev       # Start Vite dev server on http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview the production build locally
```

---

## Deployment

### Netlify (Recommended)

1. Push your repo to GitHub
2. Connect it to [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in **Site Settings → Environment Variables**
6. The `_redirects` file is already included to handle SPA client-side routing:
   ```
   /*  /index.html  200
   ```

### Cloudflare Pages

1. Connect your GitHub repo in the Cloudflare Pages dashboard
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Add environment variables in **Settings → Environment Variables**

### Vercel

```bash
npm install -g vercel
vercel --prod
```

Add env vars in the Vercel dashboard or via `vercel env add`.

---

## SEO & Performance

### Meta Tags (in `index.html`)
- `<title>`, `<meta description>`, `<meta keywords>`
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
- Twitter Card tags (`twitter:card`, `twitter:image`)
- Geo tags (`geo.region: IN-AS`, `geo.placename: Guwahati`)
- Canonical URL
- `robots: index, follow`

### Performance
- **Font preconnect** — `dns-prefetch` + `preconnect` for Google Fonts and Unsplash
- **Hero image preload** — `<link rel="preload" as="image">` for above-the-fold image
- **Lazy loading** — all images below the fold use `loading="lazy" decoding="async"`
- **`will-change: transform, opacity`** — applied to animated cards for GPU compositing
- **`contain: layout style paint`** — applied to service/package/testimonial cards
- **`content-visibility: auto`** — on footer and contact section
- **`font-display: swap`** — declared in `@font-face` fallbacks
- **Vite production build** — tree-shaking, minification, code splitting warning at 500KB

### JSON-LD Structured Data
A `LocalBusiness` schema is injected via a `<script type="application/ld+json">` tag in the `SEO` component, updating on each page navigation.

---

## Accessibility

- **Skip link** — `<a href="#main-content">Skip to content</a>` at the top of every page, visible on focus
- **ARIA roles** — `banner`, `navigation`, `contentinfo`, `dialog`, `tablist`, `tabpanel`
- **ARIA labels** — all icon buttons, lightbox controls, and gallery cards have descriptive `aria-label`
- **`aria-current="page"`** — applied to active nav links
- **`aria-expanded`** — on hamburger menu button and FAQ accordion buttons
- **`aria-hidden="true"`** — on decorative elements (orbit rings, hero watermark)
- **`aria-live="polite"`** — on testimonial carousel and cookie banner
- **Focus trap** — lightbox traps keyboard focus while open
- **Keyboard navigation** — gallery lightbox supports ArrowLeft, ArrowRight, Escape
- **Focus visible** — custom `2px solid var(--gold)` outline on all interactive elements
- **Colour contrast** — gold on dark and ink-on-paper combinations meet WCAG AA
- **`prefers-reduced-motion`** — all CSS transitions and Framer Motion animations disabled

---

## Customisation Guide

### Replacing Placeholder Text

All business-specific placeholders are in `src/data.js`:

```js
// src/data.js
export const site = {
  phone: '+1234567890',          // ← Your phone
  email: 'hello@example.com',    // ← Your email
  instagram: 'https://...',      // ← Your Instagram URL
  whatsapp: 'https://wa.me/...',  // ← Your WhatsApp link
  location: '[Your City, Country]', // ← Your location
};
```

Replace all `[City]`, `[Region]`, `[Year]`, `[Founders' Names]` placeholders across `data.js` and `main.jsx`.

### Changing Colours

Edit the CSS custom properties in `src/styles.css` (`:root` block):

```css
:root {
  --gold: #b9935a;       /* Your brand colour */
  --paper: #f5f1e9;      /* Background */
  --ink: #11100e;        /* Dark text / sections */
}
```

### Adding Services

Edit the `services` array in `src/data.js`. Each service entry:

```js
{
  number: '07',
  title: 'My New Service',
  eyebrow: 'Keywords · Keywords · Keywords',
  image: 'https://images.unsplash.com/...?w=1400&q=90',
  summary: 'One line summary shown on service cards.',
  description: 'Longer description paragraph.',
  detail: 'Additional detail paragraph.',
  includes: ['Feature 1', 'Feature 2', '...'],
}
```

### Adding Pages

1. Create a new page component (e.g. `const Blog = () => <main>...</main>`)
2. Add a route in the `App` function:
   ```jsx
   else if (current === '/blog') page = <Blog />;
   ```
3. Add it to `navItems` in `data.js`:
   ```js
   { label: 'Blog', path: '/blog' }
   ```

### Changing Fonts

Replace the Google Fonts import URL in `src/styles.css` and `index.html`, then update the CSS variables:

```css
--display: 'Your Serif Font', serif;
--sans: 'Your Body Font', sans-serif;
--ui: 'Your UI Font', sans-serif;
```

---

## Browser Support

| Browser | Support |
|---|---|
| Chrome / Edge | ✅ Full |
| Firefox | ✅ Full |
| Safari 15+ | ✅ Full |
| Safari < 15 | ⚠️ `dvh` units fallback to `vh` |
| Internet Explorer | ❌ Not supported |

---

## License

This project is proprietary and intended for personal or client use. Not licensed for redistribution or resale.

---

## Author

**Event Planer** — Luxury Weddings · Events · Experiences · Guwahati, Assam

Built with ❤️ using React, Vite, Framer Motion, and Supabase.
