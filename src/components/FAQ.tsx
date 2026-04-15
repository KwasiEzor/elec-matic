import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import siteData from '../lib/cmsData';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 sm:py-32 bg-navy relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-amber font-semibold text-sm uppercase tracking-[0.2em] mb-4">FAQ</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
            Questions <span className="text-amber">fréquentes</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Vous avez une question ? Retrouvez ici les réponses les plus courantes.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {siteData.faq.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-white/5 rounded-xl overflow-hidden hover:border-amber/10 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center gap-4 p-5 sm:p-6 text-left"
              >
                <HelpCircle className={`w-5 h-5 shrink-0 transition-colors ${
                  openIndex === i ? 'text-amber' : 'text-slate-600'
                }`} />
                <span className={`flex-1 font-semibold transition-colors ${
                  openIndex === i ? 'text-white' : 'text-slate-300'
                }`}>
                  {item.question}
                </span>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
                  openIndex === i ? 'rotate-180 text-amber' : ''
                }`} />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-14">
                  <p className="text-slate-400 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12 p-8 rounded-2xl bg-gradient-to-r from-amber/10 to-amber/5 border border-amber/10"
        >
          <p className="text-white font-semibold text-lg mb-2">Vous ne trouvez pas la réponse à votre question ?</p>
          <p className="text-slate-400 mb-6">Contactez-nous directement, nous vous répondons dans les plus brefs délais.</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber text-navy font-bold rounded-xl hover:shadow-lg hover:shadow-amber/25 transition-all"
          >
            Nous contacter
          </a>
        </motion.div>
      </div>
    </section>
  );
}
