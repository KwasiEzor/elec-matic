import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  avatar?: string;
  createdAt: string;
}

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  users: AdminUser[];
  passwords: Record<string, string>; // email -> hashed password (simple for demo)
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<AdminUser>) => void;
}

// Simple hash for demo purposes
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: [
        {
          id: 'admin-1',
          email: 'admin@elec-matic.be',
          name: 'Administrateur',
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
      ],
      passwords: {
        'admin@elec-matic.be': simpleHash('Admin123!'),
      },
      login: (email, password) => {
        const { passwords, users } = get();
        const hashed = simpleHash(password);
        if (passwords[email] && passwords[email] === hashed) {
          const user = users.find((u) => u.email === email);
          if (user) {
            set({ user, isAuthenticated: true });
            return { success: true };
          }
        }
        return { success: false, error: 'Email ou mot de passe incorrect.' };
      },
      register: (name, email, password) => {
        const { passwords, users } = get();
        if (passwords[email]) {
          return { success: false, error: 'Cet email est déjà utilisé.' };
        }
        const newUser: AdminUser = {
          id: `user-${Date.now()}`,
          email,
          name,
          role: 'editor',
          createdAt: new Date().toISOString(),
        };
        set({
          users: [...users, newUser],
          passwords: { ...passwords, [email]: simpleHash(password) },
          user: newUser,
          isAuthenticated: true,
        });
        return { success: true };
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data) => {
        const { user, users } = get();
        if (!user) return;
        const updated = { ...user, ...data };
        set({
          user: updated,
          users: users.map((u) => (u.id === user.id ? updated : u)),
        });
      },
    }),
    { name: 'elecmatic-auth' }
  )
);
