"use client";

import { ArrowRight, Lock, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";

import { BackNavLink } from "@/components/shared/back-nav-link";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useCatalogStore } from "@/stores/catalog-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const books = useCatalogStore((state) => state.books);

  const rows = items
    .map((item) => {
      const book = books.find((candidate) => candidate.id === item.bookId);
      if (!book) return null;
      return { book, item };
    })
    .filter(Boolean) as { book: (typeof books)[number]; item: (typeof items)[number] }[];

  if (rows.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[1440px] space-y-8 px-5 pb-16 pt-4 md:px-8 xl:px-10">
        <div className="mb-6">
          <BackNavLink href="/dashboard" />
        </div>
        <h2 className="mb-5 text-2xl font-semibold leading-tight tracking-[-0.01em] text-foreground md:mb-6 md:text-3xl">Keranjang Belanja</h2>
        <Card className="flex flex-col items-center justify-center border-border p-12 text-center shadow-sm">
          <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="size-10 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-foreground">Keranjang Anda Kosong</h2>
          <p className="mb-8 text-muted-foreground">
            Belum ada buku di keranjang. Ayo cari buku yang Anda butuhkan di katalog kami.
          </p>
          <Link href="/etalase" className={cn(buttonVariants({ variant: "default" }), "h-10 px-8 rounded-lg")}>
            Mulai Belanja
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8 px-5 pb-16 pt-4 md:px-8 xl:px-10">
      <div className="mb-6">
        <BackNavLink href="/dashboard" />
      </div>
      <h2 className="mb-5 text-2xl font-semibold leading-tight tracking-[-0.01em] text-foreground md:mb-6 md:text-3xl">Keranjang Belanja</h2>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <Card className="mb-6 rounded-lg border-border p-4 sm:p-6">
            {rows.map(({ book, item }) => (
              <div key={book.id} className="flex flex-col gap-4 border-b border-border py-5 first:pt-0 last:border-0 last:pb-0 sm:flex-row">
                <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded bg-muted sm:h-32 sm:w-24">
                  <img alt={book.judul} className="h-full w-full object-cover" src={book.coverUrl} />
                </div>
                <div className="flex flex-grow flex-col justify-between py-1">
                  <div>
                    <h3 className="mb-1 text-base font-semibold leading-tight text-foreground sm:text-lg">{book.judul}</h3>
                    <p className="mb-2 text-sm text-muted-foreground">{book.penulis}</p>
                    <span className="inline-block rounded bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground sm:text-xs">{book.kategori}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between sm:mt-0">
                    <div className="text-base font-semibold text-foreground sm:text-lg">{formatRupiah(item.hargaSnapshot)}</div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center rounded border border-border">
                        <button onClick={() => decreaseQty(book.id)} aria-label="Kurangi jumlah" className="px-2 py-1 text-muted-foreground transition-colors hover:bg-muted sm:px-3">
                          <Minus className="size-3 sm:size-4" />
                        </button>
                        <span className="w-6 px-1 text-center text-sm sm:w-8 sm:px-2 sm:text-base">{item.qty}</span>
                        <button onClick={() => increaseQty(book)} disabled={item.qty >= book.stok} aria-label="Tambah jumlah" className="px-2 py-1 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50 sm:px-3">
                          <Plus className="size-3 sm:size-4" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(book.id)} aria-label="Hapus produk" className="p-1.5 text-destructive transition-colors hover:text-destructive/80 sm:p-2">
                        <Trash2 className="size-4 sm:size-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <Card className="sticky top-32 rounded-lg border-border p-6">
            <h2 className="mb-6 text-2xl font-semibold text-foreground">Ringkasan Pesanan</h2>
            <div className="mb-6 space-y-3 border-b border-border pb-6 text-base">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Biaya Layanan</span>
                <span className="text-foreground">{formatRupiah(0)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Pengiriman</span>
                <span className="text-foreground">Dihitung saat pembayaran</span>
              </div>
            </div>
            <div className="mb-6 flex items-center justify-between">
              <span className="text-2xl font-semibold text-foreground">Total</span>
              <span className="text-3xl font-bold text-foreground">{formatRupiah(subtotal)}</span>
            </div>
            <Link href="/checkout" className={cn(buttonVariants({ variant: "default" }), "flex h-12 w-full items-center justify-center gap-2 rounded-lg")}>
              Lanjut Checkout
              <ArrowRight className="size-4" />
            </Link>
            <p className="flex items-center justify-center gap-1 text-center text-xs text-muted-foreground">
              <Lock className="size-3" />
              Pembayaran aman dan terenkripsi oleh LPPM UPNVJ.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
