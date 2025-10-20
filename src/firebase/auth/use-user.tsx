'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { useAuth, useFirestore } from '../provider';
import { AppUser } from '@/lib/types';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !firestore) {
      // Firebase might not be initialized yet
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
            // First, check if the user is in the 'admins' collection
            const adminRef = doc(firestore, 'admins', user.uid);
            const adminSnap = await getDoc(adminRef);

            if (adminSnap.exists()) {
                // This is an admin
                const adminData: AppUser = {
                    uid: user.uid,
                    email: user.email!,
                    displayName: user.displayName || 'Admin',
                    photoURL: user.photoURL,
                    role: 'admin' as const,
                };
                setAppUser(adminData);

                // Ensure a corresponding user profile exists for consistency
                const userRef = doc(firestore, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) {
                    setDoc(userRef, adminData, { merge: true }).catch(serverError => {
                        const permissionError = new FirestorePermissionError({
                            path: userRef.path,
                            operation: 'create',
                            requestResourceData: adminData
                        });
                        errorEmitter.emit('permission-error', permissionError);
                    });
                }
            } else {
                // This is a regular user
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
                    };
                    setDoc(userRef, newUser, { merge: true }).catch(serverError => {
                        const permissionError = new FirestorePermissionError({
                            path: userRef.path,
                            operation: 'create',
                            requestResourceData: newUser
                        });
                        errorEmitter.emit('permission-error', permissionError);
                    });
                    setAppUser(newUser);
                }
            }
        } catch(e: any) {
            if (e.code === 'permission-denied') {
                const errorContext = { path: `admins/${user.uid}` , operation: 'get' as const };
                const permissionError = new FirestorePermissionError(errorContext);
                errorEmitter.emit('permission-error', permissionError);
            } else {
                console.error("An unexpected error occurred in useUser:", e);
            }
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
