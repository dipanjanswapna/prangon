'use client';

import { useAuth } from '@/firebase/provider';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const { auth } = useAuth();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error signing in with Google: ', error);
    }
  };

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
