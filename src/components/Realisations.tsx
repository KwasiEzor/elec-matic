import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import { useSiteData } from '../lib/useSiteData';

export default function Realisations() {
  const data = useSiteData();
  const categories = ['Toutes', ...new Set(data.realisations.map((r) => r.category))];
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = activeCategory === 'Toutes' ? data.realisations : data.realisations.filter((r) => r.category === activeCategory);

  return (
    <section id="realisations" className="py-24 sm:py-32 bg-navy-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block text-amber font-semibold text-sm uppercase tracking-[0.2em] mb-4">Nos réalisations</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">La qualité en <span className="text-amber">images</span></h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Découvrez quelques-uns de nos projets récents.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeCategory === cat ? 'bg-amber text-navy' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((real) => (
              <motion.div key={real.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}
                className="group cursor-pointer" onClick={() => setLightbox(real.image)}>
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                  <img src={real.image} alt={real.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-3 py-1 bg-amber/20 text-amber text-xs font-semibold rounded-full mb-2">{real.category}</span>
                    <h3 className="text-white font-bold text-lg leading-tight">{real.title}</h3>
                    <div className="flex items-center gap-1 text-slate-400 text-sm mt-1"><MapPin className="w-3 h-3" /> {real.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-white/70 hover:text-white p-2"><X className="w-8 h-8" /></button>
            <motion.img initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} src={lightbox} alt="Réalisation" className="max-w-full max-h-[85vh] rounded-xl object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
