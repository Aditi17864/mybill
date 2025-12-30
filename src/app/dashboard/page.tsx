"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Receipt, Store } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer } from "recharts";
import type { Bill, DashboardStats, MonthlySummary } from "@/lib/types";
import { isToday, isThisMonth, parseISO, subDays } from 'date-fns';

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const pieChartConfig = {
    cash: { label: 'Cash', color: "hsl(var(--chart-1))" },
    upi: { label: 'UPI', color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const calculateStats = (bills: Bill[]): { stats: DashboardStats, monthly: MonthlySummary } => {
    const today = new Date();
    const billsToday = bills.filter(b => isToday(parseISO(b.createdAt)));
    
    const stats: DashboardStats = {
        totalSalesToday: billsToday.reduce((acc, b) => acc + b.totalAmount, 0),
        cashTotal: billsToday.filter(b => b.paymentMode === 'Cash').reduce((acc, b) => acc + b.totalAmount, 0),
        upiTotal: billsToday.filter(b => b.paymentMode === 'UPI').reduce((acc, b) => acc + b.totalAmount, 0),
        billCount: billsToday.length,
        kapishSales: billsToday.filter(b => b.shopId === 'kapish').reduce((acc, b) => acc + b.totalAmount, 0),
        sunnySales: billsToday.filter(b => b.shopId === 'sunny').reduce((acc, b) => acc + b.totalAmount, 0),
    };
    
    const billsThisMonth = bills.filter(b => isThisMonth(parseISO(b.createdAt)));
    const totalRevenue = billsThisMonth.reduce((acc, b) => acc + b.totalAmount, 0);

    const dailySalesData: { [key: string]: number } = {};
    const last30Days = Array.from({ length: 30 }, (_, i) => subDays(today, i));
    
    last30Days.forEach(day => {
        const dayStr = day.toISOString().split('T')[0];
        dailySalesData[dayStr] = 0;
    });

    bills.filter(b => parseISO(b.createdAt) >= subDays(today, 30)).forEach(bill => {
        const dayStr = parseISO(bill.createdAt).toISOString().split('T')[0];
        if (dailySalesData.hasOwnProperty(dayStr)) {
            dailySalesData[dayStr] += bill.totalAmount;
        }
    });

    const dailySales = Object.entries(dailySalesData)
        .map(([date, sales]) => ({ date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), sales }))
        .reverse();

    const monthly: MonthlySummary = {
        totalRevenue,
        dailySales,
    };

    return { stats, monthly };
};


export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      router.replace("/login");
      return;
    }
    
    try {
        const storedBills = JSON.parse(localStorage.getItem('billsHistory') || '[]') as Bill[];
        const { stats, monthly } = calculateStats(storedBills);
        setStats(stats);
        setMonthlySummary(monthly);
    } catch (error) {
        console.error("Failed to calculate stats:", error);
        setStats({ totalSalesToday: 0, cashTotal: 0, upiTotal: 0, billCount: 0, kapishSales: 0, sunnySales: 0 });
        setMonthlySummary({ totalRevenue: 0, dailySales: []});
    }

  }, [router]);
  
  const paymentData = stats ? [
      { name: 'Cash', value: stats.cashTotal, fill: 'hsl(var(--chart-1))' },
      { name: 'UPI', value: stats.upiTotal, fill: 'hsl(var(--chart-2))' },
  ] : [];

  if (!stats || !monthlySummary) {
      return <AppLayout><div>Loading dashboard...</div></AppLayout>
  }

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
                <CardTitle>Last 30 Days Sales</CardTitle>
                <CardDescription>Monthly Revenue: ₹{monthlySummary.totalRevenue.toFixed(2)}</CardDescription>
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
                             <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Pie data={paymentData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                if (percent === 0) return null;
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
