import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useSiteData } from '../lib/useSiteData';

export default function ZoneIntervention() {
  const data = useSiteData();

  return (
    <section className="py-16 bg-navy border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <div className="flex items-center justify-center gap-2 text-amber font-semibold mb-4"><MapPin className="w-5 h-5" />Zone d'intervention</div>
          <h3 className="text-2xl font-bold text-white mb-6">Nous intervenons à Charleroi et dans tout le Hainaut</h3>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {data.company.zones.map((zone) => (
              <span key={zone} className="px-4 py-2 bg-white/5 border border-white/5 text-slate-400 text-sm rounded-full hover:border-amber/20 hover:text-white transition-all">{zone}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
