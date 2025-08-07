
'use client';

import { Home, Settings, Feather, Palette, Star, UserCircle, Library, Briefcase, Trophy, Info, Rss, HandHeart, GitBranch, HelpCircle, Users, Menu, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
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
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';


const adminNavItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { href: '/admin/users', label: 'Users', icon: <Users className="h-4 w-4" /> },
    { href: '/admin/home', label: 'Home Page', icon: <Home className="h-4 w-4" /> },
    { href: '/admin/about', label: 'About Page', icon: <Info className="h-4 w-4" /> },
    { href: '/admin/experiences', label: 'Experiences', icon: <Briefcase className="h-4 w-4" /> },
    { href: '/admin/projects', label: 'Projects', icon: <GitBranch className="h-4 w-4" /> },
    { href: '/admin/achievements', label: 'Achievements', icon: <Trophy className="h-4 w-4" /> },
    { href: '/admin/social-work', label: 'Social Work', icon: <HandHeart className="h-4 w-4" /> },
    { href: '/admin/prangons-likha', label: 'Prangons Likha', icon: <Feather className="h-4 w-4" /> },
    { href: '/admin/library', label: 'Library', icon: <Library className="h-4 w-4" /> },
    { href: '/admin/blog', label: 'Blog', icon: <Rss className="h-4 w-4" /> },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: <Star className="h-4 w-4" /> },
    { href: '/admin/visual-arts', label: 'Visual Arts', icon: <Palette className="h-4 w-4" /> },
    { href: '/admin/faq', label: 'FAQ', icon: <HelpCircle className="h-4 w-4" /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/login?flow=admin');
      } else if (user.role !== 'admin') {
        // Logged in, but not an admin, redirect to home
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2 text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }
  
  // If we reach here, user is logged in and is an admin.
  return (
    <SidebarProvider>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Sidebar>
                <SidebarHeader>
                     <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base mr-4">
                         <Image src="/logo.png" alt="PRANGON CENTRE Logo" width={32} height={32} className="rounded-full" />
                         <span>PRANGON CENTRE</span>
                    </Link>
                </SidebarHeader>
                <SidebarContent className="p-2">
                    <SidebarMenu>
                         {adminNavItems.map(item => (
                            <SidebarMenuItem key={item.href}>
                                <Link href={item.href}>
                                     <SidebarMenuButton isActive={pathname === item.href}>
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                         ))}
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <SidebarTrigger className="sm:hidden" />
                    <div className="relative ml-auto flex-1 md:grow-0">
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                            <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                                    <AvatarFallback>{user.displayName?.charAt(0)?.toUpperCase() ?? 'A'}</AvatarFallback>
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href="/logout">Logout</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex-1 p-4 sm:px-6 sm:py-0">
                    {children}
                </main>
            </div>
        </div>
    </SidebarProvider>
  );
}
