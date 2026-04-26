"use client";

import { BackNavLink } from "@/components/shared/back-nav-link";
import { Copy, WalletCards } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

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
    toast.success("Nomor VA berhasil disalin.");
  };

  const onPaid = () => {
    if (!order) return;
    markOrderPaid(order.id);
    clearCheckout();
    router.push(`/pembayaran/berhasil?orderId=${encodeURIComponent(order.id)}`);
  };

  if (!order || order.status !== "pending_payment") {
    return (
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-4 md:px-8 xl:px-10">
        <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Nomor VA Tidak Tersedia
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Pesanan tidak ditemukan atau sudah dibayar.
          </p>
          <Link
            href="/etalase"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-12 rounded-full px-8 font-semibold text-base",
            )}
          >
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-4 md:px-8 xl:px-10">
      {/* Header */}
      <div className="mb-8">
        <BackNavLink
          href="/pembayaran"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors"
        />
        <h1 className="mb-5 text-2xl font-semibold leading-tight tracking-[-0.01em] text-foreground md:mb-6 md:text-3xl">
          Instruksi Pembayaran
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left: VA Number + Confirm */}
        <div className="flex-1">
          <section className="bg-card border border-border rounded-xl p-6 transition-shadow hover:shadow-md">
            <h2 className="mb-6 border-b border-border pb-4 text-xl font-bold text-foreground">
              Nomor Akun Virtual (VA)
            </h2>

            <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
              <div>
                <p className="mb-1 text-sm text-muted-foreground">
                  {paymentMethodLabel(order.paymentMethod)}
                </p>
                <p className="text-2xl font-bold tracking-widest text-foreground">
                  {order.vaNumber}
                </p>
              </div>
              <Button variant="outline" onClick={copyVa} className="shrink-0">
                <Copy className="mr-1.5 size-4" />
                Salin
              </Button>
            </div>

            <div className="mb-6 space-y-1 text-sm text-muted-foreground">
              <p>
                ID Pesanan:{" "}
                <span className="font-medium text-foreground">{order.id}</span>
              </p>
              <p>Dibuat: {formatDate(order.createdAt)}</p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full h-12 rounded-full font-semibold text-base hover:opacity-90 active:scale-95 transition-all",
                )}
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
          </section>
        </div>

        {/* Right: Summary + Instructions (Sticky) */}
        <aside className="w-full lg:w-[380px]">
          <div className="sticky top-24 space-y-4">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-foreground">Ringkasan Tagihan</h2>
              <div className="mb-4 flex flex-col gap-3 border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-base text-muted-foreground">Status</span>
                  <Badge variant="secondary">Menunggu Pembayaran</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base text-muted-foreground">Subtotal</span>
                  <span className="text-base font-medium text-foreground">
                    {formatRupiah(order.subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base text-muted-foreground">Biaya Layanan</span>
                  <span className="text-base font-medium text-foreground">
                    {formatRupiah(order.biayaLayanan)}
                  </span>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-lg font-bold text-foreground">Total Bayar</span>
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {formatRupiah(order.total)}
                </span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <p className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                <WalletCards className="size-5 text-muted-foreground" />
                Instruksi Pembayaran
              </p>
              <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                <li>Salin nomor VA di sebelah kiri.</li>
                <li>Buka aplikasi m-banking atau ATM Bank Anda.</li>
                <li>Pilih menu Transfer / Bayar Virtual Account.</li>
                <li>Masukkan nomor VA dan nominal sesuai total.</li>
                <li>Kembali ke halaman ini lalu klik konfirmasi.</li>
              </ol>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
