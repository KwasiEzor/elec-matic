// Email service for sending invoices
// Uses local dev server in development, Firebase Functions in production

const DEV_API_URL = 'http://localhost:3001/api';
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
 */
export async function sendInvoiceEmail(params: SendInvoiceEmailParams): Promise<EmailResult> {
  try {
    if (!IS_DEV) {
      throw new Error('Email sending is only available in development mode. Configure Firebase Functions for production.');
    }

    const response = await fetch(`${DEV_API_URL}/send-invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: params.to,
        subject: params.subject,
        body: params.body,
        pdfData: params.pdfDataUrl,
        invoiceNumber: params.invoiceNumber,
        companyName: params.companyName,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send email');
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Test email server connection
 */
export async function testEmailServer(): Promise<boolean> {
  try {
    const response = await fetch(`${DEV_API_URL}/test`);
    const data = await response.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}
