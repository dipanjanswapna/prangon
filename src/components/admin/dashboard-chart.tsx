
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface DashboardChartProps {
    data: {
        name: string;
        total: number;
        fill: string;
    }[];
}

export function DashboardChart({ data }: DashboardChartProps) {
    const chartConfig = {
        total: {
          label: 'Total',
          color: 'hsl(var(--chart-1))',
        },
    };

    return (
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart accessibilityLayer data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip cursor={{fill: 'hsla(var(--muted))'}} content={<ChartTooltipContent />} />
                <Bar dataKey="total" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
    );
}
