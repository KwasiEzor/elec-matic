import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useCMSStore } from '../../lib/cmsStore';
import { PageHeader, Card, CardHeader, InputField, SaveButton, Toast } from '../components/FormUI';

export default function AboutPage() {
  const { data, updateAbout } = useCMSStore();
  const [about, setAbout] = useState(data.about);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setAbout(data.about); }, [data]);

  const handleParagraph = (i: number, value: string) => {
    const paragraphs = [...about.paragraphs];
    paragraphs[i] = value;
    setAbout({ ...about, paragraphs });
  };

  const addParagraph = () => setAbout({ ...about, paragraphs: [...about.paragraphs, ''] });
  const removeParagraph = (i: number) => setAbout({ ...about, paragraphs: about.paragraphs.filter((_, idx) => idx !== i) });

  const handleValue = (i: number, field: string, value: string) => {
    const values = [...about.values];
    values[i] = { ...values[i], [field]: value };
    setAbout({ ...about, values });
  };

  const handleSave = () => {
    updateAbout(about);
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <PageHeader title="À propos" description="Section à propos du site">
        <SaveButton onClick={handleSave} saved={saved} />
      </PageHeader>

      <div className="space-y-6">
        <Card>
          <CardHeader title="Titre" />
          <InputField label="Titre de la section" name="title" value={about.title} onChange={(e) => setAbout({ ...about, title: e.target.value })} />
        </Card>

        <Card>
          <CardHeader title="Paragraphes" description="Texte de présentation">
            <button onClick={addParagraph} className="p-2 rounded-lg bg-amber/10 text-amber hover:bg-amber/20 transition-all"><Plus className="w-4 h-4" /></button>
          </CardHeader>
          <div className="space-y-3">
            {about.paragraphs.map((p, i) => (
              <div key={i} className="flex gap-2">
                <textarea value={p} onChange={(e) => handleParagraph(i, e.target.value)} rows={3}
                  className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:border-amber/40 outline-none resize-none" />
                <button onClick={() => removeParagraph(i)} className="p-2 self-start rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Valeurs" description="Les 4 valeurs affichées" />
          <div className="grid sm:grid-cols-2 gap-4">
            {about.values.map((v, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <InputField label={`Titre ${i + 1}`} name="title" value={v.title} onChange={(e) => handleValue(i, 'title', e.target.value)} />
                <InputField label="Description" name="desc" value={v.desc} onChange={(e) => handleValue(i, 'desc', e.target.value)} />
                <InputField label="Icône" name="icon" value={v.icon} onChange={(e) => handleValue(i, 'icon', e.target.value)} placeholder="ShieldCheck, Clock..." />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <AnimatePresence>{saved && <Toast message="Section À propos mise à jour" />}</AnimatePresence>
    </div>
  );
}
