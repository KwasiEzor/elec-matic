import { motion } from 'framer-motion';
import { Phone, FileText, ChevronDown, Shield, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../lib/useSiteData';

export default function Hero() {
  const data = useSiteData();

  return (
    <section id="accueil" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src="/images/hero-electrician.jpg" alt="Électricien professionnel Charleroi" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-60" />
      </div>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(212,168,83,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber/10 border border-amber/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-amber">Disponible — Intervention rapide sur le Hainaut</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6">
            {data.hero.headline.split(' ').map((word, i) => (
              <span key={i} className={word === 'excellence' || word === "L'excellence" ? 'text-amber' : ''}>{word}{' '}</span>
            ))}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl">
            {data.hero.subheadline}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link to="/contact" className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber to-amber-light text-navy font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-amber/30 transition-all duration-300 hover:-translate-y-1">
              <FileText className="w-5 h-5" />{data.hero.ctaPrimary}
            </Link>
            <a href={data.company.phone} className="group inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-white/20 text-white font-bold text-lg rounded-xl hover:border-amber/50 hover:bg-amber/5 transition-all duration-300">
              <Phone className="w-5 h-5 text-amber" />{data.company.phoneDisplay}
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }} className="flex flex-wrap gap-6 sm:gap-10">
            {[
              { icon: Award, text: `${data.company.yearsExperience} ans d'expérience` },
              { icon: Shield, text: 'Certifié RGIE' },
              { icon: Clock, text: 'Intervention < 24h' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-slate-400">
                <Icon className="w-4 h-4 text-amber/70" /><span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.a href="#services" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-amber transition-colors">
        <span className="text-xs font-medium tracking-wider uppercase">Découvrir</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.a>
    </section>
  );
}
