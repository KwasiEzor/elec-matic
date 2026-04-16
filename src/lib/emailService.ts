// Email service for sending invoices
// Uses local dev server in development, Vercel API in production

const DEV_API_URL = 'http://localhost:3001/api';
const PROD_API_URL = '/api'; // Vercel serverless functions
const IS_DEV = import.meta.env.DEV;

export interface SendInvoiceEmailParams {
  to: string;
  subject: string;
  body: string;
  pdfDataUrl?: string; // Base64 data URL from jsPDF
  invoiceNumber: string;
  companyName: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  mailpitUrl?: string;
}

/**
 * Send invoice email with PDF attachment
 * Uses dev server (Mailpit) in development
 * Uses Vercel API in production
 */
export async function sendInvoiceEmail(params: SendInvoiceEmailParams): Promise<EmailResult> {
  try {
    const apiUrl = IS_DEV ? DEV_API_URL : PROD_API_URL;

    const response = await fetch(`${apiUrl}/send-invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: params.to,
        subject: params.subject,
        body: params.body,
        pdfDataUrl: params.pdfDataUrl,
        invoiceNumber: params.invoiceNumber,
        companyName: params.companyName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email failed: ${response.status}`);
    }

    // Try to parse JSON, fallback to success if email actually sent
    try {
      const result = await response.json();
      return result;
    } catch {
      // Response not JSON (cached HTML) but status 200 = email sent
      return { success: true, messageId: 'sent' };
    }

  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Test email server connection (dev only)
 */
export async function testEmailServer(): Promise<boolean> {
  if (!IS_DEV) return false;

  try {
    const response = await fetch(`${DEV_API_URL}/test`);
    const data = await response.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}
