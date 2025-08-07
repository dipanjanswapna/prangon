
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rss, GitBranch, Library, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getDashboardStats } from './actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const StatCardSkeleton = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-6 rounded-full" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-32 mt-1" />
        </CardContent>
    </Card>
);


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
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const chartConfig = {
        total: {
          label: 'Total',
          color: 'hsl(var(--chart-1))',
        },
    };

    useEffect(() => {
        getDashboardStats().then(data => {
            setStats([
                { title: 'Blog Posts', value: data.totalBlogPosts, icon: <Rss className="h-6 w-6 text-primary" /> },
                { title: 'Projects', value: data.totalProjects, icon: <GitBranch className="h-6 w-6 text-primary" /> },
                { title: 'Library Items', value: data.totalLibraryItems, icon: <Library className="h-6 w-6 text-primary" /> },
                { title: 'Subscription Plans', value: data.totalSubscriptionPlans, icon: <Star className="h-6 w-6 text-primary" /> },
            ]);
            setChartData([
                { name: 'Blog', total: data.totalBlogPosts, fill: 'var(--color-blog)' },
                { name: 'Projects', total: data.totalProjects, fill: 'var(--color-projects)' },
                { name: 'Library', total: data.totalLibraryItems, fill: 'var(--color-library)' },
                { name: 'Plans', total: data.totalSubscriptionPlans, fill: 'var(--color-plans)' },
            ]);
            setLoading(false);
        });
    }, []);

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
                {loading ? (
                    [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
                ) : (
                    stats.map((stat: any) => (
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
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
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
                            <CardTitle>Content Overview</CardTitle>
                             <CardDescription>A summary of all content types.</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            {loading ? (
                                 <Skeleton className="h-[250px] w-full"/>
                            ) : (
                                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                    <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                        <Tooltip cursor={{fill: 'hsla(var(--muted))'}} content={<ChartTooltipContent />} />
                                        <Bar dataKey="total" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ChartContainer>
                            )}
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
