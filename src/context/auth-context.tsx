
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
        setLoading(true); // Start loading whenever auth state changes
        if (firebaseUser) {
            try {
                let appUserData = await getAppUser(firebaseUser.uid);
                
                if (!appUserData) {
                    appUserData = await createUserInDB(firebaseUser);
                }
                
                setUser({ ...firebaseUser, ...appUserData });
            } catch (error) {
                console.error("Failed to fetch or create user data in DB:", error);
                await signOut(auth);
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false); // Finish loading after all operations
    });

    return () => unsubscribe();
}, []);


  const login = async (email: string, pass: string) => {
    setLoading(true);
    return await signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signup = async (email: string, pass: string, displayName: string) => {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        await createUserInDB({ ...userCredential.user, displayName });
    }
    return userCredential;
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout }}>
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
