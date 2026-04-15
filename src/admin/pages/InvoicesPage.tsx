import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Plus, Search, FileText, Send, CheckCircle, Clock, XCircle,
  MoreHorizontal, Eye, Copy, Trash2, Download, Filter, ArrowUpRight
} from 'lucide-react';
import { useInvoiceStore, formatCurrency, calcGrandTotal, type InvoiceStatus } from '../../lib/invoiceStore';
import { PageHeader, Toast } from '../components/FormUI';

const statusConfig: Record<InvoiceStatus, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: 'Brouillon', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: FileText },
  sent: { label: 'Envoyée', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Send },
  paid: { label: 'Payée', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle },
  overdue: { label: 'En retard', color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: Clock },
  cancelled: { label: 'Annulée', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20', icon: XCircle },
};

export default function InvoicesPage() {
  const { invoices, deleteInvoice, duplicateInvoice, markAsPaid } = useInvoiceStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'all'>('all');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = invoices
    .filter((inv) => filterStatus === 'all' || inv.status === filterStatus)
    .filter((inv) => {
      const q = search.toLowerCase();
      return inv.number.toLowerCase().includes(q) || inv.client.name.toLowerCase().includes(q) || inv.client.email.toLowerCase().includes(q);
    });

  const totalRevenue = invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + calcGrandTotal(i.items), 0);
  const totalPending = invoices.filter((i) => i.status === 'sent').reduce((sum, i) => sum + calcGrandTotal(i.items), 0);
  const totalDraft = invoices.filter((i) => i.status === 'draft').length;

  // Get recently sent invoices (last 24 hours)
  const recentlySent = invoices
    .filter(i => i.sentAt && new Date(i.sentAt).getTime() > Date.now() - 24 * 60 * 60 * 1000)
    .sort((a, b) => new Date(b.sentAt!).getTime() - new Date(a.sentAt!).getTime())
    .slice(0, 3);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const handleDuplicate = (id: string) => {
    duplicateInvoice(id);
    setMenuOpen(null);
    showToast('Facture dupliquée');
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer cette facture ?')) { deleteInvoice(id); setMenuOpen(null); }
  };

  const handleMarkPaid = (id: string) => {
    markAsPaid(id);
    setMenuOpen(null);
    showToast('Facture marquée comme payée');
  };

  return (
    <div>
      <PageHeader title="Factures" description={`${invoices.length} facture${invoices.length > 1 ? 's' : ''}`}>
        <Link to="/admin/invoices/settings" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white transition-all">
          Paramètres
        </Link>
        <Link to="/admin/invoices/clients" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white transition-all">
          Clients
        </Link>
        <Link to="/admin/invoices/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber to-amber-light text-[#0D1321] hover:shadow-lg hover:shadow-amber/20 transition-all">
          <Plus className="w-4 h-4" /> Nouvelle facture
        </Link>
      </PageHeader>

      {/* Recently Sent Banner */}
      {recentlySent.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Send className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-blue-400 font-semibold text-sm mb-2">
                📬 Récemment envoyées ({recentlySent.length})
              </h3>
              <div className="space-y-1.5">
                {recentlySent.map(inv => (
                  <div key={inv.id} className="flex items-center justify-between text-sm">
                    <Link
                      to={`/admin/invoices/${inv.id}`}
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      <span className="font-medium">{inv.number}</span>
                      <span className="text-slate-500 mx-2">→</span>
                      <span>{inv.client.name}</span>
                    </Link>
                    <span className="text-slate-500 text-xs">
                      {new Date(inv.sentAt!).toLocaleString('fr-BE', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Revenus (payées)', value: formatCurrency(totalRevenue), color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20', textColor: 'text-emerald-400' },
          { label: 'En attente', value: formatCurrency(totalPending), color: 'from-blue-500/20 to-blue-500/5 border-blue-500/20', textColor: 'text-blue-400' },
          { label: 'Brouillons', value: String(totalDraft), color: 'from-slate-500/20 to-slate-500/5 border-slate-500/20', textColor: 'text-slate-400' },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} border`}>
            <div className={`text-2xl font-extrabold ${stat.textColor}`}>{stat.value}</div>
            <div className="text-slate-400 text-sm mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par n°, client, email..."
            className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm placeholder-slate-600 focus:border-amber/40 outline-none" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['all', 'draft', 'sent', 'paid', 'overdue', 'cancelled'] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filterStatus === s ? 'bg-amber/10 text-amber border border-amber/20' : 'bg-white/5 text-slate-400 border border-white/5 hover:text-white'
              }`}>
              {s === 'all' ? 'Toutes' : statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">Aucune facture trouvée</p>
          <p className="text-slate-600 text-sm mt-1">Créez votre première facture pour commencer</p>
          <Link to="/admin/invoices/new" className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl text-sm font-bold bg-amber/10 text-amber border border-amber/20 hover:bg-amber/20 transition-all">
            <Plus className="w-4 h-4" /> Créer une facture
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {filtered.map((inv, i) => {
            const sc = statusConfig[inv.status];
            const StatusIcon = sc.icon;
            const total = calcGrandTotal(inv.items);
            return (
              <motion.div key={inv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                className="group bg-[#0D1321] border border-white/5 rounded-xl p-4 sm:p-5 hover:border-amber/15 transition-all">
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex w-10 h-10 rounded-xl bg-amber/10 items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-amber" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Link to={`/admin/invoices/${inv.id}`} className="text-white font-bold text-sm hover:text-amber transition-colors">{inv.number}</Link>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${sc.color}`}>
                        <StatusIcon className="w-3 h-3" />{sc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-xs">
                      <span className="font-medium text-slate-300">{inv.client.name}</span>
                      <span>{inv.issueDate}</span>
                      {inv.dueDate && <span>Éch. {inv.dueDate}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-sm">{formatCurrency(total)}</div>
                    <div className="text-slate-600 text-xs">{inv.items.length} ligne{inv.items.length > 1 ? 's' : ''}</div>
                  </div>
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === inv.id ? null : inv.id)}
                      className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {menuOpen === inv.id && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute right-0 top-10 z-20 w-48 bg-[#131B2E] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                          <Link to={`/admin/invoices/${inv.id}`} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                            <Eye className="w-4 h-4" /> Voir / Modifier
                          </Link>
                          <Link to={`/admin/invoices/${inv.id}/send`} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                            <Send className="w-4 h-4" /> Envoyer par email
                          </Link>
                          {inv.status !== 'paid' && (
                            <button onClick={() => handleMarkPaid(inv.id)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                              <CheckCircle className="w-4 h-4" /> Marquer payée
                            </button>
                          )}
                          <button onClick={() => handleDuplicate(inv.id)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                            <Copy className="w-4 h-4" /> Dupliquer
                          </button>
                          <button onClick={() => handleDelete(inv.id)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                            <Trash2 className="w-4 h-4" /> Supprimer
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>{toast && <Toast message={toast} />}</AnimatePresence>
    </div>
  );
}
