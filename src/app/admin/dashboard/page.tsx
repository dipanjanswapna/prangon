
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rss, GitBranch, Library, Star } from 'lucide-react';
import { getDashboardStats } from './actions';
import { DashboardChart } from '@/components/admin/dashboard-chart';

export default async function DashboardPage() {
    const data = await getDashboardStats();

    const stats = [
        { title: 'Blog Posts', value: data.totalBlogPosts, icon: <Rss className="h-6 w-6 text-primary" /> },
        { title: 'Projects', value: data.totalProjects, icon: <GitBranch className="h-6 w-6 text-primary" /> },
        { title: 'Library Items', value: data.totalLibraryItems, icon: <Library className="h-6 w-6 text-primary" /> },
        { title: 'Subscription Plans', value: data.totalSubscriptionPlans, icon: <Star className="h-6 w-6 text-primary" /> },
    ];

    const chartData = [
        { name: 'Blog', total: data.totalBlogPosts, fill: 'var(--color-blog)' },
        { name: 'Projects', total: data.totalProjects, fill: 'var(--color-projects)' },
        { name: 'Library', total: data.totalLibraryItems, fill: 'var(--color-library)' },
        { name: 'Plans', total: data.totalSubscriptionPlans, fill: 'var(--color-plans)' },
    ];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
                {stats.map((stat: any) => (
                    <Card key={stat.title}>
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
                ))}
            </div>

            <div
                 className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
            >
                <div className="col-span-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Content Overview</CardTitle>
                             <CardDescription>A summary of all content types.</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <DashboardChart data={chartData} />
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-3">
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
                </div>
            </div>

        </div>
    );
}
