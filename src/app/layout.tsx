
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Dribbble, Instagram, Linkedin, PlayCircle, Music2, VolumeX, Volume2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HireMeBanner } from '@/components/layout/hire-me-banner';
import { useRef, useState, useEffect } from 'react';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play().catch(e => console.error("Autoplay failed:", e));
        }
      }
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted]);
  
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
            console.error("Error playing audio:", e);
            // If autoplay fails, set isPlaying to false, but only if there was no interaction yet.
            if(!hasInteracted) setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, hasInteracted]);

  const toggleSound = () => {
    if (!hasInteracted) setHasInteracted(true);
    setIsPlaying(!isPlaying);
  };
  
  return (
    <html lang="en" className="h-full dark">
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
          'min-h-screen bg-background flex flex-col'
        )}
      >
        <audio ref={audioRef} src="/mixkit-relax-beat-292.mp3" loop preload="auto" />
        
        <Header />
        <main className="flex-grow relative">{children}</main>

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
        <Toaster />
        <HireMeBanner />
      </body>
    </html>
  );
}
