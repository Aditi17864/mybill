"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Share2, FilePlus2, CheckCircle } from "lucide-react";
import type { Bill } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function ConfirmationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [bill, setBill] = useState<Bill | null>(null);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      router.replace("/login");
      return;
    }
    const billData = localStorage.getItem("currentBill");
    if (billData) {
      setBill(JSON.parse(billData));
    } else {
      router.replace("/shop-selection");
    }
  }, [router]);

  const handleShare = () => {
    toast({
      title: "Feature coming soon!",
      description: "Bill sharing via SMS/WhatsApp will be implemented in a future update.",
    });
  };
  
  const handleNewBill = () => {
    localStorage.removeItem("currentBill");
    router.push("/shop-selection");
  };

  if (!bill) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold font-headline">Payment Successful!</h1>
            <p className="text-muted-foreground">The bill has been generated and marked as paid.</p>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Invoice #{bill.id.slice(-6)}</CardTitle>
            <CardDescription>
              Date: {new Date(bill.createdAt).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <h3 className="font-semibold mb-1">Billed From:</h3>
                    <p className="font-medium">{bill.shopName}</p>
                    <p className="text-muted-foreground">{bill.shopAddress}</p>
                    <p className="text-muted-foreground">{bill.shopContact}</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-1">Billed To:</h3>
                    <p className="font-medium">{bill.customerName}</p>
                    <p className="text-muted-foreground">{bill.customerPhone}</p>
                </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Items Purchased:</h3>
              <div className="space-y-2">
                {bill.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <p>{item.name} <span className="text-muted-foreground">x {item.quantity}</span></p>
                    <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <p className="text-muted-foreground">Payment Mode:</p>
                    <p className="font-medium">{bill.paymentMode}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-muted-foreground">Payment Status:</p>
                    <p className="font-medium text-green-600">{bill.paymentStatus}</p>
                </div>
                <Separator className="my-2"/>
                <div className="flex justify-between font-bold text-lg">
                    <p>Total Amount:</p>
                    <p>₹{bill.totalAmount.toFixed(2)}</p>
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row justify-end gap-2">
             <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Bill
             </Button>
             <Button onClick={handleNewBill} className="bg-accent hover:bg-accent/90">
                <FilePlus2 className="mr-2 h-4 w-4" />
                New Bill
             </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
