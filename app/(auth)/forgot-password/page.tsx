"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { useAuthStore } from "@/stores/auth-store";

const forgotSchema = z.object({
  email: z.email("Format email tidak valid."),
});

type ForgotInput = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);
  const form = useForm<ForgotInput>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotInput) => {
    const result = requestPasswordReset(values.email);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    router.push(`/verifikasi-otp?email=${encodeURIComponent(values.email)}`);
  };

  return (
    <Card className="w-full rounded-xl border border-border bg-background shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05),0px_4px_6px_-4px_rgba(0,0,0,0.05)]">
      <CardContent className="space-y-8 p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-[-0.01em] text-foreground">
            Lupa Kata Sandi
          </h1>
          <p className="text-sm text-muted-foreground">
            Masukkan email untuk mendapatkan kode OTP reset kata sandi
          </p>
        </div>
        <Alert>
          <AlertTitle>Mode Simulasi</AlertTitle>
          <AlertDescription>
            OTP akan ditampilkan di halaman verifikasi untuk kebutuhan testing.
          </AlertDescription>
        </Alert>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="h-10 w-full rounded-lg">
              Kirim OTP
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
