"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { formatDate, formatRupiah, paymentMethodLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCatalogStore } from "@/stores/catalog-store";
import { useOrderStore } from "@/stores/order-store";
import { ChevronDown, ClipboardList, Filter, MapPinned, PackageSearch, Search, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type StatusFilter = "all" | "pending_payment" | "paid";

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const highlightedOrderId = searchParams.get("orderId") ?? "";
  const orders = useOrderStore((state) => state.orders);
  const books = useCatalogStore((state) => state.books);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    highlightedOrderId || null,
  );

  const bookMap = useMemo(
    () => new Map(books.map((book) => [book.id, book])),
    [books],
  );
  const filteredOrders = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase();
    return orders.filter((order) => {
      const matchStatus = statusFilter === "all" || order.status === statusFilter;
      if (!matchStatus) return false;

      if (!normalizedKeyword) return true;

      const matchOrderId = order.id.toLowerCase().includes(normalizedKeyword);
      const matchBookTitle = order.items.some((item) => {
        const book = bookMap.get(item.bookId);
        return book?.judul.toLowerCase().includes(normalizedKeyword);
      });
      return matchOrderId || matchBookTitle;
    });
  }, [orders, searchKeyword, statusFilter, bookMap]);

  if (orders.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-4 md:px-8 xl:px-10">
        <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
            <ClipboardList className="size-7 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
            Belum Ada Pesanan
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pesanan Anda akan muncul di sini setelah proses checkout selesai.
          </p>
          <Link
            href="/etalase"
            className={cn(
              buttonVariants({ variant: "default" }),
              "mt-6 h-12 rounded-full px-8 font-semibold text-base",
            )}
          >
            Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-4 md:px-8 xl:px-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-semibold leading-tight tracking-[-0.01em] text-foreground md:text-3xl">
            Lacak Pesanan
          </h1>
          <p className="text-sm text-muted-foreground">
            Pantau status pembayaran pesanan Anda di satu halaman.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[34rem] sm:flex-row sm:items-center sm:justify-end">
          <form
            className="flex w-full gap-2 sm:min-w-[22rem]"
            onSubmit={(event) => {
              event.preventDefault();
              setSearchKeyword(searchInput.trim().toLowerCase());
            }}
          >
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(event) => {
                  const value = event.target.value;
                  setSearchInput(value);
                  setSearchKeyword(value.trim().toLowerCase());
                }}
                placeholder="Cari ID pesanan atau judul buku..."
                className="h-10 w-full rounded-md pl-9 bg-white"
              />
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex h-10 shrink-0 items-center rounded-md border border-slate-300 bg-white px-3 text-sm transition-colors outline-none hover:bg-slate-50",
                "focus-visible:ring-2 focus-visible:ring-slate-300",
              )}
            >
              <Filter className="mr-2 size-4 text-slate-500" />
              <span className="font-normal text-slate-700">Filter Status</span>
              <ChevronDown className="ml-2 size-4 text-slate-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuRadioGroup
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as StatusFilter)}
              >
                <DropdownMenuRadioItem value="all">Semua</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pending_payment">
                  Menunggu Pembayaran
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="paid">Lunas</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-4 py-12 text-center">
          <p className="text-base font-semibold text-foreground">Pesanan tidak ditemukan.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Coba gunakan ID pesanan atau judul buku yang lain.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4">
        {filteredOrders.map((order) => {
          const isHighlighted = highlightedOrderId === order.id;
          const isPaid = order.status === "paid";
          const isExpanded = expandedOrderId === order.id;
          const totalQty = order.items.reduce((total, item) => total + item.qty, 0);
          const primaryBook = bookMap.get(order.items[0]?.bookId ?? "");
          const shippingStatusLabel = isPaid
            ? "Klik untuk tracking"
            : "Menunggu Pembayaran";

          return (
            <article
              key={order.id}
              className={cn(
                "rounded-xl border border-border bg-card p-5 transition-colors md:p-6",
                isHighlighted && "border-primary ring-1 ring-primary/30",
              )}
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedOrderId((current) => (current === order.id ? null : order.id))
                }
                className="w-full text-left"
                aria-expanded={isExpanded}
              >
                <div className="mb-4 flex items-start justify-between gap-4 border-b border-border pb-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted sm:size-20">
                      {primaryBook ? (
                        <Image
                          src={primaryBook.coverUrl}
                          alt={primaryBook.judul}
                          width={80}
                          height={80}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <ClipboardList className="size-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground md:text-base">
                        ID Pesanan: {order.id}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {totalQty} item | {formatDate(order.createdAt)}
                      </p>
                      {primaryBook ? (
                        <p className="mt-1 truncate text-sm text-foreground">
                          {primaryBook.judul}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-start gap-2">
                    {/* Keep badge labels explicit so status is easy to scan quickly. */}
                    <Badge
                      className={cn(
                        "font-semibold",
                        isPaid
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
                      )}
                    >
                      {isPaid ? "LUNAS" : "MENUNGGU PEMBAYARAN"}
                    </Badge>
                    <ChevronDown
                      className={cn(
                        "mt-0.5 size-4 text-muted-foreground transition-transform",
                        isExpanded && "rotate-180",
                      )}
                    />
                  </div>
                </div>
              </button>

              <div className="grid gap-3 text-sm md:grid-cols-2">
                <div className="flex items-center justify-between gap-3 md:block">
                  <p className="text-muted-foreground">Tanggal Pesanan</p>
                  <p className="font-medium text-foreground">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center justify-between gap-3 md:block">
                  <p className="text-muted-foreground">Metode Pembayaran</p>
                  <p className="font-medium text-foreground">
                    {paymentMethodLabel(order.paymentMethod)}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 md:block">
                  <p className="text-muted-foreground">Jumlah Item</p>
                  <p className="font-medium text-foreground">{totalQty} item</p>
                </div>
                <div className="flex items-center justify-between gap-3 md:block">
                  <p className="text-muted-foreground">Total Pembayaran</p>
                  <p className="text-base font-semibold text-foreground">
                    {formatRupiah(order.total)}
                  </p>
                </div>
              </div>

              {isExpanded ? (
                <div className="mt-5 space-y-5 border-t border-border pt-5">
                  <section>
                    <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <MapPinned className="size-4 text-muted-foreground" />
                      Alamat Pengiriman
                    </p>
                    <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm">
                      <p className="font-semibold text-foreground">{order.address.namaPenerima}</p>
                      <p className="text-muted-foreground">{order.address.telepon}</p>
                      <p className="mt-1 text-foreground">{order.address.alamatLengkap}</p>
                      <p className="text-foreground">
                        {order.address.kota}, {order.address.provinsi} {order.address.kodePos}
                      </p>
                    </div>
                  </section>

                  <section>
                    <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <PackageSearch className="size-4 text-muted-foreground" />
                      Detail Buku
                    </p>
                    <div className="space-y-3">
                      {order.items.map((item) => {
                        const book = bookMap.get(item.bookId);

                        return (
                          <div
                            key={`${order.id}-${item.bookId}`}
                            className="flex gap-3 rounded-lg border border-border p-3"
                          >
                            <div className="h-20 w-14 shrink-0 overflow-hidden rounded border border-border bg-muted">
                              {book ? (
                                <Image
                                  src={book.coverUrl}
                                  alt={book.judul}
                                  width={56}
                                  height={80}
                                  className="size-full object-cover"
                                />
                              ) : (
                                <div className="flex size-full items-center justify-center">
                                  <ClipboardList className="size-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {book?.judul ?? "Buku tidak ditemukan"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Penulis: {book?.penulis ?? "-"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Jenis: {book?.kategori ?? "-"}
                              </p>
                              <p className="mt-1 text-sm font-medium text-foreground">
                                Jumlah dibeli: {item.qty}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <section className="rounded-lg border border-border bg-muted/20 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Status Pengiriman</p>
                        {isPaid ? (
                          <Link
                            href="https://www.jne.co.id/id/tracking/trace"
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 underline decoration-dotted underline-offset-4 transition-colors hover:text-sky-800"
                          >
                            <Truck className="size-4" />
                            {shippingStatusLabel}
                          </Link>
                        ) : (
                          <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
                            <Truck className="size-4" />
                            {shippingStatusLabel}
                          </p>
                        )}
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm text-muted-foreground">Total Harga</p>
                        <p className="text-base font-semibold text-foreground">
                          {formatRupiah(order.total)}
                        </p>
                      </div>
                    </div>

                    {!isPaid ? (
                      <Link
                        href="/checkout"
                        className={cn(
                          buttonVariants({ variant: "default" }),
                          "mt-4 h-12 w-full rounded-full font-semibold text-base hover:opacity-90 active:scale-95 transition-all",
                        )}
                      >
                        Lanjutkan Pembayaran
                      </Link>
                    ) : null}
                  </section>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
