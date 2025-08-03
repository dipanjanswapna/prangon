
'use client';

import { motion } from 'framer-motion';
import { Check, Crown, Star, Ticket, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getSubscriptionPlans } from '@/app/admin/subscriptions/actions';
import { SubscriptionPlan } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import Link from 'next/link';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100 },
    },
};

const PlanCardSkeleton = () => (
    <Card className="bg-muted/30 flex flex-col h-full">
        <CardHeader className="text-center">
            <Skeleton className="h-6 w-24 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto mt-2" />
        </CardHeader>
        <CardContent className="flex-grow">
            <div className="text-center mb-6">
                <Skeleton className="h-10 w-20 mx-auto" />
                <Skeleton className="h-4 w-16 mx-auto mt-1" />
            </div>
            <ul className="space-y-3">
                {[...Array(4)].map((_, i) => (
                    <li key={i} className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-full" />
                    </li>
                ))}
            </ul>
        </CardContent>
        <CardFooter>
            <Skeleton className="h-10 w-full" />
        </CardFooter>
    </Card>
)

export default function SubscribePage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSubscriptionPlans()
            .then(setPlans)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-background min-h-screen py-16 md:py-24 relative">
             <Image
                src="https://i.pinimg.com/736x/33/b0/7b/33b07b85217d89cfa5a73560f21660ae.jpg"
                alt="Subscribe background"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0 opacity-10"
                data-ai-hint="abstract background"
            />
            <div className="container mx-auto px-4 relative z-10">
                <motion.header
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                        <Crown className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-primary-foreground uppercase">
                        Become a Premium Member
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
                        Unlock exclusive content, support our writers, and join a community of passionate readers.
                    </p>
                </motion.header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex justify-center items-center gap-4 mb-12"
                >
                    <Label htmlFor="billing-cycle" className={cn("font-medium", billingCycle === 'monthly' && 'text-primary')}>Monthly</Label>
                    <Switch
                        id="billing-cycle"
                        checked={billingCycle === 'yearly'}
                        onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                    />
                    <Label htmlFor="billing-cycle" className={cn("font-medium", billingCycle === 'yearly' && 'text-primary')}>Yearly</Label>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">Save 20%</Badge>
                </motion.div>
                
                {loading ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <PlanCardSkeleton />
                        <PlanCardSkeleton />
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                    >
                        {plans.map((plan, index) => (
                            <motion.div key={plan.id} variants={itemVariants}>
                                <Card className={cn("bg-muted/30 backdrop-blur-sm flex flex-col h-full", plan.isPopular && "border-primary shadow-primary/20")}>
                                    {plan.isPopular && (
                                        <div className="bg-primary text-primary-foreground text-center py-1.5 px-4 text-sm font-bold rounded-t-lg">
                                            Most Popular
                                        </div>
                                    )}
                                    <CardHeader className="text-center">
                                        <CardTitle className="text-2xl font-bold font-headline text-primary-foreground">{plan.name}</CardTitle>
                                        <CardDescription>{plan.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <div className="text-center mb-6">
                                            <span className="text-4xl font-extrabold text-primary-foreground">
                                                ${billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly}
                                            </span>
                                            <span className="text-muted-foreground">
                                                /{billingCycle === 'monthly' ? 'month' : 'year'}
                                            </span>
                                        </div>
                                        <ul className="space-y-3 text-muted-foreground">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-3">
                                                    <Check className="h-5 w-5 text-green-500" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" variant={plan.isPopular ? 'default' : 'outline'} asChild>
                                            <Link href={`/checkout?planId=${plan.id}&billing=${billingCycle}`}>
                                                Subscribe
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}


                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                    className="text-center mt-16 max-w-xl mx-auto"
                >
                    <Card className="bg-muted/30 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center gap-2 font-headline text-primary-foreground">
                                <Percent className="h-6 w-6 text-primary"/> Have a Promo Code?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center max-w-sm mx-auto">
                                <Input type="text" placeholder="Enter code" className="bg-input border-r-0 rounded-r-none" />
                                <Button className="rounded-l-none">
                                    <Ticket className="mr-2 h-4 w-4"/>
                                    Apply
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.7 }}
                    className="mt-16 max-w-3xl mx-auto"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-headline text-primary-foreground">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                            <AccordionContent>
                                We plan to accept all major credit cards (Visa, MasterCard, American Express), PayPal, and other popular digital wallets. All payments are processed securely.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
                            <AccordionContent>
                                Yes, you can cancel your subscription at any time from your account page. Your access will continue until the end of the current billing period.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>What happens if I cancel?</AccordionTrigger>
                            <AccordionContent>
                                If you cancel, you will retain access to all premium features until your current subscription period ends. After that, your account will be downgraded to the free plan.
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-4">
                            <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
                            <AccordionContent>
                                Due to the nature of digital content, we generally do not offer refunds. However, if you have a special circumstance, please contact our support team.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </motion.div>

            </div>
        </div>
    );
}
