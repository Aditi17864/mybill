"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Watch } from "lucide-react";

const shops = [
  {
    id: "kapish",
    name: "Kapish Photo Frame",
    icon: Camera,
  },
  {
    id: "sunny",
    name: "Sunny Watch Center",
    icon: Watch,
  },
];

export default function ShopSelectionPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      router.replace("/login");
    }
    // Clear any previous bill from storage for a fresh start
    localStorage.removeItem('currentBill');
  }, [router]);

  return (
    <AppLayout>
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline">Select a Shop</h1>
        <p className="text-muted-foreground">
          Choose a shop to start billing for.
        </p>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto w-full">
        {shops.map((shop) => (
          <Link href={`/billing?shop=${shop.id}`} key={shop.id} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
            <Card className="hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium font-headline">
                  {shop.name}
                </CardTitle>
                <shop.icon className="h-8 w-8 text-accent" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Click to start a new bill for {shop.name}.
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
