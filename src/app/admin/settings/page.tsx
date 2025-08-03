
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSettingsSchema, PaymentSettings } from '@/lib/types';
import { getPaymentSettings, updatePaymentSettings } from './actions';
import { useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function PaymentGatewayForm() {
    const { toast } = useToast();
    const form = useForm<PaymentSettings>({
        resolver: zodResolver(paymentSettingsSchema),
        defaultValues: {
            card: { enabled: true },
            paypal: { enabled: true },
            mobile: { enabled: true },
            bkash: { enabled: true },
            nagad: { enabled: true },
            upi: { enabled: false },
        },
    });

    useEffect(() => {
        getPaymentSettings().then(settings => {
            form.reset(settings);
        });
    }, [form]);

    const onSubmit = async (data: PaymentSettings) => {
        const result = await updatePaymentSettings(data);
        if (result.success) {
            toast({ title: "Settings saved successfully!" });
        } else {
            toast({ variant: 'destructive', title: "Error saving settings." });
        }
    };

    return (
         <Card>
            <CardHeader>
                <CardTitle>Payment Gateway Settings</CardTitle>
                <CardDescription>Enable or disable available payment methods on the checkout page.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="card.enabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Credit/Debit Card</FormLabel>
                                            <FormMessage />
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="paypal.enabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">PayPal</FormLabel>
                                            <FormMessage />
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mobile.enabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Mobile Banking (Main Tab)</FormLabel>
                                            <FormMessage />
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bkash.enabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">bKash</FormLabel>
                                            <FormMessage />
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nagad.enabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Nagad</FormLabel>
                                            <FormMessage />
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="upi.enabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">UPI</FormLabel>
                                            <FormMessage />
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Save Payment Settings
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default function SettingsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            </div>
            
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="grid gap-6"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>Update your personal information and profile picture.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" defaultValue="Dipanjan “Swapna Prangon” Prangon" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="your-email@example.com" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="avatar">Avatar URL</Label>
                            <Input id="avatar" defaultValue="https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg" />
                        </div>
                        <Button>Save Profile</Button>
                    </CardContent>
                </Card>

                <PaymentGatewayForm />

                <Card>
                    <CardHeader>
                        <CardTitle>Theme Settings</CardTitle>
                        <CardDescription>Customize the look and feel of your website.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Label>Primary Color:</Label>
                            <div className="w-8 h-8 rounded-full bg-primary border-2 border-primary-foreground"></div>
                            <span>(hsl(334 93 38))</span>
                        </div>
                        <Button variant="outline">Change Theme</Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
