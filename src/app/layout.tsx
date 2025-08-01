import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Dribbble, Instagram, Linkedin, PlayCircle, Music2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'PRANGON CENTRE - Creative Design, EdTech, and Digital Innovation',
  description: 'Welcome to PRANGON CENTRE, the home of Dipanjan "Swapna Prangon" Prangon. We specialize in creative design, EdTech innovation, branding, and digital tools for students and educators in Dhaka, Bangladesh and beyond.',
  keywords: 'PRANGON CENTRE, Dipanjan Swapna Prangon, EdTech, creative design, branding, web development, Bangladesh, Dhaka, student resources, educator tools',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <head>
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

        <aside className="fixed right-4 bottom-4 z-50 hidden md:flex items-center space-x-2">
            <Music2 className="h-4 w-4 text-muted-foreground" />
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors [writing-mode:vertical-rl] text-sm tracking-widest uppercase">
                Sound Off
            </Link>
        </aside>
        
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
