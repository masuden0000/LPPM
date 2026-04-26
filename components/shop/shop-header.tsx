"use client";

import { LogOut, Menu, Search, ShoppingCart, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { CampusIcon } from "@/components/auth/campus-icon";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";

export function ShopHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const logout = useAuthStore((state) => state.logout);
  const cartCount = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.qty, 0)
  );
  const isLoggedIn = Boolean(currentUserId);

  const doLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 text-slate-900 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 text-slate-900 transition-opacity hover:opacity-90"
        >
          {/* Keep the campus mark and store name in one brand block. */}
          <CampusIcon
            className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm"
            imageClassName="size-7 object-contain"
          />
          <div className="min-w-0">
            <p className="text-base font-bold tracking-[0.04em] text-slate-900 sm:text-lg">
              LPPM UPNVJ STORE
            </p>
            <p className="text-[11px] font-medium tracking-[0.11em] text-slate-500 uppercase">
              Marketplace Publikasi Akademik
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <nav className="mr-6 hidden items-center gap-6 md:flex">
            <Link
              href="/dashboard"
              className={cn(
                "pb-1 text-sm font-medium transition-colors",
                pathname === "/dashboard"
                  ? "border-b-2 border-primary text-primary"
                  : "border-b-2 border-transparent text-black hover:border-primary hover:text-primary"
              )}
            >
              Beranda
            </Link>
            <Link
              href="/etalase"
              className={cn(
                "pb-1 text-sm font-medium transition-colors",
                pathname === "/etalase"
                  ? "border-b-2 border-primary text-primary"
                  : "border-b-2 border-transparent text-black hover:border-primary hover:text-primary"
              )}
            >
              Etalase
            </Link>
          </nav>

          <div className="hidden h-10 w-60 items-center rounded-full border border-slate-200 bg-slate-100 px-3 lg:flex">
            <Search className="mr-2 size-4 text-slate-500" />
            <Input
              className="h-8 border-none bg-transparent px-0 text-sm text-slate-900 shadow-none placeholder:text-slate-500 focus-visible:ring-0"
              placeholder="Cari publikasi..."
            />
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            className="text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Cari"
            onClick={() => { }}
          >
            <Search className="size-4" />
          </Button>

          {isLoggedIn ? (
            <Link
              href="/keranjang"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "relative size-10 rounded-full transition-colors",
                pathname === "/keranjang"
                  ? "bg-primary/10 text-primary"
                  : "text-slate-700 hover:bg-slate-100 hover:text-primary"
              )}
              aria-label="Keranjang"
            >
              <ShoppingCart className="size-5" />
              {cartCount > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground shadow-sm">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          ) : null}

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon-sm" }),
                  "size-10 rounded-full text-slate-700 hover:bg-slate-100"
                )}
                aria-label="Menu"
              >
                <Menu className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 rounded-xl border border-border bg-background p-1.5 shadow-[0px_12px_24px_-12px_rgba(15,23,42,0.22)]"
              >
                <DropdownMenuItem
                  onClick={() => router.push("/profil")}
                  className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-foreground focus:bg-muted focus:text-foreground"
                >
                  <UserCircle className="size-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={doLogout}
                  className="mt-1 cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-destructive focus:bg-destructive/10 focus:text-destructive data-[highlighted]:bg-destructive/10data-[highlighted]:text-destructive [&_svg]:!text-destructive [&_svg]:!stroke-destructive data-[highlighted]:[&_svg]:!text-destructive data-[highlighted]:[&_svg]:!stroke-destructive"
                >
                  <LogOut className="size-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "h-10 rounded-full px-5"
              )}
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
