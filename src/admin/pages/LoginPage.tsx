import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { signIn } from '../../lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = 'L\'email est requis.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email invalide.';
    if (!password) errs.password = 'Le mot de passe est requis.';
    else if (password.length < 6) errs.password = 'Minimum 6 caractères.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);

    const result = await signIn(email, password);
    setLoading(false);

    if (result.user) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Erreur de connexion.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* BG effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber/3 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
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
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber to-amber-light flex items-center justify-center shadow-lg shadow-amber/20">
              <Zap className="w-6 h-6 text-[#0D1321]" strokeWidth={2.5} />
            </div>
          </Link>
          <h1 className="text-3xl font-extrabold text-white mb-2">Bienvenue</h1>
          <p className="text-slate-400 text-sm">Connectez-vous à l'espace administration</p>
        </div>

        {/* Form */}
        <div className="bg-[#0D1321] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Adresse email <span className="text-amber">*</span></label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                  placeholder="admin@elec-matic.be"
                  className={`w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border rounded-xl text-white text-sm placeholder-slate-600 focus:ring-1 focus:ring-amber/20 transition-all outline-none ${
                    errors.email ? 'border-red-500/50 focus:border-red-500/50' : 'border-white/10 focus:border-amber/40'
                  }`}
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
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3.5 bg-white/[0.03] border rounded-xl text-white text-sm placeholder-slate-600 focus:ring-1 focus:ring-amber/20 transition-all outline-none ${
                    errors.password ? 'border-red-500/50 focus:border-red-500/50' : 'border-white/10 focus:border-amber/40'
                  }`}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber to-amber-light text-[#0D1321] font-bold rounded-xl hover:shadow-xl hover:shadow-amber/20 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#0D1321]/30 border-t-[#0D1321] rounded-full animate-spin" />
              ) : (
                <>Se connecter <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Pas encore de compte ?{' '}
              <Link to="/admin/register" className="text-amber font-semibold hover:text-amber-light transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 rounded-xl bg-amber/5 border border-amber/10 text-center"
        >
          <p className="text-amber/70 text-xs font-medium mb-1">Identifiants de démonstration</p>
          <p className="text-slate-400 text-xs">admin@elec-matic.be / Admin123!</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
