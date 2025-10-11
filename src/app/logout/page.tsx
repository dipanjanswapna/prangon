'use client';

import { useEffect } from 'react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth) {
      signOut(auth).then(() => {
        router.push('/login');
      });
    }
  }, [auth, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Logging out...</p>
    </div>
  );
}
