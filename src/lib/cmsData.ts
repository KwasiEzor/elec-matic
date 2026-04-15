// CMS Data Store - Edit this file to update all website content
// This serves as a simple CMS for the Elec-Matic website

export interface Service {
  id: string;
  icon: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  features: string[];
}

export interface Realisation {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  location: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
  date: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SiteData {
  company: {
    name: string;
    tagline: string;
    phone: string;
    phoneDisplay: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    region: string;
    country: string;
    vatNumber: string;
    hours: { day: string; hours: string }[];
    zones: string[];
    yearsExperience: number;
    projectsCompleted: string;
    clientsSatisfied: string;
    interventionDelay: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  hero: {
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  services: Service[];
  realisations: Realisation[];
  testimonials: Testimonial[];
  faq: FAQItem[];
  about: {
    title: string;
    paragraphs: string[];
    values: { icon: string; title: string; desc: string }[];
  };
  legal: {
    companyFull: string;
    legalForm: string;
    siret: string;
    host: string;
    hostAddress: string;
  };
}

const siteData: SiteData = {
  company: {
    name: "Elec-Matic",
    tagline: "Électricité Générale",
    phone: "tel:+32488322142",
    phoneDisplay: "0488 32 21 42",
    email: "contact@elec-matic.be",
    address: "Charleroi",
    city: "Charleroi",
    postalCode: "6000",
    region: "Hainaut",
    country: "Belgique",
    vatNumber: "BE 0XXX.XXX.XXX",
    hours: [
      { day: "Lundi - Vendredi", hours: "07:00 - 18:00" },
      { day: "Samedi", hours: "08:00 - 13:00" },
      { day: "Dimanche", hours: "Fermé" },
      { day: "Urgences", hours: "24h/24 - 7j/7" }
    ],
    zones: [
      "Charleroi", "Montigny-le-Tilleul", "Gerpinnes", "Ham-sur-Heure",
      "Fleurus", "Châtelet", "Couvin", "Thuin", "Fontaine-l'Évêque",
      "Mons", "La Louvière", "Binche", "Manage", "Seneffe",
      "Tout le Hainaut"
    ],
    yearsExperience: 15,
    projectsCompleted: "2 500+",
    clientsSatisfied: "98%",
    interventionDelay: "< 24h"
  },
  seo: {
    title: "Elec-Matic | Électricien à Charleroi – Électricité Générale & Domotique",
    description: "Elec-Matic, votre électricien de confiance à Charleroi et dans le Hainaut. Électricité générale, dépannage, mise en conformité, domotique, caméras de surveillance. Devis gratuit au 0488 32 21 42.",
    keywords: [
      "électricien Charleroi", "électricité générale Hainaut", "dépannage électrique Charleroi",
      "mise en conformité électrique", "domotique Charleroi", "caméras surveillance Charleroi",
      "rénovation électrique Hainaut", "éclairage LED Charleroi", "câblage informatique",
      "vidéophonie Charleroi", "parlophonie", "électricien Hainaut"
    ]
  },
  hero: {
    headline: "L'excellence électrique au service de votre confort",
    subheadline: "Électricien certifié à Charleroi et dans le Hainaut. Installation, rénovation, dépannage — un travail soigné, des solutions durables.",
    ctaPrimary: "Demander un devis gratuit",
    ctaSecondary: "Appeler maintenant"
  },
  services: [
    {
      id: "electricite-generale",
      icon: "Zap",
      title: "Électricité Générale",
      shortDesc: "Installation et maintenance de systèmes électriques complets pour particuliers et professionnels.",
      longDesc: "De la conception à la réalisation, nous prenons en charge l'intégralité de vos installations électriques. Tableaux, câblage, prises, interrupteurs — chaque détail est pensé pour votre sécurité et votre confort.",
      features: ["Tableaux électriques", "Câblage complet", "Prises & interrupteurs", "Certification RGIE"]
    },
    {
      id: "depannage",
      icon: "AlertTriangle",
      title: "Dépannage Électrique",
      shortDesc: "Intervention rapide en moins de 24h pour tous vos problèmes électriques urgents.",
      longDesc: "Panne de courant, court-circuit, disjoncteur qui saute ? Notre équipe intervient rapidement sur Charleroi et le Hainaut pour diagnostiquer et résoudre tout problème électrique.",
      features: ["Intervention < 24h", "Diagnostic précis", "Réparation durable", "Disponible 7j/7"]
    },
    {
      id: "mise-en-conformite",
      icon: "ShieldCheck",
      title: "Mise en Conformité",
      shortDesc: "Mise aux normes RGIE de votre installation pour garantir sécurité et conformité.",
      longDesc: "Votre installation électrique doit répondre aux normes RGIE en vigueur. Nous réalisons l'audit complet, identifions les non-conformités et effectuons les travaux nécessaires pour obtenir votre attestation.",
      features: ["Audit complet", "Rapport détaillé", "Travaux de mise aux normes", "Attestation RGIE"]
    },
    {
      id: "renovation-electrique",
      icon: "Wrench",
      title: "Rénovation Électrique",
      shortDesc: "Modernisation complète de vos installations électriques existantes.",
      longDesc: "Vous rénovez votre habitation ou vos locaux ? Nous modernisons votre installation électrique de A à Z : remplacement du tableau, nouveau câblage, ajout de circuits, optimisation énergétique.",
      features: ["Remplacement tableau", "Nouveau câblage", "Optimisation énergétique", "Finitions soignées"]
    },
    {
      id: "eclairage",
      icon: "Lightbulb",
      title: "Éclairage",
      shortDesc: "Conception et installation d'éclairages intérieurs et extérieurs sur mesure.",
      longDesc: "L'éclairage transforme un espace. Nous concevons des solutions d'éclairage LED personnalisées : spots encastrés, rubans LED, éclairage architectural, éclairage de jardin et bien plus.",
      features: ["Éclairage LED", "Spots encastrés", "Éclairage extérieur", "Variateurs d'intensité"]
    },
    {
      id: "domotique",
      icon: "Smartphone",
      title: "Domotique",
      shortDesc: "Automatisation intelligente de votre habitat pour plus de confort et d'économies.",
      longDesc: "Pilotez votre maison du bout des doigts : éclairage, chauffage, volets, alarme. Nous installons et configurons des systèmes domotiques adaptés à vos besoins et votre budget.",
      features: ["Contrôle à distance", "Scénarios automatisés", "Économies d'énergie", "Installation sur mesure"]
    },
    {
      id: "cameras-surveillance",
      icon: "Camera",
      title: "Caméras de Surveillance",
      shortDesc: "Systèmes de vidéosurveillance professionnels pour sécuriser vos biens.",
      longDesc: "Protégez votre domicile ou vos locaux professionnels avec nos systèmes de vidéosurveillance haute définition. Installation, configuration et accès à distance sur smartphone inclus.",
      features: ["Caméras HD/4K", "Vision nocturne", "Accès smartphone", "Enregistrement continu"]
    },
    {
      id: "videophonie-parlophonie",
      icon: "Video",
      title: "Vidéophonie & Parlophonie",
      shortDesc: "Systèmes d'interphonie vidéo et audio pour contrôler vos accès.",
      longDesc: "Voyez et communiquez avec vos visiteurs avant d'ouvrir. Nous installons des systèmes de vidéophonie et parlophonie modernes, filaires ou sans fil, pour maisons et immeubles.",
      features: ["Écran couleur", "Ouverture à distance", "Multi-postes", "Filaire ou sans fil"]
    },
    {
      id: "cablage-informatique",
      icon: "Network",
      title: "Câblage Informatique",
      shortDesc: "Infrastructure réseau structurée pour entreprises et particuliers.",
      longDesc: "Un réseau performant commence par un câblage de qualité. Nous réalisons le câblage structuré de vos locaux : baies de brassage, prises RJ45, fibre optique, Wi-Fi professionnel.",
      features: ["Câblage Cat6/Cat6a", "Baies de brassage", "Prises RJ45", "Wi-Fi professionnel"]
    }
  ],
  realisations: [
    {
      id: "r1",
      title: "Rénovation complète villa à Montigny-le-Tilleul",
      category: "Rénovation",
      image: "/images/realisation-1.jpg",
      description: "Rénovation électrique intégrale d'une villa de 280m² : nouveau tableau 4 rangées, 42 circuits, éclairage LED encastré, domotique KNX.",
      location: "Montigny-le-Tilleul"
    },
    {
      id: "r2",
      title: "Installation domotique appartement moderne",
      category: "Domotique",
      image: "/images/realisation-2.jpg",
      description: "Système domotique complet : gestion éclairage, volets, chauffage et scénarios automatisés via application smartphone.",
      location: "Charleroi Centre"
    },
    {
      id: "r3",
      title: "Vidéosurveillance commerce de détail",
      category: "Sécurité",
      image: "/images/realisation-3.jpg",
      description: "Installation de 8 caméras 4K avec enregistreur NVR, accès à distance et détection de mouvement intelligente.",
      location: "Fleurus"
    },
    {
      id: "r4",
      title: "Mise en conformité immeuble de rapport",
      category: "Conformité",
      image: "/images/realisation-4.jpg",
      description: "Mise aux normes RGIE complète d'un immeuble de 6 appartements : tableaux, différentiels, câblage et terre.",
      location: "Châtelet"
    },
    {
      id: "r5",
      title: "Éclairage architectural restaurant gastronomique",
      category: "Éclairage",
      image: "/images/realisation-5.jpg",
      description: "Conception et installation d'un éclairage d'ambiance sur mesure : spots orientables, rubans LED RGBW, variateurs.",
      location: "Charleroi"
    },
    {
      id: "r6",
      title: "Vidéophonie résidence 12 appartements",
      category: "Vidéophonie",
      image: "/images/realisation-6.jpg",
      description: "Installation complète vidéophonie avec platine de rue, 12 moniteurs couleur et contrôle d'accès par badge.",
      location: "Gerpinnes"
    }
  ],
  testimonials: [
    {
      id: "t1",
      name: "Marc D.",
      location: "Charleroi",
      rating: 5,
      text: "Travail impeccable du début à la fin. L'équipe d'Elec-Matic a rénové toute l'installation électrique de notre maison. Propre, ponctuel et très professionnel. Je recommande sans hésitation.",
      service: "Rénovation électrique",
      date: "Novembre 2024"
    },
    {
      id: "t2",
      name: "Sophie L.",
      location: "Montigny-le-Tilleul",
      rating: 5,
      text: "Intervention rapide pour une panne un samedi matin. Le technicien a diagnostiqué et résolu le problème en moins d'une heure. Tarif transparent, aucune mauvaise surprise. Merci !",
      service: "Dépannage",
      date: "Octobre 2024"
    },
    {
      id: "t3",
      name: "Philippe M.",
      location: "Fleurus",
      rating: 5,
      text: "Elec-Matic a installé notre système de vidéosurveillance et la domotique. Tout fonctionne parfaitement, l'application est intuitive. Un vrai gain de confort et de sérénité au quotidien.",
      service: "Domotique & Sécurité",
      date: "Septembre 2024"
    },
    {
      id: "t4",
      name: "Catherine V.",
      location: "Châtelet",
      rating: 5,
      text: "Notre immeuble devait être mis en conformité pour la vente. Elec-Matic a géré l'ensemble des travaux avec efficacité. Attestation obtenue du premier coup. Rapport qualité-prix excellent.",
      service: "Mise en conformité",
      date: "Août 2024"
    },
    {
      id: "t5",
      name: "Jean-François R.",
      location: "Gerpinnes",
      rating: 5,
      text: "Très satisfait de l'éclairage LED installé dans notre salon et notre jardin. Le résultat est magnifique, l'ambiance est totalement transformée. Des vrais professionnels passionnés.",
      service: "Éclairage",
      date: "Juillet 2024"
    },
    {
      id: "t6",
      name: "Entreprise Dupont SPRL",
      location: "Charleroi",
      rating: 5,
      text: "Câblage informatique complet de nos nouveaux bureaux. Installation propre, bien organisée, et livrée dans les délais. Notre réseau est performant et fiable. Partenaire de confiance.",
      service: "Câblage informatique",
      date: "Juin 2024"
    }
  ],
  faq: [
    {
      question: "Quelle est votre zone d'intervention ?",
      answer: "Nous intervenons principalement à Charleroi et dans toute la province du Hainaut : Montigny-le-Tilleul, Gerpinnes, Fleurus, Châtelet, Thuin, Fontaine-l'Évêque, Mons, La Louvière, Binche et environs."
    },
    {
      question: "Le devis est-il gratuit ?",
      answer: "Oui, tous nos devis sont entièrement gratuits et sans engagement. Nous nous déplaçons chez vous pour évaluer précisément vos besoins et vous proposer une solution adaptée à votre budget."
    },
    {
      question: "Quel est votre délai d'intervention pour un dépannage ?",
      answer: "Pour les urgences, nous nous engageons à intervenir en moins de 24 heures sur Charleroi et sa périphérie. Pour les cas critiques (panne totale, danger), nous faisons notre maximum pour intervenir le jour même."
    },
    {
      question: "Vos installations sont-elles conformes au RGIE ?",
      answer: "Absolument. Toutes nos installations respectent scrupuleusement le Règlement Général sur les Installations Électriques (RGIE). Nous travaillons en conformité avec les normes en vigueur et pouvons vous accompagner pour l'obtention de votre attestation de conformité."
    },
    {
      question: "Travaillez-vous pour les particuliers et les professionnels ?",
      answer: "Oui, nous intervenons aussi bien chez les particuliers (maisons, appartements) que pour les professionnels (commerces, bureaux, restaurants, immeubles). Chaque projet bénéficie du même niveau d'exigence et de qualité."
    },
    {
      question: "Proposez-vous un service après-vente ?",
      answer: "Bien sûr. Nous assurons un suivi après chaque intervention. En cas de problème lié à nos travaux, nous revenons gratuitement pendant la période de garantie. Votre satisfaction est notre priorité."
    },
    {
      question: "Comment fonctionne la domotique que vous installez ?",
      answer: "Nous installons des systèmes domotiques intuitifs, pilotables depuis votre smartphone ou tablette. Vous pouvez contrôler l'éclairage, le chauffage, les volets et la sécurité à distance. Nous vous formons à l'utilisation lors de la mise en service."
    },
    {
      question: "Quels modes de paiement acceptez-vous ?",
      answer: "Nous acceptons les virements bancaires, les paiements par carte et les paiements en espèces. Pour les projets importants, nous pouvons proposer un échelonnement du paiement. N'hésitez pas à nous en parler."
    }
  ],
  about: {
    title: "L'expertise électrique, la passion du travail bien fait",
    paragraphs: [
      "Fondée à Charleroi, Elec-Matic est née de la conviction qu'un travail électrique de qualité fait toute la différence — en sécurité, en confort et en durabilité.",
      "Avec plus de 15 ans d'expérience et plus de 2 500 projets réalisés, notre équipe d'électriciens certifiés met son savoir-faire au service des particuliers et des professionnels du Hainaut.",
      "Chaque chantier est pour nous l'occasion de démontrer notre engagement : propreté irréprochable, finitions soignées, respect des délais et transparence totale sur les tarifs. Nous ne faisons aucun compromis sur la qualité."
    ],
    values: [
      { icon: "ShieldCheck", title: "Sécurité", desc: "Conformité RGIE garantie sur chaque installation" },
      { icon: "Clock", title: "Réactivité", desc: "Intervention en moins de 24h sur le Hainaut" },
      { icon: "Sparkles", title: "Propreté", desc: "Chantier propre, finitions impeccables" },
      { icon: "HandshakeIcon", title: "Transparence", desc: "Devis détaillé, aucun coût caché" }
    ]
  },
  legal: {
    companyFull: "Elec-Matic Électricité Générale",
    legalForm: "Entreprise individuelle",
    siret: "BE 0XXX.XXX.XXX",
    host: "Vercel Inc.",
    hostAddress: "440 N Barranca Ave #4133, Covina, CA 91723, USA"
  }
};

export default siteData;
