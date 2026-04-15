import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../lib/useSiteData';

export default function LegalPage() {
  const siteData = useSiteData();
  return (
    <>
      <Helmet>
        <title>Mentions Légales & RGPD | Elec-Matic Électricien Charleroi</title>
        <meta name="description" content="Mentions légales, politique de confidentialité et informations RGPD du site Elec-Matic, électricien à Charleroi." />
      </Helmet>

      {/* Hero banner */}
      <section className="relative pt-32 pb-16 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(212,168,83,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber/10 mb-6">
              <Shield className="w-8 h-8 text-amber" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Mentions légales & <span className="text-amber">RGPD</span>
            </h1>
            <p className="text-slate-400 text-lg">
              Informations légales, protection des données et politique de confidentialité.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-10"
          >
            {/* Éditeur */}
            <div className="p-6 sm:p-8 rounded-2xl bg-navy-light/50 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center text-amber text-sm font-extrabold">1</span>
                Éditeur du site
              </h2>
              <div className="space-y-2 text-slate-400 leading-relaxed">
                <p><span className="text-slate-300 font-medium">Raison sociale :</span> {siteData.legal.companyFull}</p>
                <p><span className="text-slate-300 font-medium">Forme juridique :</span> {siteData.legal.legalForm}</p>
                <p><span className="text-slate-300 font-medium">Numéro d'entreprise :</span> {siteData.legal.siret}</p>
                <p><span className="text-slate-300 font-medium">Adresse :</span> {siteData.company.address}, {siteData.company.postalCode} {siteData.company.city}</p>
                <p><span className="text-slate-300 font-medium">Téléphone :</span> <a href={siteData.company.phone} className="text-amber hover:text-amber-light transition-colors">{siteData.company.phoneDisplay}</a></p>
                <p><span className="text-slate-300 font-medium">Email :</span> <a href={`mailto:${siteData.company.email}`} className="text-amber hover:text-amber-light transition-colors">{siteData.company.email}</a></p>
              </div>
            </div>

            {/* Hébergement */}
            <div className="p-6 sm:p-8 rounded-2xl bg-navy-light/50 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center text-amber text-sm font-extrabold">2</span>
                Hébergement
              </h2>
              <div className="space-y-2 text-slate-400 leading-relaxed">
                <p><span className="text-slate-300 font-medium">Hébergeur :</span> {siteData.legal.host}</p>
                <p><span className="text-slate-300 font-medium">Adresse :</span> {siteData.legal.hostAddress}</p>
              </div>
            </div>

            {/* Propriété intellectuelle */}
            <div className="p-6 sm:p-8 rounded-2xl bg-navy-light/50 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center text-amber text-sm font-extrabold">3</span>
                Propriété intellectuelle
              </h2>
              <p className="text-slate-400 leading-relaxed">
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes) est protégé par le droit d'auteur.
                Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site
                est interdite sans l'autorisation écrite préalable de {siteData.company.name}.
              </p>
            </div>

            {/* RGPD */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber/5 to-transparent border border-amber/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber/20 flex items-center justify-center text-amber text-sm font-extrabold">4</span>
                Protection des données personnelles (RGPD)
              </h2>
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679),
                  {siteData.company.name} s'engage à protéger la vie privée des utilisateurs de ce site.
                </p>

                <div>
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-2">Données collectées</h3>
                  <p>
                    Les seules données personnelles collectées sont celles que vous fournissez volontairement via nos formulaires
                    de contact et de demande de devis : nom, prénom, adresse email, numéro de téléphone, adresse et description de votre projet.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-2">Finalité du traitement</h3>
                  <p>
                    Vos données sont utilisées exclusivement pour :
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-slate-500">
                    <li>Répondre à vos demandes de contact et de devis</li>
                    <li>Vous recontacter dans le cadre de votre projet</li>
                    <li>Assurer le suivi de nos prestations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-2">Durée de conservation</h3>
                  <p>
                    Vos données sont conservées pendant une durée maximale de 3 ans à compter de votre dernière interaction avec nous,
                    sauf obligation légale de conservation plus longue.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-2">Vos droits</h3>
                  <p>
                    Vous disposez d'un droit d'accès, de rectification, de suppression, de limitation du traitement,
                    de portabilité et d'opposition concernant vos données personnelles.
                  </p>
                  <p className="mt-2">
                    Pour exercer ces droits, contactez-nous à :{' '}
                    <a href={`mailto:${siteData.company.email}`} className="text-amber hover:text-amber-light transition-colors font-medium">
                      {siteData.company.email}
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-2">Transfert à des tiers</h3>
                  <p>
                    Vos données personnelles ne sont jamais vendues, échangées ou transmises à des tiers sans votre consentement explicite,
                    sauf obligation légale.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-2">Autorité de contrôle</h3>
                  <p>
                    En cas de litige, vous pouvez introduire une réclamation auprès de l'Autorité de protection des données (APD) :
                    <br /><span className="text-slate-500">Rue de la Presse 35, 1000 Bruxelles — <a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noopener noreferrer" className="text-amber/70 hover:text-amber">www.autoriteprotectiondonnees.be</a></span>
                  </p>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div className="p-6 sm:p-8 rounded-2xl bg-navy-light/50 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center text-amber text-sm font-extrabold">5</span>
                Cookies
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Ce site utilise uniquement des cookies techniques strictement nécessaires à son bon fonctionnement.
                Aucun cookie publicitaire, analytique ou de traçage n'est utilisé. Aucun consentement n'est donc requis
                conformément à la directive ePrivacy.
              </p>
            </div>

            {/* Limitation de responsabilité */}
            <div className="p-6 sm:p-8 rounded-2xl bg-navy-light/50 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center text-amber text-sm font-extrabold">6</span>
                Limitation de responsabilité
              </h2>
              <p className="text-slate-400 leading-relaxed">
                {siteData.company.name} s'efforce de fournir des informations exactes et à jour sur ce site.
                Toutefois, des erreurs ou omissions peuvent survenir. {siteData.company.name} ne saurait être tenu
                responsable des dommages directs ou indirects résultant de l'utilisation de ce site ou de l'impossibilité
                de l'utiliser.
              </p>
            </div>

            {/* Droit applicable */}
            <div className="p-6 sm:p-8 rounded-2xl bg-navy-light/50 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center text-amber text-sm font-extrabold">7</span>
                Droit applicable
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Le présent site et ses mentions légales sont soumis au droit belge.
                En cas de litige, les tribunaux de l'arrondissement judiciaire de Charleroi seront seuls compétents.
              </p>
            </div>

            {/* Last update */}
            <div className="text-center pt-8 border-t border-white/5">
              <p className="text-slate-600 text-sm">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-BE', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
