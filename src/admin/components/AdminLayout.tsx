import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Wrench, Images, MessageSquareQuote, HelpCircle,
  Building2, Search, Settings, LogOut, Menu, X, Zap, ChevronRight,
  User, FileText, Globe, Shield, Receipt, Users, CreditCard, Sparkles,
  Bell, RefreshCw, Home
} from 'lucide-react';
import { useAuth, signOut } from '../../lib/auth';

// Grouped navigation for better UX
const navGroups = [
  {
    label: 'Général',
    items: [
      { label: 'Tableau de bord', to: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    label: 'Contenu',
    items: [
      { label: 'Entreprise & Hero', to: '/admin/company', icon: Building2 },
      { label: 'Services', to: '/admin/services', icon: Wrench },
      { label: 'Réalisations', to: '/admin/realisations', icon: Images },
      { label: 'Témoignages', to: '/admin/testimonials', icon: MessageSquareQuote },
      { label: 'FAQ', to: '/admin/faq', icon: HelpCircle },
      { label: 'À propos', to: '/admin/about', icon: FileText },
    ]
  },
  {
    label: 'Finance',
    items: [
      { label: 'Factures', to: '/admin/invoices', icon: Receipt },
      { label: 'Clients', to: '/admin/invoices/clients', icon: Users },
      { label: 'Paramètres factures', to: '/admin/invoices/settings', icon: CreditCard },
    ]
  },
  {
    label: 'Configuration',
    items: [
      { label: 'SEO', to: '/admin/seo', icon: Search },
      { label: 'Mentions légales', to: '/admin/legal', icon: Shield },
      { label: 'Paramètres', to: '/admin/settings', icon: Settings },
    ]
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.displayName) return user?.email?.charAt(0).toUpperCase() || 'U';
    const names = user.displayName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return user.displayName.substring(0, 2).toUpperCase();
  };

  // Get page title from current route
  const getPageTitle = () => {
    const path = location.pathname;
    for (const group of navGroups) {
      const item = group.items.find(i => i.to === path || (i.to !== '/admin' && path.startsWith(i.to)));
      if (item) return item.label;
    }
    return 'Tableau de bord';
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-[#0D1321] border-r border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:sticky lg:top-0 lg:h-screen`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber to-amber-light flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#0D1321]" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Elec-Matic</div>
              <div className="text-amber/60 text-[10px] font-medium uppercase tracking-[0.15em]">Administration</div>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="absolute top-5 right-4 lg:hidden text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav - Grouped */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {navGroups.map((group, groupIdx) => (
            <div key={group.label}>
              <div className="px-3 mb-2">
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                  {group.label}
                </div>
              </div>
              <div className="space-y-0.5">
                {group.items.map((link) => {
                  const isActive = location.pathname === link.to || (link.to !== '/admin' && location.pathname.startsWith(link.to));
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                        isActive
                          ? 'bg-gradient-to-r from-amber/10 to-amber/5 text-amber shadow-lg shadow-amber/5'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-amber/10 to-amber/5 rounded-xl"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <Icon className={`w-[18px] h-[18px] relative z-10 ${ isActive ? 'text-amber' : 'text-slate-500 group-hover:text-slate-300' }`} />
                      <span className="flex-1 relative z-10">{link.label}</span>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-1.5 h-1.5 rounded-full bg-amber relative z-10"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User section - Enhanced */}
        <div className="p-4 border-t border-white/5 space-y-3">
          {/* User profile card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber/10 via-amber/5 to-transparent border border-amber/20 p-3"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-amber/5 rounded-full blur-xl" />

            <div className="relative flex items-center gap-3">
              {/* Avatar with initials */}
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber to-amber-light flex items-center justify-center shadow-lg shadow-amber/20">
                  <span className="text-[#0D1321] text-sm font-bold">
                    {getUserInitials()}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0D1321]" />
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-white text-sm font-semibold truncate">
                    {user?.displayName || 'Utilisateur'}
                  </div>
                  <div className="px-1.5 py-0.5 rounded bg-amber/20 border border-amber/30">
                    <Sparkles className="w-2.5 h-2.5 text-amber" />
                  </div>
                </div>
                <div className="text-slate-400 text-xs truncate">
                  {user?.email}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/"
              target="_blank"
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 text-slate-300 text-xs font-medium hover:bg-white/10 hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Site public</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 hover:text-red-300 transition-all hover:scale-[1.02] active:scale-[0.98] border border-red-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Enhanced Top bar */}
        <header className="sticky top-0 z-30 bg-[#0B0F1A]/95 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-4 px-4 sm:px-6 h-16">
            {/* Mobile menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white hover:bg-white/5 p-2 rounded-lg transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Page title */}
            <div className="flex items-center gap-2 text-sm">
              <Link to="/admin" className="text-slate-500 hover:text-slate-300 transition-colors hidden sm:flex items-center gap-1.5">
                <Home className="w-4 h-4" />
              </Link>
              {location.pathname !== '/admin' && (
                <>
                  <ChevronRight className="w-4 h-4 text-slate-600 hidden sm:block" />
                  <span className="text-white font-medium">{getPageTitle()}</span>
                </>
              )}
              {location.pathname === '/admin' && (
                <span className="text-white font-medium sm:ml-2">Tableau de bord</span>
              )}
            </div>

            <div className="flex-1" />

            {/* Quick actions */}
            <div className="flex items-center gap-2">
              {/* Date */}
              <span className="text-slate-500 text-xs hidden md:block">
                {new Date().toLocaleDateString('fr-BE', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>

              {/* Notifications */}
              <button
                className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber rounded-full" />
              </button>

              {/* Refresh */}
              <button
                onClick={() => window.location.reload()}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all hidden sm:block"
                title="Actualiser"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* User menu (mobile) */}
              <div className="lg:hidden flex items-center gap-2 pl-2 border-l border-white/5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber to-amber-light flex items-center justify-center text-xs font-bold text-[#0D1321]">
                  {getUserInitials()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
