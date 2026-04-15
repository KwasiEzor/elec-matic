# Invoice Email Testing with Mailpit

Email functionality now integrated with Mailpit for local testing.

## ✅ Current Status

- **Email Dev Server:** Running on http://localhost:3001
- **Vite Dev Server:** Running on http://localhost:5173
- **Mailpit SMTP:** localhost:1025
- **Mailpit Web UI:** http://localhost:8025

## 🧪 How to Test Invoice Emails

### 1. Login to Admin Panel

Go to: http://localhost:5173/admin/login

Default credentials (if using demo auth):
- Email: `admin@elec-matic.be`
- Password: `Admin123!`

Or use Firebase auth with your registered account.

### 2. Create or Edit an Invoice

1. Navigate to **Factures** in admin sidebar
2. Create new invoice or open existing one
3. Fill in client details (including email address)
4. Add invoice items
5. Save invoice

### 3. Send Invoice via Email

1. Click **"Envoyer"** button on invoice detail page
2. You'll see the email sending form with:
   - **Destinataire:** Client email (pre-filled)
   - **Objet:** Email subject (customizable)
   - **Message:** Email body (customizable template)
   - **PDF attachment:** Automatically attached

3. Click **"Envoyer la facture"**

### 4. Check Email in Mailpit

1. Open Mailpit UI: http://localhost:8025
2. You should see the email appear immediately
3. Click to view:
   - ✉️ Email headers (From, To, Subject)
   - 📄 Email body (formatted text)
   - 📎 PDF attachment (click to download/view)

## 📧 Email Features

### What's Included

- **PDF Attachment:** Invoice PDF automatically generated and attached
- **Formatted Body:** Professional email template with invoice details
- **Custom Subject:** Configurable subject line with variables
- **Company Branding:** Emails sent from company name

### Email Template Variables

Available in email subject/body templates (configure in Invoice Settings):

- `{clientName}` - Client name
- `{number}` - Invoice number
- `{total}` - Invoice total amount
- `{dueDate}` - Payment due date
- `{bankAccount}` - Company bank account

Example template:
```
Bonjour {clientName},

Veuillez trouver ci-joint la facture {number} d'un montant de {total}.

Date d'échéance : {dueDate}
Compte bancaire : {bankAccount}

Cordialement,
Elec-Matic
```

## 🔧 Troubleshooting

### Email Server Not Running

```bash
npm run dev:email
```

### Mailpit Not Running

Check if Mailpit is installed and running:
```bash
curl http://localhost:8025
```

If not running, start Mailpit (installation varies by OS):
```bash
# macOS with Homebrew
brew services start mailpit

# Or run directly
mailpit
```

### CORS Errors

The dev server has CORS enabled. If you see CORS errors:
1. Check that email server is running on port 3001
2. Restart the email dev server
3. Clear browser cache

### Email Not Appearing

1. Check email server logs: `npm run dev:email`
2. Verify Mailpit is running: http://localhost:8025
3. Check browser console for errors
4. Verify SMTP port 1025 is not blocked

## 🚀 Production Setup

**Note:** Current implementation is for development/testing only.

For production, you need to:

1. **Firebase Cloud Functions**
   - Create email sending function
   - Configure SendGrid/Mailgun/etc.
   - Update `emailService.ts` to use production endpoint

2. **Security**
   - Never expose SMTP credentials in frontend
   - Use environment variables for API keys
   - Implement rate limiting

3. **Reliability**
   - Add retry logic for failed sends
   - Queue emails for batch processing
   - Log email delivery status

See `FIREBASE_ROADMAP.md` for production implementation plan.

## 📝 Testing Checklist

- [ ] Email server running (`npm run dev:email`)
- [ ] Mailpit running (http://localhost:8025)
- [ ] Login to admin panel
- [ ] Create test invoice with client email
- [ ] Send invoice via email
- [ ] Verify email received in Mailpit
- [ ] Check PDF attachment opens correctly
- [ ] Verify email body formatting
- [ ] Test with different email templates
- [ ] Test with special characters in invoice

## 🎯 Next Steps

1. ✅ **Email sending implemented** (Development)
2. ⏳ **Test thoroughly with Mailpit**
3. 📋 **Implement Firebase Cloud Function** (Production)
4. 📋 **Add email queue system**
5. 📋 **Implement delivery status tracking**

Happy testing! 📬
