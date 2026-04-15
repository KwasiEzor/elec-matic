import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Sparkles, Handshake } from 'lucide-react';
import { useSiteData } from '../lib/useSiteData';

const iconMap: Record<string, React.ElementType> = { ShieldCheck, Clock, Sparkles, HandshakeIcon: Handshake };

export default function About() {
  const data = useSiteData();

  return (
    <section id="apropos" className="py-24 sm:py-32 bg-navy-dark relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img src="/images/about-team.jpg" alt="Équipe Elec-Matic" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-amber rounded-2xl p-6 shadow-2xl shadow-amber/20">
              <div className="text-navy font-extrabold text-3xl">{data.company.yearsExperience}+</div>
              <div className="text-navy/70 font-semibold text-sm">ans d'expérience</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="inline-block text-amber font-semibold text-sm uppercase tracking-[0.2em] mb-4">À propos</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 leading-tight">{data.about.title}</h2>
            <div className="space-y-4 mb-10">
              {data.about.paragraphs.map((p, i) => <p key={i} className="text-slate-400 leading-relaxed">{p}</p>)}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.about.values.map((val, i) => {
                const Icon = iconMap[val.icon] || ShieldCheck;
                return (
                  <motion.div key={val.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-amber" /></div>
                    <div>
                      <div className="text-white font-bold text-sm">{val.title}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{val.desc}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
