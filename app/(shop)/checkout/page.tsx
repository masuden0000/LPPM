"use client";

import { BackNavLink } from "@/components/shared/back-nav-link";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Edit2, Lock, MapPin, Plus, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { OrderSummaryCard } from "@/components/shop/order-summary-card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { formatRupiah } from "@/lib/format";
import type { Address } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useCatalogStore } from "@/stores/catalog-store";
import { useOrderStore } from "@/stores/order-store";

const addressSchema = z.object({
  namaPenerima: z.string().min(3, "Nama penerima minimal 3 karakter."),
  telepon: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit.")
    .regex(/^[0-9]+$/, "Nomor telepon hanya boleh angka."),
  alamatLengkap: z.string().min(10, "Alamat lengkap minimal 10 karakter."),
  provinsi: z.string().min(2, "Provinsi wajib diisi."),
  kota: z.string().min(2, "Kota wajib diisi."),
  kodePos: z
    .string()
    .length(5, "Kode pos harus 5 digit.")
    .regex(/^[0-9]+$/, "Kode pos hanya boleh angka."),
});

type AddressInput = z.infer<typeof addressSchema>;

const PROVINSI_OPTIONS = [
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Banten",
  "Lainnya",
];

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.getCurrentUser());
  const updateAddress = useAuthStore((state) => state.updateAddress);
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const books = useCatalogStore((state) => state.books);
  const setCheckoutAddress = useOrderStore((state) => state.setCheckoutAddress);

  const alamatList = user?.alamatList ?? [];
  const hasSavedAddresses = alamatList.length > 0;

  const [addressMode, setAddressMode] = useState<"saved" | "manual">(
    hasSavedAddresses ? "saved" : "manual",
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    alamatList[0]?.id ?? null,
  );
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const manualForm = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      namaPenerima: "",
      telepon: "",
      alamatLengkap: "",
      provinsi: "",
      kota: "",
      kodePos: "",
    },
  });

  const editForm = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      namaPenerima: "",
      telepon: "",
      alamatLengkap: "",
      provinsi: "",
      kota: "",
      kodePos: "",
    },
  });

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/keranjang");
    }
  }, [items.length, router]);

  useEffect(() => {
    if (isEditSheetOpen && editingAddress) {
      editForm.reset({
        namaPenerima: editingAddress.namaPenerima,
        telepon: editingAddress.telepon,
        alamatLengkap: editingAddress.alamatLengkap,
        provinsi: editingAddress.provinsi,
        kota: editingAddress.kota,
        kodePos: editingAddress.kodePos,
      });
    }
  }, [isEditSheetOpen, editingAddress, editForm]);

  const handleOpenEditSheet = (address: Address) => {
    setEditingAddress(address);
    setIsEditSheetOpen(true);
  };

  const onEditSubmit = (values: AddressInput) => {
    if (!editingAddress) return;
    const result = updateAddress({ ...values, id: editingAddress.id });
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setIsEditSheetOpen(false);
  };

  const handleCheckout = () => {
    if (addressMode === "saved") {
      const addr = alamatList.find((a) => a.id === selectedAddressId);
      if (!addr) {
        toast.error("Pilih alamat pengiriman terlebih dahulu.");
        return;
      }
      setCheckoutAddress(addr);
      router.push("/pembayaran");
    } else {
      manualForm.handleSubmit((values) => {
        const address: Address = { id: crypto.randomUUID(), ...values };
        setCheckoutAddress(address);
        router.push("/pembayaran");
      })();
    }
  };

  const rows = items
    .map((item) => {
      const book = books.find((candidate) => candidate.id === item.bookId);
      if (!book) return null;
      return { book, item };
    })
    .filter(Boolean) as { book: (typeof books)[number]; item: (typeof items)[number] }[];

  if (items.length === 0) return null;

  const shippingFee = 25000;
  const adminFee = 15000;
  const totalItems = items.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = subtotal + shippingFee + adminFee;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-4 md:px-8 xl:px-10">
      {/* Header */}
      <div className="mb-8">
        <BackNavLink
          href="/keranjang"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-black"
        />
        <h1 className="mb-5 text-2xl font-semibold leading-tight tracking-[-0.01em] text-foreground md:mb-6 md:text-3xl">
          Checkout Aman
        </h1>
      </div>

      {/* Layout Split */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-8">

          {/* Shipping Address Section */}
          <section className="bg-card border border-border rounded-xl p-6 transition-shadow hover:shadow-md">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <MapPin className="size-5 text-muted-foreground" />
                Alamat Pengiriman
              </h2>
            </div>

            {/* Saved Addresses */}
            {hasSavedAddresses && (
              <div className="space-y-3 mb-4">
                {alamatList.map((address) => (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => {
                      setSelectedAddressId(address.id);
                      setAddressMode("saved");
                    }}
                    className={cn(
                      "w-full text-left rounded-lg border p-4 transition-colors",
                      addressMode === "saved" && selectedAddressId === address.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-muted-foreground/40",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Radio indicator */}
                        <div
                          className={cn(
                            "mt-1 size-4 shrink-0 rounded-full border-2 transition-colors flex items-center justify-center",
                            addressMode === "saved" && selectedAddressId === address.id
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/40 bg-background",
                          )}
                        >
                          {addressMode === "saved" && selectedAddressId === address.id && (
                            <div className="size-1.5 rounded-full bg-primary-foreground" />
                          )}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            {address.namaPenerima}
                          </p>
                          <p className="text-sm text-muted-foreground">{address.telepon}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {address.alamatLengkap}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.kota}, {address.provinsi} {address.kodePos}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditSheet(address);
                        }}
                      >
                        <Edit2 className="mr-1.5 size-3.5" />
                        Edit
                      </Button>
                    </div>
                  </button>
                ))}

                {/* Manual option toggle */}
                <button
                  type="button"
                  onClick={() => setAddressMode("manual")}
                  className={cn(
                    "w-full text-left rounded-lg border border-dashed p-4 transition-colors",
                    addressMode === "manual"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-muted-foreground/40",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "size-4 shrink-0 rounded-full border-2 transition-colors flex items-center justify-center",
                        addressMode === "manual"
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/40 bg-background",
                      )}
                    >
                      {addressMode === "manual" && (
                        <div className="size-1.5 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Plus className="size-4" />
                      Gunakan Alamat Lain
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Manual Form */}
            {addressMode === "manual" && (
              <div className={cn(hasSavedAddresses && "mt-4 border-t border-border pt-4")}>
                <Form {...manualForm}>
                  <form className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={manualForm.control}
                        name="namaPenerima"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Penerima</FormLabel>
                            <FormControl>
                              <Input className="h-11 px-4 text-base bg-background" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={manualForm.control}
                        name="telepon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor Telepon</FormLabel>
                            <FormControl>
                              <Input
                                className="h-11 px-4 text-base bg-background"
                                placeholder="Contoh: 081234567890"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={manualForm.control}
                      name="alamatLengkap"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alamat Lengkap</FormLabel>
                          <FormControl>
                            <Textarea
                              className="resize-none p-4 text-base bg-background"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={manualForm.control}
                        name="provinsi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provinsi</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="h-11 w-full px-4 text-base bg-background">
                                  <SelectValue placeholder="Pilih provinsi" />
                                </SelectTrigger>
                                <SelectContent>
                                  {PROVINSI_OPTIONS.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={manualForm.control}
                        name="kota"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kota/Kabupaten</FormLabel>
                            <FormControl>
                              <Input className="h-11 px-4 text-base bg-background" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={manualForm.control}
                      name="kodePos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kode Pos</FormLabel>
                          <FormControl>
                            <Input className="h-11 px-4 text-base bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
            )}
          </section>

          {/* Order Items Section */}
          <section className="bg-card border border-border rounded-xl p-6 transition-shadow hover:shadow-md">
            <h2 className="text-xl font-bold text-foreground mb-6 border-b border-border pb-4 flex items-center gap-2">
              <BookOpen className="size-5 text-muted-foreground" />
              Item Pesanan
            </h2>
            <div className="flex flex-col gap-6">
              {rows.map(({ book, item }, index) => (
                <div key={book.id}>
                  <div className="flex gap-4 items-start">
                    <div className="w-[80px] shrink-0 bg-muted rounded border border-border overflow-hidden">
                      <img
                        src={book.coverUrl}
                        alt={book.judul}
                        className="w-full h-auto aspect-[3/4] object-cover block"
                      />
                    </div>
                    <div className="flex-1 flex flex-col min-h-[106px]">
                      <h3 className="text-base font-bold text-foreground mb-1 leading-tight">
                        {book.judul}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{book.penulis}</p>
                      <div className="mt-auto flex justify-between items-end">
                        <span className="text-sm font-medium text-muted-foreground">
                          Jml: {item.qty}
                        </span>
                        <span className="text-base font-bold text-foreground">
                          {formatRupiah(item.hargaSnapshot)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {index < rows.length - 1 && <hr className="mt-6 border-border" />}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary (Sticky) */}
        <aside className="w-full lg:w-[380px]">
          <OrderSummaryCard
            title="Ringkasan Pesanan"
            rows={[
              {
                label: `Subtotal (${totalItems} item)`,
                value: formatRupiah(subtotal),
              },
              {
                label: "Pengiriman",
                value: formatRupiah(shippingFee),
              },
              {
                label: "Biaya Admin",
                value: formatRupiah(adminFee),
              },
            ]}
            totalLabel="Total Harga"
            totalValue={formatRupiah(totalPrice)}
            action={
              <Button
                type="button"
                onClick={handleCheckout}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full text-base font-semibold transition-all hover:opacity-90 active:scale-95"
              >
                <Lock className="size-5" />
                Konfirmasi dan Bayar
              </Button>
            }
            footer={
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                <ShieldCheck className="size-4" />
                <span className="text-xs font-medium">Transaksi aman terenkripsi</span>
              </div>
            }
          />
        </aside>
      </div>

      {/* Edit Address Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent side="right" className="flex flex-col sm:max-w-lg overflow-hidden">
          <SheetHeader className="border-b border-border">
            <SheetTitle>Edit Alamat</SheetTitle>
          </SheetHeader>

          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={editForm.control}
                    name="namaPenerima"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Nama Penerima</FormLabel>
                        <FormControl>
                          <Input className="h-11 px-4 text-base bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="telepon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Nomor Telepon</FormLabel>
                        <FormControl>
                          <Input
                            className="h-11 px-4 text-base bg-background"
                            placeholder="Contoh: 081234567890"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="alamatLengkap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">
                        Alamat Lengkap (Jalan, RT/RW, Gedung)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          className="resize-none p-4 text-base bg-background"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={editForm.control}
                    name="provinsi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Provinsi</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="h-11 w-full px-4 text-base bg-background">
                              <SelectValue placeholder="Pilih provinsi" />
                            </SelectTrigger>
                            <SelectContent>
                              {PROVINSI_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="kota"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Kota/Kabupaten</FormLabel>
                        <FormControl>
                          <Input className="h-11 px-4 text-base bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="kodePos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Kode Pos</FormLabel>
                      <FormControl>
                        <Input className="h-11 px-4 text-base bg-background" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <SheetFooter className="border-t border-border px-4 py-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditSheetOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={editForm.formState.isSubmitting}>
                  Simpan Perubahan
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
