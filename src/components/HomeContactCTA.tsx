import { motion } from 'framer-motion';
import { Phone, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../lib/useSiteData';

export default function HomeContactCTA() {
  const data = useSiteData();

  return (
    <section id="contact" className="py-24 sm:py-32 bg-navy-dark relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-amber/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber/3 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <span className="inline-block text-amber font-semibold text-sm uppercase tracking-[0.2em] mb-4">Contact</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">Prêt à démarrer votre <span className="text-amber">projet</span> ?</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">Devis gratuit et sans engagement. Intervention rapide sur Charleroi et tout le Hainaut. Réponse garantie sous 24h.</p>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-12">
            {[{ value: 'Gratuit', label: 'Devis' }, { value: '< 24h', label: 'Réponse' }, { value: '98%', label: 'Satisfaits' }].map((item) => (
              <div key={item.label} className="text-center"><div className="text-2xl font-extrabold text-amber">{item.value}</div><div className="text-slate-500 text-xs font-medium mt-0.5">{item.label}</div></div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber to-amber-light text-navy font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-amber/30 transition-all duration-300 hover:-translate-y-1">
              <FileText className="w-5 h-5" />Demander un devis gratuit<ArrowRight className="w-5 h-5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </Link>
            <a href={data.company.phone} className="group inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-white/20 text-white font-bold text-lg rounded-xl hover:border-amber/50 hover:bg-amber/5 transition-all duration-300">
              <Phone className="w-5 h-5 text-amber" />{data.company.phoneDisplay}
            </a>
          </div>
          <p className="text-slate-600 text-sm mt-8">{data.company.yearsExperience}+ ans d'expérience • Certifié RGIE • {data.company.projectsCompleted} projets réalisés</p>
        </motion.div>
      </div>
    </section>
  );
}
