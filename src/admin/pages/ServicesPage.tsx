import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, ShieldCheck, Wrench, Lightbulb, Smartphone, Camera, Video, Network, GripVertical, Pencil, X } from 'lucide-react';
import { useCMSStore } from '../../lib/cmsStore';
import type { Service } from '../../lib/cmsData';
import { PageHeader, Card, CardHeader, InputField, SaveButton, DeleteButton, AddButton, Toast } from '../components/FormUI';

const iconOptions = [
  { value: 'Zap', label: '⚡ Zap' }, { value: 'AlertTriangle', label: '⚠ Alerte' },
  { value: 'ShieldCheck', label: '🛡 Bouclier' }, { value: 'Wrench', label: '🔧 Clé' },
  { value: 'Lightbulb', label: '💡 Ampoule' }, { value: 'Smartphone', label: '📱 Téléphone' },
  { value: 'Camera', label: '📷 Caméra' }, { value: 'Video', label: '🎥 Vidéo' },
  { value: 'Network', label: '🌐 Réseau' },
];

const iconMap: Record<string, React.ElementType> = { Zap, AlertTriangle, ShieldCheck, Wrench, Lightbulb, Smartphone, Camera, Video, Network };

const emptyService: Service = { id: '', icon: 'Zap', title: '', shortDesc: '', longDesc: '', features: [''] };

export default function ServicesPage() {
  const { data, addService, updateService, deleteService } = useCMSStore();
  const [editing, setEditing] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saved, setSaved] = useState(false);

  const openNew = () => { setEditing({ ...emptyService, id: `svc-${Date.now()}` }); setIsNew(true); };
  const openEdit = (s: Service) => { setEditing({ ...s, features: [...s.features] }); setIsNew(false); };
  const close = () => { setEditing(null); setIsNew(false); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editing) return;
    setEditing({ ...editing, [e.target.name]: e.target.value });
  };

  const handleFeature = (index: number, value: string) => {
    if (!editing) return;
    const features = [...editing.features];
    features[index] = value;
    setEditing({ ...editing, features });
  };

  const addFeature = () => { if (editing) setEditing({ ...editing, features: [...editing.features, ''] }); };
  const removeFeature = (index: number) => { if (editing) setEditing({ ...editing, features: editing.features.filter((_, i) => i !== index) }); };

  const handleSave = () => {
    if (!editing || !editing.title) return;
    if (isNew) addService(editing);
    else updateService(editing.id, editing);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    close();
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer ce service ?')) deleteService(id);
  };

  return (
    <div>
      <PageHeader title="Services" description={`${data.services.length} services configurés`}>
        <AddButton onClick={openNew} label="Nouveau service" />
      </PageHeader>

      {/* List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.services.map((service, i) => {
          const Icon = iconMap[service.icon] || Zap;
          return (
            <motion.div key={service.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="group bg-[#0D1321] border border-white/5 rounded-2xl p-5 hover:border-amber/20 transition-all cursor-pointer"
              onClick={() => openEdit(service)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-amber" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); openEdit(service); }} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(service.id); }} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:text-red-300"><X className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">{service.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{service.shortDesc}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {service.features.slice(0, 3).map((f) => (
                  <span key={f} className="px-2 py-0.5 bg-white/5 text-slate-500 text-[10px] rounded-md">{f}</span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 pt-20 overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0D1321] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{isNew ? 'Nouveau service' : 'Modifier le service'}</h2>
                <button onClick={close} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <InputField label="Titre" name="title" value={editing.title} onChange={handleChange} required />
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Icône <span className="text-amber">*</span></label>
                    <select name="icon" value={editing.icon} onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:border-amber/40 outline-none appearance-none">
                      {iconOptions.map((o) => <option key={o.value} value={o.value} className="bg-[#0D1321]">{o.label}</option>)}
                    </select>
                  </div>
                </div>
                <InputField label="Description courte" name="shortDesc" value={editing.shortDesc} onChange={handleChange} rows={2} />
                <InputField label="Description longue" name="longDesc" value={editing.longDesc} onChange={handleChange} rows={4} />
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Caractéristiques</label>
                  <div className="space-y-2">
                    {editing.features.map((f, i) => (
                      <div key={i} className="flex gap-2">
                        <input value={f} onChange={(e) => handleFeature(i, e.target.value)} placeholder={`Caractéristique ${i + 1}`}
                          className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:border-amber/40 outline-none" />
                        <button onClick={() => removeFeature(i)} className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button onClick={addFeature} className="text-amber text-sm font-medium hover:text-amber-light">+ Ajouter</button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  {!isNew && <DeleteButton onClick={() => { handleDelete(editing.id); close(); }} />}
                  <div className="flex gap-3 ml-auto">
                    <button onClick={close} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all">Annuler</button>
                    <SaveButton onClick={handleSave} saved={false} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{saved && <Toast message="Service enregistré avec succès" />}</AnimatePresence>
    </div>
  );
}
