
'use client';

import { useState, useEffect } from 'react';
import { getAllUsers, manageSubscription } from './actions';
import { getSubscriptionPlans } from '../subscriptions/actions';
import { AppUser, SubscriptionPlan } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, SlidersHorizontal, UserPlus, Gem, Star, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

function ManageSubscriptionDialog({ user, plans }: { user: AppUser, plans: SubscriptionPlan[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleGrant = async () => {
        if (!selectedPlanId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a subscription plan.' });
            return;
        }
        setIsSubmitting(true);
        const result = await manageSubscription(user.customId, 'grant', selectedPlanId);
        if (result.success) {
            toast({ title: 'Success', description: `Subscription granted to ${user.displayName}.` });
            setIsOpen(false);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsSubmitting(false);
    };

    const handleRevoke = async () => {
        if (confirm(`Are you sure you want to revoke the subscription for ${user.displayName}?`)) {
            setIsSubmitting(true);
            const result = await manageSubscription(user.customId, 'revoke');
            if (result.success) {
                toast({ title: 'Success', description: `Subscription revoked for ${user.displayName}.` });
                setIsOpen(false);
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            }
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Manage</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage Subscription for {user.displayName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <p>Current plan: <Badge variant={user.subscription?.planName ? 'default' : 'secondary'}>{user.subscription?.planName || 'Standard'}</Badge></p>
                    
                    <div className="space-y-2">
                        <h4 className="font-semibold">Grant New Subscription</h4>
                        <div className="flex gap-2">
                            <Select onValueChange={setSelectedPlanId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {plans.map(plan => (
                                        <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleGrant} disabled={isSubmitting || !selectedPlanId}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Grant
                            </Button>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <h4 className="font-semibold">Revoke Subscription</h4>
                        <Button variant="destructive" onClick={handleRevoke} disabled={isSubmitting || !user.subscription?.planName}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Revoke Access
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<AppUser[]>([]);
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, plansData] = await Promise.all([
                    getAllUsers(),
                    getSubscriptionPlans()
                ]);
                setUsers(usersData);
                setFilteredUsers(usersData);
                setPlans(plansData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const results = users.filter(user =>
            user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.customId.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(results);
    }, [searchQuery, users]);

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                        <p className="text-muted-foreground">
                            View users and manage their subscriptions.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Users</CardTitle>
                        <CardDescription>A list of all registered users in the system.</CardDescription>
                        <div className="relative pt-2">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by name, email, or user ID..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Display Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>User ID</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Subscription</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <TableRow key={user.uid}>
                                            <TableCell className="font-medium">{user.displayName}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell><code className="text-xs">{user.customId}</code></TableCell>
                                            <TableCell>
                                                {user.role === 'admin' ? (
                                                    <Badge variant="destructive" className="gap-1"><ShieldCheck className="h-3 w-3"/>Admin</Badge>
                                                ) : (
                                                    <Badge variant="secondary">User</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {user.subscription?.planName ? (
                                                    <Badge><Gem className="mr-1 h-3 w-3"/>{user.subscription.planName}</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Standard</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <ManageSubscriptionDialog user={user} plans={plans} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">No users found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
