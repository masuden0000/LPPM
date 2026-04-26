"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRupiah } from "@/lib/format";
import type { Book } from "@/lib/types";
import { useCartStore } from "@/stores/cart-store";

export function BookCard({ book }: { book: Book }) {
  const addItem = useCartStore((state) => state.addItem);

  const onAdd = () => {
    const result = addItem(book);
    if (!result.ok) toast.error(result.message);
  };

  return (
    <Card className="group h-full gap-0 overflow-hidden pt-0 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-20px_rgba(14,116,144,0.55)]">
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={book.coverUrl}
          alt={book.judul}
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.03] md:h-48 xl:h-36"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/45 to-transparent" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-sm leading-5">{book.judul}</CardTitle>
        <CardDescription className="text-xs">{book.penulis}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-3 pb-5">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="rounded-full text-[10px]">
            {book.kategori}
          </Badge>
          <Badge
            variant={book.stok > 0 ? "secondary" : "destructive"}
            className="text-[10px]"
          >
            {book.stok > 0 ? `Stok ${book.stok}` : "Habis"}
          </Badge>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <p className="text-base font-semibold tracking-tight xl:text-sm 2xl:text-base">
            {formatRupiah(book.harga)}
          </p>
          <Button
            className="size-9 rounded-full border border-border bg-background text-foreground shadow-none hover:bg-primary hover:text-primary-foreground"
            size="icon-sm"
            disabled={book.stok <= 0}
            onClick={onAdd}
            aria-label={`Tambah ${book.judul} ke keranjang`}
          >
            <ShoppingCart />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
