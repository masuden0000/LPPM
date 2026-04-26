"use client";

import { BackNavLink } from "@/components/shared/back-nav-link";
import { CreditCard, Landmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah, paymentMethodLabel } from "@/lib/format";
import type { PaymentMethod } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useOrderStore } from "@/stores/order-store";

const paymentMethods: PaymentMethod[] = ["BCA_VA", "BNI_VA", "BRI_VA"];

export default function PaymentPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const checkoutAddress = useOrderStore((state) => state.checkoutAddress);
  const selectedPaymentMethod = useOrderStore((state) => state.selectedPaymentMethod);
  const setSelectedPaymentMethod = useOrderStore((state) => state.setSelectedPaymentMethod);
  const createPendingOrder = useOrderStore((state) => state.createPendingOrder);

  const subtotal = items.reduce(
    (acc, item) => acc + item.hargaSnapshot * item.qty,
    0,
  );
  const biayaLayanan = 4000;
  const total = subtotal + biayaLayanan;

  useEffect(() => {
    if (!checkoutAddress) {
      router.replace("/checkout");
    }
  }, [checkoutAddress, router]);

  const onContinue = () => {
    if (!selectedPaymentMethod) {
      toast.error("Pilih metode pembayaran terlebih dulu.");
      return;
    }
    const order = createPendingOrder({ items, paymentMethod: selectedPaymentMethod });
    if (!order) {
      toast.error("Pesanan gagal dibuat. Periksa data checkout.");
      return;
    }
    clearCart();
    router.push(`/pembayaran/va?orderId=${encodeURIComponent(order.id)}`);
  };

  if (!checkoutAddress) return null;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-4 md:px-8 xl:px-10">
      {/* Header */}
      <div className="mb-8">
        <BackNavLink
          href="/checkout"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors"
        />
        <h1 className="mb-5 text-2xl font-semibold leading-tight tracking-[-0.01em] text-foreground md:mb-6 md:text-3xl">
          Metode Pembayaran
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left: Payment Method Selection */}
        <div className="flex-1">
          <section className="bg-card border border-border rounded-xl p-6 transition-shadow hover:shadow-md">
            <h2 className="mb-6 flex items-center gap-2 border-b border-border pb-4 text-xl font-bold text-foreground">
              <Landmark className="size-5 text-muted-foreground" />
              Pilih Metode Pembayaran
            </h2>

            <div className="mb-6 grid gap-3">
              {paymentMethods.map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setSelectedPaymentMethod(method)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                    selectedPaymentMethod === method
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-muted-foreground/40",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      selectedPaymentMethod === method
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40 bg-background",
                    )}
                  >
                    {selectedPaymentMethod === method && (
                      <div className="size-1.5 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {paymentMethodLabel(method)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Bayar dengan nomor akun virtual (VA).
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <Button
              className="w-full h-12 rounded-full font-semibold text-base gap-2 hover:opacity-90 active:scale-95 transition-all"
              onClick={onContinue}
            >
              <CreditCard className="size-5" />
              Buat Nomor VA
            </Button>
          </section>
        </div>

        {/* Right: Order Summary (Sticky) */}
        <aside className="w-full lg:w-[380px]">
          <div className="sticky top-24 bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-foreground">Ringkasan Pembayaran</h2>

            <div className="mb-6 flex flex-col gap-3 border-b border-border pb-6">
              <div className="flex items-center justify-between">
                <span className="text-base text-muted-foreground">Jumlah Item</span>
                <Badge variant="secondary">{items.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base text-muted-foreground">Subtotal</span>
                <span className="text-base font-medium text-foreground">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base text-muted-foreground">Biaya Layanan</span>
                <span className="text-base font-medium text-foreground">
                  {formatRupiah(biayaLayanan)}
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <span className="text-lg font-bold text-foreground">Total Bayar</span>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {formatRupiah(total)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
