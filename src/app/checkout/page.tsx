
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Loader2, CreditCard, Lock, Calendar, User, ArrowLeft, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getSubscriptionPlans } from '@/app/admin/subscriptions/actions';
import { SubscriptionPlan } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const paymentSchema = z.object({
  nameOnCard: z.string().min(3, 'Name must be at least 3 characters.'),
  cardNumber: z.string().refine((value) => /^\d{16}$/.test(value), 'Please enter a valid 16-digit card number.'),
  expiryDate: z.string().refine((value) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value), 'Please use MM/YY format.'),
  cvc: z.string().refine((value) => /^\d{3,4}$/.test(value), 'Please enter a valid CVC.'),
});

function CheckoutForm() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const planId = searchParams.get('planId');
    const billingCycle = searchParams.get('billing') as 'monthly' | 'yearly' | null;

    useEffect(() => {
        if(planId) {
            getSubscriptionPlans().then(plans => {
                const foundPlan = plans.find(p => p.id === planId);
                setPlan(foundPlan || null);
            }).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [planId]);

    const form = useForm<z.infer<typeof paymentSchema>>({
        resolver: zodResolver(paymentSchema),
        defaultValues: { nameOnCard: '', cardNumber: '', expiryDate: '', cvc: '' },
    });

    const onSubmit = (values: z.infer<typeof paymentSchema>) => {
        console.log(values);
        toast({
            title: 'Payment Processing...',
            description: 'Please wait while we process your payment.',
        });
        setTimeout(() => {
            setPaymentSuccess(true);
             toast({
                title: 'Payment Successful!',
                description: `You have successfully subscribed to the ${plan?.name} plan.`,
            });
        }, 2000);
    };
    
    if (loading) {
        return <Skeleton className="h-96 w-full max-w-lg" />;
    }

    if (!plan || !billingCycle) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Invalid Plan</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The selected subscription plan is not valid. Please go back and select a plan.</p>
                </CardContent>
                <CardFooter>
                    <Button asChild>
                        <Link href="/subscribe">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Plans
                        </Link>
                    </Button>
                </CardFooter>
             </Card>
        )
    }
    
    const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;

    if (paymentSuccess) {
         return (
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="text-center">
                    <CardHeader>
                         <div className="mx-auto bg-green-500/10 text-green-500 w-fit p-4 rounded-full mb-4">
                            <BadgeCheck className="h-12 w-12" />
                        </div>
                        <CardTitle className="text-3xl font-bold">Thank You!</CardTitle>
                        <CardDescription>Your subscription to the {plan.name} plan is now active.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <p className="text-muted-foreground mb-6">A confirmation email has been sent to your address. You can now access all premium features.</p>
                         <Button asChild>
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Go to Homepage
                            </Link>
                         </Button>
                    </CardContent>
                </Card>
            </motion.div>
         )
    }

    return (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Details</CardTitle>
                        <CardDescription>Enter your payment information below. All transactions are secure.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField name="nameOnCard" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name on Card</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="John Doe" {...field} className="pl-9" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField name="cardNumber" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Card Number</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="0000 0000 0000 0000" {...field} className="pl-9" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <div className="flex gap-4">
                                    <FormField name="expiryDate" control={form.control} render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Expiry Date</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input placeholder="MM/YY" {...field} className="pl-9" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField name="cvc" control={form.control} render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>CVC</FormLabel>
                                            <FormControl>
                                                 <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input placeholder="123" {...field} className="pl-9" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                </div>
                                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                                    Confirm Payment
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
             <div className="lg:col-span-1">
                <Card className="sticky top-24">
                     <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Plan:</span>
                                <span className="font-semibold">{plan.name}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Billing Cycle:</span>
                                <span className="font-semibold capitalize">{billingCycle}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Price:</span>
                                <span className="font-semibold">${price.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">VAT (20%):</span>
                                <span className="font-semibold">${(price * 0.20).toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                                <span>Total:</span>
                                <span>${(price * 1.20).toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
             </div>
        </motion.div>
    );
}


export default function CheckoutPage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-headline">Complete Your Subscription</h1>
            <p className="text-muted-foreground mt-2">You're one step away from unlocking premium content.</p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
            <CheckoutForm />
        </Suspense>
    </div>
  )
}
