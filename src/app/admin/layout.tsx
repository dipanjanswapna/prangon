'use client';

import { Home, Settings, Feather, Palette, Star, UserCircle, Library, Briefcase, Trophy, Info, Rss, HandHeart, GitBranch, HelpCircle, Users, Menu, ShieldAlert, X, LayoutDashboard, ChevronDown, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/firebase/auth/use-user';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const adminNavItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
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
  const router = useRouter();
  const { user, appUser, loading } = useUser();

  useEffect(() => {
    if (loading) return;

    if (!user) {
        if (pathname !== '/admin/login') {
            router.push('/login?redirect=/admin/dashboard');
        }
        return;
    }

    if (appUser?.role !== 'admin') {
        router.push('/account'); // Or show an unauthorized page
    } else {
         // Logged in as admin
        if (pathname === '/login' || pathname === '/admin/login') {
            router.push('/admin/dashboard');
        }
    }
  }, [user, appUser, loading, pathname, router]);

  // Show a loader while Firebase auth state is being determined
  if (loading || (pathname.startsWith('/admin') && appUser?.role !== 'admin')) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  // Allow login page to render without the layout if user is not authenticated yet
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
             <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base mr-4">
                 <Image src="/logo.png" alt="Dipanjan Swapna Prangon Logo" width={32} height={32} className="rounded-full" />
                 <span className="hidden sm:inline-block">DIPANJAN SWAPNA PRANGON</span>
            </Link>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Panel
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <ScrollArea className="h-96">
                    <DropdownMenuLabel>Admin Navigation</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {adminNavItems.map(item => (
                         <Link href={item.href} key={item.href} passHref>
                            <DropdownMenuItem
                                className={cn(
                                    "flex items-center gap-2",
                                    pathname === item.href && "bg-accent"
                                )}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </DropdownMenuItem>
                         </Link>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative ml-auto flex-1 md:grow-0">
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                            <AvatarFallback>{user?.displayName?.charAt(0) || 'A'}</AvatarFallback>
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
                    <DropdownMenuItem asChild>
                       <Link href="/logout"><LogOut className="mr-2 h-4 w-4" /> Logout</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>

        <div className="flex-1">
            {children}
        </div>
    </div>
  );
}
