import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useCMSStore } from '../../lib/cmsStore';
import { PageHeader, Card, CardHeader, InputField, SaveButton, Toast } from '../components/FormUI';

export default function LegalAdminPage() {
  const { data, updateLegal } = useCMSStore();
  const [legal, setLegal] = useState(data.legal);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setLegal(data.legal); }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLegal({ ...legal, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateLegal(legal);
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <PageHeader title="Mentions légales" description="Informations juridiques et RGPD">
        <SaveButton onClick={handleSave} saved={saved} />
      </PageHeader>

      <div className="space-y-6">
        <Card>
          <CardHeader title="Éditeur du site" />
          <div className="grid sm:grid-cols-2 gap-5">
            <InputField label="Raison sociale" name="companyFull" value={legal.companyFull} onChange={handleChange} required />
            <InputField label="Forme juridique" name="legalForm" value={legal.legalForm} onChange={handleChange} />
            <InputField label="N° d'entreprise" name="siret" value={legal.siret} onChange={handleChange} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Hébergement" />
          <div className="grid sm:grid-cols-2 gap-5">
            <InputField label="Hébergeur" name="host" value={legal.host} onChange={handleChange} />
            <InputField label="Adresse hébergeur" name="hostAddress" value={legal.hostAddress} onChange={handleChange} />
          </div>
        </Card>
      </div>

      <AnimatePresence>{saved && <Toast message="Mentions légales mises à jour" />}</AnimatePresence>
    </div>
  );
}
