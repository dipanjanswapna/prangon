
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, BookOpen, ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../theme-toggle';
import { LanguageSwitcher } from '../language-switcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useUser } from '@/firebase/auth/use-user';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


const mainNavItems = [
  { href: '/', label: 'Home'},
  { href: '/work', label: 'Work' },
];

const resourcesNavItems = [
  { href: '/about', label: 'About' },
  { href: '/social-work', label: 'Social Work' },
  { href: '/prangons-likha', label: 'Prangons Likha'},
  { href: '/library', label: 'Library' },
  { href: '/blog', label: 'Blog' },
];

const contactNavItem = { href: '/contact', label: 'Say Hello' };


export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();

  const NavItem = ({ href, label, isContact = false }: { href: string, label: string, isContact?: boolean }) => {
    const isActive = pathname === href;

    if (isContact) {
      return (
        <Link href={href} passHref>
           <motion.div
             whileHover={{ scale: 1.05 }}
             className="gradient-border-button"
            >
             {label}
           </motion.div>
        </Link>
      );
    }
    
    return (
      <Link href={href} passHref>
        <motion.div
          className={cn(
            "relative px-4 py-2 text-sm font-medium transition-colors rounded-full",
            isActive ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white"
          )}
        >
          {label}
        </motion.div>
      </Link>
    );
  };
  
  const ResourcesDropdown = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
           <motion.div
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors rounded-full cursor-pointer flex items-center gap-1",
                resourcesNavItems.some(item => pathname.startsWith(item.href))
                  ? "bg-white/10 text-white"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              Resources
              <ChevronDown className="h-4 w-4" />
            </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-neutral-900/80 backdrop-blur-sm border-neutral-700 text-white">
          {resourcesNavItems.map(item => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href}>{item.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  const UserMenu = () => {
      if (user) {
          return (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                            <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                        <Link href="/account"><UserCircle className="mr-2 h-4 w-4" /> My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                       <Link href="/logout"><LogOut className="mr-2 h-4 w-4" /> Logout</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          )
      }
      return (
        <Link href="/login" passHref>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="gradient-border-button px-3 py-1.5"
          >
           Login
          </motion.div>
        </Link>
      )
  }

  return (
    <header className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-auto transition-all duration-300 ease-in-out"
    )}>
       <div className="flex items-center justify-between sm:justify-center gap-2 bg-neutral-900/50 backdrop-blur-md border border-neutral-700 rounded-full px-4 py-1 sm:p-2">
            <div className="sm:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="sm:hidden text-white">
                      <Menu />
                      <span className="sr-only">Open Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="bg-neutral-900/80 backdrop-blur-lg border-neutral-700 text-white rounded-t-2xl h-auto">
                   <div className="flex flex-col items-center gap-4 py-4">
                      {[...mainNavItems, ...resourcesNavItems].map(item => (
                         <Link key={item.href} href={item.href} passHref>
                            <div
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={cn(
                                "text-lg font-medium w-full text-center py-2",
                                pathname.startsWith(item.href) ? "text-primary" : "text-neutral-300"
                              )}
                            >
                              {item.label}
                            </div>
                          </Link>
                      ))}
                      <Link href={contactNavItem.href} passHref>
                        <div onClick={() => setIsMobileMenuOpen(false)} className="mt-4">
                         <div
                           className="gradient-border-button px-6 py-2"
                          >
                           {contactNavItem.label}
                         </div>
                        </div>
                      </Link>
                   </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="hidden sm:flex items-center gap-2">
                <Link href="/" passHref>
                  <motion.div whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.5 }}>
                     <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-full cursor-pointer"/>
                  </motion.div>
                </Link>
                {mainNavItems.map(item => (
                  <NavItem key={item.href} href={item.href} label={item.label} />
                ))}
                <ResourcesDropdown />
                <NavItem href={contactNavItem.href} label={contactNavItem.label} isContact />
            </div>

             <div className="flex-grow flex justify-center items-center sm:hidden">
                 <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-full"/>
                 </Link>
            </div>
             <div className="flex items-center gap-2">
                <ThemeToggle />
                <div className="hidden sm:block">
                  <UserMenu />
                </div>
            </div>
        </div>
    </header>
  );
}
