import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../lib/authStore';
import { useCMSStore } from '../../lib/cmsStore';
import { PageHeader, Card, CardHeader, InputField, SaveButton, Toast } from '../components/FormUI';

export default function SettingsPage() {
  const { user, updateProfile } = useAuthStore();
  const { resetToDefaults } = useCMSStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleSaveProfile = () => {
    updateProfile({ name, email });
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    resetToDefaults();
    setShowReset(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  return (
    <div>
      <PageHeader title="Paramètres" description="Profil administrateur et configuration" />

      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader title="Profil administrateur" description="Vos informations personnelles">
            <SaveButton onClick={handleSaveProfile} saved={saved} />
          </CardHeader>
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber/20 to-amber/10 flex items-center justify-center">
              <User className="w-7 h-7 text-amber" />
            </div>
            <div>
              <div className="text-white font-bold">{user?.name}</div>
              <div className="text-slate-500 text-sm">{user?.email}</div>
              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-amber/10 text-amber text-xs font-medium">
                <Shield className="w-3 h-3" /> {user?.role === 'admin' ? 'Administrateur' : 'Éditeur'}
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <InputField label="Nom" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
            <InputField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </Card>

        {/* Danger zone */}
        <Card className="border-red-500/10">
          <CardHeader title="Zone de danger" description="Actions irréversibles" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
            <div>
              <div className="text-white font-semibold text-sm">Réinitialiser le contenu</div>
              <div className="text-slate-500 text-xs mt-0.5">Remet tout le contenu du site aux valeurs par défaut</div>
            </div>
            <button onClick={() => setShowReset(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
              <RotateCcw className="w-4 h-4" /> Réinitialiser
            </button>
          </div>
        </Card>
      </div>

      {/* Reset confirmation modal */}
      <AnimatePresence>
        {showReset && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-[#0D1321] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Êtes-vous sûr ?</h3>
              <p className="text-slate-400 text-sm mb-6">Cette action va réinitialiser tout le contenu du site (services, réalisations, témoignages, FAQ, etc.) aux valeurs par défaut. Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowReset(false)} className="flex-1 py-3 rounded-xl text-sm font-medium text-slate-400 bg-white/5 hover:bg-white/10 transition-all">Annuler</button>
                <button onClick={handleReset} className="flex-1 py-3 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30 transition-all">Confirmer la réinitialisation</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{saved && <Toast message="Profil mis à jour" />}</AnimatePresence>
      <AnimatePresence>{resetDone && <Toast message="Contenu réinitialisé aux valeurs par défaut" />}</AnimatePresence>
    </div>
  );
}
