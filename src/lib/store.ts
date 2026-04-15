import { create } from 'zustand';

interface AppState {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  lightboxImage: string | null;
  setLightboxImage: (image: string | null) => void;
  formSubmitted: boolean;
  setFormSubmitted: (submitted: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  activeSection: 'accueil',
  setActiveSection: (section) => set({ activeSection: section }),
  lightboxImage: null,
  setLightboxImage: (image) => set({ lightboxImage: image }),
  formSubmitted: false,
  setFormSubmitted: (submitted) => set({ formSubmitted: submitted }),
}));
