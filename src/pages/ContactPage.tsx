import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../lib/useSiteData';

export default function ContactPage() {
  const siteData = useSiteData();
  const [formType, setFormType] = useState<'contact' | 'devis'>('devis');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', service: '', message: '', urgency: 'normal'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>Contact & Devis Gratuit | Elec-Matic — Électricien Charleroi</title>
        <meta name="description" content="Contactez Elec-Matic pour un devis gratuit. Électricien à Charleroi et Hainaut. Appelez le 0488 32 21 42 ou remplissez notre formulaire. Réponse sous 24h." />
      </Helmet>

      {/* Hero banner */}
      <section className="relative pt-32 pb-16 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(212,168,83,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-block text-amber font-semibold text-sm uppercase tracking-[0.2em] mb-4">Contact</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              Parlons de votre <span className="text-amber">projet</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Devis gratuit et sans engagement. Réponse garantie sous 24h.<br />
              Intervention rapide sur Charleroi et tout le Hainaut.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24 bg-navy relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-amber/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Phone Card */}
              <a
                href={siteData.company.phone}
                className="group flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber/10 to-amber/5 border border-amber/20 hover:border-amber/40 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-amber/20 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-amber" />
                </div>
                <div>
                  <div className="text-white font-bold text-xl group-hover:text-amber transition-colors">
                    {siteData.company.phoneDisplay}
                  </div>
                  <div className="text-slate-400 text-sm">Appel direct — Réponse immédiate</div>
                </div>
              </a>

              {/* Contact details */}
              <div className="space-y-4">
                {[
                  { icon: Mail, label: siteData.company.email, href: `mailto:${siteData.company.email}` },
                  { icon: MapPin, label: `${siteData.company.city}, ${siteData.company.region}`, href: '#' },
                ].map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href} className="flex items-center gap-4 text-slate-400 hover:text-white transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-amber/70" />
                    </div>
                    <span className="text-sm">{label}</span>
                  </a>
                ))}
              </div>

              {/* Hours */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-white font-bold mb-4">
                  <Clock className="w-5 h-5 text-amber" />
                  Horaires
                </div>
                <div className="space-y-2">
                  {siteData.company.hours.map((h) => (
                    <div key={h.day} className="flex justify-between text-sm">
                      <span className="text-slate-400">{h.day}</span>
                      <span className={`font-medium ${
                        h.day === 'Urgences' ? 'text-amber' : h.hours === 'Fermé' ? 'text-red-400' : 'text-white'
                      }`}>{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zone */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-white font-bold mb-3">
                  <MapPin className="w-5 h-5 text-amber" />
                  Zone d'intervention
                </div>
                <div className="flex flex-wrap gap-2">
                  {siteData.company.zones.map((z) => (
                    <span key={z} className="px-3 py-1 bg-white/5 text-slate-400 text-xs rounded-full">{z}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="bg-navy-light/50 border border-white/5 rounded-3xl p-6 sm:p-8">
                {/* Form type toggle */}
                <div className="flex gap-2 mb-8 p-1 bg-white/5 rounded-xl">
                  {[
                    { type: 'devis' as const, icon: FileText, label: 'Demande de devis' },
                    { type: 'contact' as const, icon: Send, label: 'Message' },
                  ].map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      onClick={() => setFormType(type)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                        formType === type
                          ? 'bg-amber text-navy'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Message envoyé !</h3>
                    <p className="text-slate-400">Nous vous recontactons dans les 24 heures.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Nom complet *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-amber/50 focus:ring-1 focus:ring-amber/25 transition-all outline-none"
                          placeholder="Votre nom"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Téléphone *</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-amber/50 focus:ring-1 focus:ring-amber/25 transition-all outline-none"
                          placeholder="04XX XX XX XX"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-amber/50 focus:ring-1 focus:ring-amber/25 transition-all outline-none"
                          placeholder="votre@email.be"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Localité</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-amber/50 focus:ring-1 focus:ring-amber/25 transition-all outline-none"
                          placeholder="Charleroi, Fleurus..."
                        />
                      </div>
                    </div>

                    {formType === 'devis' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Service souhaité *</label>
                          <select
                            name="service"
                            required
                            value={formData.service}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-amber/50 focus:ring-1 focus:ring-amber/25 transition-all outline-none appearance-none"
                          >
                            <option value="" className="bg-navy">Sélectionnez un service</option>
                            {siteData.services.map((s) => (
                              <option key={s.id} value={s.title} className="bg-navy">{s.title}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Urgence</label>
                          <div className="flex gap-3">
                            {[
                              { value: 'normal', label: 'Normal', color: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
                              { value: 'rapide', label: 'Rapide', color: 'bg-amber/10 text-amber border-amber/20' },
                              { value: 'urgent', label: 'Urgent', color: 'bg-red-400/10 text-red-400 border-red-400/20' },
                            ].map((u) => (
                              <button
                                key={u.value}
                                type="button"
                                onClick={() => setFormData({ ...formData, urgency: u.value })}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                                  formData.urgency === u.value ? u.color : 'bg-white/5 text-slate-500 border-white/10'
                                }`}
                              >
                                {u.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {formType === 'devis' ? 'Description de votre projet *' : 'Votre message *'}
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-amber/50 focus:ring-1 focus:ring-amber/25 transition-all outline-none resize-none"
                        placeholder={formType === 'devis' ? 'Décrivez votre projet, le type de travaux, la surface...' : 'Votre message...'}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-amber to-amber-light text-navy font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-amber/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-3"
                    >
                      <Send className="w-5 h-5" />
                      {formType === 'devis' ? 'Envoyer ma demande de devis' : 'Envoyer le message'}
                    </button>

                    <p className="text-slate-600 text-xs text-center">
                      En soumettant ce formulaire, vous acceptez notre{' '}
                      <Link to="/mentions-legales" className="text-amber/60 hover:text-amber underline">politique de confidentialité</Link>.
                      Vos données sont utilisées uniquement pour traiter votre demande.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map placeholder / extra trust */}
      <section className="py-16 bg-navy-dark border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { value: 'Gratuit', label: 'Devis sans engagement', desc: 'Estimation détaillée offerte' },
              { value: '< 24h', label: 'Réponse rapide', desc: 'Nous vous recontactons vite' },
              { value: '15+ ans', label: 'D\'expérience', desc: 'Expertise certifiée RGIE' },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5"
              >
                <div className="text-3xl font-extrabold text-amber mb-1">{item.value}</div>
                <div className="text-white font-semibold text-sm">{item.label}</div>
                <div className="text-slate-500 text-xs mt-1">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
