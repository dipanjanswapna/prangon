'use client';

import { useAuth, useFirestore } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase/auth/use-user';
import { useEffect } from 'react';

export default function AdminLoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user, appUser, loading } = useUser();

   useEffect(() => {
    // If the user is already logged in and is an admin, redirect them to the dashboard.
    if (!loading && user && appUser?.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [user, appUser, loading, router]);


  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) {
        console.error("Auth service or Firestore is not available.");
         toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not connect to Firebase services.',
        });
        return;
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // This is a temp check to see if the user is an admin.
      // The secure check happens on the server with session cookies.
      const adminRef = doc(firestore, 'admins', user.uid);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        const idToken = await user.getIdToken();
        const response = await fetch('/api/auth/session', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });
        
        if (response.ok) {
            toast({
                title: 'Admin Login Successful',
                description: `Welcome back, ${user.displayName}!`,
            });
             // The useEffect will handle the redirect to the dashboard after state update
             router.refresh();
        } else {
             await auth.signOut();
             throw new Error('Session creation failed.');
        }
      } else {
        await auth.signOut();
        toast({
            variant: 'destructive',
            title: 'Access Denied',
            description: 'You do not have administrative privileges.',
        });
      }
    } catch (error) {
      console.error('Error signing in with Google: ', error);
      toast({
        variant: 'destructive',
        title: 'Sign-in Failed',
        description: 'An error occurred during the sign-in process.',
      });
    }
  };
  
  if (loading || (user && appUser?.role === 'admin')) {
      return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
        <Image
            src="https://i.pinimg.com/originals/13/a5/38/13a53851c828b81b8632191439366144.gif"
            alt="Login background"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0 opacity-50"
            data-ai-hint="futuristic city gif"
        />
        <div className="relative z-10 w-full max-w-md">
            <Card className="bg-background/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
                    <CardDescription>Sign in to manage your portfolio content.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" onClick={handleGoogleSignIn}>
                        <Chrome className="mr-2 h-4 w-4" />
                        Sign in with Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
