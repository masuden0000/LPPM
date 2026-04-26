"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { BookTypeIcon } from "@/components/shop/book-type-icon";
import { formatRupiah } from "@/lib/format";
import type { Book } from "@/lib/types";
import { useCartStore } from "@/stores/cart-store";

type ProductCardProps = {
  book: Book;
  imageUrl: string;
  meta: string;
  originalPrice?: number;
  discountLabel?: string;
};

export function ProductCard({
  book,
  imageUrl,
  meta,
  originalPrice,
  discountLabel,
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const hasDiscount = Boolean(originalPrice && originalPrice > book.harga);

  const onAdd = () => {
    const result = addItem(book);
    // Keep only error notification based on current UX decision.
    if (!result.ok) toast.error(result.message);
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05),0px_4px_6px_-4px_rgba(0,0,0,0.05)]">
      <div className="relative aspect-[3/4] overflow-hidden border-b border-border bg-muted/40 p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={book.judul}
          className="h-full w-full object-cover shadow-md transition-transform duration-300 hover:scale-[1.03]"
        />
        {hasDiscount ? (
          <div className="absolute left-4 top-4 rounded-full bg-rose-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
            {discountLabel ?? "Special Offer"}
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-medium leading-none text-muted-foreground">
          <BookTypeIcon type={meta} className="size-3.5 shrink-0 align-middle" />
          <span className="leading-none">{meta}</span>
        </span>
        <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-tight tracking-[-0.01em] text-foreground">
          {book.judul}
        </h3>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">{book.penulis}</p>
        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-foreground">{formatRupiah(book.harga)}</p>
            {hasDiscount ? (
              <p className="text-xs text-muted-foreground line-through">
                {formatRupiah(originalPrice ?? book.harga)}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            aria-label={`Tambah ${book.judul} ke keranjang`}
          >
            <ShoppingCart className="size-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
