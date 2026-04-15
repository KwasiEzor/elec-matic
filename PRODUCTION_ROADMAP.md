# Production Readiness Roadmap — Elec-Matic

Comprehensive plan to transform demo into production-ready application.

## Executive Summary

**Current State:** Client-side demo with localStorage persistence
**Target State:** Full-stack production app with backend, database, security, monitoring

**Estimated Timeline:** 6-8 weeks (single developer) | 3-4 weeks (team of 2-3)
**Estimated Cost:** €150-300/month infrastructure + initial dev investment

---

## Critical Security Issues — MUST FIX

### 🔴 P0: Authentication System

**Current Problem:**
- Client-side auth with simple hash
- Passwords stored in localStorage
- No session management
- No protection against XSS/CSRF

**Solution: Implement Supabase Auth**

Why Supabase:
- Built-in auth (JWT-based)
- Row Level Security (RLS)
- Email verification
- Password reset
- Social login ready
- Free tier generous
- PostgreSQL database included

```bash
npm install @supabase/supabase-js
```

**Implementation Steps:**

1. Create Supabase project (5 min)
2. Replace `authStore.ts` with Supabase client
3. Migrate auth flows:
   - Login → `supabase.auth.signInWithPassword()`
   - Register → `supabase.auth.signUp()`
   - Logout → `supabase.auth.signOut()`
   - Session → `supabase.auth.getSession()`
4. Add AuthGuard with real session check
5. Implement password reset flow
6. Add email verification

**Time:** 1-2 days

---

### 🔴 P0: Data Persistence Backend

**Current Problem:**
- All data in localStorage
- No multi-device sync
- Data loss on cache clear
- No backup strategy

**Solution: Supabase Database + API**

**Database Schema:**

```sql
-- Users handled by Supabase Auth

-- Company/Site Settings
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  company JSONB NOT NULL,
  hero JSONB NOT NULL,
  seo JSONB NOT NULL,
  about JSONB NOT NULL,
  legal JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own settings" ON site_settings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON site_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  features JSONB DEFAULT '[]',
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own services" ON services
  USING (auth.uid() = user_id);

-- Realisations
CREATE TABLE realisations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE realisations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read realisations" ON realisations FOR SELECT USING (true);
CREATE POLICY "Users manage own realisations" ON realisations
  FOR ALL USING (auth.uid() = user_id);

-- Testimonials
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Users manage own testimonials" ON testimonials
  FOR ALL USING (auth.uid() = user_id);

-- FAQ
CREATE TABLE faq (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read faq" ON faq FOR SELECT USING (true);
CREATE POLICY "Users manage own faq" ON faq
  FOR ALL USING (auth.uid() = user_id);

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  vat_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own clients" ON clients
  USING (auth.uid() = user_id);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  client_id UUID REFERENCES clients NOT NULL,
  number TEXT NOT NULL UNIQUE,
  status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  items JSONB NOT NULL, -- Array of line items
  notes TEXT,
  payment_terms TEXT,
  bank_account TEXT,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own invoices" ON invoices
  USING (auth.uid() = user_id);

-- Invoice Email History
CREATE TABLE invoice_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE invoice_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own invoice emails" ON invoice_emails
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_emails.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

-- Invoice Settings
CREATE TABLE invoice_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  prefix TEXT NOT NULL DEFAULT 'FAC',
  next_number INTEGER NOT NULL DEFAULT 1,
  bank_account TEXT NOT NULL,
  payment_terms TEXT NOT NULL DEFAULT '30 jours',
  default_vat_rate NUMERIC NOT NULL DEFAULT 21,
  default_notes TEXT,
  email_subject_template TEXT NOT NULL,
  email_body_template TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE invoice_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own invoice settings" ON invoice_settings
  USING (auth.uid() = user_id);
```

**Migration Strategy:**

```typescript
// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// lib/migrate.ts
export async function migrateFromLocalStorage() {
  // Read existing localStorage data
  const cmsData = JSON.parse(localStorage.getItem('elecmatic-cms') || '{}');
  const invoiceData = JSON.parse(localStorage.getItem('elecmatic-invoices') || '{}');

  // Insert into Supabase
  // ... migration logic

  // Clear localStorage after successful migration
  localStorage.removeItem('elecmatic-cms');
  localStorage.removeItem('elecmatic-invoices');
}
```

**Replace Zustand stores with Supabase queries:**

```typescript
// Instead of useCMSStore
export function useServices() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .order('position')
      .then(({ data }) => setServices(data || []));
  }, []);

  return { services };
}

// Or use React Query for better caching
export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await supabase.from('services').select('*').order('position');
      return data;
    }
  });
}
```

**Time:** 3-5 days

---

## Phase 1: Backend Infrastructure (Week 1)

### 1.1 Environment Setup

Create `.env` file (add to `.gitignore`):

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx...

# Resend (email)
VITE_RESEND_API_KEY=re_xxxx...

# Sentry (monitoring)
VITE_SENTRY_DSN=https://xxxx@sentry.io/xxxx

# Environment
VITE_APP_ENV=production
```

Update `.gitignore`:
```
.env
.env.local
.env.production
```

### 1.2 Install Dependencies

```bash
# Core backend
npm install @supabase/supabase-js

# Query management
npm install @tanstack/react-query

# Email
npm install resend

# File upload
npm install @supabase/storage-js

# Error tracking
npm install @sentry/react

# Environment validation
npm install zod
npm install -D @types/node
```

### 1.3 Supabase Setup

1. Create project on [supabase.com](https://supabase.com)
2. Run database migrations (SQL schema above)
3. Configure Storage buckets:
   - `realisations` — public bucket for project images
   - `avatars` — public bucket for testimonial avatars
   - `company-assets` — public bucket for logos, etc.
4. Set up RLS policies
5. Get API keys

**Time:** 1 day

---

## Phase 2: Core Refactoring (Week 1-2)

### 2.1 Replace Authentication

**Files to modify:**
- `src/lib/authStore.ts` → Delete, replace with `src/lib/auth.ts`
- `src/admin/components/AuthGuard.tsx` → Use Supabase session
- `src/admin/pages/LoginPage.tsx` → Use Supabase auth
- `src/admin/pages/RegisterPage.tsx` → Use Supabase auth

**New auth implementation:**

```typescript
// lib/auth.ts
import { supabase } from './supabaseClient';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { user: data.user, error };
}

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });
  return { user: data.user, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading, user: session?.user };
}
```

**Updated AuthGuard:**

```typescript
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

**Time:** 2 days

### 2.2 Replace CMS Store

Create React Query hooks for each content type:

```typescript
// lib/hooks/useServices.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('position');
      if (error) throw error;
      return data;
    }
  });
}

export function useAddService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Omit<Service, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('services')
        .insert(service)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    }
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Service> & { id: string }) => {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    }
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    }
  });
}
```

Repeat for: realisations, testimonials, FAQ, clients, invoices.

**Time:** 3-4 days

### 2.3 File Upload System

**Image upload component:**

```typescript
// components/ImageUpload.tsx
export function ImageUpload({ bucket, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      alert('Erreur upload: ' + error.message);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
      onUpload(publicUrl);
    }

    setUploading(false);
  }

  return (
    <input
      type="file"
      onChange={handleUpload}
      disabled={uploading}
      accept="image/*"
    />
  );
}
```

**Time:** 1 day

---

## Phase 3: Email System (Week 2)

### 3.1 Setup Resend

[Resend](https://resend.com) — modern email API for developers
- Free tier: 3,000 emails/month
- Great deliverability
- Simple API

**Install:**
```bash
npm install resend
```

### 3.2 Implement Email Sending

Need serverless functions since email API keys can't be in frontend.

**Option A: Supabase Edge Functions** (Recommended)

```typescript
// supabase/functions/send-invoice-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'npm:resend';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  const { to, subject, html, pdfUrl } = await req.json();

  const { data, error } = await resend.emails.send({
    from: 'Elec-Matic <factures@elec-matic.be>',
    to,
    subject,
    html,
    attachments: pdfUrl ? [{
      filename: 'facture.pdf',
      path: pdfUrl
    }] : []
  });

  return new Response(JSON.stringify({ data, error }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

Deploy:
```bash
supabase functions deploy send-invoice-email --project-ref xxxxx
supabase secrets set RESEND_API_KEY=re_xxxx
```

**Frontend usage:**

```typescript
async function sendInvoiceEmail(invoice: Invoice) {
  const { data, error } = await supabase.functions.invoke('send-invoice-email', {
    body: {
      to: invoice.client.email,
      subject: `Facture ${invoice.number}`,
      html: generateEmailHTML(invoice),
      pdfUrl: await generateAndUploadPDF(invoice)
    }
  });

  if (!error) {
    await markInvoiceAsSent(invoice.id);
  }
}
```

### 3.3 Contact Form

Same pattern — Edge Function to send contact form emails.

**Time:** 2 days

---

## Phase 4: Invoice PDF Generation (Week 2)

Current PDF generation is client-side. Move to server for:
- Better fonts
- Watermarks
- Archive storage
- Email attachments

**Option: Server-side PDF with Puppeteer**

```typescript
// supabase/functions/generate-invoice-pdf/index.ts
import puppeteer from 'npm:puppeteer';

serve(async (req) => {
  const invoice = await req.json();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Generate HTML invoice
  const html = generateInvoiceHTML(invoice);
  await page.setContent(html);

  // Generate PDF
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true
  });

  await browser.close();

  // Upload to Supabase Storage
  const fileName = `invoices/${invoice.number}.pdf`;
  await supabase.storage.from('invoices').upload(fileName, pdf);

  const { data: { publicUrl } } = supabase.storage
    .from('invoices')
    .getPublicUrl(fileName);

  return new Response(JSON.stringify({ pdfUrl: publicUrl }));
});
```

**Alternative:** Keep client-side jsPDF (simpler, free tier friendly).

**Time:** 2 days (server) or 0 days (keep current)

---

## Phase 5: Performance & SEO (Week 3)

### 5.1 Image Optimization

```bash
npm install sharp
```

Use Supabase transforms or pre-process images:

```typescript
// Auto-resize on upload
const optimized = await sharp(file)
  .resize(1200, 900, { fit: 'inside' })
  .webp({ quality: 85 })
  .toBuffer();
```

### 5.2 Code Splitting

```typescript
// Lazy load admin panel
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));

// Route-based splitting
<Route path="/admin/*" element={
  <Suspense fallback={<Loading />}>
    <AuthGuard>
      <AdminLayout />
    </AuthGuard>
  </Suspense>
} />
```

### 5.3 SEO Enhancements

**Generate sitemap:**

```typescript
// scripts/generate-sitemap.ts
const pages = ['/', '/contact', '/faq', '/mentions-legales'];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
    <url>
      <loc>https://elec-matic.be${page}</loc>
      <changefreq>weekly</changefreq>
      <priority>${page === '/' ? '1.0' : '0.8'}</priority>
    </url>
  `).join('')}
</urlset>`;
fs.writeFileSync('public/sitemap.xml', sitemap);
```

**Add robots.txt:**

```
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://elec-matic.be/sitemap.xml
```

**Structured data:** Already present via `SchemaMarkup.tsx` — verify with Google Rich Results Test.

**Time:** 2 days

---

## Phase 6: Error Handling & Monitoring (Week 3)

### 6.1 Setup Sentry

```bash
npm install @sentry/react
```

```typescript
// main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});

// Wrap app
const root = createRoot(document.getElementById('root')!);
root.render(
  <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
    <App />
  </Sentry.ErrorBoundary>
);
```

### 6.2 Error Boundary Component

```typescript
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
        <p className="text-gray-600 mt-2">
          Nous avons été notifiés du problème.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
        >
          Recharger la page
        </button>
      </div>
    </div>
  );
}
```

### 6.3 API Error Handling

```typescript
// lib/apiClient.ts
export async function apiCall<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    // Log to Sentry
    Sentry.captureException(error);

    // User-friendly error
    const message = error instanceof Error
      ? error.message
      : 'Une erreur est survenue';

    toast.error(message);
    throw error;
  }
}

// Usage
const { mutate } = useMutation({
  mutationFn: (data) => apiCall(() =>
    supabase.from('services').insert(data)
  )
});
```

**Time:** 1 day

---

## Phase 7: Testing (Week 3-4)

### 7.1 Setup Testing Framework

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
});
```

### 7.2 Write Tests

**Unit tests:**
```typescript
// lib/invoiceStore.test.ts
describe('Invoice calculations', () => {
  it('calculates line total correctly', () => {
    const item = { quantity: 2, unitPrice: 100, vatRate: 21 };
    expect(calcLineTotal(item)).toBe(200);
  });

  it('calculates VAT correctly', () => {
    const item = { quantity: 2, unitPrice: 100, vatRate: 21 };
    expect(calcLineTax(item)).toBe(42);
  });
});
```

**Integration tests:**
```typescript
// admin/pages/ServicesPage.test.tsx
describe('ServicesPage', () => {
  it('displays services list', async () => {
    render(<ServicesPage />);
    await waitFor(() => {
      expect(screen.getByText('Installation électrique')).toBeInTheDocument();
    });
  });

  it('allows adding new service', async () => {
    render(<ServicesPage />);
    await userEvent.click(screen.getByText('Ajouter'));
    // ... test form
  });
});
```

**E2E with Playwright:**
```bash
npm install -D @playwright/test
```

```typescript
// e2e/invoice-flow.spec.ts
test('create and send invoice', async ({ page }) => {
  await page.goto('/admin/login');
  await page.fill('[name=email]', 'admin@elec-matic.be');
  await page.fill('[name=password]', 'Admin123!');
  await page.click('button[type=submit]');

  await page.goto('/admin/invoices/new');
  // ... complete invoice creation

  await page.click('text=Envoyer');
  await expect(page.locator('text=Facture envoyée')).toBeVisible();
});
```

Add to `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test"
  }
}
```

**Time:** 3-4 days

---

## Phase 8: CI/CD Pipeline (Week 4)

### 8.1 GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

### 8.2 Vercel Deployment

Already configured. Add environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SENTRY_DSN`

**Preview deployments:** Auto-generated for each PR.

**Production:** Auto-deploy on push to `main`.

**Time:** 1 day

---

## Phase 9: Legal & Compliance (Week 4)

### 9.1 GDPR Compliance

**Cookie consent:**

```bash
npm install react-cookie-consent
```

```typescript
<CookieConsent
  location="bottom"
  buttonText="J'accepte"
  declineButtonText="Refuser"
  enableDeclineButton
  cookieName="elecmatic-consent"
  expires={365}
>
  Ce site utilise des cookies pour améliorer votre expérience.
  <a href="/mentions-legales#cookies">En savoir plus</a>
</CookieConsent>
```

**Data export (GDPR Article 20):**

```typescript
// Admin panel: Export all user data as JSON
async function exportUserData() {
  const { data: services } = await supabase.from('services').select('*');
  const { data: invoices } = await supabase.from('invoices').select('*');
  // ... export all tables

  const json = JSON.stringify({ services, invoices, /* ... */ }, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mes-donnees.json';
  a.click();
}
```

**Account deletion:**

```typescript
async function deleteAccount() {
  // Delete all user data
  await supabase.from('services').delete().eq('user_id', userId);
  await supabase.from('invoices').delete().eq('user_id', userId);
  // ... delete all tables

  // Delete user account
  await supabase.auth.admin.deleteUser(userId);
}
```

### 9.2 Update Legal Pages

Update `mentions-legales` page with:
- Cookie policy
- Data processing details
- User rights (access, rectification, erasure)
- Contact: DPO email

**Time:** 1 day

---

## Phase 10: Polish & Launch (Week 4)

### 10.1 Analytics

```bash
npm install @vercel/analytics
```

```typescript
// main.tsx
import { Analytics } from '@vercel/analytics/react';

<App />
<Analytics />
```

Or use Plausible (privacy-friendly):
```html
<!-- index.html -->
<script defer data-domain="elec-matic.be" src="https://plausible.io/js/script.js"></script>
```

### 10.2 Performance Audit

```bash
npm install -D lighthouse
```

Run Lighthouse CI:
```bash
npx lighthouse https://elec-matic.be --output=html --output-path=./lighthouse-report.html
```

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### 10.3 Final Checklist

- [ ] All environment variables set in Vercel
- [ ] Database migrations run on production
- [ ] Email domain verified in Resend
- [ ] Sentry project configured
- [ ] Supabase RLS policies tested
- [ ] Backup strategy configured (Supabase daily backups)
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Robots.txt deployed
- [ ] Sitemap deployed
- [ ] Google Search Console verified
- [ ] Analytics tracking verified
- [ ] Test user account created
- [ ] Test invoice sent
- [ ] All forms validated
- [ ] Mobile responsiveness checked
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Legal pages updated
- [ ] Contact form tested
- [ ] 404 page styled
- [ ] Loading states added everywhere
- [ ] Error messages in French
- [ ] Success notifications added

**Time:** 2-3 days

---

## Cost Breakdown

### Monthly Infrastructure (Production)

| Service | Tier | Cost |
|---------|------|------|
| Supabase | Pro | $25/mo (2GB DB, 8GB bandwidth) |
| Vercel | Pro | $20/mo (100GB bandwidth, analytics) |
| Resend | Free → Paid | $0-20/mo (3k→50k emails) |
| Sentry | Developer | $29/mo (50k events) |
| Domain | .be | €8/year (~$1/mo) |
| **Total** | | **~$75-100/month** |

### Free Tier Option

| Service | Tier | Limits |
|---------|------|--------|
| Supabase | Free | 500MB DB, 2GB bandwidth, 1GB file storage |
| Vercel | Hobby | 100GB bandwidth |
| Resend | Free | 3,000 emails/month |
| Sentry | Free | 5k events/month |
| Domain | — | $10/year |
| **Total** | | **$10/year** |

**Recommendation:** Start with free tier, upgrade when needed.

---

## Timeline Summary

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Week 1 | 5 days | Supabase setup, auth migration, database schema |
| Week 2 | 5 days | Data layer refactor, email system, file uploads |
| Week 3 | 5 days | Performance, SEO, monitoring, testing setup |
| Week 4 | 5 days | CI/CD, compliance, polish, launch |
| **Total** | **4 weeks** | Production-ready application |

With 2-3 developers in parallel: **2-3 weeks**.

---

## Tech Stack Recommendations

### ✅ Keep (Good Choices)

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- React Hook Form + Zod
- Framer Motion
- Lucide React

### ✅ Add (Essential)

- Supabase (auth + database + storage)
- React Query (server state)
- Resend (email)
- Sentry (monitoring)

### 🔄 Replace

- Zustand → React Query (server state) + Zustand (client state only)
- localStorage → Supabase Database
- Client auth → Supabase Auth
- jsPDF client → Keep or move to Edge Functions

---

## Alternative: Supabase-Free Stack

If avoiding Supabase subscription:

**Backend Option 2: Firebase**
- Firebase Auth (free 50k users)
- Firestore (free 1GB storage)
- Firebase Storage (free 5GB)
- Firebase Functions (free 2M invocations)

**Backend Option 3: Appwrite**
- Self-hosted or cloud
- Similar to Supabase
- Free tier more generous

**Backend Option 4: PocketBase**
- Single binary Go backend
- Deploy on Railway/Fly.io for $5/mo
- Batteries included (auth, realtime, files)

---

## Post-Launch Roadmap

### Phase 11: Advanced Features (Month 2+)

- **Multi-user:** Team accounts, roles
- **Invoicing:** Recurring invoices, payment tracking, Stripe integration
- **CRM:** Client portal, quotes, project tracking
- **Mobile:** React Native app or PWA
- **Automation:** Reminder emails for overdue invoices
- **Reporting:** Revenue dashboard, client analytics
- **Integrations:** Accounting software (Odoo, Exact), Google Calendar
- **Localization:** Dutch version for Flanders clients

---

## Risk Mitigation

### Data Loss Prevention

1. **Supabase auto-backups:** Daily snapshots (7 days retention on Pro)
2. **Export script:** Weekly JSON export to S3
3. **Version control:** Database migrations in Git

### Security

1. **RLS policies:** Test thoroughly before launch
2. **Rate limiting:** Supabase built-in or Vercel Edge Config
3. **Input validation:** Zod schemas on all forms
4. **SQL injection:** Parameterized queries only (Supabase client handles)
5. **XSS:** React escapes by default, use DOMPurify for rich text if needed

### Performance

1. **Database indexes:** On all foreign keys and query columns
2. **Image CDN:** Supabase Storage has CDN
3. **Code splitting:** Lazy load admin panel
4. **Caching:** React Query caches API responses

---

## Support & Maintenance

Post-launch weekly tasks:
- Monitor Sentry for errors
- Check email deliverability
- Review analytics
- Database performance (Supabase metrics)
- Backup verification
- Security updates (`npm audit`)

**Estimated time:** 2-4 hours/week

---

## Questions Before Starting

1. **Budget:** Free tier or paid ($75-100/mo)?
2. **Timeline:** Solo or team? 4 weeks or faster?
3. **Multi-tenant:** Single business or SaaS for multiple electricians?
4. **Payments:** Stripe integration needed?
5. **Domain:** Buy `elec-matic.be` or different?
6. **Email:** Use `@elec-matic.be` or `@resend.dev`?

---

## Next Steps

Ready to start? Run:

```bash
# 1. Create Supabase project
# Visit supabase.com/dashboard

# 2. Install dependencies
npm install @supabase/supabase-js @tanstack/react-query resend @sentry/react

# 3. Create .env file
cp .env.example .env
# Fill in Supabase credentials

# 4. Start migration
npm run dev

# 5. Test locally before deployment
```

---

**This roadmap gets you from prototype to production-ready in 4 weeks.**

All critical issues fixed. Security solid. Scalable architecture. Professional deployment.

Questions? Ready to start Phase 1?
