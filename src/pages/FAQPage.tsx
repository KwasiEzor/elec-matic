import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle, ArrowLeft, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../lib/useSiteData';

export default function FAQPage() {
  const siteData = useSiteData();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <Helmet>
        <title>FAQ — Questions Fréquentes | Elec-Matic Électricien Charleroi</title>
        <meta name="description" content="Retrouvez les réponses aux questions les plus fréquentes sur nos services d'électricité à Charleroi : zones d'intervention, devis, délais, conformité RGIE, domotique." />
      </Helmet>

      {/* Hero banner */}
      <section className="relative pt-32 pb-16 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(212,168,83,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-block text-amber font-semibold text-sm uppercase tracking-[0.2em] mb-4">FAQ</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              Questions <span className="text-amber">fréquentes</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Vous avez une question sur nos services, nos tarifs ou notre fonctionnement ?<br />
              Retrouvez ici les réponses les plus courantes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-16 sm:py-24 bg-navy relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {siteData.faq.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
            className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-amber/10 via-amber/5 to-transparent border border-amber/10"
          >
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Vous ne trouvez pas la réponse à votre question ?
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                Contactez-nous directement par téléphone ou via notre formulaire. Nous vous répondons dans les plus brefs délais.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={siteData.company.phone}
                  className="inline-flex items-center gap-3 px-6 py-3 border-2 border-white/20 text-white font-bold rounded-xl hover:border-amber/50 hover:bg-amber/5 transition-all"
                >
                  <Phone className="w-5 h-5 text-amber" />
                  {siteData.company.phoneDisplay}
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-amber to-amber-light text-navy font-bold rounded-xl hover:shadow-2xl hover:shadow-amber/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Nous contacter
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
