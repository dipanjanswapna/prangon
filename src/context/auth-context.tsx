
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import { getAppUser, createUserInDB } from '@/app/admin/users/actions';
import { AppUser } from '@/lib/types';

type AppUserWithFirebase = User & AppUser;

interface AuthContextType {
  user: AppUserWithFirebase | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string, displayName: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUserWithFirebase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setLoading(true);
        if (firebaseUser) {
            try {
                let appUserData = await getAppUser(firebaseUser.uid);
                
                if (!appUserData) {
                    // This might be a new sign-up or first-time login
                    // The displayName from the user object might be what we need
                    const userWithDisplayName = {
                        ...firebaseUser,
                        displayName: firebaseUser.displayName,
                    };
                    appUserData = await createUserInDB(userWithDisplayName);
                }
                
                // By this point, appUserData should be valid.
                setUser({ ...firebaseUser, ...appUserData });

            } catch (error) {
                console.error("Failed to fetch or create user data in DB:", error);
                await signOut(auth);
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    });

    return () => unsubscribe();
}, []);


  const login = async (email: string, pass: string) => {
    return await signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signup = async (email: string, pass: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        // The onAuthStateChanged listener will handle creating the user in our DB
    }
    return userCredential;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
