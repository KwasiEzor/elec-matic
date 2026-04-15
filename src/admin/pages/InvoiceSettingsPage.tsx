import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useInvoiceStore } from '../../lib/invoiceStore';
import { PageHeader, Card, CardHeader, InputField, SaveButton, Toast } from '../components/FormUI';

export default function InvoiceSettingsPage() {
  const { settings, updateSettings } = useInvoiceStore();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(settings); }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'defaultVatRate' ? Number(value) : value }));
  };

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <Link to="/admin/invoices" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber transition-colors text-sm mb-4">
        <ArrowLeft className="w-4 h-4" /> Retour aux factures
      </Link>

      <PageHeader title="Paramètres de facturation" description="Configuration par défaut des factures">
        <SaveButton onClick={handleSave} saved={saved} />
      </PageHeader>

      <div className="space-y-6">
        <Card>
          <CardHeader title="Numérotation & Paiement" />
          <div className="grid sm:grid-cols-2 gap-5">
            <InputField label="Préfixe des factures" name="prefix" value={form.prefix} onChange={handleChange} placeholder="EM" />
            <InputField label="Taux TVA par défaut (%)" name="defaultVatRate" type="number" value={String(form.defaultVatRate)} onChange={handleChange} />
            <InputField label="Compte bancaire" name="bankAccount" value={form.bankAccount} onChange={handleChange} />
            <InputField label="Conditions de paiement" name="paymentTerms" value={form.paymentTerms} onChange={handleChange} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Notes par défaut" description="Texte ajouté en bas de chaque facture" />
          <InputField label="Notes" name="defaultNotes" value={form.defaultNotes} onChange={handleChange} rows={4} />
        </Card>

        <Card>
          <CardHeader title="Modèle d'email" description="Variables disponibles : {number}, {clientName}, {total}, {dueDate}, {bankAccount}" />
          <div className="space-y-5">
            <InputField label="Objet de l'email" name="emailSubjectTemplate" value={form.emailSubjectTemplate} onChange={handleChange} />
            <InputField label="Corps de l'email" name="emailBodyTemplate" value={form.emailBodyTemplate} onChange={handleChange} rows={10} />
          </div>
        </Card>
      </div>

      <AnimatePresence>{saved && <Toast message="Paramètres de facturation mis à jour" />}</AnimatePresence>
    </div>
  );
}
