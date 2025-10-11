'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { useAuth } from '../provider';

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
}

export function isUserAuthenticated(user: User | null): user is User {
  return user !== null;
}

export function assertUserAuthenticated(
  user: User | null
): asserts user is User {
  if (!isUserAuthenticated(user)) {
    throw new Error('User is not authenticated');
  }
}
