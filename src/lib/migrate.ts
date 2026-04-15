import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './auth';

/**
 * Migrate data from localStorage to Firestore
 * Run this once after setting up Firebase
 */
export async function migrateLocalStorageToFirebase() {
  const { user } = useAuth();

  if (!user) {
    alert('Vous devez être connecté pour migrer les données');
    return;
  }

  try {
    // Get localStorage data
    const cmsDataRaw = localStorage.getItem('elecmatic-cms');
    const invoiceDataRaw = localStorage.getItem('elecmatic-invoices');

    if (!cmsDataRaw && !invoiceDataRaw) {
      alert('Aucune donnée à migrer');
      return;
    }

    const cmsData = cmsDataRaw ? JSON.parse(cmsDataRaw) : null;
    const invoiceData = invoiceDataRaw ? JSON.parse(invoiceDataRaw) : null;

    let migrated = 0;

    // Migrate Services
    if (cmsData?.state?.data?.services) {
      for (const service of cmsData.state.data.services) {
        await setDoc(doc(collection(db, 'services')), {
          ...service,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
        migrated++;
      }
      console.log(`✅ ${cmsData.state.data.services.length} services migrés`);
    }

    // Migrate Realisations
    if (cmsData?.state?.data?.realisations) {
      for (const realisation of cmsData.state.data.realisations) {
        await setDoc(doc(collection(db, 'realisations')), {
          ...realisation,
          userId: user.uid,
          date: new Date(realisation.date),
          createdAt: serverTimestamp(),
        });
        migrated++;
      }
      console.log(`✅ ${cmsData.state.data.realisations.length} réalisations migrées`);
    }

    // Migrate Testimonials
    if (cmsData?.state?.data?.testimonials) {
      for (const testimonial of cmsData.state.data.testimonials) {
        await setDoc(doc(collection(db, 'testimonials')), {
          ...testimonial,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
        migrated++;
      }
      console.log(`✅ ${cmsData.state.data.testimonials.length} témoignages migrés`);
    }

    // Migrate FAQ
    if (cmsData?.state?.data?.faq) {
      for (let i = 0; i < cmsData.state.data.faq.length; i++) {
        const faqItem = cmsData.state.data.faq[i];
        await setDoc(doc(collection(db, 'faq')), {
          ...faqItem,
          userId: user.uid,
          position: i,
          createdAt: serverTimestamp(),
        });
        migrated++;
      }
      console.log(`✅ ${cmsData.state.data.faq.length} questions FAQ migrées`);
    }

    // Migrate Site Settings
    if (cmsData?.state?.data) {
      const { services, realisations, testimonials, faq, ...settings } = cmsData.state.data;
      await setDoc(doc(db, 'site_settings', user.uid), {
        ...settings,
        updatedAt: serverTimestamp(),
      });
      migrated++;
      console.log('✅ Paramètres site migrés');
    }

    // Migrate Clients
    if (invoiceData?.state?.clients) {
      for (const client of invoiceData.state.clients) {
        await setDoc(doc(collection(db, 'clients')), {
          ...client,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
        migrated++;
      }
      console.log(`✅ ${invoiceData.state.clients.length} clients migrés`);
    }

    // Migrate Invoices
    if (invoiceData?.state?.invoices) {
      for (const invoice of invoiceData.state.invoices) {
        await setDoc(doc(collection(db, 'invoices')), {
          ...invoice,
          userId: user.uid,
          issueDate: new Date(invoice.issueDate),
          dueDate: new Date(invoice.dueDate),
          sentAt: invoice.sentAt ? new Date(invoice.sentAt) : null,
          paidAt: invoice.paidAt ? new Date(invoice.paidAt) : null,
          createdAt: new Date(invoice.createdAt),
          updatedAt: serverTimestamp(),
        });
        migrated++;
      }
      console.log(`✅ ${invoiceData.state.invoices.length} factures migrées`);
    }

    // Migrate Invoice Settings
    if (invoiceData?.state?.settings) {
      await setDoc(doc(db, 'invoice_settings', user.uid), {
        ...invoiceData.state.settings,
        updatedAt: serverTimestamp(),
      });
      migrated++;
      console.log('✅ Paramètres factures migrés');
    }

    alert(`✅ Migration réussie!\n${migrated} éléments migrés vers Firebase.`);

    // Ask if user wants to clear localStorage
    const clear = confirm(
      'Migration terminée! Voulez-vous effacer les données localStorage?\n\n(Recommandé: Oui, mais gardez un backup au cas où)'
    );

    if (clear) {
      localStorage.removeItem('elecmatic-cms');
      localStorage.removeItem('elecmatic-invoices');
      localStorage.removeItem('elecmatic-auth');
      console.log('✅ localStorage effacé');
    }

    console.log('🎉 Migration Firebase terminée!');
    return true;
  } catch (error) {
    console.error('❌ Erreur migration:', error);
    alert('Erreur lors de la migration. Vérifiez la console pour les détails.');
    return false;
  }
}

/**
 * Export localStorage data as JSON backup
 */
export function exportLocalStorageBackup() {
  const cmsData = localStorage.getItem('elecmatic-cms');
  const invoiceData = localStorage.getItem('elecmatic-invoices');
  const authData = localStorage.getItem('elecmatic-auth');

  const backup = {
    exportDate: new Date().toISOString(),
    cms: cmsData ? JSON.parse(cmsData) : null,
    invoices: invoiceData ? JSON.parse(invoiceData) : null,
    auth: authData ? JSON.parse(authData) : null,
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `elecmatic-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  console.log('✅ Backup localStorage téléchargé');
}
