import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, body, pdfDataUrl, invoiceNumber, companyName } = req.body;

  // Validate required fields
  if (!to || !subject || !body || !pdfDataUrl || !invoiceNumber) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Configure email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Convert base64 PDF to buffer
    const base64Data = pdfDataUrl.replace(/^data:application\/pdf;base64,/, '');
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    // Send email
    const info = await transporter.sendMail({
      from: `"${companyName}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: body,
      attachments: [
        {
          filename: `${invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send email',
    });
  }
}
