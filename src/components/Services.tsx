import { motion } from 'framer-motion';
import { Zap, AlertTriangle, ShieldCheck, Wrench, Lightbulb, Smartphone, Camera, Video, Network, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../lib/useSiteData';

const iconMap: Record<string, React.ElementType> = { Zap, AlertTriangle, ShieldCheck, Wrench, Lightbulb, Smartphone, Camera, Video, Network };

export default function Services() {
  const data = useSiteData();

  return (
    <section id="services" className="py-24 sm:py-32 bg-navy relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block text-amber font-semibold text-sm uppercase tracking-[0.2em] mb-4">Nos services</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">Des solutions électriques<br /><span className="text-amber">complètes et sur mesure</span></h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">De l'installation neuve au dépannage urgent, nous couvrons l'ensemble de vos besoins électriques avec expertise et professionnalisme.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.services.map((service, i) => {
            const Icon = iconMap[service.icon] || Zap;
            return (
              <motion.div key={service.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="group relative bg-navy-light/50 border border-white/5 rounded-2xl p-6 sm:p-8 hover:border-amber/20 hover:bg-navy-light/80 transition-all duration-500">
                <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center mb-5 group-hover:bg-amber/20 transition-colors">
                  <Icon className="w-6 h-6 text-amber" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{service.shortDesc}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((f) => (<li key={f} className="flex items-center gap-2 text-sm text-slate-500"><span className="w-1 h-1 rounded-full bg-amber" />{f}</li>))}
                </ul>
                <Link to="/contact" className="inline-flex items-center gap-2 text-amber text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  Demander un devis <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-16">
          <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber to-amber-light text-navy font-bold rounded-xl hover:shadow-2xl hover:shadow-amber/25 transition-all duration-300 hover:-translate-y-1">
            Discutons de votre projet <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
