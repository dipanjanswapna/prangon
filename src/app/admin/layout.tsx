
'use client';

import { Home, Settings, Loader2, Feather, Palette, Star, UserCircle, Library, Briefcase, Trophy, Info } from 'lucide-react';
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


const adminNavItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <Home /> },
    { href: '/admin/home', label: 'Home Page', icon: <Home /> },
    { href: '/admin/about', label: 'About Page', icon: <Info /> },
    { href: '/admin/experiences', label: 'Experiences', icon: <Briefcase /> },
    { href: '/admin/achievements', label: 'Achievements', icon: <Trophy /> },
    { href: '/admin/prangons-likha', label: 'Prangons Likha', icon: <Feather /> },
    { href: '/admin/library', label: 'Library', icon: <Library /> },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: <Star /> },
    { href: '/admin/visual-arts', label: 'Visual Arts', icon: <Palette /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings /> },
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
    if (!loading && !user) {
      router.push('/login?flow=admin');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 overflow-x-auto whitespace-nowrap">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base mr-4">
                     <Image src="/logo.png" alt="PRANGON CENTRE Logo" width={32} height={32} className="rounded-full" />
                     <span className="sr-only">PRANGON CENTRE</span>
                </Link>
                {adminNavItems.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn("transition-colors hover:text-foreground whitespace-nowrap", pathname === item.href ? "text-foreground font-semibold" : "text-muted-foreground")}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <div className="ml-auto flex-1 sm:flex-initial">
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
            </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {children}
        </main>
    </div>
  );
}
