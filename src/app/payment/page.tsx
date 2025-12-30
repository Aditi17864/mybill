"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowRight, CheckCircle, Wallet } from "lucide-react";
import type { Bill } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";


export default function PaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [bill, setBill] = useState<Bill | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const qrCodePlaceholder = PlaceHolderImages.find(p => p.id === 'upi-qr-code');

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      router.replace("/login");
      return;
    }
    const billData = localStorage.getItem("currentBill");
    if (billData) {
      setBill(JSON.parse(billData));
    } else {
      // No bill data, redirect to start
      toast({
        title: "No bill found",
        description: "Please create a bill first.",
        variant: "destructive",
      });
      router.replace("/shop-selection");
    }
  }, [router, toast]);

  const finalizeBill = (paymentMode: 'Cash' | 'UPI') => {
    if (!bill) return;
    setIsLoading(true);
    
    const finalBill: Bill = {
      ...bill,
      paymentMode,
      paymentStatus: 'Paid',
    };
    
    localStorage.setItem('currentBill', JSON.stringify(finalBill));

    // Save to history
    try {
      const history = JSON.parse(localStorage.getItem('billsHistory') || '[]') as Bill[];
      history.unshift(finalBill); // Add to the beginning of the array
      localStorage.setItem('billsHistory', JSON.stringify(history));
    } catch (error) {
        console.error("Failed to save bill history:", error);
        toast({
            title: "Error saving history",
            description: "There was an issue saving the bill to your history.",
            variant: "destructive",
        });
    }
    
    setTimeout(() => {
        router.push('/confirmation');
    }, 1000);
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
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">Complete Payment</CardTitle>
                    <CardDescription>Select a payment method to finalize the bill.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center bg-muted/50 rounded-lg p-6 my-6">
                        <p className="text-lg text-muted-foreground">Total Amount Due</p>
                        <p className="text-5xl font-bold font-headline text-accent">₹{bill.totalAmount.toFixed(2)}</p>
                    </div>
                    <Tabs defaultValue="upi" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 h-12">
                            <TabsTrigger value="upi" className="h-10 text-base">UPI</TabsTrigger>
                            <TabsTrigger value="cash" className="h-10 text-base">Cash</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upi" className="mt-6">
                            <div className="flex flex-col items-center text-center gap-4">
                                <p className="text-muted-foreground">Scan the QR code with any UPI app.</p>
                                {qrCodePlaceholder && (
                                    <Image 
                                        src={qrCodePlaceholder.imageUrl} 
                                        alt={qrCodePlaceholder.description}
                                        width={250}
                                        height={250}
                                        className="rounded-lg border-4 border-primary shadow-md"
                                        data-ai-hint={qrCodePlaceholder.imageHint}
                                    />
                                )}
                                <p className="font-semibold">Amount: ₹{bill.totalAmount.toFixed(2)}</p>
                                <Button onClick={() => finalizeBill('UPI')} className="w-full max-w-xs" size="lg" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
                                    Confirm Payment
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="cash" className="mt-6">
                            <div className="flex flex-col items-center text-center gap-6 p-4">
                                <Wallet className="h-16 w-16 text-primary" />
                                <p className="text-muted-foreground">Confirm that cash payment has been received.</p>
                                <p className="font-semibold text-xl">Amount Received: ₹{bill.totalAmount.toFixed(2)}</p>
                                <Button onClick={() => finalizeBill('Cash')} className="w-full max-w-xs" size="lg" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
                                    Mark as Paid
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
  );
}
