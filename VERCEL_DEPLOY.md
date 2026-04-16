# Vercel Deployment Guide

Deploy Elec-Matic to Vercel in minutes.

## 🚀 Quick Deploy

### Option 1: Deploy via Vercel CLI (Recommended)

**1. Install Vercel CLI:**
```bash
npm install -g vercel
```

**2. Login to Vercel:**
```bash
vercel login
```

**3. Deploy:**
```bash
vercel
```

Follow prompts:
- Link to existing project? **No**
- Project name: **elec-matic** (or your choice)
- Directory: **./** (press Enter)
- Override settings? **No** (uses vercel.json)

**4. Deploy to production:**
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

**1. Push to GitHub:**
```bash
git push origin main
```

**2. Go to Vercel Dashboard:**
- Visit: https://vercel.com
- Click "Add New" → "Project"
- Import your GitHub repository

**3. Configure:**
- **Framework Preset:** Vite
- **Root Directory:** ./
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

**4. Add Environment Variables** (see below)

**5. Click "Deploy"**

## 🔧 Environment Variables

**Required for Firebase:**

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Get values from:** Firebase Console → Project Settings → General

**Environment:** Select **Production, Preview, Development** (all three)

## ⚠️ Important: Email Functionality

**The dev email server (server-dev.js) will NOT work on Vercel!**

Vercel is a static hosting platform. The Node.js email server is for local development only.

**For production email sending, you need:**

### Option A: Firebase Cloud Functions (Recommended)

1. **Create Cloud Function:**
```javascript
// functions/src/sendInvoiceEmail.ts
import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

export const sendInvoiceEmail = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { to, subject, body, pdfDataUrl, invoiceNumber } = data;

  // Configure your production SMTP (SendGrid, Mailgun, etc.)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: functions.config().email.user,
      pass: functions.config().email.password,
    },
  });

  // Send email with PDF attachment
  await transporter.sendMail({
    from: 'noreply@elec-matic.be',
    to,
    subject,
    text: body,
    attachments: [{
      filename: `${invoiceNumber}.pdf`,
      content: pdfDataUrl.replace(/^data:application\/pdf;base64,/, ''),
      encoding: 'base64',
    }],
  });

  return { success: true };
});
```

2. **Deploy:**
```bash
firebase deploy --only functions
```

3. **Update emailService.ts:**
```typescript
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

export async function sendInvoiceEmail(params: SendInvoiceEmailParams) {
  const sendEmail = httpsCallable(functions, 'sendInvoiceEmail');
  const result = await sendEmail(params);
  return result.data;
}
```

### Option B: API Route (Vercel Serverless)

Create `api/send-invoice.ts` in root:
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ... email sending logic
}
```

Update `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 🔒 Security

**Before deploying:**

1. **Review .env file** - Ensure no secrets committed
2. **Check .gitignore** - Should include `.env`, `.env.local`
3. **Firebase Security Rules** - Deploy restrictive rules
4. **Firestore Rules** - See `NEXT_STEPS.md` for rules

**Deploy security rules:**
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

## 🌐 Custom Domain

**Add custom domain in Vercel:**

1. Go to: Project Settings → Domains
2. Add domain: `elec-matic.be`
3. Follow DNS configuration steps
4. Vercel handles SSL automatically

## 📊 Post-Deployment Checklist

- [ ] **Test authentication** - Login/Register works
- [ ] **Test Firebase** - Data loads from Firestore
- [ ] **Check console** - No errors in browser console (F12)
- [ ] **Test invoice PDF** - Generation works
- [ ] **Email sending** - Update to production method (Firebase Functions)
- [ ] **SEO** - meta tags correct
- [ ] **Performance** - Lighthouse score
- [ ] **Mobile** - Test on phone
- [ ] **Admin panel** - All CRUD operations work
- [ ] **Public site** - All sections display correctly

## 🐛 Troubleshooting

**Build fails:**
```bash
# Test locally first
npm run build
npm run preview
```

**Environment variables not working:**
- Must start with `VITE_` prefix
- Redeploy after adding variables
- Check spelling/typos

**Firebase not connecting:**
- Verify all Firebase env vars set
- Check Firebase console for auth/Firestore enabled
- Deploy Firebase security rules

**Routes return 404:**
- Check `vercel.json` rewrites present
- Clear Vercel cache: Settings → Clear Cache → Redeploy

**Email not sending:**
- Dev server doesn't work on Vercel
- Implement Firebase Functions or Vercel API route
- See "Email Functionality" section above

## 📈 Monitoring

**Vercel Analytics:**
- Enable in: Project Settings → Analytics
- Monitor: Speed, page views, errors

**Firebase Analytics:**
- Already configured in app
- View in: Firebase Console → Analytics

## 🔄 Continuous Deployment

**Auto-deploy on push:**

Vercel automatically deploys on:
- **Production:** Push to `main` branch
- **Preview:** Push to any other branch
- **PR:** Comments with preview URL

**Disable auto-deploy:**
- Project Settings → Git
- Uncheck "Production Branch"

## 💰 Pricing

**Vercel Free Tier includes:**
- ✅ Unlimited deployments
- ✅ SSL certificate
- ✅ 100 GB bandwidth/month
- ✅ Serverless functions (limited)
- ✅ Preview deployments

**Firebase Free Tier includes:**
- ✅ 10GB storage
- ✅ 50K reads/day
- ✅ 20K writes/day
- ✅ Auth (unlimited)

Should be sufficient for small business.

## 📚 Resources

- **Vercel Docs:** https://vercel.com/docs
- **Vite on Vercel:** https://vercel.com/docs/frameworks/vite
- **Firebase Functions:** https://firebase.google.com/docs/functions
- **Email setup:** See `FIREBASE_ROADMAP.md`

## 🚨 Production Readiness

**Current status:** ✅ Ready for deployment

**Working:**
- ✅ Authentication (Firebase)
- ✅ Frontend hosting
- ✅ PDF generation
- ✅ Admin panel
- ✅ Public site
- ✅ Firestore (partial)

**Needs implementation:**
- ⏳ Email sending (production)
- ⏳ Complete Firestore migration
- ⏳ Firebase security rules deployment
- ⏳ Error monitoring (optional)

**Quick deploy now, implement email later.**

Happy deploying! 🚀
