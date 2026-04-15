import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, User } from 'lucide-react';
import { signUp } from '../../lib/auth';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Le nom est requis.';
    else if (name.trim().length < 2) errs.name = 'Minimum 2 caractères.';
    if (!email.trim()) errs.email = 'L\'email est requis.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email invalide.';
    if (!password) errs.password = 'Le mot de passe est requis.';
    else if (password.length < 8) errs.password = 'Minimum 8 caractères.';
    else if (!/[A-Z]/.test(password)) errs.password = 'Au moins une majuscule.';
    else if (!/[0-9]/.test(password)) errs.password = 'Au moins un chiffre.';
    if (!confirmPw) errs.confirmPw = 'Veuillez confirmer le mot de passe.';
    else if (password !== confirmPw) errs.confirmPw = 'Les mots de passe ne correspondent pas.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength();
  const strengthLabels = ['', 'Faible', 'Moyen', 'Bon', 'Excellent'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-amber', 'bg-emerald-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);

    const result = await signUp(email, password, name);
    setLoading(false);

    if (result.user) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.error || 'Erreur lors de l\'inscription.');
    }
  };

  const clearError = (field: string) => setErrors((p) => ({ ...p, [field]: '' }));

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber/3 rounded-full blur-3xl translate-y-1/2 translate-x-1/3" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(212,168,83,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber to-amber-light flex items-center justify-center shadow-lg shadow-amber/20">
              <Zap className="w-6 h-6 text-[#0D1321]" strokeWidth={2.5} />
            </div>
          </Link>
          <h1 className="text-3xl font-extrabold text-white mb-2">Créer un compte</h1>
          <p className="text-slate-400 text-sm">Rejoignez l'administration Elec-Matic</p>
        </div>

        <div className="bg-[#0D1321] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
              <AlertCircle className="w-5 h-5 shrink-0" />{error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nom complet <span className="text-amber">*</span></label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" value={name} onChange={(e) => { setName(e.target.value); clearError('name'); }} placeholder="Jean Dupont"
                  className={`w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border rounded-xl text-white text-sm placeholder-slate-600 focus:ring-1 focus:ring-amber/20 transition-all outline-none ${errors.name ? 'border-red-500/50' : 'border-white/10 focus:border-amber/40'}`}
                />
              </div>
              {errors.name && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Adresse email <span className="text-amber">*</span></label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearError('email'); }} placeholder="vous@email.be"
                  className={`w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border rounded-xl text-white text-sm placeholder-slate-600 focus:ring-1 focus:ring-amber/20 transition-all outline-none ${errors.email ? 'border-red-500/50' : 'border-white/10 focus:border-amber/40'}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Mot de passe <span className="text-amber">*</span></label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); clearError('password'); }} placeholder="Min. 8 car., 1 majuscule, 1 chiffre"
                  className={`w-full pl-11 pr-12 py-3.5 bg-white/[0.03] border rounded-xl text-white text-sm placeholder-slate-600 focus:ring-1 focus:ring-amber/20 transition-all outline-none ${errors.password ? 'border-red-500/50' : 'border-white/10 focus:border-amber/40'}`}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-white/10'}`} />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${
                    strength <= 1 ? 'text-red-400' : strength === 2 ? 'text-orange-400' : strength === 3 ? 'text-amber' : 'text-emerald-400'
                  }`}>{strengthLabels[strength]}</span>
                </div>
              )}
              {errors.password && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirmer le mot de passe <span className="text-amber">*</span></label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="password" value={confirmPw} onChange={(e) => { setConfirmPw(e.target.value); clearError('confirmPw'); }} placeholder="Retapez votre mot de passe"
                  className={`w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border rounded-xl text-white text-sm placeholder-slate-600 focus:ring-1 focus:ring-amber/20 transition-all outline-none ${errors.confirmPw ? 'border-red-500/50' : 'border-white/10 focus:border-amber/40'}`}
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPw && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.confirmPw}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber to-amber-light text-[#0D1321] font-bold rounded-xl hover:shadow-xl hover:shadow-amber/20 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-[#0D1321]/30 border-t-[#0D1321] rounded-full animate-spin" /> : <>Créer mon compte <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">Déjà un compte ?{' '}
              <Link to="/admin/login" className="text-amber font-semibold hover:text-amber-light transition-colors">Se connecter</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
