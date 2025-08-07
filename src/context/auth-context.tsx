
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
        // Always start loading when auth state might change.
        setLoading(true); 
        
        if (firebaseUser) {
            try {
                // Attempt to get the user data from our custom DB.
                let appUserData = await getAppUser(firebaseUser.uid);
                
                // If the user doesn't exist in our DB, create them.
                if (!appUserData) {
                    // Pass the displayName from the firebaseUser, which might have been set during signup/Google login.
                    appUserData = await createUserInDB(firebaseUser);
                }
                
                // Combine Firebase user data with our custom app user data.
                setUser({ ...firebaseUser, ...appUserData });
            } catch (error) {
                console.error("Failed to fetch or create user data in DB:", error);
                // If there's an error, sign the user out to prevent an inconsistent state.
                await signOut(auth);
                setUser(null);
            }
        } else {
            // No Firebase user found.
            setUser(null);
        }
        
        // Finish loading only after all async operations are complete.
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
        // We update the Firebase profile first.
        await updateProfile(userCredential.user, { displayName });
        // Then, we ensure the user is created in our DB with the correct details.
        // onAuthStateChanged will handle fetching the full user object.
        await createUserInDB({ ...userCredential.user, displayName });
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
      {loading && (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {!loading && children}
    </AuthContext.Provider>
  );
};
