import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import defaultData, { type SiteData, type Service, type Realisation, type Testimonial, type FAQItem } from './cmsData';

interface CMSState {
  data: SiteData;
  lastSaved: string | null;
  // Company
  updateCompany: (company: Partial<SiteData['company']>) => void;
  // SEO
  updateSEO: (seo: Partial<SiteData['seo']>) => void;
  // Hero
  updateHero: (hero: Partial<SiteData['hero']>) => void;
  // Services
  addService: (service: Service) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  reorderServices: (services: Service[]) => void;
  // Realisations
  addRealisation: (real: Realisation) => void;
  updateRealisation: (id: string, real: Partial<Realisation>) => void;
  deleteRealisation: (id: string) => void;
  // Testimonials
  addTestimonial: (t: Testimonial) => void;
  updateTestimonial: (id: string, t: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  // FAQ
  addFAQ: (faq: FAQItem) => void;
  updateFAQ: (index: number, faq: Partial<FAQItem>) => void;
  deleteFAQ: (index: number) => void;
  reorderFAQ: (faqs: FAQItem[]) => void;
  // About
  updateAbout: (about: Partial<SiteData['about']>) => void;
  // Legal
  updateLegal: (legal: Partial<SiteData['legal']>) => void;
  // Reset
  resetToDefaults: () => void;
}

export const useCMSStore = create<CMSState>()(
  persist(
    (set) => ({
      data: defaultData,
      lastSaved: null,
      updateCompany: (company) =>
        set((s) => ({ data: { ...s.data, company: { ...s.data.company, ...company } }, lastSaved: new Date().toISOString() })),
      updateSEO: (seo) =>
        set((s) => ({ data: { ...s.data, seo: { ...s.data.seo, ...seo } }, lastSaved: new Date().toISOString() })),
      updateHero: (hero) =>
        set((s) => ({ data: { ...s.data, hero: { ...s.data.hero, ...hero } }, lastSaved: new Date().toISOString() })),
      addService: (service) =>
        set((s) => ({ data: { ...s.data, services: [...s.data.services, service] }, lastSaved: new Date().toISOString() })),
      updateService: (id, service) =>
        set((s) => ({
          data: { ...s.data, services: s.data.services.map((sv) => (sv.id === id ? { ...sv, ...service } : sv)) },
          lastSaved: new Date().toISOString(),
        })),
      deleteService: (id) =>
        set((s) => ({ data: { ...s.data, services: s.data.services.filter((sv) => sv.id !== id) }, lastSaved: new Date().toISOString() })),
      reorderServices: (services) =>
        set((s) => ({ data: { ...s.data, services }, lastSaved: new Date().toISOString() })),
      addRealisation: (real) =>
        set((s) => ({ data: { ...s.data, realisations: [...s.data.realisations, real] }, lastSaved: new Date().toISOString() })),
      updateRealisation: (id, real) =>
        set((s) => ({
          data: { ...s.data, realisations: s.data.realisations.map((r) => (r.id === id ? { ...r, ...real } : r)) },
          lastSaved: new Date().toISOString(),
        })),
      deleteRealisation: (id) =>
        set((s) => ({ data: { ...s.data, realisations: s.data.realisations.filter((r) => r.id !== id) }, lastSaved: new Date().toISOString() })),
      addTestimonial: (t) =>
        set((s) => ({ data: { ...s.data, testimonials: [...s.data.testimonials, t] }, lastSaved: new Date().toISOString() })),
      updateTestimonial: (id, t) =>
        set((s) => ({
          data: { ...s.data, testimonials: s.data.testimonials.map((tm) => (tm.id === id ? { ...tm, ...t } : tm)) },
          lastSaved: new Date().toISOString(),
        })),
      deleteTestimonial: (id) =>
        set((s) => ({ data: { ...s.data, testimonials: s.data.testimonials.filter((t) => t.id !== id) }, lastSaved: new Date().toISOString() })),
      addFAQ: (faq) =>
        set((s) => ({ data: { ...s.data, faq: [...s.data.faq, faq] }, lastSaved: new Date().toISOString() })),
      updateFAQ: (index, faq) =>
        set((s) => ({
          data: { ...s.data, faq: s.data.faq.map((f, i) => (i === index ? { ...f, ...faq } : f)) },
          lastSaved: new Date().toISOString(),
        })),
      deleteFAQ: (index) =>
        set((s) => ({ data: { ...s.data, faq: s.data.faq.filter((_, i) => i !== index) }, lastSaved: new Date().toISOString() })),
      reorderFAQ: (faqs) =>
        set((s) => ({ data: { ...s.data, faq: faqs }, lastSaved: new Date().toISOString() })),
      updateAbout: (about) =>
        set((s) => ({ data: { ...s.data, about: { ...s.data.about, ...about } }, lastSaved: new Date().toISOString() })),
      updateLegal: (legal) =>
        set((s) => ({ data: { ...s.data, legal: { ...s.data.legal, ...legal } }, lastSaved: new Date().toISOString() })),
      resetToDefaults: () => set({ data: defaultData, lastSaved: new Date().toISOString() }),
    }),
    { name: 'elecmatic-cms' }
  )
);
