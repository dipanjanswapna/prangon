
'use client';

import './globals.css';
import './i18n';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Dribbble, Instagram, Linkedin, PlayCircle, Music2, VolumeX, Volume2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HireMeBanner } from '@/components/layout/hire-me-banner';
import { useRef, useState, useEffect, Suspense } from 'react';
import { AuthProvider } from '@/context/auth-context';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { Loader2 } from 'lucide-react';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const isAuthPage = pathname === '/login' || pathname === '/logout';

  useEffect(() => {
    // This effect should only run on the client
    const canPlayMusic = localStorage.getItem('musicConsent') === 'true';
    if (canPlayMusic) {
      setHasInteracted(true);
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setIsPlaying(true);
        localStorage.setItem('musicConsent', 'true');
      }
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    // This effect should also only run on the client
    if (typeof window !== 'undefined') {
        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);
    }
    
    return () => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        }
    };
  }, [hasInteracted]);
  
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && hasInteracted) {
        audioRef.current.play().catch(e => {
            console.error("Audio playback failed:", e);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, hasInteracted]);

  const toggleSound = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    localStorage.setItem('musicConsent', JSON.stringify(newIsPlaying));
  };
  
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <title>PRANGON CENTRE - Creative Design, EdTech, and Digital Innovation</title>
        <meta name="description" content='Welcome to PRANGON CENTRE, the home of Dipanjan "Swapna Prangon" Prangon. We specialize in creative design, EdTech innovation, branding, and digital tools for students and educators in Dhaka, Bangladesh and beyond.' />
        <meta name="keywords" content="PRANGON CENTRE, Dipanjan Swapna Prangon, EdTech, creative design, branding, web development, Bangladesh, Dhaka, student resources, educator tools" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body
        className={cn(
          'font-body antialiased',
          !isAdminPage && !isAuthPage && 'min-h-screen bg-background flex flex-col',
          (isAdminPage || isAuthPage) && 'bg-background'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <I18nextProvider i18n={i18n}>
                <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                    {!isAdminPage && !isAuthPage && (
                       <audio ref={audioRef} src="/mixkit-relax-beat-292.mp3" loop preload="auto" />
                    )}
                    
                    {!isAdminPage && !isAuthPage && <Header />}
                    
                    <main className={cn(!isAdminPage && !isAuthPage ? 'flex-grow relative' : '')}>
                      {children}
                    </main>

                    {!isAdminPage && !isAuthPage && (
                      <>
                        <aside className="fixed left-4 bottom-4 z-50 hidden md:flex flex-col items-center space-y-4">
                          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <Dribbble className="h-5 w-5" />
                          </Link>
                          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <Instagram className="h-5 w-5" />
                          </Link>
                          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <PlayCircle className="h-5 w-5" />
                          </Link>
                          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <Linkedin className="h-5 w-5" />
                          </Link>
                        </aside>

                        <aside className="fixed right-4 bottom-4 z-50 flex items-center space-x-2">
                            <button onClick={toggleSound} className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2">
                                {isPlaying ? <Volume2 className="h-4 w-4 md:h-5 md:w-5" /> : <VolumeX className="h-4 w-4 md:h-5 md:w-5" />}
                                <span className="[writing-mode:vertical-rl] text-xs md:text-sm tracking-widest uppercase">
                                    {isPlaying ? 'Sound On' : 'Sound Off'}
                                </span>
                            </button>
                        </aside>
                        
                        <Footer />
                        <HireMeBanner />
                      </>
                    )}
                    <Toaster />
                </Suspense>
            </I18nextProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
