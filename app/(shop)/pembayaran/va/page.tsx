"use client";

import { Copy, WalletCards } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatRupiah, paymentMethodLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useOrderStore } from "@/stores/order-store";

export default function VaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const getOrderById = useOrderStore((state) => state.getOrderById);
  const markOrderPaid = useOrderStore((state) => state.markOrderPaid);
  const clearCheckout = useOrderStore((state) => state.clearCheckout);
  const orderId = searchParams.get("orderId") ?? "";
  const order = useMemo(() => getOrderById(orderId), [getOrderById, orderId]);

  const copyVa = async () => {
    if (!order?.vaNumber) return;
    await navigator.clipboard.writeText(order.vaNumber);
  };

  const onPaid = () => {
    if (!order) return;
    markOrderPaid(order.id);
    clearCheckout();
    router.push(`/pembayaran/berhasil?orderId=${encodeURIComponent(order.id)}`);
  };

  if (!order || order.status !== "pending_payment") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nomor VA Tidak Tersedia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Pesanan tidak ditemukan atau sudah dibayar.
          </p>
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
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Nomor Akun Virtual (VA)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {paymentMethodLabel(order.paymentMethod)}
              </p>
              <p className="text-2xl font-semibold tracking-wide">{order.vaNumber}</p>
            </div>
            <Button variant="outline" onClick={copyVa}>
              <Copy className="mr-1 size-4" />
              Salin
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">ID Pesanan: {order.id}</p>
            <p className="text-muted-foreground">
              Dibuat: {formatDate(order.createdAt)}
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger
              className={cn(buttonVariants({ variant: "default" }), "w-full")}
            >
              Saya Sudah Bayar
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Pembayaran</AlertDialogTitle>
                <AlertDialogDescription>
                  Lanjutkan jika pembayaran akun virtual sudah berhasil.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={onPaid}>Ya, Sudah Bayar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Tagihan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="secondary">Menunggu Pembayaran</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatRupiah(order.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Biaya Layanan</span>
            <span>{formatRupiah(order.biayaLayanan)}</span>
          </div>
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total Bayar</span>
            <span>{formatRupiah(order.total)}</span>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
            <p className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <WalletCards className="size-4" />
              Instruksi Singkat
            </p>
            <p>1. Salin nomor VA di sebelah kiri.</p>
            <p>2. Lakukan transfer sesuai nominal total.</p>
            <p>3. Kembali dan klik tombol konfirmasi pembayaran.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
