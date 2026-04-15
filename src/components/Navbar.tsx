import { useState, useEffect } from 'react';
import { Menu, X, Phone, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useSiteData } from '../lib/useSiteData';

interface NavLink { label: string; href?: string; to?: string; }

const navLinks: NavLink[] = [
  { label: 'Accueil', to: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'Réalisations', href: '/#realisations' },
  { label: 'Avis', href: '/#avis' },
  { label: 'À propos', href: '/#apropos' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const data = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || !isHome ? 'bg-navy/95 backdrop-blur-xl shadow-2xl shadow-navy/20 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber to-amber-light flex items-center justify-center"><Zap className="w-5 h-5 text-navy" strokeWidth={2.5} /></div>
              <div className="absolute inset-0 rounded-lg bg-amber/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-tight leading-none">{data.company.name}</span>
              <span className="text-[10px] font-medium text-amber/80 uppercase tracking-[0.2em] leading-none mt-1">{data.company.tagline}</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isHashLink = !!link.href;
              const isActive = link.to ? location.pathname === link.to : false;
              if (isHashLink) {
                const hash = link.href!.replace('/', '');
                if (isHome) return <a key={link.label} href={hash} className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">{link.label}<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-amber group-hover:w-4/5 transition-all duration-300" /></a>;
                return <Link key={link.label} to={link.href!} className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">{link.label}<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-amber group-hover:w-4/5 transition-all duration-300" /></Link>;
              }
              return <Link key={link.label} to={link.to!} className={`px-3 py-2 text-sm font-medium transition-colors relative group ${isActive ? 'text-amber' : 'text-slate-300 hover:text-white'}`}>{link.label}<span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-amber transition-all duration-300 ${isActive ? 'w-4/5' : 'w-0 group-hover:w-4/5'}`} /></Link>;
            })}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <a href={data.company.phone} className="flex items-center gap-2 text-amber font-semibold text-sm hover:text-amber-light transition-colors"><Phone className="w-4 h-4" />{data.company.phoneDisplay}</a>
            <Link to="/contact" className="px-5 py-2.5 bg-gradient-to-r from-amber to-amber-light text-navy font-bold text-sm rounded-lg hover:shadow-lg hover:shadow-amber/25 transition-all duration-300 hover:-translate-y-0.5">Devis gratuit</Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-white" aria-label="Menu">{mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-navy/98 backdrop-blur-xl lg:hidden">
            <div className="flex flex-col items-center justify-center h-full gap-6 pt-20">
              {navLinks.map((link, i) => {
                const isHashLink = !!link.href;
                const dest = isHashLink ? (isHome ? link.href!.replace('/', '') : link.href!) : link.to!;
                return (
                  <motion.div key={link.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    {isHashLink && isHome ? (
                      <a href={dest} onClick={() => setMobileOpen(false)} className="text-2xl font-semibold text-white hover:text-amber transition-colors">{link.label}</a>
                    ) : (
                      <Link to={dest} onClick={() => setMobileOpen(false)} className="text-2xl font-semibold text-white hover:text-amber transition-colors">{link.label}</Link>
                    )}
                  </motion.div>
                );
              })}
              <motion.a href={data.company.phone} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-4 flex items-center gap-3 text-amber text-xl font-bold"><Phone className="w-6 h-6" />{data.company.phoneDisplay}</motion.a>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <Link to="/contact" onClick={() => setMobileOpen(false)} className="mt-2 inline-block px-8 py-3 bg-gradient-to-r from-amber to-amber-light text-navy font-bold rounded-lg text-lg">Devis gratuit</Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
