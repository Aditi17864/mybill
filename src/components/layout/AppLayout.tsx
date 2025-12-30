"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, LayoutDashboard, LogOut, Store } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  const navLinks = [
    { href: "/shop-selection", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 md:px-6">
        <Link href="/shop-selection" className="flex items-center gap-2 font-semibold">
          <Store className="h-6 w-6 text-primary" />
          <span className="text-lg font-headline">RetailFlow</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-primary ${
                pathname.startsWith(link.href) ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
      <footer className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-card">
          <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
            {navLinks.map((link) => (
              <Link
                key={`mobile-${link.href}`}
                href={link.href}
                className={`inline-flex flex-col items-center justify-center px-5 hover:bg-muted group ${pathname.startsWith(link.href) ? "text-primary" : "text-muted-foreground"}`}
              >
                  <link.icon className="w-5 h-5 mb-1" />
                  <span className="text-xs">{link.label}</span>
              </Link>
            ))}
            <button
                onClick={handleLogout}
                type="button"
                className="inline-flex flex-col items-center justify-center px-5 text-muted-foreground hover:bg-muted group"
            >
                <LogOut className="w-5 h-5 mb-1" />
                <span className="text-xs">Logout</span>
            </button>
          </div>
      </footer>
      <div className="h-16 md:hidden"></div>
    </div>
  );
}
