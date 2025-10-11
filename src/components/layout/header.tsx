
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, BookOpen, ChevronDown } from 'lucide-react';
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
} from "@/components/ui/dropdown-menu";


const mainNavItems = [
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

  const NavItem = ({ href, label, isContact = false }: { href: string, label: string, isContact?: boolean }) => {
    const isActive = pathname.startsWith(href);

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

  return (
    <header className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto transition-all duration-300 ease-in-out"
    )}>
       <div className="flex items-center gap-2 bg-neutral-900/50 backdrop-blur-md border border-neutral-700 rounded-full px-4 py-1 sm:p-2">
            {mainNavItems.map(item => (
              <NavItem key={item.href} href={item.href} label={item.label} />
            ))}
            <ResourcesDropdown />
            <NavItem href={contactNavItem.href} label={contactNavItem.label} isContact />
        </div>
    </header>
  );
}
