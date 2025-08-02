
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Briefcase, BarChart, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
    { title: 'Total Projects', value: '12', icon: <Briefcase className="h-6 w-6 text-primary" /> },
    { title: 'Blog Posts', value: '8', icon: <FileText className="h-6 w-6 text-primary" /> },
    { title: 'Page Views', value: '25.3K', icon: <BarChart className="h-6 w-6 text-primary" /> },
    { title: 'New Leads', value: '150', icon: <Activity className="h-6 w-6 text-primary" /> },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function DashboardPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
                {stats.map((stat) => (
                    <motion.div key={stat.title} variants={itemVariants}>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                {stat.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    +20.1% from last month
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                 variants={containerVariants}
                 initial="hidden"
                 animate="visible"
                 className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
            >
                <motion.div variants={itemVariants} className="col-span-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <p>Overview chart will be here.</p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants} className="col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Sales</CardTitle>
                            <CardDescription>
                                You made 265 sales this month.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Recent sales list will be here.</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

        </div>
    );
}
