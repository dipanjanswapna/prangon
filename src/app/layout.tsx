import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Dribbble, Instagram, Linkedin, PlayCircle } from 'lucide-react';
import { Header } from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'PortfolioPro',
  description: 'A minimalist design portfolio website.',
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
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap"
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

        {/* Left Social Bar */}
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

        {/* Right "Sound Off" Bar */}
        <aside className="fixed right-4 bottom-4 z-50 hidden md:flex items-center">
          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors [writing-mode:vertical-rl] text-sm tracking-widest">
            SOUND OFF
          </Link>
        </aside>
        
        <Toaster />
      </body>
    </html>
  );
}
