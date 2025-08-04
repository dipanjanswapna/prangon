
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, LogIn, UserCircle, LogOut, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ThemeToggle } from '../theme-toggle';


const navItems = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/social-work', label: 'Social Work' },
  { href: '/prangons-likha', label: 'Prangons Likha'},
  { href: '/library', label: 'Library' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { user, logout } = useAuth();

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
                 pathname.startsWith(item.href) ? 'text-primary' : 'text-muted-foreground'
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
        hasScrolled ? "bg-background/80 backdrop-blur-sm shadow-md" : "bg-transparent border-b border-transparent"
    )}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2">
           <Image src="/logo.png" alt="PRANGON CENTRE Logo" width={40} height={40} className="rounded-full" />
        </Link>

        <div className="hidden md:flex items-center space-x-6">
           <NavLinks />
           <ThemeToggle />
            {user ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                                <AvatarFallback>{user.displayName?.charAt(0)?.toUpperCase() ?? 'U'}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.displayName}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                           <Link href="/account">
                            <UserCircle className="mr-2 h-4 w-4"/>
                            My Account
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href="/logout">
                             <LogOut className="mr-2 h-4 w-4"/>
                             Logout
                           </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login / Sign Up
                  </Link>
                </Button>
            )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-foreground" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[75vh] rounded-t-2xl bg-background text-foreground p-0">
              <div className="relative w-full h-full bg-cover bg-center" style={{backgroundImage: "url('https://wallpapercat.com/w/full/5/1/d/121255-1125x2436-phone-hd-squid-game-wallpaper-photo.jpg')"}}>
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 flex flex-col space-y-8 p-6 h-full">
                  <div className="flex justify-between items-center">
                      <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                         <Image src="/logo.png" alt="PRANGON CENTRE Logo" width={40} height={40} className="rounded-full" />
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
                          pathname.startsWith(item.href) ? 'text-primary' : 'text-white'
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                   <div className="mt-auto pt-8">
                     {user ? (
                        <div className="text-center">
                          <p className="text-white">Welcome, {user.displayName}</p>
                           <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="text-white mt-2">
                                        <UserCircle className="mr-2 h-4 w-4"/> My Account
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                                            View Profile
                                        </Link>
                                    </DropdownMenuItem>
                                     <DropdownMenuItem asChild>
                                        <Link href="/logout" onClick={() => setIsMobileMenuOpen(false)}>
                                            Logout
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                     ) : (
                        <Button asChild className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                            <Link href="/login">Login / Sign Up</Link>
                        </Button>
                     )}
                   </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
