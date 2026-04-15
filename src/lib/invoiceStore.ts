import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
}

export interface InvoiceClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  vatNumber: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  number: string;
  status: InvoiceStatus;
  client: InvoiceClient;
  items: InvoiceLineItem[];
  notes: string;
  paymentTerms: string;
  bankAccount: string;
  issueDate: string;
  dueDate: string;
  createdAt: string;
  sentAt: string | null;
  paidAt: string | null;
  emailHistory: { date: string; to: string; subject: string }[];
}

interface InvoiceState {
  invoices: Invoice[];
  clients: InvoiceClient[];
  nextNumber: number;
  settings: {
    prefix: string;
    bankAccount: string;
    paymentTerms: string;
    defaultVatRate: number;
    defaultNotes: string;
    emailSubjectTemplate: string;
    emailBodyTemplate: string;
  };
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  duplicateInvoice: (id: string) => Invoice;
  markAsSent: (id: string, email: string) => void;
  markAsPaid: (id: string) => void;
  addClient: (client: InvoiceClient) => void;
  updateClient: (id: string, data: Partial<InvoiceClient>) => void;
  deleteClient: (id: string) => void;
  updateSettings: (settings: Partial<InvoiceState['settings']>) => void;
  getNextNumber: () => string;
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      invoices: [],
      clients: [
        { id: 'c1', name: 'Marc Dupont', email: 'marc.dupont@email.be', phone: '0475 12 34 56', address: 'Rue de la Station 15', city: 'Charleroi', postalCode: '6000', vatNumber: '' },
        { id: 'c2', name: 'Sophie Laurent', email: 'sophie.l@email.be', phone: '0486 78 90 12', address: 'Avenue des Alliés 42', city: 'Montigny-le-Tilleul', postalCode: '6110', vatNumber: '' },
        { id: 'c3', name: 'Entreprise Dupont SPRL', email: 'info@dupont-sprl.be', phone: '071 32 45 67', address: 'Zoning Industriel 8', city: 'Fleurus', postalCode: '6220', vatNumber: 'BE 0456.789.012' },
      ],
      nextNumber: 1,
      settings: {
        prefix: 'EM',
        bankAccount: 'BE00 0000 0000 0000',
        paymentTerms: '30 jours',
        defaultVatRate: 21,
        defaultNotes: 'Merci pour votre confiance.\nPaiement attendu dans les 30 jours suivant la date de facturation.',
        emailSubjectTemplate: 'Facture {number} - Elec-Matic',
        emailBodyTemplate: 'Bonjour {clientName},\n\nVeuillez trouver ci-joint la facture {number} d\'un montant de {total} €.\n\nDate d\'échéance : {dueDate}\n\nCompte bancaire : {bankAccount}\nCommunication : {number}\n\nN\'hésitez pas à nous contacter pour toute question.\n\nCordialement,\nElec-Matic\n0488 32 21 42',
      },
      addInvoice: (invoice) => set((s) => ({ invoices: [invoice, ...s.invoices], nextNumber: s.nextNumber + 1 })),
      updateInvoice: (id, data) => set((s) => ({ invoices: s.invoices.map((inv) => inv.id === id ? { ...inv, ...data } : inv) })),
      deleteInvoice: (id) => set((s) => ({ invoices: s.invoices.filter((inv) => inv.id !== id) })),
      duplicateInvoice: (id) => {
        const { invoices, nextNumber, settings } = get();
        const orig = invoices.find((inv) => inv.id === id);
        if (!orig) throw new Error('Invoice not found');
        const num = `${settings.prefix}-${String(nextNumber).padStart(4, '0')}`;
        const dup: Invoice = {
          ...orig,
          id: `inv-${Date.now()}`,
          number: num,
          status: 'draft',
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          sentAt: null,
          paidAt: null,
          emailHistory: [],
        };
        set((s) => ({ invoices: [dup, ...s.invoices], nextNumber: s.nextNumber + 1 }));
        return dup;
      },
      markAsSent: (id, email) => set((s) => ({
        invoices: s.invoices.map((inv) => inv.id === id ? {
          ...inv,
          status: 'sent' as InvoiceStatus,
          sentAt: new Date().toISOString(),
          emailHistory: [...inv.emailHistory, { date: new Date().toISOString(), to: email, subject: `Facture ${inv.number}` }]
        } : inv)
      })),
      markAsPaid: (id) => set((s) => ({
        invoices: s.invoices.map((inv) => inv.id === id ? { ...inv, status: 'paid' as InvoiceStatus, paidAt: new Date().toISOString() } : inv)
      })),
      addClient: (client) => set((s) => ({ clients: [...s.clients, client] })),
      updateClient: (id, data) => set((s) => ({ clients: s.clients.map((c) => c.id === id ? { ...c, ...data } : c) })),
      deleteClient: (id) => set((s) => ({ clients: s.clients.filter((c) => c.id !== id) })),
      updateSettings: (settings) => set((s) => ({ settings: { ...s.settings, ...settings } })),
      getNextNumber: () => {
        const { nextNumber, settings } = get();
        return `${settings.prefix}-${String(nextNumber).padStart(4, '0')}`;
      },
    }),
    { name: 'elecmatic-invoices' }
  )
);

// Helpers
export function calcLineTotal(item: InvoiceLineItem): number {
  return item.quantity * item.unitPrice;
}

export function calcLineTax(item: InvoiceLineItem): number {
  return calcLineTotal(item) * (item.vatRate / 100);
}

export function calcSubtotal(items: InvoiceLineItem[]): number {
  return items.reduce((sum, item) => sum + calcLineTotal(item), 0);
}

export function calcTotalTax(items: InvoiceLineItem[]): number {
  return items.reduce((sum, item) => sum + calcLineTax(item), 0);
}

export function calcGrandTotal(items: InvoiceLineItem[]): number {
  return calcSubtotal(items) + calcTotalTax(items);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(amount);
}
