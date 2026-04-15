import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, Plus, Search, Globe, Tag } from 'lucide-react';
import { useCMSStore } from '../../lib/cmsStore';
import { PageHeader, Card, CardHeader, InputField, SaveButton, Toast } from '../components/FormUI';

export default function SEOPage() {
  const { data, updateSEO } = useCMSStore();
  const [seo, setSeo] = useState(data.seo);
  const [saved, setSaved] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => { setSeo(data.seo); }, [data]);

  const addKeyword = () => {
    if (newKeyword.trim() && !seo.keywords.includes(newKeyword.trim())) {
      setSeo({ ...seo, keywords: [...seo.keywords, newKeyword.trim()] });
      setNewKeyword('');
    }
  };

  const removeKeyword = (kw: string) => setSeo({ ...seo, keywords: seo.keywords.filter((k) => k !== kw) });

  const handleSave = () => {
    updateSEO(seo);
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const titleLen = seo.title.length;
  const descLen = seo.description.length;

  return (
    <div>
      <PageHeader title="Paramètres SEO" description="Optimisation pour les moteurs de recherche">
        <SaveButton onClick={handleSave} saved={saved} />
      </PageHeader>

      <div className="space-y-6">
        {/* Preview */}
        <Card>
          <CardHeader title="Aperçu Google" description="Voici comment votre site apparaît dans les résultats de recherche" />
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-blue-400 text-lg font-medium truncate">{seo.title || 'Titre de la page'}</div>
            <div className="text-emerald-400 text-sm mt-0.5">https://elec-matic.be</div>
            <div className="text-slate-400 text-sm mt-1 line-clamp-2">{seo.description || 'Description de la page...'}</div>
          </div>
        </Card>

        {/* Title */}
        <Card>
          <CardHeader title="Titre de la page" description="Recommandé : 50-60 caractères">
            <span className={`text-xs font-mono px-2 py-1 rounded-md ${
              titleLen > 60 ? 'bg-red-500/10 text-red-400' : titleLen > 50 ? 'bg-amber/10 text-amber' : 'bg-emerald-500/10 text-emerald-400'
            }`}>{titleLen}/60</span>
          </CardHeader>
          <InputField label="Meta Title" name="title" value={seo.title} onChange={(e) => setSeo({ ...seo, title: e.target.value })} required />
        </Card>

        {/* Description */}
        <Card>
          <CardHeader title="Meta Description" description="Recommandé : 150-160 caractères">
            <span className={`text-xs font-mono px-2 py-1 rounded-md ${
              descLen > 160 ? 'bg-red-500/10 text-red-400' : descLen > 150 ? 'bg-amber/10 text-amber' : 'bg-emerald-500/10 text-emerald-400'
            }`}>{descLen}/160</span>
          </CardHeader>
          <InputField label="Meta Description" name="description" value={seo.description} onChange={(e) => setSeo({ ...seo, description: e.target.value })} rows={3} required />
        </Card>

        {/* Keywords */}
        <Card>
          <CardHeader title="Mots-clés" description={`${seo.keywords.length} mots-clés configurés`} />
          <div className="flex flex-wrap gap-2 mb-4">
            {seo.keywords.map((kw) => (
              <span key={kw} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber/5 border border-amber/10 text-amber text-sm rounded-lg">
                <Tag className="w-3 h-3" />{kw}
                <button onClick={() => removeKeyword(kw)} className="text-amber/50 hover:text-red-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              placeholder="Ajouter un mot-clé..." className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:border-amber/40 outline-none" />
            <button onClick={addKeyword} className="px-4 py-3 bg-amber/10 text-amber rounded-xl hover:bg-amber/20 transition-all"><Plus className="w-5 h-5" /></button>
          </div>
        </Card>

        {/* Tips */}
        <Card className="bg-gradient-to-br from-amber/5 to-transparent border-amber/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5 text-amber" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm mb-2">Conseils SEO local</h3>
              <ul className="space-y-1.5 text-slate-400 text-sm">
                <li>• Incluez votre ville principale (Charleroi) dans le titre et la description</li>
                <li>• Utilisez des mots-clés spécifiques : « électricien Charleroi », « dépannage électrique Hainaut »</li>
                <li>• Le schema LocalBusiness/Electrician est déjà intégré automatiquement</li>
                <li>• Les avis clients améliorent votre visibilité locale</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <AnimatePresence>{saved && <Toast message="Paramètres SEO mis à jour" />}</AnimatePresence>
    </div>
  );
}
