# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Elec-Matic** — website and CMS for electrician business in Charleroi, Belgium. Fully client-side SPA with admin panel for content management and invoicing.

**Primary Language:** French (French labels, content, and UI text throughout)

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | - |
| Framework | React | 19.2 |
| Language | TypeScript | ~5.9 |
| Build Tool | Vite | ^7.3 |
| Routing | React Router | ^7.13 |
| Styling | Tailwind CSS | v4 |
| State | Zustand | ^5.0 |
| Forms | React Hook Form + Zod | ^7.72 / ^4.3 |
| Animation | Framer Motion | ^12.35 |
| Icons | Lucide React | ^0.577 |
| PDF | jsPDF + jspdf-autotable | ^4.2 / ^5.0 |
| SEO | React Helmet Async | ^3.0 |

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Architecture

### State Management Pattern

All app state stored in browser localStorage via Zustand persist middleware. No backend.

**Store locations:**
- `src/lib/cmsStore.ts` — all site content (services, realisations, testimonials, FAQ, company info, SEO)
- `src/lib/authStore.ts` — authentication (users, passwords hashed with simple demo hash)
- `src/lib/invoiceStore.ts` — invoices and client data

**Key pattern:**
```typescript
export const useCMSStore = create<CMSState>()(
  persist(
    (set) => ({
      data: defaultData,
      lastSaved: null,
      updateCompany: (company) =>
        set((s) => ({
          data: { ...s.data, company: { ...s.data.company, ...company } },
          lastSaved: new Date().toISOString()
        })),
      // ... more actions
    }),
    { name: 'elecmatic-cms' } // localStorage key
  )
);
```

All data mutations update `lastSaved` timestamp.

### Routing Architecture

Two layouts:
1. **Public site** (`Layout.tsx`) — navbar, footer, public pages
2. **Admin panel** (`AdminLayout.tsx`) — sidebar navigation, protected routes

**Route structure:**
```
/ — public site
  /contact
  /faq
  /mentions-legales

/admin/login — auth (no guard)
/admin/register — auth (no guard)

/admin/* — protected by AuthGuard
  /admin (dashboard)
  /admin/company
  /admin/services
  /admin/realisations
  /admin/testimonials
  /admin/faq
  /admin/about
  /admin/seo
  /admin/legal
  /admin/invoices
  /admin/invoices/new
  /admin/invoices/:id
  /admin/invoices/:id/send
  /admin/invoices/clients
  /admin/invoices/settings
  /admin/settings
```

### Authentication Pattern

**Client-side only** — AuthGuard component checks `useAuthStore().isAuthenticated`.

Demo credentials stored in `authStore.ts`:
- Default admin: `admin@elec-matic.be` / `Admin123!`
- Password hashing: simple hash function (demo purposes, NOT production-ready)

**AuthGuard pattern:**
```typescript
// Redirects to /admin/login if not authenticated
// Wraps AdminLayout to protect all /admin/* routes
```

### Data Flow

1. Default data defined in `src/lib/cmsData.ts`
2. Zustand store initialized with defaults
3. Admin panel updates store via actions
4. Store persists to localStorage automatically
5. Public site reads from store via hooks
6. PDF generation reads store data and exports via jsPDF

### File Structure

```
src/
  admin/
    components/
      AdminLayout.tsx — sidebar, header for admin
      AuthGuard.tsx — route protection
      FormUI.tsx — reusable form components
    pages/
      [ContentType]Page.tsx — CRUD pages for each content type

  components/
    [Section].tsx — public site sections (Hero, Services, etc.)
    Layout.tsx — public site layout
    SchemaMarkup.tsx — SEO structured data

  lib/
    cmsStore.ts — content state
    authStore.ts — auth state
    invoiceStore.ts — invoice state
    cmsData.ts — default content
    invoicePdf.ts — PDF generation logic
    useSiteData.ts — convenience hook for reading CMS data

  pages/
    [Page]Page.tsx — public route pages
```

## Code Conventions

### TypeScript

All new code must use TypeScript with strict mode. Define interfaces for:
- Store state and actions
- Form data with Zod schemas
- Component props

### Forms

Always use React Hook Form + Zod validation:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Titre requis'),
  // ...
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
});
```

### French Language

All UI text, labels, validation messages, and content MUST be in French:

```typescript
// ✅ Correct
label: "Titre"
placeholder: "Entrez le titre"
error: "Le titre est requis"

// ❌ Wrong
label: "Title"
placeholder: "Enter title"
error: "Title is required"
```

### State Updates

Always create new objects/arrays (immutable updates):

```typescript
// ✅ Correct
set((s) => ({
  data: { ...s.data, services: [...s.data.services, newService] }
}))

// ❌ Wrong
set((s) => {
  s.data.services.push(newService);
  return s;
})
```

### Styling

Use Tailwind CSS v4. No custom CSS files except `index.css` for globals.

**Color scheme:**
- Primary: `#0A1628` (dark blue)
- Accent: Electric blue tones
- Text: Dark grays on white backgrounds

## Important Patterns

### Adding New Content Type

1. Define TypeScript interface in `cmsData.ts`
2. Add to `SiteData` interface
3. Add default data
4. Create store actions in `cmsStore.ts` (add, update, delete, reorder if needed)
5. Create admin page in `src/admin/pages/`
6. Add route in `App.tsx`
7. Add nav link in `AdminLayout.tsx`
8. Create public component in `src/components/` if displayed on public site

### PDF Generation

Invoice PDFs use `jsPDF` + `jspdf-autotable`. Pattern in `invoicePdf.ts`:
```typescript
const doc = new jsPDF();
doc.setFont('helvetica');
// ... add content
doc.save('facture.pdf');
```

### SEO

SEO managed via `react-helmet-async`:
- Meta tags set in each page component
- Structured data (JSON-LD) in `SchemaMarkup.tsx`
- Default SEO config in `cmsData.ts` → `seo` object

## Local Development

No backend required. All data in browser localStorage:
- `elecmatic-cms` — site content
- `elecmatic-auth` — users and auth state
- `elecmatic-invoices` — invoice data

**Reset data:** Clear localStorage keys or use "Réinitialiser" button in admin settings.

## Deployment

Configured for Vercel (`vercel.json` present). Static site export.

```bash
npm run build  # Creates dist/ folder
# Deploy dist/ to any static host
```

## Security Notes

⚠️ **Migration in Progress** — Currently migrating from localStorage to Firebase backend.

**Status:**
- ✅ Firebase Authentication implemented
- ✅ Login/Register pages using Firebase
- 🚧 Data layer migration in progress (localStorage → Firestore)
- 📋 Next: Migrate services, realisations, invoices to Firestore

**For complete production deployment:** See `FIREBASE_ROADMAP.md` — comprehensive 4-week plan with:
- Firebase backend (auth + Firestore + Storage)
- Real authentication with JWT sessions
- Cloud Functions for email
- Error monitoring (Sentry)
- CI/CD pipeline
- Full test coverage
- GDPR compliance
- Cost: **Free tier** (suitable for small business)
