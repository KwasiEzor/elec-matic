import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../auth';

export interface Service {
  id: string;
  userId: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  position: number;
  createdAt: Timestamp | null;
}

/**
 * Get services for authenticated user (admin use)
 */
export function useServices() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['services', user?.uid],
    queryFn: async () => {
      if (!user) return [];

      const q = query(
        collection(db, 'services'),
        where('userId', '==', user.uid),
        orderBy('position', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[];
    },
    enabled: !!user,
  });
}

/**
 * Get public services (for public site - gets first user's services)
 * In production, filter by custom domain or subdomain
 */
export function usePublicServices() {
  return useQuery({
    queryKey: ['services-public'],
    queryFn: async () => {
      // For now, get all services ordered by position
      // TODO: Filter by user based on domain/subdomain
      const q = query(
        collection(db, 'services'),
        orderBy('position', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[];
    },
  });
}

/**
 * Add new service
 */
export function useAddService() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Omit<Service, 'id' | 'userId' | 'createdAt'>) => {
      if (!user) throw new Error('Non authentifié');

      const docRef = await addDoc(collection(db, 'services'), {
        ...service,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      return docRef.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['services-public'] });
    },
    onError: (error) => {
      console.error('Erreur ajout service:', error);
      alert('Erreur lors de l\'ajout du service');
    },
  });
}

/**
 * Update existing service
 */
export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Service> & { id: string }) => {
      const docRef = doc(db, 'services', id);
      await updateDoc(docRef, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['services-public'] });
    },
    onError: (error) => {
      console.error('Erreur mise à jour service:', error);
      alert('Erreur lors de la mise à jour');
    },
  });
}

/**
 * Delete service
 */
export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, 'services', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['services-public'] });
    },
    onError: (error) => {
      console.error('Erreur suppression service:', error);
      alert('Erreur lors de la suppression');
    },
  });
}

/**
 * Reorder services (bulk update positions)
 */
export function useReorderServices() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (services: Service[]) => {
      // Update position for each service
      const updates = services.map((service, index) =>
        updateDoc(doc(db, 'services', service.id), { position: index })
      );

      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['services-public'] });
    },
    onError: (error) => {
      console.error('Erreur réordonnancement:', error);
      alert('Erreur lors du réordonnancement');
    },
  });
}
