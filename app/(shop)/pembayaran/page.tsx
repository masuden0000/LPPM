"use client";

import { CreditCard, Landmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const selectedPaymentMethod = useOrderStore(
    (state) => state.selectedPaymentMethod,
  );
  const setSelectedPaymentMethod = useOrderStore(
    (state) => state.setSelectedPaymentMethod,
  );
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

    const order = createPendingOrder({
      items,
      paymentMethod: selectedPaymentMethod,
    });

    if (!order) {
      toast.error("Pesanan gagal dibuat. Periksa data checkout.");
      return;
    }

    clearCart();
    router.push(`/pembayaran/va?orderId=${encodeURIComponent(order.id)}`);
  };

  if (!checkoutAddress) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Pilih Metode Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3">
            {paymentMethods.map((method) => (
              <button
                type="button"
                key={method}
                onClick={() => setSelectedPaymentMethod(method)}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg border p-3 text-left transition",
                  selectedPaymentMethod === method
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/40",
                )}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">{paymentMethodLabel(method)}</p>
                    <p className="text-xs text-muted-foreground">
                      Bayar dengan nomor akun virtual (VA).
                    </p>
                  </div>
                </div>
                <Landmark className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>

          <Button className="w-full" onClick={onContinue} data-icon="inline-start">
            <CreditCard />
            Buat Nomor VA
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Jumlah Item</span>
            <Badge variant="secondary">{items.length}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Biaya Layanan</span>
            <span>{formatRupiah(biayaLayanan)}</span>
          </div>
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatRupiah(total)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
