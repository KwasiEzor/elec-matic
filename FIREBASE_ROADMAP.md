# Production Roadmap — Firebase Edition

Transform demo into production-ready app with Firebase backend.

**Timeline:** 4-6 weeks | **Cost:** Free tier or $25-50/month

---

## Phase 1: Firebase Setup & Auth (Week 1)

### 1.1 Install Firebase

```bash
npm install firebase
npm install @tanstack/react-query
```

### 1.2 Firebase Project Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create new project: `elec-matic-prod`
3. Enable Google Analytics (optional)
4. Add web app, get config

### 1.3 Enable Services

**Authentication:**
- Enable Email/Password provider
- Enable Email verification (optional)

**Firestore Database:**
- Create database (start in test mode)
- Choose region: europe-west1 (Belgium)
- Deploy security rules later

**Storage:**
- Enable Firebase Storage
- Create folders: `realisations/`, `avatars/`, `company/`, `invoices/`

### 1.4 Environment Setup

`.env`:
```env
VITE_FIREBASE_API_KEY=AIzaSyXxx...
VITE_FIREBASE_AUTH_DOMAIN=elec-matic-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=elec-matic-prod
VITE_FIREBASE_STORAGE_BUCKET=elec-matic-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxx
```

Add to `.gitignore`:
```
.env
.env.local
.env.production
```

### 1.5 Firebase Client

`src/lib/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### 1.6 Replace Authentication

**Delete:** `src/lib/authStore.ts`

**Create:** `src/lib/auth.ts`

```typescript
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from './firebase';
import { useState, useEffect } from 'react';

export async function signIn(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    return {
      user: null,
      error: error.code === 'auth/invalid-credential'
        ? 'Email ou mot de passe incorrect'
        : error.message
    };
  }
}

export async function signUp(email: string, password: string, name: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    return { user: result.user, error: null };
  } catch (error: any) {
    return {
      user: null,
      error: error.code === 'auth/email-already-in-use'
        ? 'Cet email est déjà utilisé'
        : error.message
    };
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user
  };
}
```

**Update:** `src/admin/components/AuthGuard.tsx`

```typescript
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

**Update:** `src/admin/pages/LoginPage.tsx`

```typescript
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from '../../lib/auth';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    const { user, error: authError } = await signIn(data.email, data.password);

    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    const from = (location.state as any)?.from?.pathname || '/admin';
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center">Connexion Admin</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              {...register('password')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="text-center">
          <a href="/admin/register" className="text-sm text-blue-600 hover:text-blue-500">
            Créer un compte
          </a>
        </div>
      </div>
    </div>
  );
}
```

**Update:** `src/admin/pages/RegisterPage.tsx` (similar pattern)

**Time:** 2 days

---

## Phase 2: Firestore Data Layer (Week 1-2)

### 2.1 Install React Query

```bash
npm install @tanstack/react-query
```

**Setup:** `src/main.tsx`

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
```

### 2.2 Create Firestore Hooks

**Services:** `src/lib/hooks/useServices.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../auth';

export interface Service {
  id: string;
  userId: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  position: number;
  createdAt: any;
}

export function useServices() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['services', user?.uid],
    queryFn: async () => {
      const q = query(
        collection(db, 'services'),
        where('userId', '==', user!.uid),
        orderBy('position')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
    },
    enabled: !!user,
  });
}

export function usePublicServices() {
  return useQuery({
    queryKey: ['services-public'],
    queryFn: async () => {
      // For demo: get first user's services
      // In production: use custom domain/subdomain to identify user
      const q = query(collection(db, 'services'), orderBy('position'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
    },
  });
}

export function useAddService() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Omit<Service, 'id' | 'userId' | 'createdAt'>) => {
      const docRef = await addDoc(collection(db, 'services'), {
        ...service,
        userId: user!.uid,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Service> & { id: string }) => {
      const docRef = doc(db, 'services', id);
      await updateDoc(docRef, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, 'services', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}
```

**Repeat pattern for:**
- `useRealisations.ts`
- `useTestimonials.ts`
- `useFAQ.ts`
- `useClients.ts`
- `useInvoices.ts`

### 2.3 Deploy Security Rules

Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Public read
    match /services/{serviceId} {
      allow read: if true;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }

    match /realisations/{id} {
      allow read: if true;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }

    match /testimonials/{id} {
      allow read: if true;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }

    match /faq/{id} {
      allow read: if true;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }

    // Private data
    match /clients/{id} {
      allow read, write: if isOwner(resource.data.userId);
    }

    match /invoices/{id} {
      allow read, write: if isOwner(resource.data.userId);
    }

    match /invoice_settings/{userId} {
      allow read, write: if isOwner(userId);
    }

    match /site_settings/{userId} {
      allow read, write: if isOwner(userId);
    }
  }
}
```

**Time:** 4-5 days

---

## Phase 3: Email System (Week 2)

### 3.1 Setup Cloud Functions

```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

Choose:
- Language: TypeScript
- ESLint: Yes
- Install dependencies: Yes

### 3.2 Install Dependencies

```bash
cd functions
npm install resend
cd ..
```

### 3.3 Send Invoice Email Function

`functions/src/index.ts`:

```typescript
import * as functions from 'firebase-functions';
import { Resend } from 'resend';

const resend = new Resend(functions.config().resend.key);

export const sendInvoiceEmail = functions.https.onCall(async (data, context) => {
  // Verify authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Non authentifié');
  }

  const { to, subject, html, pdfUrl } = data;

  try {
    const result = await resend.emails.send({
      from: 'Elec-Matic <factures@elec-matic.be>',
      to,
      subject,
      html,
      attachments: pdfUrl ? [{
        filename: 'facture.pdf',
        path: pdfUrl,
      }] : [],
    });

    return { success: true, messageId: result.data?.id };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

export const sendContactEmail = functions.https.onCall(async (data) => {
  const { name, email, phone, message } = data;

  try {
    await resend.emails.send({
      from: 'Contact <contact@elec-matic.be>',
      to: 'admin@elec-matic.be',
      replyTo: email,
      subject: `Nouveau message de ${name}`,
      html: `
        <h2>Nouveau message contact</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return { success: true };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

### 3.4 Configure Resend Key

```bash
firebase functions:config:set resend.key="re_xxxx"
```

### 3.5 Deploy Functions

```bash
firebase deploy --only functions
```

### 3.6 Frontend Usage

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const sendInvoiceEmail = httpsCallable(functions, 'sendInvoiceEmail');

async function sendInvoice(invoice: Invoice) {
  const result = await sendInvoiceEmail({
    to: invoice.client.email,
    subject: `Facture ${invoice.number}`,
    html: generateEmailHTML(invoice),
    pdfUrl: await uploadPDF(invoice),
  });

  console.log('Email sent:', result.data);
}
```

**Time:** 2-3 days

---

## Phase 4: File Upload (Week 2-3)

### 4.1 Image Upload Component

`src/components/ImageUpload.tsx`:

```typescript
import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { useAuth } from '../lib/auth';

interface Props {
  folder: string;
  onUpload: (url: string) => void;
}

export function ImageUpload({ folder, onUpload }: Props) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      const ext = file.name.split('.').pop();
      const fileName = `${folder}/${user.uid}/${Date.now()}.${ext}`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      onUpload(url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        accept="image/*"
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {uploading && <p className="mt-2 text-sm text-gray-600">Upload en cours...</p>}
    </div>
  );
}
```

### 4.2 Storage Rules

Firebase Console → Storage → Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /realisations/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /company/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /invoices/{userId}/{fileName} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Time:** 1-2 days

---

## Phase 5: Performance & Monitoring (Week 3)

### 5.1 Setup Sentry

```bash
npm install @sentry/react
```

`src/main.tsx`:

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://xxx@sentry.io/xxx',
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});

// Wrap app
<Sentry.ErrorBoundary fallback={<ErrorPage />}>
  <App />
</Sentry.ErrorBoundary>
```

### 5.2 Firebase Analytics

Already included if enabled during setup. Track custom events:

```typescript
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics();

logEvent(analytics, 'invoice_sent', {
  invoice_id: invoice.id,
  amount: calcGrandTotal(invoice.items),
});
```

### 5.3 Code Splitting

```typescript
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));
```

**Time:** 2 days

---

## Phase 6: Testing & CI/CD (Week 4)

### 6.1 Testing

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Same as Supabase roadmap — write unit + integration tests.

### 6.2 GitHub Actions

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

### 6.3 Deploy to Firebase Hosting

```bash
firebase init hosting
```

Choose:
- Public directory: `dist`
- Single-page app: Yes
- GitHub integration: Yes (optional)

Deploy:
```bash
npm run build
firebase deploy --only hosting
```

Or use Vercel (already configured).

**Time:** 3-4 days

---

## Cost Breakdown

### Firebase Free Tier (Spark Plan)

| Service | Free Limit |
|---------|-----------|
| Authentication | 50K users |
| Firestore | 1GB storage, 50K reads/day, 20K writes/day |
| Storage | 5GB, 1GB download/day |
| Functions | 2M invocations/month |
| Hosting | 10GB storage, 360MB/day transfer |

**Perfect for small business — likely stays free forever.**

### Firebase Blaze Plan (Pay-as-you-go)

If outgrow free tier:
- Firestore: $0.18 per 100K reads
- Storage: $0.026/GB
- Functions: $0.40 per million invocations
- Hosting: $0.15/GB

**Estimated cost for medium traffic:** $10-30/month

### Additional Services

| Service | Cost |
|---------|------|
| Resend | Free (3K emails) or $20/mo (50K) |
| Sentry | Free (5K events) or $29/mo (50K) |
| Domain (.be) | €8/year |
| **Total** | **$10-80/month** |

---

## Migration from localStorage

### One-time Data Migration

`src/lib/migrate.ts`:

```typescript
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './auth';

export async function migrateLocalData() {
  const { user } = useAuth();
  if (!user) return;

  // Get localStorage data
  const cmsData = JSON.parse(localStorage.getItem('elecmatic-cms') || '{}');
  const invoiceData = JSON.parse(localStorage.getItem('elecmatic-invoices') || '{}');

  try {
    // Migrate services
    for (const service of cmsData.data?.services || []) {
      await addDoc(collection(db, 'services'), {
        ...service,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    }

    // Migrate other collections...

    // Clear localStorage after success
    localStorage.removeItem('elecmatic-cms');
    localStorage.removeItem('elecmatic-invoices');
    localStorage.removeItem('elecmatic-auth');

    alert('Migration réussie !');
  } catch (error) {
    console.error('Migration error:', error);
    alert('Erreur lors de la migration');
  }
}
```

Show migration button in admin on first login.

---

## Timeline

| Week | Focus | Deliverables |
|------|-------|--------------|
| 1 | Firebase setup + Auth | Auth working, Firestore connected |
| 2 | Data layer + Email | All CRUD working, emails sending |
| 3 | Files + Monitoring | Uploads working, Sentry tracking |
| 4 | Testing + Deploy | Tests passing, live on Firebase Hosting |

**Total: 4 weeks solo | 2-3 weeks with team**

---

## Next Steps

1. Create Firebase project
2. Install dependencies
3. Configure environment
4. Implement auth
5. Migrate data layer
6. Deploy functions
7. Test everything
8. Go live!

Ready to start? 🔥
