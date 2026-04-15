# Firebase Setup Guide — 15 Minutes

Get Firebase configured for Elec-Matic.

## Step 1: Create Firebase Project (3 min)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Add project" or "Create a project"
3. Project name: `elec-matic-prod` (or your choice)
4. Google Analytics: Enable (optional but recommended)
5. Analytics account: Default or create new
6. Click "Create project" — wait ~30 seconds

## Step 2: Add Web App (2 min)

1. In project overview → Click **Web icon** (`</>`)
2. App nickname: `Elec-Matic Web`
3. Firebase Hosting: **Check** (yes, set up)
4. Click "Register app"
5. **Copy the config object** — you'll need this next

Config looks like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXxx...",
  authDomain: "elec-matic-prod.firebaseapp.com",
  projectId: "elec-matic-prod",
  storageBucket: "elec-matic-prod.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxx"
};
```

## Step 3: Create .env File (1 min)

In project root, create `.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSyXxx...
VITE_FIREBASE_AUTH_DOMAIN=elec-matic-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=elec-matic-prod
VITE_FIREBASE_STORAGE_BUCKET=elec-matic-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxx
VITE_APP_ENV=development
```

**Replace with YOUR values from Step 2!**

## Step 4: Enable Authentication (2 min)

1. Firebase Console → **Authentication**
2. Click "Get started"
3. Sign-in method → **Email/Password**
4. Click "Email/Password" row
5. Enable **Email/Password** (top toggle)
6. Save

## Step 5: Create Firestore Database (3 min)

1. Firebase Console → **Firestore Database**
2. Click "Create database"
3. Location: `europe-west1` (Belgium) or closest
4. Security rules: Start in **test mode** (we'll secure later)
5. Click "Enable" — wait ~1 minute

## Step 6: Enable Storage (2 min)

1. Firebase Console → **Storage**
2. Click "Get started"
3. Security rules: Start in **test mode**
4. Location: Same as Firestore (`europe-west1`)
5. Click "Done"

## Step 7: Deploy Security Rules (2 min)

### Firestore Rules

Firebase Console → Firestore → **Rules** tab

Replace with:

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

    // Public read for public site data
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

    // Private data (owner only)
    match /clients/{id} {
      allow read, write: if isAuthenticated() && isOwner(resource.data.userId);
    }

    match /invoices/{id} {
      allow read, write: if isAuthenticated() && isOwner(resource.data.userId);
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

Click **Publish**.

### Storage Rules

Firebase Console → Storage → **Rules** tab

Replace with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Public images
    match /realisations/{userId}/{fileName} {
      allow read: if true;
      allow write: if isOwner(userId);
    }

    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if isOwner(userId);
    }

    match /company/{userId}/{fileName} {
      allow read: if true;
      allow write: if isOwner(userId);
    }

    // Private files
    match /invoices/{userId}/{fileName} {
      allow read, write: if isOwner(userId);
    }
  }
}
```

Click **Publish**.

---

## ✅ Firebase Setup Complete!

Now test:

```bash
npm run dev
```

Navigate to `http://localhost:5173/admin/register`

1. Create account (email + password)
2. Should redirect to `/admin`
3. If error about Firebase config → check `.env` file

---

## Troubleshooting

### "Firebase configuration manquante"

- Check `.env` file exists in project root
- Verify all `VITE_FIREBASE_*` variables set
- Restart dev server: `Ctrl+C` then `npm run dev`

### "auth/operation-not-allowed"

- Enable Email/Password in Firebase Console → Authentication → Sign-in method

### "Missing or insufficient permissions"

- Deploy Firestore security rules (Step 7)
- Wait 10 seconds for rules to propagate
- Refresh page

### "Firebase: Error (auth/invalid-api-key)"

- Wrong API key in `.env`
- Copy-paste from Firebase Console → Project Settings → General → Web apps

---

## Next Steps

✅ Firebase configured
✅ Auth working

**Next:** Implement data layer with Firestore

See `FIREBASE_ROADMAP.md` Phase 2 — Create hooks for Services, Realisations, etc.

Time: 2-3 hours to migrate all stores to Firestore.

---

## Useful Firebase Console Links

Once logged in:

- **Authentication users:** [console.firebase.google.com](https://console.firebase.google.com) → Authentication → Users
- **Firestore data:** → Firestore Database → Data
- **Storage files:** → Storage → Files
- **Usage stats:** → Usage and billing

---

Ready to build data layer? See `FIREBASE_ROADMAP.md` Phase 2!
