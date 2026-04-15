import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Pencil, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useCMSStore } from '../../lib/cmsStore';
import type { FAQItem } from '../../lib/cmsData';
import { PageHeader, InputField, SaveButton, DeleteButton, AddButton, Toast } from '../components/FormUI';

export default function FAQAdminPage() {
  const { data, addFAQ, updateFAQ, deleteFAQ, reorderFAQ } = useCMSStore();
  const [editing, setEditing] = useState<{ index: number; item: FAQItem } | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saved, setSaved] = useState(false);

  const openNew = () => { setEditing({ index: -1, item: { question: '', answer: '' } }); setIsNew(true); };
  const openEdit = (i: number) => { setEditing({ index: i, item: { ...data.faq[i] } }); setIsNew(false); };
  const close = () => { setEditing(null); setIsNew(false); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editing) return;
    setEditing({ ...editing, item: { ...editing.item, [e.target.name]: e.target.value } });
  };

  const handleSave = () => {
    if (!editing || !editing.item.question) return;
    if (isNew) addFAQ(editing.item); else updateFAQ(editing.index, editing.item);
    setSaved(true); setTimeout(() => setSaved(false), 2500); close();
  };

  const handleDelete = (i: number) => { if (confirm('Supprimer cette question ?')) deleteFAQ(i); };

  const moveUp = (i: number) => {
    if (i === 0) return;
    const faqs = [...data.faq];
    [faqs[i - 1], faqs[i]] = [faqs[i], faqs[i - 1]];
    reorderFAQ(faqs);
  };

  const moveDown = (i: number) => {
    if (i >= data.faq.length - 1) return;
    const faqs = [...data.faq];
    [faqs[i], faqs[i + 1]] = [faqs[i + 1], faqs[i]];
    reorderFAQ(faqs);
  };

  return (
    <div>
      <PageHeader title="FAQ" description={`${data.faq.length} questions`}>
        <AddButton onClick={openNew} label="Nouvelle question" />
      </PageHeader>

      <div className="space-y-2">
        {data.faq.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="group bg-[#0D1321] border border-white/5 rounded-xl p-4 hover:border-amber/20 transition-all flex items-center gap-3">
            <div className="flex flex-col gap-0.5">
              <button onClick={() => moveUp(i)} disabled={i === 0} className="p-1 rounded text-slate-600 hover:text-white disabled:opacity-20"><ChevronUp className="w-4 h-4" /></button>
              <button onClick={() => moveDown(i)} disabled={i >= data.faq.length - 1} className="p-1 rounded text-slate-600 hover:text-white disabled:opacity-20"><ChevronDown className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openEdit(i)}>
              <div className="text-white font-semibold text-sm mb-0.5">{item.question}</div>
              <p className="text-slate-500 text-xs line-clamp-1">{item.answer}</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(i)} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => handleDelete(i)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400"><X className="w-3.5 h-3.5" /></button>
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
                <h2 className="text-xl font-bold text-white">{isNew ? 'Nouvelle question' : 'Modifier la question'}</h2>
                <button onClick={close} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-5">
                <InputField label="Question" name="question" value={editing.item.question} onChange={handleChange} required />
                <InputField label="Réponse" name="answer" value={editing.item.answer} onChange={handleChange} rows={5} required />
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  {!isNew && <DeleteButton onClick={() => { handleDelete(editing.index); close(); }} />}
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
      <AnimatePresence>{saved && <Toast message="FAQ mise à jour" />}</AnimatePresence>
    </div>
  );
}
