
'use client';

import { motion } from 'framer-motion';
import { Check, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const plans = {
    monthly: [
        {
            name: 'Reader',
            price: '$5',
            period: '/month',
            description: 'Access to all premium articles and our community.',
            features: [
                'Unlimited premium articles',
                'Join the community forum',
                'Monthly newsletter',
                'Cancel anytime'
            ],
            isPopular: false,
        },
        {
            name: 'Patron',
            price: '$10',
            period: '/month',
            description: 'Support our work and get exclusive benefits.',
            features: [
                'All features from Reader plan',
                'Early access to new content',
                'Monthly Q&A with authors',
                'Your name in our patrons list'
            ],
            isPopular: true,
        },
    ],
    yearly: [
        {
            name: 'Reader',
            price: '$50',
            period: '/year',
            description: 'Get 2 months free with our annual plan.',
            features: [
                'Unlimited premium articles',
                'Join the community forum',
                'Monthly newsletter',
                'Cancel anytime'
            ],
            isPopular: false,
        },
        {
            name: 'Patron',
            price: '$100',
            period: '/year',
            description: 'Maximum savings for our biggest supporters.',
            features: [
                'All features from Reader plan',
                'Early access to new content',
                'Monthly Q&A with authors',
                'Your name in our patrons list'
            ],
            isPopular: true,
        },
    ]
};

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

export default function SubscribePage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const activePlans = plans[billingCycle];

    return (
        <div className="bg-background min-h-screen py-16 md:py-24">
            <div className="container mx-auto px-4">
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

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                >
                    {activePlans.map((plan, index) => (
                        <motion.div key={plan.name} variants={itemVariants}>
                            <Card className={cn("bg-muted/30 flex flex-col h-full", plan.isPopular && "border-primary shadow-primary/20")}>
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
                                        <span className="text-4xl font-extrabold text-primary-foreground">{plan.price}</span>
                                        <span className="text-muted-foreground">{plan.period}</span>
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
                                    <Button className="w-full" variant={plan.isPopular ? 'default' : 'outline'}>
                                        Subscribe
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                    className="text-center mt-16"
                >
                    <h3 className="text-xl font-bold text-primary-foreground mb-4">Have a promo code?</h3>
                    <div className="flex justify-center max-w-sm mx-auto">
                        <input type="text" placeholder="Enter code" className="bg-input border border-border rounded-l-md px-4 py-2 w-full focus:ring-primary focus:border-primary" />
                        <Button className="rounded-l-none">Apply</Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
