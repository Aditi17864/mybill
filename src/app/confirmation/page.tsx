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

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
        <path fill="#fff" d="M4.868,43.313c-0.02-0.059-0.039-0.12-0.059-0.178c-0.003-0.009-0.007-0.017-0.01-0.026c-0.04-0.101-0.075-0.208-0.111-0.315c-0.002-0.005-0.003-0.01-0.005-0.015c-0.043-0.123-0.079-0.251-0.115-0.378c-0.002-0.008-0.005-0.015-0.007-0.023c-0.044-0.149-0.079-0.304-0.111-0.46c-0.002-0.008-0.003-0.016-0.005-0.024c-0.038-0.173-0.069-0.352-0.094-0.534c-0.002-0.014-0.003-0.027-0.005-0.041c-0.03-0.211-0.053-0.427-0.069-0.645c-0.001-0.014-0.002-0.028-0.002-0.043c-0.021-0.274-0.033-0.552-0.036-0.832c0-0.001,0-0.002,0-0.003L4.227,12.11c0-1.527,1.242-2.769,2.769-2.769h29.921c1.527,0,2.769,1.242,2.769,2.769v20.43c0,1.527-1.242,2.769-2.769,2.769H10.151L4.868,43.313z"/>
        <path fill="#fff" d="M4.868,43.313c-0.02-0.059-0.039-0.12-0.059-0.178c-0.003-0.009-0.007-0.017-0.01-0.026c-0.04-0.101-0.075-0.208-0.111-0.315c-0.002-0.005-0.003-0.01-0.005-0.015c-0.043-0.123-0.079-0.251-0.115-0.378c-0.002-0.008-0.005-0.015-0.007-0.023c-0.044-0.149-0.079-0.304-0.111-0.46c-0.002-0.008-0.003-0.016-0.005-0.024c-0.038-0.173-0.069-0.352-0.094-0.534c-0.002-0.014-0.003-0.027-0.005-0.041c-0.03-0.211-0.053-0.427-0.069-0.645c-0.001-0.014-0.002-0.028-0.002-0.043c-0.021-0.274-0.033-0.552-0.036-0.832c0-0.001,0-0.002,0-0.003L4.227,12.11c0-1.527,1.242-2.769,2.769-2.769h29.921c1.527,0,2.769,1.242,2.769,2.769v20.43c0,1.527-1.242,2.769-2.769,2.769H10.151L4.868,43.313z"/>
        <path fill="#40C351" d="M36.918,11.348h-29.92c-0.9,0-1.63,0.73-1.63,1.63v20.43c0,0.9,0.73,1.63,1.63,1.63h24.085l6.326,5.828V12.978C38.548,12.078,37.818,11.348,36.918,11.348z"/>
        <path fill="#fff" d="M22.999,17.284c-1.299-0.03-2.585,0.368-3.684,1.141c-1.129,0.791-2.091,1.9-2.793,3.228c-0.103,0.19-0.187,0.387-0.264,0.589c-0.035,0.089-0.068,0.179-0.102,0.268l-0.012,0.031c-0.108,0.288-0.21,0.579-0.297,0.875c-0.025,0.086-0.05,0.171-0.073,0.258c-0.093,0.352-0.172,0.71-0.23,1.077c-0.018,0.114-0.03,0.23-0.043,0.345c-0.055,0.489-0.08,0.985-0.076,1.482c0.004,0.474,0.038,0.946,0.102,1.411c0.019,0.141,0.041,0.28,0.065,0.419c0.12,0.676,0.301,1.332,0.536,1.968c0.042,0.114,0.088,0.225,0.134,0.336c0.239,0.579,0.529,1.13,0.859,1.656c0.083,0.132,0.17,0.261,0.259,0.388c0.822,1.164,1.889,2.14,3.13,2.862c0.172,0.1,0.347,0.195,0.525,0.287c1.378,0.721,2.943,1.109,4.558,1.109c1.598,0,3.15-0.38,4.519-1.085c0.184-0.094,0.365-0.191,0.543-0.293c1.205-0.692,2.253-1.616,3.089-2.71c0.076-0.1,0.15-0.2,0.223-0.302c0.669-0.923,1.214-1.96,1.603-3.078c0.048-0.137,0.09-0.277,0.132-0.418c0.165-0.551,0.287-1.116,0.361-1.692c0.021-0.165,0.035-0.331,0.043-0.498c0.029-0.622,0.01-1.256-0.051-1.876c-0.009-0.089-0.023-0.176-0.036-0.264c-0.074-0.493-0.19-0.975-0.349-1.442c-0.048-0.143-0.098-0.283-0.151-0.423c-0.229-0.603-0.521-1.18-0.865-1.722c-0.078-0.123-0.16-0.244-0.243-0.363c-0.536-0.768-1.178-1.446-1.9-2.012c-0.137-0.106-0.277-0.208-0.418-0.308c-0.89-0.627-1.89-1.133-2.96-1.49C24.032,17.371,23.513,17.302,22.999,17.284z M27.818,20.689c0.231,0,0.46,0.017,0.686,0.049c0.835,0.12,1.644,0.384,2.399,0.773c0.128,0.066,0.254,0.135,0.378,0.208c0.706,0.414,1.341,0.933,1.879,1.533c0.12,0.132,0.234,0.269,0.344,0.407c0.412,0.518,0.76,1.088,1.03,1.696c0.083,0.186,0.159,0.377,0.228,0.573c0.207,0.584,0.354,1.191,0.435,1.811c0.024,0.183,0.039,0.369,0.044,0.555c0.016,0.6,0.005,1.203-0.034,1.795c-0.007,0.103-0.017,0.205-0.03,0.306c-0.05,0.395-0.127,0.784-0.23,1.161c-0.029,0.108-0.06,0.214-0.092,0.32c-0.137,0.457-0.312,0.9-0.521,1.323c-0.048,0.098-0.1,0.193-0.152,0.288c-0.381,0.702-0.849,1.33-1.388,1.87c-0.125,0.125-0.253,0.245-0.385,0.363c-0.899,0.799-1.956,1.411-3.12,1.79c-0.165,0.055-0.333,0.106-0.5,0.152c-1.018,0.279-2.074,0.417-3.15,0.417c-1.026,0-2.042-0.132-3.003-0.399c-0.165-0.046-0.328-0.095-0.489-0.147c-0.979-0.317-1.902-0.776-2.73-1.349c-0.129-0.088-0.256-0.18-0.38-0.273c-0.822-0.627-1.543-1.39-2.127-2.251c-0.091-0.132-0.179-0.267-0.264-0.403c-0.485-0.781-0.879-1.636-1.161-2.545c-0.035-0.11-0.068-0.222-0.099-0.334c-0.12-0.428-0.208-0.869-0.259-1.319c-0.015-0.132-0.023-0.266-0.029-0.4c-0.02-0.477-0.007-0.957,0.039-1.428c0.013-0.131,0.032-0.26,0.053-0.388c0.076-0.457,0.188-0.9,0.333-1.326c0.04-0.117,0.083-0.231,0.128-0.345c0.19-0.485,0.424-0.951,0.698-1.392c0.065-0.106,0.133-0.209,0.202-0.311c0.45-0.669,0.985-1.267,1.586-1.782c0.165-0.143,0.335-0.279,0.509-0.408c0.75-0.551,1.584-0.983,2.47-1.276C25.597,21.037,26.702,20.689,27.818,20.689z"/>
    </svg>
);


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

  const handleShare = (via: 'sms' | 'whatsapp') => {
    if (!bill) return;

    const itemsSummary = bill.items.map(item => `${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`).join('\n');
    
    const message = `Thank you for your purchase from ${bill.shopName}!\n\nBill Summary:\nInvoice ID: #${bill.id.slice(-6)}\n${itemsSummary}\n\nTotal Amount: ₹${bill.totalAmount.toFixed(2)}\nPayment: ${bill.paymentMode} (${bill.paymentStatus})\n\nThank you!`;
    
    if (via === 'whatsapp') {
      const whatsappUrl = `https://wa.me/91${bill.customerPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
        toast({
            title: "Feature coming soon!",
            description: "Bill sharing via SMS will be implemented in a future update.",
        });
    }
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
             <Button variant="outline" onClick={() => handleShare('sms')}>
                <Share2 className="mr-2 h-4 w-4" />
                Share via SMS
             </Button>
             <Button variant="outline" onClick={() => handleShare('whatsapp')} className="bg-[#25D366] text-white hover:bg-[#25D366]/90">
                <WhatsAppIcon className="mr-2 h-5 w-5" />
                Share via WhatsApp
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
