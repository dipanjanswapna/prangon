'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const NavLinks = ({ className }: { className?: string }) => (
    <nav className={cn('flex items-center space-x-8 text-sm font-medium', className)}>
      {navItems.map((item) => (
        <motion.div key={item.label} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
            <Link
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'transition-colors hover:text-primary uppercase tracking-widest',
                 pathname === item.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
        </motion.div>
      ))}
    </nav>
  );

  return (
    <header className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out",
        hasScrolled ? "bg-black/50 backdrop-blur-sm shadow-md" : "bg-transparent"
    )}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2">
           <Image src="https://mir-s3-cdn-cf.behance.net/user/230/1eb6171863399673.6851829692324.png" alt="PRANGON CENTRE Logo" width={40} height={40} className="rounded-full" />
        </Link>

        <div className="hidden md:flex items-center space-x-6">
           <NavLinks />
        </div>

        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-foreground" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full bg-background text-foreground">
              <div className="flex flex-col space-y-8 p-6">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                       <Image src="https://mir-s3-cdn-cf.behance.net/user/230/1eb6171863399673.6851829692324.png" alt="PRANGON CENTRE Logo" width={40} height={40} className="rounded-full" />
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'text-2xl font-bold',
                        pathname === item.href ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
