"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Info, MapPin, Plus, Shield, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { BackNavLink } from "@/components/shared/back-nav-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/format";
import type { Address } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useProfileStore } from "@/stores/profile-store";

const basicInfoSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter."),
  email: z.email("Format email tidak valid."),
});

const keamananSchema = z
  .object({
    passwordSaatIni: z.string().optional(),
    passwordBaru: z.string().optional(),
    confirmPasswordBaru: z.string().optional(),
  })
  .refine(
    (values) => {
      if (values.passwordBaru) return !!values.passwordSaatIni;
      return true;
    },
    {
      message: "Password saat ini wajib diisi jika ingin mengubah password.",
      path: ["passwordSaatIni"],
    },
  )
  .refine(
    (values) => {
      if (!values.passwordBaru && !values.confirmPasswordBaru) return true;
      return values.passwordBaru && values.passwordBaru.length >= 6;
    },
    {
      message: "Password baru minimal 6 karakter.",
      path: ["passwordBaru"],
    },
  )
  .refine(
    (values) => {
      if (!values.passwordBaru && !values.confirmPasswordBaru) return true;
      return values.passwordBaru === values.confirmPasswordBaru;
    },
    {
      message: "Konfirmasi password baru tidak cocok.",
      path: ["confirmPasswordBaru"],
    },
  );

const addressSchema = z.object({
  namaPenerima: z.string().min(3, "Nama penerima minimal 3 karakter."),
  telepon: z
    .string()
    .min(10, "Telepon minimal 10 digit.")
    .regex(/^[0-9]+$/, "Telepon hanya boleh angka."),
  alamatLengkap: z.string().min(10, "Alamat lengkap minimal 10 karakter."),
  provinsi: z.string().min(2, "Provinsi wajib dipilih."),
  kota: z.string().min(2, "Kota wajib diisi."),
  kodePos: z
    .string()
    .length(5, "Kode pos harus 5 digit.")
    .regex(/^[0-9]+$/, "Kode pos hanya boleh angka."),
});

type BasicInfoInput = z.infer<typeof basicInfoSchema>;
type KeamananInput = z.infer<typeof keamananSchema>;
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

export default function ProfilePage() {
  const user = useAuthStore((state) => state.getCurrentUser());
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const addAddress = useProfileStore((state) => state.addAddress);
  const updateAddress = useProfileStore((state) => state.updateAddress);
  const removeAddress = useProfileStore((state) => state.removeAddress);
  const lastUpdatedAt = useProfileStore((state) => state.lastUpdatedAt);

  const [activeTab, setActiveTab] = useState<"identitas" | "keamanan">("identitas");
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [isEditingKeamanan, setIsEditingKeamanan] = useState(false);
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const basicInfoForm = useForm<BasicInfoInput>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      nama: user?.nama ?? "",
      email: user?.email ?? "",
    },
  });

  const keamananForm = useForm<KeamananInput>({
    resolver: zodResolver(keamananSchema),
    defaultValues: {
      passwordSaatIni: "",
      passwordBaru: "",
      confirmPasswordBaru: "",
    },
  });

  const addressForm = useForm<AddressInput>({
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
    if (isAddressSheetOpen) {
      addressForm.reset(
        editingAddress
          ? {
            namaPenerima: editingAddress.namaPenerima,
            telepon: editingAddress.telepon,
            alamatLengkap: editingAddress.alamatLengkap,
            provinsi: editingAddress.provinsi,
            kota: editingAddress.kota,
            kodePos: editingAddress.kodePos,
          }
          : {
            namaPenerima: "",
            telepon: "",
            alamatLengkap: "",
            provinsi: "",
            kota: "",
            kodePos: "",
          },
      );
    }
  }, [isAddressSheetOpen, editingAddress, addressForm]);

  const handleOpenAddSheet = () => {
    setEditingAddress(null);
    setIsAddressSheetOpen(true);
  };

  const handleOpenEditSheet = (address: Address) => {
    setEditingAddress(address);
    setIsAddressSheetOpen(true);
  };

  const onBasicInfoSubmit = (values: BasicInfoInput) => {
    const result = updateProfile({ nama: values.nama, email: values.email });
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setIsEditingBasicInfo(false);
    basicInfoForm.reset({ nama: values.nama, email: values.email });
  };

  const onKeamananSubmit = (values: KeamananInput) => {
    if (values.passwordBaru) {
      const currentHash = `mock_hash:${values.passwordSaatIni}`;
      if (currentHash !== user?.passwordHashMock) {
        keamananForm.setError("passwordSaatIni", {
          message: "Password saat ini salah.",
        });
        return;
      }
    }

    const result = updateProfile({
      nama: user!.nama,
      email: user!.email,
      passwordBaru: values.passwordBaru?.trim() || undefined,
    });

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success("Kata sandi berhasil diperbarui.");
    setIsEditingKeamanan(false);
    keamananForm.reset();
  };

  const onAddressSubmit = (values: AddressInput) => {
    const result = editingAddress
      ? updateAddress({ ...values, id: editingAddress.id })
      : addAddress(values);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setIsAddressSheetOpen(false);
  };

  const handleRemoveAddress = (addressId: string) => {
    const result = removeAddress(addressId);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
  };

  const alamatList = user?.alamatList ?? [];
  const canAddAddress = alamatList.length < 5;

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8 px-5 pb-16 pt-4 md:px-8 xl:px-10">
      <div className="px-2">
        <BackNavLink href="/etalase" />
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-border px-2">
        <button
          onClick={() => setActiveTab("identitas")}
          className={cn(
            "pb-3 text-sm font-medium transition-colors",
            activeTab === "identitas"
              ? "border-b-2 border-primary text-primary"
              : "border-b-2 border-transparent text-muted-foreground hover:border-border hover:text-foreground",
          )}
        >
          Identitas Diri
        </button>
        <button
          onClick={() => setActiveTab("keamanan")}
          className={cn(
            "pb-3 text-sm font-medium transition-colors",
            activeTab === "keamanan"
              ? "border-b-2 border-primary text-primary"
              : "border-b-2 border-transparent text-muted-foreground hover:border-border hover:text-foreground",
          )}
        >
          Keamanan
        </button>
      </div>

      {/* Tab Content */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Info Panel */}
        <div className="space-y-6 lg:col-span-4 lg:order-2">
          <Card className="border-border bg-muted/40 p-6 shadow-none">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              {activeTab === "identitas" ? (
                <Info className="size-5 text-primary" />
              ) : (
                <Shield className="size-5 text-primary" />
              )}
              {activeTab === "identitas" ? "Informasi Akun" : "Keamanan Akun"}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {activeTab === "identitas"
                ? "Data identitas diri digunakan untuk keperluan administrasi dan pengiriman pesanan. Tambahkan hingga 5 alamat pengiriman untuk kemudahan bertransaksi."
                : "Pastikan Anda menggunakan kombinasi password yang kuat. Hindari menggunakan informasi pribadi yang mudah ditebak untuk menjaga keamanan akun Anda."}
            </p>
            {lastUpdatedAt && activeTab === "identitas" && (
              <p className="mt-4 text-xs text-muted-foreground">
                Update terakhir: {formatDate(lastUpdatedAt)}
              </p>
            )}
          </Card>
        </div>

        {/* Form Area */}
        <div className="space-y-6 lg:col-span-8 lg:order-1">

          {/* IDENTITAS TAB */}
          <div className={cn(activeTab !== "identitas" && "hidden")}>

            {/* Basic Info Card */}
            <Card className="p-6 sm:p-8">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Informasi Pribadi
                </h2>
                {!isEditingBasicInfo && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingBasicInfo(true)}
                  >
                    <Edit className="mr-2 size-4" /> Edit Profil
                  </Button>
                )}
              </div>

              <Form {...basicInfoForm}>
                <form
                  onSubmit={basicInfoForm.handleSubmit(onBasicInfoSubmit)}
                  className="space-y-6"
                >
                  <fieldset
                    disabled={!isEditingBasicInfo}
                    className="grid gap-6 sm:grid-cols-2 disabled:opacity-80"
                  >
                    <FormField
                      control={basicInfoForm.control}
                      name="nama"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input className="h-11 px-4 text-base bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={basicInfoForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">Email</FormLabel>
                          <FormControl>
                            <Input className="h-11 px-4 text-base bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </fieldset>

                  {isEditingBasicInfo && (
                    <div className="flex justify-end gap-3 border-t border-border pt-6">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          basicInfoForm.reset();
                          setIsEditingBasicInfo(false);
                        }}
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={!basicInfoForm.formState.isDirty}
                      >
                        Simpan Perubahan
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </Card>

            {/* Address List Card */}
            <Card className="mt-6 p-6 sm:p-8">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Alamat Saya
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({alamatList.length}/5)
                  </span>
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleOpenAddSheet}
                  disabled={!canAddAddress}
                >
                  <Plus className="mr-2 size-4" />
                  Tambah Alamat
                </Button>
              </div>

              {alamatList.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <MapPin className="size-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    Belum ada alamat tersimpan.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleOpenAddSheet}
                  >
                    <Plus className="mr-1.5 size-4" />
                    Tambah Alamat Pertama
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {alamatList.map((address) => (
                    <div
                      key={address.id}
                      className="flex items-start justify-between gap-4 rounded-lg border border-border p-4"
                    >
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-semibold text-foreground">
                          {address.namaPenerima}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.telepon}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.alamatLengkap}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.kota}, {address.provinsi} {address.kodePos}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleOpenEditSheet(address)}
                        >
                          <Edit className="size-4" />
                          <span className="sr-only">Edit alamat</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleRemoveAddress(address.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                          <span className="sr-only">Hapus alamat</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!canAddAddress && (
                <p className="mt-4 text-xs text-muted-foreground">
                  Batas maksimal 5 alamat tersimpan telah tercapai.
                </p>
              )}
            </Card>
          </div>

          {/* KEAMANAN TAB */}
          <div className={cn(activeTab !== "keamanan" && "hidden")}>
            <Card className="p-6 sm:p-8">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Pengaturan Kata Sandi
                </h2>
                {!isEditingKeamanan && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingKeamanan(true)}
                  >
                    <Edit className="mr-2 size-4" /> Ubah Kata Sandi
                  </Button>
                )}
              </div>

              <Form {...keamananForm}>
                <form
                  onSubmit={keamananForm.handleSubmit(onKeamananSubmit)}
                  className="space-y-6"
                >
                  <fieldset
                    disabled={!isEditingKeamanan}
                    className="space-y-6 disabled:opacity-80"
                  >
                    <FormField
                      control={keamananForm.control}
                      name="passwordSaatIni"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">
                            Kata Sandi Saat Ini
                          </FormLabel>
                          <FormControl>
                            <PasswordInput
                              className="h-11 px-4 text-base bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-border">
                      <FormField
                        control={keamananForm.control}
                        name="passwordBaru"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-muted-foreground">
                              Kata Sandi Baru
                            </FormLabel>
                            <FormControl>
                              <PasswordInput
                                className="h-11 px-4 text-base bg-background"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={keamananForm.control}
                        name="confirmPasswordBaru"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-muted-foreground">
                              Konfirmasi Kata Sandi Baru
                            </FormLabel>
                            <FormControl>
                              <PasswordInput
                                className="h-11 px-4 text-base bg-background"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </fieldset>

                  {isEditingKeamanan && (
                    <div className="flex justify-end gap-3 border-t border-border pt-6">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          keamananForm.reset();
                          setIsEditingKeamanan(false);
                        }}
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={!keamananForm.formState.isDirty}
                      >
                        Simpan Perubahan
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </Card>
          </div>

        </div>
      </div>

      {/* Address Sheet */}
      <Sheet open={isAddressSheetOpen} onOpenChange={setIsAddressSheetOpen}>
        <SheetContent side="right" className="flex flex-col sm:max-w-lg overflow-hidden">
          <SheetHeader className="border-b border-border">
            <SheetTitle>
              {editingAddress ? "Edit Alamat" : "Tambah Alamat"}
            </SheetTitle>
          </SheetHeader>

          <Form {...addressForm}>
            <form
              id="address-form"
              onSubmit={addressForm.handleSubmit(onAddressSubmit)}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={addressForm.control}
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
                    control={addressForm.control}
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
                  control={addressForm.control}
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
                    control={addressForm.control}
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
                    control={addressForm.control}
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
                  control={addressForm.control}
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
                  onClick={() => setIsAddressSheetOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={addressForm.formState.isSubmitting}>
                  {editingAddress ? "Simpan Perubahan" : "Tambah Alamat"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
