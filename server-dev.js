// Development email server for testing with Mailpit
// Run alongside Vite dev server: node server-dev.js

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Configure Mailpit SMTP transport
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false,
  auth: null, // Mailpit doesn't need auth
  tls: {
    rejectUnauthorized: false
  }
});

// Test email endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'Email server ready' });
});

// Send invoice email endpoint
app.post('/api/send-invoice', async (req, res) => {
  try {
    const { to, subject, body, pdfData, invoiceNumber, companyName } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, body'
      });
    }

    // Convert base64 PDF to buffer if provided
    let attachments = [];
    if (pdfData && invoiceNumber) {
      // Remove data URL prefix if present
      const base64Data = pdfData.replace(/^data:application\/pdf;base64,/, '');
      attachments.push({
        filename: `${invoiceNumber}.pdf`,
        content: Buffer.from(base64Data, 'base64'),
        contentType: 'application/pdf'
      });
    }

    // Send email via Mailpit
    const info = await transporter.sendMail({
      from: `"${companyName || 'Elec-Matic'}" <noreply@elec-matic.be>`,
      to,
      subject,
      text: body,
      html: `<pre style="font-family: monospace; white-space: pre-wrap;">${body}</pre>`,
      attachments
    });

    console.log('✅ Email sent to Mailpit:', info.messageId);
    console.log('📧 To:', to);
    console.log('📄 Subject:', subject);
    console.log('📎 Attachments:', attachments.length);
    console.log('🔗 View in Mailpit: http://localhost:8025');

    res.json({
      success: true,
      messageId: info.messageId,
      mailpitUrl: 'http://localhost:8025'
    });

  } catch (error) {
    console.error('❌ Email error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mailpit: 'localhost:1025',
    webUI: 'http://localhost:8025'
  });
});

app.listen(PORT, () => {
  console.log('\n🚀 Email Dev Server running');
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log('📬 Mailpit SMTP: localhost:1025');
  console.log('🌐 Mailpit Web UI: http://localhost:8025');
  console.log('\nReady to send invoice emails!\n');
});
