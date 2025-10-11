'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { useAuth, useFirestore } from '../provider';
import { AppUser } from '@/lib/types';

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setAppUser(docSnap.data() as AppUser);
        } else {
          // Create user profile if it doesn't exist
          const newUser: AppUser = {
            uid: user.uid,
            email: user.email!,
            displayName: user.displayName || 'New User',
            photoURL: user.photoURL,
            role: 'user', // Assign default role
            subscription: { planName: '' },
            customId: '', // You might want to generate a custom ID
          };
          await setDoc(userRef, newUser);
          setAppUser(newUser);
        }
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  return { user, appUser, loading };
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
