import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, X, User, Mail, Phone, MapPin } from 'lucide-react';
import { useInvoiceStore, type InvoiceClient } from '../../lib/invoiceStore';
import { InputField, SaveButton, DeleteButton, Toast } from '../components/FormUI';

const emptyClient: InvoiceClient = { id: '', name: '', email: '', phone: '', address: '', city: '', postalCode: '', vatNumber: '' };

export default function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient } = useInvoiceStore();
  const [editing, setEditing] = useState<InvoiceClient | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const openNew = () => { setEditing({ ...emptyClient, id: `c-${Date.now()}` }); setIsNew(true); };
  const openEdit = (c: InvoiceClient) => { setEditing({ ...c }); setIsNew(false); };
  const close = () => { setEditing(null); setIsNew(false); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editing) return;
    setEditing({ ...editing, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!editing || !editing.name) return;
    if (isNew) addClient(editing); else updateClient(editing.id, editing);
    setToast('Client enregistré');
    setTimeout(() => setToast(null), 2500);
    close();
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer ce client ?')) deleteClient(id);
  };

  return (
    <div>
      <Link to="/admin/invoices" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber transition-colors text-sm mb-4">
        <ArrowLeft className="w-4 h-4" /> Retour aux factures
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Clients</h1>
          <p className="text-slate-400 text-sm mt-1">{clients.length} client{clients.length > 1 ? 's' : ''} enregistré{clients.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-amber/10 text-amber border border-amber/20 hover:bg-amber/20 transition-all">
          <Plus className="w-4 h-4" /> Nouveau client
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client, i) => (
          <motion.div key={client.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="group bg-[#0D1321] border border-white/5 rounded-2xl p-5 hover:border-amber/20 transition-all cursor-pointer"
            onClick={() => openEdit(client)}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center">
                <User className="w-5 h-5 text-amber" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); openEdit(client); }} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(client.id); }} className="p-1.5 rounded-lg bg-red-500/10 text-red-400"><X className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <h3 className="text-white font-bold text-sm mb-2">{client.name}</h3>
            <div className="space-y-1">
              {client.email && <div className="flex items-center gap-2 text-slate-500 text-xs"><Mail className="w-3 h-3" />{client.email}</div>}
              {client.phone && <div className="flex items-center gap-2 text-slate-500 text-xs"><Phone className="w-3 h-3" />{client.phone}</div>}
              {client.city && <div className="flex items-center gap-2 text-slate-500 text-xs"><MapPin className="w-3 h-3" />{client.postalCode} {client.city}</div>}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 pt-20 overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0D1321] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{isNew ? 'Nouveau client' : 'Modifier le client'}</h2>
                <button onClick={close} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <InputField label="Nom" name="name" value={editing.name} onChange={handleChange} required />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Email" name="email" type="email" value={editing.email} onChange={handleChange} />
                  <InputField label="Téléphone" name="phone" value={editing.phone} onChange={handleChange} />
                </div>
                <InputField label="Adresse" name="address" value={editing.address} onChange={handleChange} />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Code postal" name="postalCode" value={editing.postalCode} onChange={handleChange} />
                  <InputField label="Ville" name="city" value={editing.city} onChange={handleChange} />
                </div>
                <InputField label="N° TVA" name="vatNumber" value={editing.vatNumber} onChange={handleChange} />
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  {!isNew && <DeleteButton onClick={() => { handleDelete(editing.id); close(); }} />}
                  <div className="flex gap-3 ml-auto">
                    <button onClick={close} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 bg-white/5 hover:bg-white/10 transition-all">Annuler</button>
                    <SaveButton onClick={handleSave} saved={false} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{toast && <Toast message={toast} />}</AnimatePresence>
    </div>
  );
}
