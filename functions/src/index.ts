import {setGlobalOptions} from "firebase-functions/v2";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import * as nodemailer from "nodemailer";

// Define secrets for email credentials
const emailUser = defineSecret("EMAIL_USER");
const emailPassword = defineSecret("EMAIL_PASSWORD");

setGlobalOptions({maxInstances: 10});

interface SendInvoiceEmailData {
  to: string;
  subject: string;
  body: string;
  pdfDataUrl: string;
  invoiceNumber: string;
  companyName: string;
}

export const sendInvoiceEmail = onCall(
  {secrets: [emailUser, emailPassword]},
  async (request) => {
  // Verify authentication
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be logged in to send emails");
  }

  const data = request.data as SendInvoiceEmailData;
  const {to, subject, body, pdfDataUrl, invoiceNumber, companyName} = data;

  // Validate required fields
  if (!to || !subject || !body || !pdfDataUrl || !invoiceNumber) {
    throw new HttpsError("invalid-argument", "Missing required fields");
  }

  try {
    // Configure email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser.value(),
        pass: emailPassword.value(),
      },
    });

    // Convert base64 PDF to buffer
    const base64Data = pdfDataUrl.replace(/^data:application\/pdf;base64,/, "");
    const pdfBuffer = Buffer.from(base64Data, "base64");

    // Send email with PDF attachment
    const info = await transporter.sendMail({
      from: `"${companyName}" <${emailUser.value()}>`,
      to,
      subject,
      text: body,
      attachments: [
        {
          filename: `${invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    logger.info("Email sent successfully", {
      messageId: info.messageId,
      to,
      invoiceNumber,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    logger.error("Failed to send email", {error, to, invoiceNumber});
    throw new HttpsError("internal", "Failed to send email");
  }
});
