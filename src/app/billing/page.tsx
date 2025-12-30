"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, Loader2, ArrowRight } from "lucide-react";
import type { Shop } from "@/lib/types";
import { format } from "date-fns";

const shopsData: Record<string, Shop> = {
    kapish: { id: "kapish", name: "Kapish Photo Frame", address: "123 Frame St, Market City", contact: "+91 1234567890"},
    sunny: { id: "sunny", name: "Sunny Watch Center", address: "456 Watch Ave, Market City", contact: "+91 9876543210"},
};

const billSchema = z.object({
  customerName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  customerPhone: z.string().regex(/^\d{10}$/, { message: "Must be a valid 10-digit phone number." }),
  items: z.array(z.object({
    name: z.string().min(1, { message: "Item name is required." }),
    quantity: z.coerce.number().min(1, { message: "Min 1." }),
    price: z.coerce.number().min(0, { message: "Min 0." }),
  })).min(1, { message: "Please add at least one item." }),
});

type BillFormData = z.infer<typeof billSchema>;

function ItemsTotal({ control }: { control: any }) {
  const items = useWatch({ control, name: "items" });
  const total = useMemo(() => {
    return items.reduce((acc: number, item: any) => acc + (item.quantity || 0) * (item.price || 0), 0);
  }, [items]);
  
  return (
    <div className="text-right">
      <p className="text-muted-foreground">Total Amount</p>
      <div className="text-3xl font-bold text-foreground">
        ₹{total.toFixed(2)}
      </div>
    </div>
  );
}

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shop") as 'kapish' | 'sunny' | null;
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate] = useState(new Date());

  const form = useForm<BillFormData>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      items: [{ name: "", quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      router.replace("/login");
      return;
    }
    if (shopId && shopsData[shopId]) {
      setShop(shopsData[shopId]);
    } else {
      router.replace("/shop-selection");
    }
  }, [router, shopId]);

  const onSubmit = (data: BillFormData) => {
    if (!shop) return;
    setIsLoading(true);

    const totalAmount = data.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

    const bill = {
      id: new Date().getTime().toString(),
      shopId: shop.id,
      shopName: shop.name,
      shopAddress: shop.address,
      shopContact: shop.contact,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      items: data.items,
      totalAmount,
      paymentStatus: 'Due',
      createdAt: currentDate.toISOString(),
    };
    
    localStorage.setItem('currentBill', JSON.stringify(bill));
    router.push('/payment');
  };

  if (!shop) {
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-headline">New Bill</h1>
              <p className="text-muted-foreground">For {shop.name}</p>
            </div>
            <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Proceed to Payment"}
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="md:col-span-2">
                  <CardHeader>
                      <CardTitle>Customer Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid sm:grid-cols-2 gap-4">
                      <FormField
                          control={form.control}
                          name="customerName"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Customer Name</FormLabel>
                                  <FormControl>
                                      <Input placeholder="John Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="customerPhone"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Customer Phone</FormLabel>
                                  <FormControl>
                                      <Input type="tel" placeholder="9876543210" {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle>Bill Details</CardTitle>
                       <CardDescription>{format(currentDate, "PPP")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <ItemsTotal control={form.control} />
                  </CardContent>
              </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="hidden md:grid grid-cols-12 gap-4 font-semibold text-muted-foreground px-2">
                    <div className="col-span-5">Item Name</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                    <div className="col-span-1"></div>
                </div>
                <Separator className="hidden md:block"/>
                {fields.map((field, index) => {
                  const quantity = form.watch(`items.${index}.quantity`);
                  const price = form.watch(`items.${index}.price`);
                  const subtotal = (quantity || 0) * (price || 0);
                  
                  return (
                  <div key={field.id} className="grid grid-cols-12 gap-2 md:gap-4 items-start border-b md:border-none pb-4 md:pb-0">
                    <FormField
                      control={form.control}
                      name={`items.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="col-span-12 md:col-span-5">
                          <FormLabel className="md:hidden">Item Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Watch Repair" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="col-span-4 md:col-span-2">
                          <FormLabel className="md:hidden">Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} className="text-center"/>
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem className="col-span-4 md:col-span-2">
                          <FormLabel className="md:hidden">Price</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="0.00" {...field} className="text-right" />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="col-span-3 md:col-span-2 flex flex-col items-end h-10 justify-center">
                        <p className="text-xs text-muted-foreground md:hidden">Subtotal</p>
                        <p>₹{subtotal.toFixed(2)}</p>
                    </div>
                    <div className="col-span-1 flex items-center h-10 justify-end md:justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )})}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: "", quantity: 1, price: 0 })}
                  className="mt-4"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
                 <FormField
                    control={form.control}
                    name="items"
                    render={({ fieldState }) => (
                      <FormMessage>{fieldState.error?.root?.message}</FormMessage>
                    )}
                 />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </AppLayout>
  );
}
