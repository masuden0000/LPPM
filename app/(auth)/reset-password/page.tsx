"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useAuthStore } from "@/stores/auth-store";

const resetSchema = z
  .object({
    email: z.email("Format email tidak valid."),
    password: z.string().min(6, "Kata sandi minimal 6 karakter."),
    confirmPassword: z.string().min(6, "Konfirmasi kata sandi wajib diisi."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok.",
    path: ["confirmPassword"],
  });

type ResetInput = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const initialEmail = searchParams.get("email") ?? "";

  const form = useForm<ResetInput>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: initialEmail,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetInput) => {
    const result = resetPassword(values.email, values.password);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    router.push("/login");
  };

  return (
    <Card className="w-full rounded-xl border border-border bg-background shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05),0px_4px_6px_-4px_rgba(0,0,0,0.05)]">
      <CardContent className="space-y-8 p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-[-0.01em] text-foreground">
            Reset Kata Sandi
          </h1>
          <p className="text-sm text-muted-foreground">
            Buat kata sandi baru untuk akun kamu
          </p>
        </div>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="nama@email.com"
                      className="h-10 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Kata Sandi Baru</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="••••••••"
                      className="h-10 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Konfirmasi Kata Sandi</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="••••••••"
                      className="h-10 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="h-10 w-full rounded-lg">
              Simpan Kata Sandi Baru
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Kembali
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
