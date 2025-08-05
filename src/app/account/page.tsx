
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, User, Mail, LogOut, ShieldCheck, Gem, UserCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { getUserData } from '../admin/users/actions';
import { AppUser } from '@/lib/types';


export default function AccountPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            getUserData(user.uid).then(data => {
                if (data) {
                    setAppUser(data);
                }
                setPageLoading(false);
            })
        }
    }, [user, loading, router]);

    if (loading || pageLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    if (!user) {
         return (
            <div className="flex h-screen items-center justify-center">
                <p>Redirecting to login...</p>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            staggerChildren: 0.1,
          },
        },
      };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Card>
                    <CardHeader className="text-center">
                         <motion.div variants={itemVariants} className="flex justify-center mb-4">
                             <Avatar className="h-24 w-24 border-4 border-primary/20 ring-4 ring-primary/40">
                                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'}/>
                                <AvatarFallback className="text-3xl">{user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                         </motion.div>
                        <motion.div variants={itemVariants}>
                            <CardTitle className="text-3xl font-bold">{user.displayName || 'User'}</CardTitle>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                           <CardDescription>
                                This is your personal account page.
                            </CardDescription>
                        </motion.div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <motion.div variants={itemVariants}>
                             <Card className="bg-muted/50 p-4">
                                <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <User className="h-5 w-5 text-muted-foreground mr-3" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Display Name</p>
                                            <p className="font-medium">{user.displayName || 'Not set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="h-5 w-5 text-muted-foreground mr-3" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Email Address</p>
                                            <p className="font-medium">{user.email}</p>
                                        </div>
                                    </div>
                                     <div className="flex items-center">
                                        <UserCheck className="h-5 w-5 text-muted-foreground mr-3" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Your User ID</p>
                                            <p className="font-mono text-xs">{appUser?.customId || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                             </Card>
                        </motion.div>

                         <motion.div variants={itemVariants}>
                             <Card className="bg-muted/50 p-4">
                                <h3 className="text-lg font-semibold mb-4">Subscription Status</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Current Plan</p>
                                        <p className="text-sm text-muted-foreground">
                                            {appUser?.subscription?.planName ? `You are subscribed to the ${appUser.subscription.planName} plan.` : 'You are on the Standard plan.'}
                                        </p>
                                    </div>
                                    <Badge variant={appUser?.subscription?.planName ? 'default' : 'secondary'} className="gap-1">
                                        {appUser?.subscription?.planName && <Gem className="h-3 w-3"/>}
                                        {appUser?.subscription?.planName || 'Standard'}
                                    </Badge>
                                </div>
                                <Button className="mt-4 w-full" variant="outline" onClick={() => router.push('/subscribe')}>Manage Subscription</Button>
                             </Card>
                        </motion.div>

                         <motion.div variants={itemVariants} className="text-center">
                            <Button variant="destructive" onClick={logout}>
                                <LogOut className="mr-2 h-4 w-4"/>
                                Sign Out
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
