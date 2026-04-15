import { motion } from 'framer-motion';
import siteData from '../lib/cmsData';

export default function Legal() {
  return (
    <section id="mentions-legales" className="py-24 bg-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-extrabold text-white mb-12">Mentions légales</h2>

          <div className="space-y-8 text-slate-400 leading-relaxed">
            <div>
              <h3 className="text-white font-bold text-lg mb-3">Éditeur du site</h3>
              <p>{siteData.legal.companyFull}</p>
              <p>Forme juridique : {siteData.legal.legalForm}</p>
              <p>Numéro d'entreprise : {siteData.legal.siret}</p>
              <p>Adresse : {siteData.company.address}, {siteData.company.postalCode} {siteData.company.city}</p>
              <p>Téléphone : {siteData.company.phoneDisplay}</p>
              <p>Email : {siteData.company.email}</p>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-3">Hébergement</h3>
              <p>{siteData.legal.host}</p>
              <p>{siteData.legal.hostAddress}</p>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-3">Propriété intellectuelle</h3>
              <p>
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes) est protégé par le droit d'auteur.
                Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site
                est interdite sans l'autorisation écrite préalable de {siteData.company.name}.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-3">Protection des données personnelles</h3>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès,
                de rectification, de suppression et de portabilité de vos données personnelles. Les données collectées via
                les formulaires de contact sont utilisées exclusivement pour traiter vos demandes et ne sont jamais transmises
                à des tiers. Pour exercer vos droits, contactez-nous à {siteData.company.email}.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-3">Cookies</h3>
              <p>
                Ce site utilise uniquement des cookies techniques nécessaires à son bon fonctionnement.
                Aucun cookie publicitaire ou de traçage n'est utilisé.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-3">Limitation de responsabilité</h3>
              <p>
                {siteData.company.name} s'efforce de fournir des informations exactes et à jour sur ce site.
                Toutefois, des erreurs ou omissions peuvent survenir. {siteData.company.name} ne saurait être tenu
                responsable des dommages directs ou indirects résultant de l'utilisation de ce site.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
