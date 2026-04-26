"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import { CampusIcon } from "@/components/auth/campus-icon";
import { useAuthStore } from "@/stores/auth-store";

const registerSchema = z
  .object({
    nama: z.string().min(3, "Nama minimal 3 karakter."),
    email: z.email("Format email tidak valid."),
    password: z.string().min(6, "Kata sandi minimal 6 karakter."),
    confirmPassword: z.string().min(6, "Konfirmasi kata sandi wajib diisi."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok.",
    path: ["confirmPassword"],
  });

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nama: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterInput) => {
    const result = register({
      nama: values.nama,
      email: values.email,
      password: values.password,
    });

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <Card className="w-full rounded-xl border border-border bg-background shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05),0px_4px_6px_-4px_rgba(0,0,0,0.05)]">
      <CardContent className="space-y-6 p-8">
        <div className="space-y-2 text-center">
          <CampusIcon
            className="mb-4 flex justify-center"
            imageClassName="size-14 object-contain text-muted-foreground"
          />
          <h1 className="text-3xl font-semibold tracking-[-0.01em] text-foreground">
            Daftar Akun LPPM UPNVJ
          </h1>
          <p className="text-sm text-muted-foreground">
            Lengkapi data berikut untuk membuat akun baru
          </p>
        </div>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Nama lengkap" className="h-10 rounded-lg pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="min-h-0" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="nama@email.com"
                        className="h-10 rounded-lg pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="min-h-0" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kata Sandi</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                      <PasswordInput
                        placeholder="Masukkan kata sandi"
                        className="h-10 rounded-lg pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="min-h-0" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi Kata Sandi</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                      <PasswordInput
                        placeholder="Ulangi kata sandi"
                        className="h-10 rounded-lg pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="min-h-0" />
                </FormItem>
              )}
            />
            <Button type="submit" className="h-10 w-full rounded-lg">
              Daftar
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Masuk sekarang
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
