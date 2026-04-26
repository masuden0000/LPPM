"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Edit, Info, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useProfileStore } from "@/stores/profile-store";

const profileSchema = z
  .object({
    nama: z.string().min(3, "Nama minimal 3 karakter."),
    email: z.email("Format email tidak valid."),
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
    }
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

type ProfileInput = z.infer<typeof profileSchema>;

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
  const lastUpdatedAt = useProfileStore((state) => state.lastUpdatedAt);

  const [activeTab, setActiveTab] = useState<"identitas" | "keamanan">("identitas");
  const [isEditingIdentitas, setIsEditingIdentitas] = useState(false);
  const [isEditingKeamanan, setIsEditingKeamanan] = useState(false);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nama: user?.nama ?? "",
      email: user?.email ?? "",
      telepon: user?.alamatDefault?.telepon ?? "",
      alamatLengkap: user?.alamatDefault?.alamatLengkap ?? "",
      provinsi: user?.alamatDefault?.provinsi ?? "",
      kota: user?.alamatDefault?.kota ?? "",
      kodePos: user?.alamatDefault?.kodePos ?? "",
      passwordSaatIni: "",
      passwordBaru: "",
      confirmPasswordBaru: "",
    },
  });

  const onSubmit = (values: ProfileInput) => {
    if (activeTab === "keamanan" && values.passwordBaru) {
      // Validasi password saat ini
      const currentPasswordHash = `mock_hash:${values.passwordSaatIni}`;
      if (currentPasswordHash !== user?.passwordHashMock) {
        form.setError("passwordSaatIni", { message: "Password saat ini salah." });
        return;
      }
    }

    const result = updateProfile({
      nama: values.nama,
      email: values.email,
      alamatDefault: {
        namaPenerima: values.nama,
        telepon: values.telepon,
        alamatLengkap: values.alamatLengkap,
        provinsi: values.provinsi,
        kota: values.kota,
        kodePos: values.kodePos,
      },
      passwordBaru: activeTab === "keamanan" && values.passwordBaru?.trim() ? values.passwordBaru : undefined,
    });

    if (!result.ok) {
      toast.error(result.message);
      return;
    }


    if (activeTab === "identitas") {
      setIsEditingIdentitas(false);
    } else {
      setIsEditingKeamanan(false);
    }

    // Reset password fields and re-sync values
    form.reset({
      ...values,
      passwordSaatIni: "",
      passwordBaru: "",
      confirmPasswordBaru: "",
    });
  };

  const handleCancelIdentitas = () => {
    form.reset();
    setIsEditingIdentitas(false);
  };

  const handleCancelKeamanan = () => {
    form.reset();
    setIsEditingKeamanan(false);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 pb-16 pt-4">
      <div className="px-2">
        <Link href="/etalase" className="inline-flex items-center gap-1 text-sm font-medium text-black">
          <ArrowLeft className="size-4" />
          Kembali
        </Link>
      </div>

      {/* Horizontal Tabs Navigation */}
      <div className="flex gap-8 border-b border-border px-2">
        <button
          onClick={() => setActiveTab("identitas")}
          className={cn(
            "pb-3 text-sm font-medium transition-colors",
            activeTab === "identitas"
              ? "border-b-2 border-primary text-primary"
              : "border-b-2 border-transparent text-muted-foreground hover:border-border hover:text-foreground"
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
              : "border-b-2 border-transparent text-muted-foreground hover:border-border hover:text-foreground"
          )}
        >
          Keamanan
        </button>
      </div>

      {/* Tab Content */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Contextual Info Panel */}
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
                ? "Data identitas diri digunakan untuk keperluan administrasi dan pengiriman pesanan. Pastikan alamat lengkap sesuai dengan domisili saat ini untuk kelancaran transaksi."
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
        <div className="lg:col-span-8 lg:order-1">
          <Card className="p-6 sm:p-8">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {activeTab === "identitas" ? "Informasi Pribadi" : "Pengaturan Kata Sandi"}
              </h2>
              {activeTab === "identitas" && !isEditingIdentitas && (
                <Button type="button" variant="outline" onClick={() => setIsEditingIdentitas(true)}>
                  <Edit className="mr-2 size-4" /> Edit Profil
                </Button>
              )}
              {activeTab === "keamanan" && !isEditingKeamanan && (
                <Button type="button" variant="outline" onClick={() => setIsEditingKeamanan(true)}>
                  <Edit className="mr-2 size-4" /> Ubah Kata Sandi
                </Button>
              )}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* IDENTITAS TAB */}
                <div className={cn("space-y-6", activeTab !== "identitas" && "hidden")}>
                  <fieldset disabled={!isEditingIdentitas} className="space-y-6 disabled:opacity-80">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
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
                        control={form.control}
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
                    </div>

                    <FormField
                      control={form.control}
                      name="telepon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">Nomor Telepon / WhatsApp</FormLabel>
                          <FormControl>
                            <Input className="h-11 px-4 text-base bg-background" {...field} placeholder="Contoh: 081234567890" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="mt-8 border-t border-border pt-6">
                      <FormField
                        control={form.control}
                        name="alamatLengkap"
                        render={({ field }) => (
                          <FormItem className="mb-6">
                            <FormLabel className="text-muted-foreground">Alamat Lengkap (Jalan, RT/RW, Gedung)</FormLabel>
                            <FormControl>
                              <Textarea rows={3} className="resize-none p-4 text-base bg-background" {...field} />
                            </FormControl>
                            <FormDescription>Digunakan sebagai alamat default pengiriman.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="provinsi"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-muted-foreground">Provinsi</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange} disabled={!isEditingIdentitas}>
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
                          control={form.control}
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
                        <FormField
                          control={form.control}
                          name="kodePos"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                              <FormLabel className="text-muted-foreground">Kode Pos</FormLabel>
                              <FormControl>
                                <Input className="h-11 px-4 text-base bg-background" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </fieldset>

                  {isEditingIdentitas && (
                    <div className="mt-8 flex justify-end gap-3 border-t border-border pt-6">
                      <Button type="button" variant="ghost" onClick={handleCancelIdentitas}>
                        Batal
                      </Button>
                      <Button type="submit" size="lg" disabled={!form.formState.isDirty}>
                        Simpan Perubahan
                      </Button>
                    </div>
                  )}
                </div>

                {/* KEAMANAN TAB */}
                <div className={cn("space-y-6", activeTab !== "keamanan" && "hidden")}>
                  <fieldset disabled={!isEditingKeamanan} className="space-y-6 disabled:opacity-80">
                    <FormField
                      control={form.control}
                      name="passwordSaatIni"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">Kata Sandi Saat Ini</FormLabel>
                          <FormControl>
                            <PasswordInput className="h-11 px-4 text-base bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-border">
                      <FormField
                        control={form.control}
                        name="passwordBaru"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-muted-foreground">Kata Sandi Baru</FormLabel>
                            <FormControl>
                              <PasswordInput className="h-11 px-4 text-base bg-background" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPasswordBaru"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-muted-foreground">Konfirmasi Kata Sandi Baru</FormLabel>
                            <FormControl>
                              <PasswordInput className="h-11 px-4 text-base bg-background" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </fieldset>

                  {isEditingKeamanan && (
                    <div className="mt-8 flex justify-end gap-3 border-t border-border pt-6">
                      <Button type="button" variant="ghost" onClick={handleCancelKeamanan}>
                        Batal
                      </Button>
                      <Button type="submit" size="lg" disabled={!form.formState.isDirty}>
                        Simpan Perubahan
                      </Button>
                    </div>
                  )}
                </div>

              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
