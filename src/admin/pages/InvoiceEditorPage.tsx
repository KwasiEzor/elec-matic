import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, X, Save, Download, Send, Eye, Trash2 } from 'lucide-react';
import { useInvoiceStore, type Invoice, type InvoiceLineItem, type InvoiceClient, calcLineTotal, calcSubtotal, calcTotalTax, calcGrandTotal, formatCurrency } from '../../lib/invoiceStore';
import { useCMSStore } from '../../lib/cmsStore';
import { generateInvoicePDF } from '../../lib/invoicePdf';
import { Toast } from '../components/FormUI';

const emptyLine: () => InvoiceLineItem = () => ({ id: `li-${Date.now()}-${Math.random().toString(36).slice(2)}`, description: '', quantity: 1, unitPrice: 0, vatRate: 21 });

export default function InvoiceEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, addInvoice, updateInvoice, clients, settings, getNextNumber } = useInvoiceStore();
  const companyData = useCMSStore((s) => s.data.company);
  const isNew = id === 'new';
  const existing = invoices.find((inv) => inv.id === id);

  const [invoice, setInvoice] = useState<Invoice>(() => {
    if (existing) return { ...existing, items: existing.items.map((i) => ({ ...i })) };
    return {
      id: `inv-${Date.now()}`,
      number: getNextNumber(),
      status: 'draft',
      client: { id: '', name: '', email: '', phone: '', address: '', city: '', postalCode: '', vatNumber: '' },
      items: [emptyLine()],
      notes: settings.defaultNotes,
      paymentTerms: settings.paymentTerms,
      bankAccount: settings.bankAccount,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      sentAt: null,
      paidAt: null,
      emailHistory: [],
    };
  });

  const [toast, setToast] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showClientPicker, setShowClientPicker] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const selectClient = (client: InvoiceClient) => {
    setInvoice((prev) => ({ ...prev, client: { ...client } }));
    setShowClientPicker(false);
  };

  const updateItem = (idx: number, field: keyof InvoiceLineItem, value: string | number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => i === idx ? { ...item, [field]: value } : item),
    }));
  };

  const addItem = () => setInvoice((prev) => ({ ...prev, items: [...prev.items, emptyLine()] }));
  const removeItem = (idx: number) => setInvoice((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));

  const handleSave = () => {
    if (isNew) addInvoice(invoice);
    else updateInvoice(invoice.id, invoice);
    showToast('Facture enregistrée');
    if (isNew) navigate(`/admin/invoices/${invoice.id}`, { replace: true });
  };

  const handlePreview = () => {
    const pdf = generateInvoicePDF(invoice, companyData);
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setShowPreview(true);
  };

  const handleDownload = () => {
    const pdf = generateInvoicePDF(invoice, companyData);
    pdf.save(`${invoice.number}.pdf`);
  };

  useEffect(() => {
    return () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); };
  }, [pdfUrl]);

  const subtotal = calcSubtotal(invoice.items);
  const totalTax = calcTotalTax(invoice.items);
  const grandTotal = calcGrandTotal(invoice.items);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <Link to="/admin/invoices" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber transition-colors text-sm mb-2">
            <ArrowLeft className="w-4 h-4" /> Retour aux factures
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isNew ? 'Nouvelle facture' : `Facture ${invoice.number}`}
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handlePreview} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all">
            <Eye className="w-4 h-4" /> Aperçu PDF
          </button>
          <button onClick={handleDownload} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" /> Télécharger
          </button>
          {!isNew && (
            <Link to={`/admin/invoices/${invoice.id}/send`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all">
              <Send className="w-4 h-4" /> Envoyer
            </Link>
          )}
          <button onClick={handleSave} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber to-amber-light text-[#0D1321] hover:shadow-lg hover:shadow-amber/20 transition-all">
            <Save className="w-4 h-4" /> Enregistrer
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client */}
          <div className="bg-[#0D1321] border border-white/5 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Client</h3>
              <button onClick={() => setShowClientPicker(true)} className="text-amber text-sm font-medium hover:text-amber-light transition-colors">Choisir un client</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[{ label: 'Nom', field: 'name' as const, required: true }, { label: 'Email', field: 'email' as const, required: true }, { label: 'Téléphone', field: 'phone' as const }, { label: 'Adresse', field: 'address' as const },
                { label: 'Code postal', field: 'postalCode' as const }, { label: 'Ville', field: 'city' as const }, { label: 'N° TVA', field: 'vatNumber' as const }].map((f) => (
                <div key={f.field}>
                  <label className="block text-xs font-medium text-slate-400 mb-1">{f.label}{f.required && <span className="text-amber"> *</span>}</label>
                  <input value={invoice.client[f.field]} onChange={(e) => setInvoice((prev) => ({ ...prev, client: { ...prev.client, [f.field]: e.target.value } }))}
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm focus:border-amber/40 outline-none" />
                </div>
              ))}
            </div>
          </div>

          {/* Line items */}
          <div className="bg-[#0D1321] border border-white/5 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Lignes de facturation</h3>
              <button onClick={addItem} className="inline-flex items-center gap-1 text-amber text-sm font-medium hover:text-amber-light"><Plus className="w-4 h-4" /> Ajouter</button>
            </div>

            {/* Header row - desktop */}
            <div className="hidden sm:grid grid-cols-12 gap-2 mb-2 px-1">
              <div className="col-span-5 text-xs font-medium text-slate-500">Description</div>
              <div className="col-span-2 text-xs font-medium text-slate-500 text-center">Qté</div>
              <div className="col-span-2 text-xs font-medium text-slate-500 text-right">Prix unit.</div>
              <div className="col-span-1 text-xs font-medium text-slate-500 text-center">TVA</div>
              <div className="col-span-1 text-xs font-medium text-slate-500 text-right">Total</div>
              <div className="col-span-1" />
            </div>

            <div className="space-y-2">
              {invoice.items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl bg-white/[0.02] border border-white/5">
                  <input value={item.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} placeholder="Description du service..."
                    className="col-span-12 sm:col-span-5 px-3 py-2 bg-transparent border border-white/10 rounded-lg text-white text-sm focus:border-amber/40 outline-none" />
                  <input type="number" min="0" step="1" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                    className="col-span-4 sm:col-span-2 px-3 py-2 bg-transparent border border-white/10 rounded-lg text-white text-sm text-center focus:border-amber/40 outline-none" />
                  <input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(idx, 'unitPrice', Number(e.target.value))}
                    className="col-span-4 sm:col-span-2 px-3 py-2 bg-transparent border border-white/10 rounded-lg text-white text-sm text-right focus:border-amber/40 outline-none" />
                  <select value={item.vatRate} onChange={(e) => updateItem(idx, 'vatRate', Number(e.target.value))}
                    className="col-span-3 sm:col-span-1 px-1 py-2 bg-transparent border border-white/10 rounded-lg text-white text-sm text-center focus:border-amber/40 outline-none appearance-none">
                    <option value="0" className="bg-[#0D1321]">0%</option>
                    <option value="6" className="bg-[#0D1321]">6%</option>
                    <option value="12" className="bg-[#0D1321]">12%</option>
                    <option value="21" className="bg-[#0D1321]">21%</option>
                  </select>
                  <div className="hidden sm:block col-span-1 text-right text-white text-sm font-medium">{formatCurrency(calcLineTotal(item))}</div>
                  <button onClick={() => removeItem(idx)} className="col-span-1 p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all justify-self-center">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-8 text-sm"><span className="text-slate-400">Sous-total HT</span><span className="text-white font-medium w-28 text-right">{formatCurrency(subtotal)}</span></div>
                <div className="flex items-center gap-8 text-sm"><span className="text-slate-400">TVA</span><span className="text-white font-medium w-28 text-right">{formatCurrency(totalTax)}</span></div>
                <div className="flex items-center gap-8 text-lg pt-2 border-t border-white/10"><span className="text-amber font-bold">Total TTC</span><span className="text-white font-extrabold w-28 text-right">{formatCurrency(grandTotal)}</span></div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-[#0D1321] border border-white/5 rounded-2xl p-5 sm:p-6">
            <h3 className="text-white font-bold mb-3">Notes</h3>
            <textarea value={invoice.notes} onChange={(e) => setInvoice((prev) => ({ ...prev, notes: e.target.value }))} rows={4}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:border-amber/40 outline-none resize-none" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Invoice details */}
          <div className="bg-[#0D1321] border border-white/5 rounded-2xl p-5 sm:p-6">
            <h3 className="text-white font-bold mb-4">Détails</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">N° de facture</label>
                <input value={invoice.number} onChange={(e) => setInvoice((prev) => ({ ...prev, number: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm focus:border-amber/40 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Date d'émission</label>
                <input type="date" value={invoice.issueDate} onChange={(e) => setInvoice((prev) => ({ ...prev, issueDate: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm focus:border-amber/40 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Date d'échéance</label>
                <input type="date" value={invoice.dueDate} onChange={(e) => setInvoice((prev) => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm focus:border-amber/40 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Statut</label>
                <select value={invoice.status} onChange={(e) => setInvoice((prev) => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm focus:border-amber/40 outline-none appearance-none">
                  <option value="draft" className="bg-[#0D1321]">Brouillon</option>
                  <option value="sent" className="bg-[#0D1321]">Envoyée</option>
                  <option value="paid" className="bg-[#0D1321]">Payée</option>
                  <option value="overdue" className="bg-[#0D1321]">En retard</option>
                  <option value="cancelled" className="bg-[#0D1321]">Annulée</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Conditions de paiement</label>
                <input value={invoice.paymentTerms} onChange={(e) => setInvoice((prev) => ({ ...prev, paymentTerms: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm focus:border-amber/40 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Compte bancaire</label>
                <input value={invoice.bankAccount} onChange={(e) => setInvoice((prev) => ({ ...prev, bankAccount: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm focus:border-amber/40 outline-none" />
              </div>
            </div>
          </div>

          {/* Summary card */}
          <div className="bg-gradient-to-br from-amber/10 to-amber/5 border border-amber/15 rounded-2xl p-5 sm:p-6">
            <div className="text-center">
              <div className="text-slate-400 text-sm mb-1">Montant total</div>
              <div className="text-3xl font-extrabold text-white">{formatCurrency(grandTotal)}</div>
              <div className="text-amber/60 text-xs mt-1">TVA incluse ({formatCurrency(totalTax)})</div>
            </div>
          </div>

          {/* Email history */}
          {invoice.emailHistory.length > 0 && (
            <div className="bg-[#0D1321] border border-white/5 rounded-2xl p-5 sm:p-6">
              <h3 className="text-white font-bold mb-3">Historique d'envoi</h3>
              <div className="space-y-2">
                {invoice.emailHistory.map((e, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <Send className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-slate-300">{e.to}</div>
                      <div className="text-slate-600">{new Date(e.date).toLocaleString('fr-BE')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Client picker modal */}
      <AnimatePresence>
        {showClientPicker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 pt-20 overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-[#0D1321] border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white">Sélectionner un client</h3>
                <button onClick={() => setShowClientPicker(false)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-2">
                {clients.map((c) => (
                  <button key={c.id} onClick={() => selectClient(c)}
                    className="w-full text-left p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-amber/20 hover:bg-white/[0.04] transition-all">
                    <div className="text-white font-semibold text-sm">{c.name}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{c.email} • {c.city}</div>
                  </button>
                ))}
                {clients.length === 0 && <p className="text-slate-500 text-sm text-center py-4">Aucun client enregistré</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Preview modal */}
      <AnimatePresence>
        {showPreview && pdfUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-4xl h-[85vh] bg-[#0D1321] border border-white/10 rounded-3xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <h3 className="text-white font-bold">Aperçu de la facture</h3>
                <div className="flex gap-2">
                  <button onClick={handleDownload} className="px-4 py-2 rounded-lg bg-amber/10 text-amber text-sm font-medium hover:bg-amber/20 transition-all"><Download className="w-4 h-4 inline mr-1" />Télécharger</button>
                  <button onClick={() => { setShowPreview(false); setPdfUrl(null); }} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
              </div>
              <iframe src={pdfUrl} className="flex-1 w-full bg-white" title="Aperçu facture" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{toast && <Toast message={toast} />}</AnimatePresence>
    </div>
  );
}
