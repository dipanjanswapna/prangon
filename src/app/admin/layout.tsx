
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
        <div className="flex flex-col flex-1">
            <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
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
            <main className="flex-1 p-4 sm:px-6 pb-24">
                {children}
            </main>
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-nav">
            <div className="bottom-nav-inner">
                <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="absolute bottom-full w-full bg-muted/80 backdrop-blur-lg rounded-t-2xl overflow-hidden"
                    >
                         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 p-4">
                            {adminNavItems.map(item => (
                                <Link key={item.href} href={item.href}>
                                     <div className={cn("flex flex-col items-center justify-center gap-1 p-2 rounded-lg", pathname === item.href ? 'bg-primary text-primary-foreground' : 'hover:bg-accent')}>
                                        {item.icon}
                                        <span className="text-xs text-center">{item.label}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
                <div className="flex justify-around items-center h-full">
                    <div className="sm:hidden"> {/* This div is for mobile to have a similar layout to desktop */}
                         <div className="grid grid-flow-col auto-cols-fr gap-2 h-full">
                            {adminNavItems.slice(0, 4).map(item => (
                                <Link key={item.href} href={item.href} className={cn("flex flex-col items-center justify-center gap-1 h-full", pathname === item.href ? 'text-primary' : 'text-muted-foreground')}>
                                   {item.icon}
                                   <span className="text-[10px]">{item.label}</span>
                                </Link>
                            ))}
                         </div>
                    </div>
                     <div className="hidden sm:flex justify-around items-center h-full w-full">
                        {adminNavItems.map(item => (
                            <Link key={item.href} href={item.href} className={cn("flex flex-col items-center justify-center gap-1 h-full px-2", pathname === item.href ? 'text-primary' : 'text-muted-foreground hover:text-primary')}>
                                {item.icon}
                                <span className="text-xs">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="sm:hidden absolute left-1/2 -translate-x-1/2 top-[-20px]">
                        <Button
                            size="icon"
                            className="rounded-full h-14 w-14 shadow-lg"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
