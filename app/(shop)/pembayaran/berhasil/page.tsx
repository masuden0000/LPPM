"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card>
        <CardHeader>
          <CardTitle>Data pembayaran tidak ditemukan.</CardTitle>
        </CardHeader>
        <CardContent>
          <Link
            href="/etalase"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Kembali ke Dashboard
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-emerald-600" />
          <CardTitle>Pembayaran Berhasil</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Terima kasih. Pesanan Anda sudah berhasil dibayar.
        </p>
        <div className="grid gap-2 rounded-lg border p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">ID Pesanan</span>
            <span>{order.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Waktu</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge>LUNAS</Badge>
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>{formatRupiah(order.total)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/etalase"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Belanja Lagi
          </Link>
          <Link
            href="/profil"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Ke Profil
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
