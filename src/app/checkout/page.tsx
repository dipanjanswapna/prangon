
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
import { getPaymentSettings } from '@/app/admin/settings/actions';
import { SubscriptionPlan, PaymentSettings } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';


const paymentSchema = z.object({
  nameOnCard: z.string().min(3, 'Name must be at least 3 characters.'),
  cardNumber: z.string().refine((value) => /^\d{16}$/.test(value), 'Please enter a valid 16-digit card number.'),
  expiryDate: z.string().refine((value) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value), 'Please use MM/YY format.'),
  cvc: z.string().refine((value) => /^\d{3,4}$/.test(value), 'Please enter a valid CVC.'),
});

const PaypalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}><path fill="#003087" d="M10.232 21.002c-1.12.01-2.22-.19-3.28-.59a.526.526 0 0 1-.36-.61L7.542 9.77c.07-.28.32-.48.6-.48h3.33c4.68 0 6.13 2.05 5.34 6.2c-.65 3.42-3.02 5.49-7.58 5.51z"/><path fill="#009cde" d="M12.442 2.772c-1.39.02-2.73.3-3.99.87a.526.526 0 0 0-.37.6L9.612 11h3.11c4.2 0 6.02-1.68 6.57-5.52c.46-3.2-1.39-4.71-5.85-4.71z"/><path fill="#012169" d="M8.412 12.182c-1.28.01-2.54-.19-3.75-.6c-.3-.1-.58-.02-.78.2L2.742 13.5c-.2.23-.2.56-.01.82c1.32 1.83 3.38 2.94 5.62 3.23c.3.04.57-.16.63-.45l.95-4.4c.06-.27-.12-.52-.39-.52z"/></svg>
)

function CheckoutForm() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
    const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const planId = searchParams.get('planId');
    const billingCycle = searchParams.get('billing') as 'monthly' | 'yearly' | null;

    useEffect(() => {
        async function loadData() {
            try {
                const [plans, settings] = await Promise.all([
                    getSubscriptionPlans(),
                    getPaymentSettings()
                ]);
                
                if(planId) {
                    const foundPlan = plans.find(p => p.id === planId);
                    setPlan(foundPlan || null);
                }
                setPaymentSettings(settings);

            } catch (error) {
                console.error("Failed to load checkout data", error);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not load checkout information.' });
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [planId, toast]);

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

    const handleMobilePayment = (provider: string) => {
        toast({
            title: `Processing ${provider} Payment...`,
            description: 'Please wait while we process your payment.',
        });
        setTimeout(() => {
            setPaymentSuccess(true);
             toast({
                title: 'Payment Successful!',
                description: `You have successfully subscribed to the ${plan?.name} plan.`,
            });
        }, 2000);
    }
    
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

    const availableGateways = paymentSettings 
        ? Object.entries(paymentSettings).filter(([_, value]) => value.enabled).map(([key]) => key)
        : [];
    
    const defaultTab = availableGateways.includes('card') ? 'card' : availableGateways[0];

    return (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>Payment Details</CardTitle>
                        <CardDescription>Select a payment method. All transactions are secure.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue={defaultTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                {availableGateways.includes('card') && <TabsTrigger value="card">Card</TabsTrigger>}
                                {availableGateways.includes('paypal') && <TabsTrigger value="paypal">PayPal</TabsTrigger>}
                                {availableGateways.includes('mobile') && <TabsTrigger value="mobile">Mobile</TabsTrigger>}
                            </TabsList>
                            {availableGateways.includes('card') && 
                                <TabsContent value="card">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
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
                                </TabsContent>
                            }
                            {availableGateways.includes('paypal') &&
                                <TabsContent value="paypal">
                                    <div className="pt-4 text-center space-y-4">
                                        <p className="text-muted-foreground">You will be redirected to PayPal to complete your purchase securely.</p>
                                        <Button className="w-full bg-[#009cde] hover:bg-[#0079b1] text-white">
                                           <PaypalIcon className="mr-2"/> Continue with PayPal
                                        </Button>
                                    </div>
                                </TabsContent>
                            }
                             {availableGateways.includes('mobile') &&
                                <TabsContent value="mobile">
                                    <div className="pt-4 space-y-4">
                                         <p className="text-muted-foreground text-center">Select your mobile banking provider.</p>
                                         <div className="grid grid-cols-2 gap-4">
                                            {paymentSettings?.bkash?.enabled && <Button variant="outline" className="h-16" onClick={() => handleMobilePayment('bKash')}>bKash</Button>}
                                            {paymentSettings?.nagad?.enabled && <Button variant="outline" className="h-16" onClick={() => handleMobilePayment('Nagad')}>Nagad</Button>}
                                         </div>
                                    </div>
                                </TabsContent>
                             }
                        </Tabs>
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
    <div className="relative min-h-screen">
        <Image
            src="https://i.pinimg.com/1200x/74/91/5c/74915cfe2e29d53bafb269ffa0a6c1dc.jpg"
            alt="Checkout background"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0 opacity-5"
            data-ai-hint="abstract background"
        />
        <div className="relative z-10 container mx-auto max-w-5xl py-12 px-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold font-headline">Complete Your Subscription</h1>
                <p className="text-muted-foreground mt-2">You're one step away from unlocking premium content.</p>
            </div>
            <Suspense fallback={<div className="text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto"/></div>}>
                <CheckoutForm />
            </Suspense>
        </div>
    </div>
  )
}
