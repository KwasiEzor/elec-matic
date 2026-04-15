import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useSiteData } from '../lib/useSiteData';

export default function Testimonials() {
  const data = useSiteData();
  const testimonials = data.testimonials;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => { setCurrent((prev) => (prev + 1) % testimonials.length); }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  if (!testimonials.length) return null;

  return (
    <section id="avis" className="py-24 sm:py-32 bg-navy relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-amber/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block text-amber font-semibold text-sm uppercase tracking-[0.2em] mb-4">Témoignages</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">La parole à nos <span className="text-amber">clients</span></h2>
          <div className="flex items-center justify-center gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-amber text-amber" />)}</div>
          <p className="text-slate-400 text-lg">Note moyenne : 5/5 basée sur {testimonials.length} avis vérifiés</p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }}
              className="bg-navy-light/50 border border-white/5 rounded-3xl p-8 sm:p-12 relative">
              <Quote className="absolute top-6 left-6 w-12 h-12 text-amber/10" />
              <div className="flex items-center gap-1 mb-6">{[...Array(testimonials[current].rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber text-amber" />)}</div>
              <blockquote className="text-xl sm:text-2xl text-white leading-relaxed mb-8 font-medium">"{testimonials[current].text}"</blockquote>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-lg">{testimonials[current].name}</div>
                  <div className="text-slate-400 text-sm">{testimonials[current].location} — {testimonials[current].service}</div>
                </div>
                <div className="text-slate-500 text-sm">{testimonials[current].date}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-amber/10 hover:border-amber/20 transition-all" aria-label="Précédent"><ChevronLeft className="w-5 h-5" /></button>
            <div className="flex gap-2">{testimonials.map((_, i) => <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? 'bg-amber w-8' : 'bg-white/20 hover:bg-white/40'}`} />)}</div>
            <button onClick={next} className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-amber/10 hover:border-amber/20 transition-all" aria-label="Suivant"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-16">
          {testimonials.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:border-amber/10 transition-colors">
              <div className="flex items-center gap-1 mb-3">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber text-amber" />)}</div>
              <p className="text-slate-300 text-sm leading-relaxed mb-3 line-clamp-3">"{t.text}"</p>
              <div className="text-white text-sm font-semibold">{t.name}</div>
              <div className="text-slate-500 text-xs">{t.location}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
