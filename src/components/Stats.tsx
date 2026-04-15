import { motion } from 'framer-motion';
import { useSiteData } from '../lib/useSiteData';

export default function Stats() {
  const data = useSiteData();
  const stats = [
    { value: `${data.company.yearsExperience}+`, label: "Années d'expérience" },
    { value: data.company.projectsCompleted, label: 'Projets réalisés' },
    { value: data.company.clientsSatisfied, label: 'Clients satisfaits' },
    { value: data.company.interventionDelay, label: "Délai d'intervention" },
  ];

  return (
    <section className="relative -mt-16 z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="bg-navy-light/80 backdrop-blur-xl p-6 sm:p-8 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
