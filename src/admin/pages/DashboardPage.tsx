import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Wrench, Images, MessageSquareQuote, HelpCircle, TrendingUp,
  Eye, Phone, FileText, ArrowUpRight, Clock
} from 'lucide-react';
import { useCMSStore } from '../../lib/cmsStore';
import { useAuthStore } from '../../lib/authStore';

export default function DashboardPage() {
  const { data, lastSaved } = useCMSStore();
  const { user } = useAuthStore();

  const stats = [
    { label: 'Services', value: data.services.length, icon: Wrench, color: 'from-blue-500/20 to-blue-500/5 border-blue-500/20', iconColor: 'text-blue-400', to: '/admin/services' },
    { label: 'Réalisations', value: data.realisations.length, icon: Images, color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20', iconColor: 'text-emerald-400', to: '/admin/realisations' },
    { label: 'Témoignages', value: data.testimonials.length, icon: MessageSquareQuote, color: 'from-purple-500/20 to-purple-500/5 border-purple-500/20', iconColor: 'text-purple-400', to: '/admin/testimonials' },
    { label: 'FAQ', value: data.faq.length, icon: HelpCircle, color: 'from-amber/20 to-amber/5 border-amber/20', iconColor: 'text-amber', to: '/admin/faq' },
  ];

  const quickActions = [
    { label: 'Modifier les services', to: '/admin/services', icon: Wrench },
    { label: 'Ajouter une réalisation', to: '/admin/realisations', icon: Images },
    { label: 'Gérer les avis', to: '/admin/testimonials', icon: MessageSquareQuote },
    { label: 'Paramètres SEO', to: '/admin/seo', icon: TrendingUp },
    { label: 'Infos entreprise', to: '/admin/company', icon: Phone },
    { label: 'Mentions légales', to: '/admin/legal', icon: FileText },
  ];

  return (
    <div>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
          Bonjour, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-400 text-sm">
          Bienvenue dans votre espace d'administration Elec-Matic.
          {lastSaved && (
            <span className="inline-flex items-center gap-1 ml-2 text-slate-500">
              <Clock className="w-3 h-3" />
              Dernière sauvegarde : {new Date(lastSaved).toLocaleString('fr-BE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={stat.to} className={`block p-5 rounded-2xl bg-gradient-to-br ${stat.color} border hover:scale-[1.02] transition-transform`}>
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  <ArrowUpRight className="w-4 h-4 text-slate-600" />
                </div>
                <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                <div className="text-slate-400 text-sm font-medium mt-0.5">{stat.label}</div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick actions + Site info */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-[#0D1321] border border-white/5 rounded-2xl p-5 sm:p-6"
        >
          <h2 className="text-white font-bold mb-4">Actions rapides</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-amber/20 hover:bg-white/[0.04] transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-amber" />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{action.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 ml-auto group-hover:text-amber transition-colors" />
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Site info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0D1321] border border-white/5 rounded-2xl p-5 sm:p-6"
        >
          <h2 className="text-white font-bold mb-4">Informations du site</h2>
          <div className="space-y-3">
            {[
              { label: 'Entreprise', value: data.company.name },
              { label: 'Téléphone', value: data.company.phoneDisplay },
              { label: 'Email', value: data.company.email },
              { label: 'Ville', value: `${data.company.city}, ${data.company.region}` },
              { label: 'Zones', value: `${data.company.zones.length} communes` },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-slate-500 text-sm">{item.label}</span>
                <span className="text-white text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Link to="/" target="_blank" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber/10 text-amber text-xs font-bold hover:bg-amber/20 transition-all">
              <Eye className="w-3.5 h-3.5" /> Voir le site
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
