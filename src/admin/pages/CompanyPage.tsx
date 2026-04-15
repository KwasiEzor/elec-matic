import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useCMSStore } from '../../lib/cmsStore';
import { PageHeader, Card, CardHeader, InputField, SaveButton, Toast } from '../components/FormUI';

export default function CompanyPage() {
  const { data, updateCompany, updateHero } = useCMSStore();
  const [company, setCompany] = useState(data.company);
  const [hero, setHero] = useState(data.hero);
  const [saved, setSaved] = useState(false);
  const [newZone, setNewZone] = useState('');

  useEffect(() => { setCompany(data.company); setHero(data.hero); }, [data]);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompany((p) => ({ ...p, [name]: name === 'yearsExperience' ? Number(value) : value }));
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHero((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleHourChange = (index: number, field: 'day' | 'hours', value: string) => {
    setCompany((p) => ({ ...p, hours: p.hours.map((h, i) => i === index ? { ...h, [field]: value } : h) }));
  };

  const addZone = () => {
    if (newZone.trim() && !company.zones.includes(newZone.trim())) {
      setCompany((p) => ({ ...p, zones: [...p.zones, newZone.trim()] }));
      setNewZone('');
    }
  };

  const removeZone = (zone: string) => {
    setCompany((p) => ({ ...p, zones: p.zones.filter((z) => z !== zone) }));
  };

  const handleSave = () => {
    updateCompany(company);
    updateHero(hero);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <PageHeader title="Entreprise & Hero" description="Informations générales et section d'accueil">
        <SaveButton onClick={handleSave} saved={saved} />
      </PageHeader>

      <div className="space-y-6">
        {/* Company Info */}
        <Card>
          <CardHeader title="Informations de l'entreprise" description="Coordonnées et identité" />
          <div className="grid sm:grid-cols-2 gap-5">
            <InputField label="Nom" name="name" value={company.name} onChange={handleCompanyChange} required />
            <InputField label="Slogan" name="tagline" value={company.tagline} onChange={handleCompanyChange} />
            <InputField label="Téléphone (affiché)" name="phoneDisplay" value={company.phoneDisplay} onChange={handleCompanyChange} required />
            <InputField label="Téléphone (lien)" name="phone" value={company.phone} onChange={handleCompanyChange} placeholder="tel:+32488322142" />
            <InputField label="Email" name="email" type="email" value={company.email} onChange={handleCompanyChange} required />
            <InputField label="N° TVA" name="vatNumber" value={company.vatNumber} onChange={handleCompanyChange} />
            <InputField label="Adresse" name="address" value={company.address} onChange={handleCompanyChange} />
            <InputField label="Code postal" name="postalCode" value={company.postalCode} onChange={handleCompanyChange} />
            <InputField label="Ville" name="city" value={company.city} onChange={handleCompanyChange} />
            <InputField label="Région" name="region" value={company.region} onChange={handleCompanyChange} />
          </div>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader title="Chiffres clés" description="Statistiques affichées sur le site" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <InputField label="Années d'expérience" name="yearsExperience" type="number" value={String(company.yearsExperience)} onChange={handleCompanyChange} />
            <InputField label="Projets réalisés" name="projectsCompleted" value={company.projectsCompleted} onChange={handleCompanyChange} />
            <InputField label="Clients satisfaits" name="clientsSatisfied" value={company.clientsSatisfied} onChange={handleCompanyChange} />
            <InputField label="Délai d'intervention" name="interventionDelay" value={company.interventionDelay} onChange={handleCompanyChange} />
          </div>
        </Card>

        {/* Hours */}
        <Card>
          <CardHeader title="Horaires d'ouverture" />
          <div className="space-y-3">
            {company.hours.map((h, i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <input value={h.day} onChange={(e) => handleHourChange(i, 'day', e.target.value)}
                  className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:border-amber/40 outline-none" />
                <input value={h.hours} onChange={(e) => handleHourChange(i, 'hours', e.target.value)}
                  className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:border-amber/40 outline-none" />
              </div>
            ))}
          </div>
        </Card>

        {/* Zones */}
        <Card>
          <CardHeader title="Zones d'intervention" description={`${company.zones.length} communes`} />
          <div className="flex flex-wrap gap-2 mb-4">
            {company.zones.map((z) => (
              <span key={z} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg">
                {z}
                <button onClick={() => removeZone(z)} className="text-slate-500 hover:text-red-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newZone} onChange={(e) => setNewZone(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addZone())}
              placeholder="Ajouter une commune..." className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:border-amber/40 outline-none" />
            <button onClick={addZone} className="px-4 py-3 bg-amber/10 text-amber rounded-xl hover:bg-amber/20 transition-all"><Plus className="w-5 h-5" /></button>
          </div>
        </Card>

        {/* Hero */}
        <Card>
          <CardHeader title="Section Hero (Accueil)" description="Titres et boutons de la page d'accueil" />
          <div className="space-y-5">
            <InputField label="Titre principal" name="headline" value={hero.headline} onChange={handleHeroChange} required />
            <InputField label="Sous-titre" name="subheadline" value={hero.subheadline} onChange={handleHeroChange} rows={3} />
            <div className="grid sm:grid-cols-2 gap-5">
              <InputField label="Bouton principal" name="ctaPrimary" value={hero.ctaPrimary} onChange={handleHeroChange} />
              <InputField label="Bouton secondaire" name="ctaSecondary" value={hero.ctaSecondary} onChange={handleHeroChange} />
            </div>
          </div>
        </Card>
      </div>

      <AnimatePresence>{saved && <Toast message="Modifications enregistrées avec succès" />}</AnimatePresence>
    </div>
  );
}
