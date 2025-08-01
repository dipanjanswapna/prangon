'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/contact', label: 'Contact' },
];

const CatIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="h-8 w-8"
    {...props}
    >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-4c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm5 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-2.75-6.5c-.52 0-1.02.11-1.47.31-.79.35-1.16 1.3-1.03 2.15.14.92 1 1.54 1.9.99.41-.25.68-.69.7-1.16-.03-1.3-1.09-2.29-2.39-2.29h-.01zM12 4c-3.1 0-5.84 1.52-7.57 3.82.16-.03.32-.05.49-.05 1.1 0 2.09.43 2.83 1.17.74.74 1.17 1.73 1.17 2.83 0 .52-.1.02-.24 1.5.14-.04.28-.08.43-.12.83-.23 1.7-.35 2.59-.35s1.76.12 2.59.35c.15.04.29.08.43.12-.14-.48-.24-.98-.24-1.5 0-1.1.43-2.09 1.17-2.83.74-.74 1.73-1.17 2.83-1.17.17 0 .33.02.49.05C17.84 5.52 15.1 4 12 4z"/>
    </svg>
)

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinks = ({ className }: { className?: string }) => (
    <nav className={cn('flex items-center space-x-6 text-sm font-medium', className)} style={{ color: 'rgb(184, 172, 152)' }}>
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={() => setIsMobileMenuOpen(false)}
          className={cn(
            'transition-colors hover:text-primary',
            'font-medium tracking-widest'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <CatIcon style={{ color: 'rgb(184, 172, 152)' }}/>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
           <Circle className="h-4 w-4 text-primary fill-current" />
           <NavLinks />
        </div>

        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" style={{ color: 'rgb(184, 172, 152)' }}/>
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full bg-background text-foreground">
              <div className="flex flex-col space-y-8 p-6">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                       <CatIcon className="text-foreground"/>
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
