"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useOrderStore } from "@/stores/order-store";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const getOrderById = useOrderStore((state) => state.getOrderById);
  const order = useMemo(() => getOrderById(orderId), [getOrderById, orderId]);

  if (!order || order.status !== "paid") {
    return (
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-4 md:px-8 xl:px-10">
        <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Data pembayaran tidak ditemukan.
          </h2>
          <Link
            href="/etalase"
            className={cn(
              buttonVariants({ variant: "default" }),
              "mt-4 h-12 rounded-full px-8 font-semibold text-base",
            )}
          >
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-4 md:px-8 xl:px-10">
      <div className="mx-auto max-w-xl">
        {/* Success Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
            <CheckCircle2 className="size-9 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Pembayaran Berhasil!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Terima kasih. Pesanan Anda sudah berhasil dibayar.
          </p>
        </div>

        {/* Order Detail Card */}
        <div className="mb-6 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 border-b border-border pb-3 text-base font-semibold text-foreground">
            Detail Pesanan
          </h2>
          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">ID Pesanan</span>
              <span className="font-medium text-foreground">{order.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Waktu Pembayaran</span>
              <span className="text-foreground">{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                LUNAS
              </Badge>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3 text-base font-semibold">
              <span>Total Dibayar</span>
              <span>{formatRupiah(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/etalase"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-12 flex-1 justify-center rounded-full font-semibold text-base hover:opacity-90 active:scale-95 transition-all",
            )}
          >
            Belanja Lagi
          </Link>
          <Link
            href={`/lacak-pesanan?orderId=${encodeURIComponent(order.id)}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-12 flex-1 justify-center rounded-full font-semibold text-base",
            )}
          >
            Lacak Pesanan
          </Link>
        </div>
      </div>
    </div>
  );
}
