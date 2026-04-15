import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Paperclip, CheckCircle, FileText, Mail } from 'lucide-react';
import { useInvoiceStore, calcGrandTotal, formatCurrency } from '../../lib/invoiceStore';
import { useCMSStore } from '../../lib/cmsStore';
import { generateInvoicePDF } from '../../lib/invoicePdf';
import { sendInvoiceEmail } from '../../lib/emailService';
import { Toast } from '../components/FormUI';

export default function InvoiceSendPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, markAsSent, settings } = useInvoiceStore();
  const companyData = useCMSStore((s) => s.data.company);
  const invoice = invoices.find((inv) => inv.id === id);

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [email, setEmail] = useState(invoice?.client.email || '');
  const [subject, setSubject] = useState(
    settings.emailSubjectTemplate
      .replace('{number}', invoice?.number || '')
  );
  const [body, setBody] = useState(
    settings.emailBodyTemplate
      .replace('{clientName}', invoice?.client.name || '')
      .replace('{number}', invoice?.number || '')
      .replace(/\{total\}/g, invoice ? formatCurrency(calcGrandTotal(invoice.items)).replace('\u00a0', ' ') : '')
      .replace('{dueDate}', invoice?.dueDate || '')
      .replace('{bankAccount}', invoice?.bankAccount || '')
  );

  if (!invoice) return <div className="text-center py-20 text-slate-400">Facture introuvable</div>;

  const total = calcGrandTotal(invoice.items);

  const handleSend = async () => {
    if (!email) {
      setToast('❌ Veuillez entrer une adresse email');
      return;
    }

    console.log('📤 Début envoi email...', {
      to: email,
      invoiceNumber: invoice.number,
      apiUrl: 'http://localhost:3001/api/send-invoice'
    });

    setSending(true);

    try {
      // Generate PDF
      console.log('📄 Génération PDF...');
      const pdf = generateInvoicePDF(invoice, companyData);

      // Get PDF as base64 data URL for email attachment
      console.log('🔄 Conversion PDF en base64...');
      const pdfDataUrl = pdf.output('dataurlstring');
      console.log('✅ PDF prêt, taille:', pdfDataUrl.length, 'caractères');

      // Send email with PDF attachment
      console.log('📧 Envoi email via API...');
      const result = await sendInvoiceEmail({
        to: email,
        subject,
        body,
        pdfDataUrl,
        invoiceNumber: invoice.number,
        companyName: companyData.name,
      });

      console.log('📬 Résultat API:', result);

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de l\'envoi');
      }

      // Also download PDF locally
      console.log('💾 Téléchargement PDF local...');
      pdf.save(`${invoice.number}.pdf`);

      // Mark invoice as sent
      console.log('✅ Marquage facture comme envoyée...');
      markAsSent(invoice.id, email);
      setSending(false);
      setSent(true);

      // Show success message with Mailpit link
      const message = import.meta.env.DEV
        ? `✅ Facture envoyée ! Consultez Mailpit: ${result.mailpitUrl || 'http://localhost:8025'}`
        : '✅ Facture envoyée avec succès !';

      console.log('🎉 Succès!', message);
      setToast(message);

      // Open Mailpit in new tab if in dev
      if (import.meta.env.DEV && result.mailpitUrl) {
        console.log('🌐 Ouverture Mailpit...');
        setTimeout(() => window.open(result.mailpitUrl, '_blank'), 500);
      }

      // Navigate back after 3 seconds
      setTimeout(() => navigate(`/admin/invoices/${invoice.id}`), 3000);

    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      setSending(false);

      let errorMessage = 'Erreur lors de l\'envoi';
      if (error instanceof Error) {
        errorMessage = error.message;

        // Specific error messages
        if (error.message.includes('Failed to fetch')) {
          errorMessage = '❌ Serveur email non accessible. Vérifiez que le serveur tourne: npm run dev:email';
        } else if (error.message.includes('NetworkError')) {
          errorMessage = '❌ Erreur réseau. Vérifiez votre connexion.';
        }
      }

      setToast(errorMessage);

      // Show error in console for debugging
      console.error('Détails erreur:', {
        error,
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  };

  return (
    <div>
      <Link to={`/admin/invoices/${invoice.id}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-amber transition-colors text-sm mb-4">
        <ArrowLeft className="w-4 h-4" /> Retour à la facture
      </Link>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Email form */}
        <div className="lg:col-span-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#0D1321] border border-white/5 rounded-2xl p-6 sm:p-8">

            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Facture envoyée !</h2>
                <p className="text-slate-400">La facture {invoice.number} a été envoyée à {email}</p>
                <p className="text-slate-500 text-sm mt-2">Le PDF a été téléchargé sur votre appareil.</p>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Envoyer la facture</h2>
                    <p className="text-slate-400 text-sm">Envoyez {invoice.number} par email</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Destinataire <span className="text-amber">*</span></label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:border-amber/40 outline-none" placeholder="client@email.be" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Objet</label>
                    <input value={subject} onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:border-amber/40 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:border-amber/40 outline-none resize-none font-mono leading-relaxed" />
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <Paperclip className="w-4 h-4 text-amber" />
                    <span className="text-slate-300 text-sm">{invoice.number}.pdf</span>
                    <span className="text-slate-600 text-xs ml-auto">Pièce jointe automatique</span>
                  </div>

                  <button onClick={handleSend} disabled={sending || !email}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-3">
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Send className="w-5 h-5" /> Envoyer la facture</>  
                    )}
                  </button>

                  <p className="text-slate-600 text-xs text-center">
                    Le PDF sera généré et téléchargé automatiquement. Vous pourrez l'envoyer manuellement par email si nécessaire.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Invoice summary */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-[#0D1321] border border-white/5 rounded-2xl p-5 sm:p-6 sticky top-24">
            <h3 className="text-white font-bold mb-4">Résumé</h3>
            <div className="space-y-3">
              {[{ label: 'Facture', value: invoice.number }, { label: 'Client', value: invoice.client.name }, { label: 'Email', value: invoice.client.email }, { label: 'Date', value: invoice.issueDate }, { label: 'Échéance', value: invoice.dueDate }].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-amber font-bold">Total TTC</span>
                <span className="text-2xl font-extrabold text-white">{formatCurrency(total)}</span>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-amber/5 border border-amber/10">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-amber mt-0.5 shrink-0" />
                <div className="text-xs text-slate-400">
                  <p className="font-medium text-amber mb-1">Paiement</p>
                  <p>Compte : {invoice.bankAccount}</p>
                  <p>Communication : {invoice.number}</p>
                  <p>Conditions : {invoice.paymentTerms}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>{toast && <Toast message={toast} />}</AnimatePresence>
    </div>
  );
}
