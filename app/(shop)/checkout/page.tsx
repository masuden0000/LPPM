"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/format";
import type { Address } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useCatalogStore } from "@/stores/catalog-store";
import { useOrderStore } from "@/stores/order-store";

const checkoutSchema = z.object({
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

type CheckoutInput = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.getCurrentUser());
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const books = useCatalogStore((state) => state.books);
  const setCheckoutAddress = useOrderStore((state) => state.setCheckoutAddress);

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      namaPenerima: user?.alamatDefault?.namaPenerima ?? "",
      telepon: user?.alamatDefault?.telepon ?? "",
      alamatLengkap: user?.alamatDefault?.alamatLengkap ?? "",
      provinsi: user?.alamatDefault?.provinsi ?? "",
      kota: user?.alamatDefault?.kota ?? "",
      kodePos: user?.alamatDefault?.kodePos ?? "",
    },
  });

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/keranjang");
    }
  }, [items.length, router]);

  const onSubmit = (values: CheckoutInput) => {
    const address: Address = {
      namaPenerima: values.namaPenerima,
      telepon: values.telepon,
      alamatLengkap: values.alamatLengkap,
      provinsi: values.provinsi,
      kota: values.kota,
      kodePos: values.kodePos,
    };
    setCheckoutAddress(address);
    router.push("/pembayaran");
  };

  const rows = items
    .map((item) => {
      const book = books.find((candidate) => candidate.id === item.bookId);
      if (!book) return null;
      return { book, item };
    })
    .filter(Boolean) as { book: (typeof books)[number]; item: (typeof items)[number] }[];

  if (items.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8 px-5 pb-14 md:px-8 md:pb-16 xl:px-10">
      <div className="mb-6">
        <Link href="/keranjang" className="inline-flex items-center gap-1 text-sm font-medium text-black">
          <ArrowLeft className="size-4" />
          Kembali
        </Link>
      </div>
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Detail Alamat Pengiriman</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="namaPenerima"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Penerima</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telepon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telepon</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="alamatLengkap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="provinsi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provinsi</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="kota"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kota</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="kodePos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Pos</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="h-10 w-full rounded-lg">
                  Lanjut Pilih Pembayaran
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Produk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ book, item }) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.judul}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell className="text-right">
                      {formatRupiah(item.qty * item.hargaSnapshot)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatRupiah(subtotal)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
