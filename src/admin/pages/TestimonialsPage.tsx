import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Pencil, X } from 'lucide-react';
import { useCMSStore } from '../../lib/cmsStore';
import type { Testimonial } from '../../lib/cmsData';
import { PageHeader, InputField, SaveButton, DeleteButton, AddButton, Toast } from '../components/FormUI';

const empty: Testimonial = { id: '', name: '', location: '', rating: 5, text: '', service: '', date: '' };

export default function TestimonialsPage() {
  const { data, addTestimonial, updateTestimonial, deleteTestimonial } = useCMSStore();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saved, setSaved] = useState(false);

  const openNew = () => { setEditing({ ...empty, id: `t-${Date.now()}` }); setIsNew(true); };
  const openEdit = (t: Testimonial) => { setEditing({ ...t }); setIsNew(false); };
  const close = () => { setEditing(null); setIsNew(false); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editing) return;
    setEditing({ ...editing, [e.target.name]: e.target.name === 'rating' ? Number(e.target.value) : e.target.value });
  };

  const handleSave = () => {
    if (!editing || !editing.name || !editing.text) return;
    if (isNew) addTestimonial(editing); else updateTestimonial(editing.id, editing);
    setSaved(true); setTimeout(() => setSaved(false), 2500); close();
  };

  const handleDelete = (id: string) => { if (confirm('Supprimer ce témoignage ?')) deleteTestimonial(id); };

  return (
    <div>
      <PageHeader title="Témoignages" description={`${data.testimonials.length} avis clients`}>
        <AddButton onClick={openNew} label="Nouveau témoignage" />
      </PageHeader>

      <div className="space-y-3">
        {data.testimonials.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="group bg-[#0D1321] border border-white/5 rounded-2xl p-5 hover:border-amber/20 transition-all cursor-pointer flex gap-4"
            onClick={() => openEdit(t)}>
            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-amber/10 items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-amber fill-amber" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-bold text-sm">{t.name}</span>
                <span className="text-slate-600 text-xs">{t.location}</span>
                <div className="flex gap-0.5 ml-auto">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3 h-3 fill-amber text-amber" />)}
                </div>
              </div>
              <p className="text-slate-400 text-sm line-clamp-2">"{t.text}"</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-amber/60 text-xs">{t.service}</span>
                <span className="text-slate-600 text-xs">{t.date}</span>
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity self-center">
              <button onClick={(e) => { e.stopPropagation(); openEdit(t); }} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }} className="p-1.5 rounded-lg bg-red-500/10 text-red-400"><X className="w-3.5 h-3.5" /></button>
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
                <h2 className="text-xl font-bold text-white">{isNew ? 'Nouveau témoignage' : 'Modifier le témoignage'}</h2>
                <button onClick={close} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <InputField label="Nom" name="name" value={editing.name} onChange={handleChange} required />
                  <InputField label="Localité" name="location" value={editing.location} onChange={handleChange} />
                </div>
                <div className="grid sm:grid-cols-3 gap-5">
                  <InputField label="Service" name="service" value={editing.service} onChange={handleChange} />
                  <InputField label="Date" name="date" value={editing.date} onChange={handleChange} placeholder="Novembre 2024" />
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Note</label>
                    <div className="flex gap-1 py-3">
                      {[1,2,3,4,5].map((n) => (
                        <button key={n} type="button" onClick={() => setEditing({ ...editing, rating: n })}>
                          <Star className={`w-6 h-6 transition-colors ${n <= editing.rating ? 'fill-amber text-amber' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <InputField label="Témoignage" name="text" value={editing.text} onChange={handleChange} rows={4} required />
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
      <AnimatePresence>{saved && <Toast message="Témoignage enregistré" />}</AnimatePresence>
    </div>
  );
}
