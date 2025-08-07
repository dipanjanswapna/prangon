
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
        if (firebaseUser) {
            try {
                // First, try to get user data from our DB
                let appUserData = await getAppUser(firebaseUser.uid);
                
                if (!appUserData) {
                    // This can happen if the user exists in Firebase Auth but not in our DB (e.g., first login after signup).
                    // Or if there was a race condition. This will create the user in our DB.
                    appUserData = await createUserInDB(firebaseUser);
                }
                
                // Combine Firebase user object with our custom user data
                setUser({ ...firebaseUser, ...appUserData });
            } catch (error) {
                console.error("Failed to fetch or create user data in DB:", error);
                // Log out the user if DB operations fail to prevent inconsistent state
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
    setLoading(true);
    return await signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signup = async (email: string, pass: string, displayName: string) => {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        // Create the user in our DB right after signup
        // Pass the updated user object with displayName
        await createUserInDB({ ...userCredential.user, displayName });
    }
    // onAuthStateChanged will handle setting the user and loading state
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
    setLoading(false);
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
