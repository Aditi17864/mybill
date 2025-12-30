"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, DollarSign, Receipt, Smartphone, Store } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Pie, PieChart as RechartsPieChart, Cell } from "recharts";
import type { DashboardStats, MonthlySummary } from "@/lib/types";

// Mock data
const mockStats: DashboardStats = {
  totalSalesToday: 4250.75,
  cashTotal: 1500.00,
  upiTotal: 2750.75,
  billCount: 15,
  kapishSales: 2800.50,
  sunnySales: 1450.25,
};

const mockMonthlySummary: MonthlySummary = {
  totalRevenue: 125600.00,
  dailySales: Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    sales: Math.floor(Math.random() * (7000 - 2000 + 1)) + 2000,
  })),
};

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const pieChartConfig = {
    cash: { label: 'Cash', color: "hsl(var(--chart-1))" },
    upi: { label: 'UPI', color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState(mockStats);
  const [monthlySummary, setMonthlySummary] = useState(mockMonthlySummary);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      router.replace("/login");
    }
    // In a real app, you would fetch this data from your backend
  }, [router]);
  
  const paymentData = [
      { name: 'Cash', value: stats.cashTotal, fill: 'hsl(var(--chart-1))' },
      { name: 'UPI', value: stats.upiTotal, fill: 'hsl(var(--chart-2))' },
  ];

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time statistics for your shops.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales Today</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₹{stats.totalSalesToday.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Across all shops</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bills Generated</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.billCount}</div>
                <p className="text-xs text-muted-foreground">Total invoices today</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kapish Photo Frame</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₹{stats.kapishSales.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Today's sales</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sunny Watch Center</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₹{stats.sunnySales.toFixed(2)}</div>
                 <p className="text-xs text-muted-foreground">Today's sales</p>
            </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
                <CardDescription>Total Revenue: ₹{monthlySummary.totalRevenue.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer>
                        <RechartsLineChart data={monthlySummary.dailySales} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false}/>
                            <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`}/>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                            <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                        </RechartsLineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Cash vs UPI Today</CardTitle>
                <CardDescription>Breakdown of payment methods</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={pieChartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer>
                        <RechartsPieChart>
                             <RechartsTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Pie data={paymentData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                return (
                                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
                                    {`${(percent * 100).toFixed(0)}%`}
                                </text>
                                );
                            }}>
                                {paymentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </RechartsPieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
