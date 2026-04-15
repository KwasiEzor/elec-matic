# Development Guide

Quick guide for running and testing the Elec-Matic application locally.

## 🚀 Quick Start

**Run all services together:**

```bash
npm start
# or
npm run dev:all
```

This starts:
- 🌐 **Vite dev server** (http://localhost:5173) - Main app
- 📧 **Email dev server** (http://localhost:3001) - Invoice email sending

## 📦 Individual Services

**Frontend only:**
```bash
npm run dev
```
- App: http://localhost:5173
- Admin: http://localhost:5173/admin

**Email server only:**
```bash
npm run dev:email
```
- API: http://localhost:3001
- Health: http://localhost:3001/health

## ✅ Prerequisites

**Required:**
- Node.js 18+ (for fetch API)
- npm or yarn

**For email testing:**
- Mailpit running on localhost:1025

**Install Mailpit:**
```bash
# macOS
brew install mailpit
brew services start mailpit

# Linux/Windows - Download from:
# https://github.com/axllent/mailpit/releases

# Or run with Docker:
docker run -d -p 1025:1025 -p 8025:8025 axllent/mailpit
```

**Check Mailpit is running:**
```bash
curl http://localhost:8025
# Should return HTML
```

## 🧪 Testing

**Test email API:**
```bash
npm run test:email
```

Expected output:
```
✅ Health: { status: 'ok', ... }
✅ Test: { status: 'ok', ... }
✅ Send result: { success: true, ... }
🎉 SUCCESS! Email sent to Mailpit
```

**Manual test:**
1. Run `npm start`
2. Login to admin: http://localhost:5173/admin/login
3. Create/open invoice
4. Click "Envoyer" → "Envoyer la facture"
5. Check Mailpit UI: http://localhost:8025

## 🏗️ Build

**Production build:**
```bash
npm run build
```

Output: `dist/` folder

**Preview production build:**
```bash
npm run preview
```

## 🔧 Development Scripts

| Command | Description |
|---------|-------------|
| `npm start` | **Start all services** (Vite + Email server) |
| `npm run dev` | Start Vite dev server only |
| `npm run dev:email` | Start email dev server only |
| `npm run dev:all` | Same as `npm start` |
| `npm run test:email` | Test email API |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📂 Project Structure

```
elec-matic/
├── src/
│   ├── admin/           # Admin panel
│   │   ├── components/  # Admin UI components
│   │   └── pages/       # Admin pages
│   ├── components/      # Public site components
│   ├── lib/             # Utilities & stores
│   │   ├── emailService.ts  # Email API client
│   │   ├── invoicePdf.ts    # PDF generation
│   │   └── ...
│   └── pages/           # Public pages
├── server-dev.js        # Dev email server
├── test-email.js        # Email API test
└── ...
```

## 🌐 URLs

**Development:**
- App: http://localhost:5173
- Admin: http://localhost:5173/admin
- Email API: http://localhost:3001
- Mailpit UI: http://localhost:8025

**Default Credentials:**
- Email: `admin@elec-matic.be` (if using demo auth)
- Password: `Admin123!`
- Or use Firebase auth with registered account

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Find process using port
lsof -i :5173   # Vite
lsof -i :3001   # Email server

# Kill process
kill -9 <PID>
```

**Email not sending:**
1. Check email server running: `npm run dev:email`
2. Check Mailpit running: `curl http://localhost:8025`
3. Run test: `npm run test:email`
4. Check browser console (F12) for errors

**Vite not starting:**
```bash
# Clear cache
rm -rf node_modules/.vite
npm run dev
```

**Dependencies issues:**
```bash
# Reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🔥 Hot Reload

Both services support hot reload:
- **Vite:** Automatic HMR for React components
- **Email server:** Restart required for changes

**Restart email server:**
```bash
# Stop with Ctrl+C, then:
npm run dev:email
```

## 📝 Environment Variables

Create `.env` file (already in `.gitignore`):

```env
# Firebase config
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
# ... (see .env.example)

# App config
VITE_APP_ENV=development
```

## 🚢 Deployment

**Production checklist:**
- [ ] Update Firebase config in `.env`
- [ ] Build: `npm run build`
- [ ] Test build: `npm run preview`
- [ ] Deploy `dist/` folder
- [ ] Configure production email (Firebase Functions)

See `FIREBASE_ROADMAP.md` for production setup.

## 📚 More Info

- **Email testing:** See `EMAIL_TEST.md`
- **Firebase setup:** See `FIREBASE_SETUP.md`
- **Project docs:** See `CLAUDE.md`
- **Next steps:** See `NEXT_STEPS.md`

Happy coding! 🚀
