import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Pencil, X, ImageIcon } from 'lucide-react';
import { useCMSStore } from '../../lib/cmsStore';
import type { Realisation } from '../../lib/cmsData';
import { PageHeader, InputField, SaveButton, DeleteButton, AddButton, Toast } from '../components/FormUI';

const empty: Realisation = { id: '', title: '', category: '', image: '', description: '', location: '' };

export default function RealisationsPage() {
  const { data, addRealisation, updateRealisation, deleteRealisation } = useCMSStore();
  const [editing, setEditing] = useState<Realisation | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saved, setSaved] = useState(false);

  const openNew = () => { setEditing({ ...empty, id: `r-${Date.now()}` }); setIsNew(true); };
  const openEdit = (r: Realisation) => { setEditing({ ...r }); setIsNew(false); };
  const close = () => { setEditing(null); setIsNew(false); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editing) return;
    setEditing({ ...editing, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!editing || !editing.title) return;
    if (isNew) addRealisation(editing); else updateRealisation(editing.id, editing);
    setSaved(true); setTimeout(() => setSaved(false), 2500); close();
  };

  const handleDelete = (id: string) => { if (confirm('Supprimer cette réalisation ?')) deleteRealisation(id); };

  return (
    <div>
      <PageHeader title="Réalisations" description={`${data.realisations.length} projets`}>
        <AddButton onClick={openNew} label="Nouvelle réalisation" />
      </PageHeader>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.realisations.map((real, i) => (
          <motion.div key={real.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="group bg-[#0D1321] border border-white/5 rounded-2xl overflow-hidden hover:border-amber/20 transition-all cursor-pointer"
            onClick={() => openEdit(real)}>
            <div className="aspect-video bg-white/5 relative overflow-hidden">
              {real.image ? <img src={real.image} alt={real.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-slate-700" /></div>}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); openEdit(real); }} className="p-1.5 rounded-lg bg-black/50 text-white backdrop-blur-sm"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(real.id); }} className="p-1.5 rounded-lg bg-red-500/50 text-white backdrop-blur-sm"><X className="w-3.5 h-3.5" /></button>
              </div>
              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-amber/20 text-amber text-[10px] font-semibold rounded-md backdrop-blur-sm">{real.category}</span>
            </div>
            <div className="p-4">
              <h3 className="text-white font-bold text-sm mb-1 line-clamp-1">{real.title}</h3>
              <div className="flex items-center gap-1 text-slate-500 text-xs"><MapPin className="w-3 h-3" />{real.location}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 pt-20 overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0D1321] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{isNew ? 'Nouvelle réalisation' : 'Modifier la réalisation'}</h2>
                <button onClick={close} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-5">
                <InputField label="Titre" name="title" value={editing.title} onChange={handleChange} required />
                <div className="grid sm:grid-cols-2 gap-5">
                  <InputField label="Catégorie" name="category" value={editing.category} onChange={handleChange} required placeholder="Rénovation, Sécurité..." />
                  <InputField label="Localité" name="location" value={editing.location} onChange={handleChange} required />
                </div>
                <InputField label="URL de l'image" name="image" value={editing.image} onChange={handleChange} placeholder="/images/realisation-x.jpg" />
                {editing.image && <img src={editing.image} alt="Aperçu" className="w-full h-40 object-cover rounded-xl border border-white/10" />}
                <InputField label="Description" name="description" value={editing.description} onChange={handleChange} rows={3} />
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
      <AnimatePresence>{saved && <Toast message="Réalisation enregistrée" />}</AnimatePresence>
    </div>
  );
}
