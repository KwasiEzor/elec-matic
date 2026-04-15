import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../lib/useSiteData';

export default function HomeFAQPreview() {
  const data = useSiteData();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const previewFaq = data.faq.slice(0, 4);

  return (
    <section id="faq" className="py-24 sm:py-32 bg-navy relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block text-amber font-semibold text-sm uppercase tracking-[0.2em] mb-4">FAQ</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">Questions <span className="text-amber">fréquentes</span></h2>
          <p className="text-slate-400 text-lg">Vous avez une question ? Retrouvez ici les réponses les plus courantes.</p>
        </motion.div>

        <div className="space-y-3">
          {previewFaq.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="border border-white/5 rounded-xl overflow-hidden hover:border-amber/10 transition-colors">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center gap-4 p-5 sm:p-6 text-left">
                <HelpCircle className={`w-5 h-5 shrink-0 transition-colors ${openIndex === i ? 'text-amber' : 'text-slate-600'}`} />
                <span className={`flex-1 font-semibold transition-colors ${openIndex === i ? 'text-white' : 'text-slate-300'}`}>{item.question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-amber' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-14"><p className="text-slate-400 leading-relaxed">{item.answer}</p></div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10">
          <Link to="/faq" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-amber/10 hover:border-amber/20 transition-all">
            Voir toutes les questions <ArrowRight className="w-4 h-4 text-amber" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
