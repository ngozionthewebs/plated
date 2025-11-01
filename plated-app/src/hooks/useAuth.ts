import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase';

/**
 * Custom hook to get the current authenticated user
 * @returns The current User object or null if not authenticated
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, loading };
};

/**
 * Simplified version that returns just the user object
 * For components that only need the user, not loading state
 */
export const useAuthUser = (): User | null => {
  const { user } = useAuth();
  return user;
};