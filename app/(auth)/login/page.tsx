"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail } from "lucide-react";
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

const loginSchema = z.object({
  email: z.email("Format email tidak valid."),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginInput) => {
    const result = login(values.email, values.password);
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
            LPPM UPNVJ
          </h1>
          <p className="text-sm text-muted-foreground">
            Masukkan email dan kata sandi Anda untuk pengalaman terbaik
          </p>
        </div>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Kata Sandi</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Lupa kata sandi?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                      <PasswordInput
                        placeholder="••••••••"
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
              Masuk
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/daftar" className="font-medium text-primary hover:underline">
            Daftar sekarang
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
