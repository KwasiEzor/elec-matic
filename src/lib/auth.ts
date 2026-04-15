import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from './firebase';
import { useState, useEffect } from 'react';

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    let message = error.message;

    // French error messages
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      message = 'Email ou mot de passe incorrect';
    } else if (error.code === 'auth/user-not-found') {
      message = 'Aucun compte trouvé avec cet email';
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Trop de tentatives. Réessayez plus tard';
    }

    return { user: null, error: message };
  }
}

/**
 * Sign up with email, password, and name
 */
export async function signUp(email: string, password: string, name: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    return { user: result.user, error: null };
  } catch (error: any) {
    let message = error.message;

    // French error messages
    if (error.code === 'auth/email-already-in-use') {
      message = 'Cet email est déjà utilisé';
    } else if (error.code === 'auth/weak-password') {
      message = 'Le mot de passe doit contenir au moins 6 caractères';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Email invalide';
    }

    return { user: null, error: message };
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Hook to manage authentication state
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}
