"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Bill } from "@/lib/types";
import { format } from "date-fns";

export default function HistoryPage() {
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterShop, setFilterShop] = useState("all");

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      router.replace("/login");
      return;
    }
    try {
      const storedBills = JSON.parse(
        localStorage.getItem("billsHistory") || "[]"
      ) as Bill[];
      setBills(storedBills);
    } catch (error) {
      console.error("Failed to load bill history:", error);
      setBills([]);
    }
  }, [router]);

  const filteredBills = useMemo(() => {
    return bills
      .filter((bill) => {
        if (filterShop !== "all" && bill.shopId !== filterShop) {
          return false;
        }
        if (searchTerm) {
          const lowerSearchTerm = searchTerm.toLowerCase();
          return (
            bill.customerName.toLowerCase().includes(lowerSearchTerm) ||
            bill.customerPhone.includes(lowerSearchTerm) ||
            bill.id.slice(-6).includes(lowerSearchTerm)
          );
        }
        return true;
      });
  }, [bills, searchTerm, filterShop]);

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Bill History</h1>
          <p className="text-muted-foreground">
            A record of all completed transactions.
          </p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
            <Input 
                placeholder="Search name, phone, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 md:w-64"
            />
            <Select value={filterShop} onValueChange={setFilterShop}>
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by shop" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Shops</SelectItem>
                    <SelectItem value="kapish">Kapish Photo</SelectItem>
                    <SelectItem value="sunny">Sunny Watch</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Showing {filteredBills.length} of {bills.length} total bills.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Shop</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Payment</TableHead>
                  <TableHead className="hidden lg:table-cell text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.length > 0 ? (
                  filteredBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">
                        #{bill.id.slice(-6)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{bill.customerName}</div>
                        <div className="text-sm text-muted-foreground">{bill.customerPhone}</div>
                      </TableCell>
                       <TableCell className="hidden md:table-cell">{bill.shopName}</TableCell>
                      <TableCell className="text-right font-mono">
                        ₹{bill.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center">
                        <Badge variant={bill.paymentMode === 'Cash' ? 'secondary' : 'default'} className="whitespace-nowrap">
                            {bill.paymentMode}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-right">
                        {format(new Date(bill.createdAt), "PPp")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No bills found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
