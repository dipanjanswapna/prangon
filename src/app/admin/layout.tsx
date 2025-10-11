
'use client';

import { Home, Settings, Feather, Palette, Star, UserCircle, Library, Briefcase, Trophy, Info, Rss, HandHeart, GitBranch, HelpCircle, Users, Menu, ShieldAlert, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';


const adminNavItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { href: '/admin/users', label: 'Users', icon: <Users className="h-5 w-5" /> },
    { href: '/admin/home', label: 'Home Page', icon: <Home className="h-5 w-5" /> },
    { href: '/admin/about', label: 'About Page', icon: <Info className="h-5 w-5" /> },
    { href: '/admin/experiences', label: 'Experiences', icon: <Briefcase className="h-5 w-5" /> },
    { href: '/admin/projects', label: 'Projects', icon: <GitBranch className="h-5 w-5" /> },
    { href: '/admin/achievements', label: 'Achievements', icon: <Trophy className="h-5 w-5" /> },
    { href: '/admin/social-work', label: 'Social Work', icon: <HandHeart className="h-5 w-5" /> },
    { href: '/admin/prangons-likha', label: 'Prangons Likha', icon: <Feather className="h-5 w-5" /> },
    { href: '/admin/library', label: 'Library', icon: <Library className="h-5 w-5" /> },
    { href: '/admin/blog', label: 'Blog', icon: <Rss className="h-5 w-5" /> },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: <Star className="h-5 w-5" /> },
    { href: '/admin/visual-arts', label: 'Visual Arts', icon: <Palette className="h-5 w-5" /> },
    { href: '/admin/faq', label: 'FAQ', icon: <HelpCircle className="h-5 w-5" /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
             <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base mr-4">
                 <Image src="/logo.png" alt="PRANGON CENTRE Logo" width={32} height={32} className="rounded-full" />
                 <span className="hidden sm:inline-block">PRANGON CENTRE</span>
            </Link>
            <div className="relative ml-auto flex-1 md:grow-0">
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                            <AvatarImage src="https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg" alt={'Admin'} />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link href="/account">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/admin/settings">Settings</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>

        <nav className="border-b bg-background sticky top-14 z-20">
            <div className="flex flex-wrap items-center gap-4 px-4 sm:px-6 py-2">
                {adminNavItems.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                            pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                        )}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}
            </div>
        </nav>

        <main className="flex-1 p-4 sm:px-6">
            {children}
        </main>
    </div>
  );
}
