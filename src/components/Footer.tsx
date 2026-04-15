import { Zap, Phone, Mail, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteData } from '../lib/useSiteData';

export default function Footer() {
  const data = useSiteData();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const footerNav = [
    { label: 'Accueil', to: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Réalisations', href: '/#realisations' },
    { label: 'Avis clients', href: '/#avis' },
    { label: 'À propos', href: '/#apropos' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Contact', to: '/contact' },
    { label: 'Mentions légales', to: '/mentions-legales' },
  ];

  const serviceLinks = data.services.slice(0, 6).map((s) => ({ label: s.title, href: '/#services' }));

  const renderLink = (item: { label: string; to?: string; href?: string }) => {
    if (item.to) return <Link to={item.to} className="text-slate-500 text-sm hover:text-amber transition-colors">{item.label}</Link>;
    if (item.href && isHome) return <a href={item.href.replace('/', '')} className="text-slate-500 text-sm hover:text-amber transition-colors">{item.label}</a>;
    return <Link to={item.href!} className="text-slate-500 text-sm hover:text-amber transition-colors">{item.label}</Link>;
  };

  return (
    <footer className="bg-navy-dark border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber to-amber-light flex items-center justify-center"><Zap className="w-5 h-5 text-navy" strokeWidth={2.5} /></div>
              <div><div className="text-lg font-bold text-white">{data.company.name}</div><div className="text-[10px] text-amber/70 uppercase tracking-[0.2em]">{data.company.tagline}</div></div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">Votre électricien de confiance à Charleroi et dans le Hainaut. Installation, rénovation, dépannage — qualité et sécurité garanties.</p>
            <div className="space-y-2">
              <a href={data.company.phone} className="flex items-center gap-2 text-amber font-semibold text-sm hover:text-amber-light transition-colors"><Phone className="w-4 h-4" />{data.company.phoneDisplay}</a>
              <a href={`mailto:${data.company.email}`} className="flex items-center gap-2 text-slate-400 text-sm hover:text-white transition-colors"><Mail className="w-4 h-4" />{data.company.email}</a>
              <div className="flex items-center gap-2 text-slate-400 text-sm"><MapPin className="w-4 h-4" />{data.company.city}, {data.company.region}</div>
            </div>
          </div>
          <div><h4 className="text-white font-bold mb-4">Navigation</h4><ul className="space-y-2">{footerNav.map((item) => <li key={item.label}>{renderLink(item)}</li>)}</ul></div>
          <div><h4 className="text-white font-bold mb-4">Services</h4><ul className="space-y-2">{serviceLinks.map((item) => <li key={item.label}>{renderLink(item)}</li>)}</ul></div>
          <div>
            <h4 className="text-white font-bold mb-4">Besoin d'un électricien ?</h4>
            <p className="text-slate-500 text-sm mb-5">Devis gratuit et sans engagement. Intervention rapide sur Charleroi et le Hainaut.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber to-amber-light text-navy font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-amber/25 transition-all">Demander un devis</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">© {new Date().getFullYear()} {data.company.name}. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Link to="/mentions-legales" className="text-slate-600 text-sm hover:text-slate-400 transition-colors">Mentions légales & RGPD</Link>
            <span className="text-slate-700">|</span>
            <span className="text-slate-600 text-sm">Électricien à {data.company.city}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
