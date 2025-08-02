
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

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
