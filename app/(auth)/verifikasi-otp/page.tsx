"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { OtpCodeInput } from "@/components/auth/otp-code-input";
import { BackNavLink } from "@/components/shared/back-nav-link";
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
import { useAuthStore } from "@/stores/auth-store";

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP harus 6 digit.")
    .regex(/^\d+$/, "OTP hanya boleh angka."),
});

type OtpInput = z.infer<typeof otpSchema>;

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const forgotToken = useAuthStore((state) => state.forgotPasswordToken);
  const initialEmail = searchParams.get("email") ?? "";

  const form = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (values: OtpInput) => {
    if (!initialEmail) {
      toast.error("Email tidak ditemukan. Silakan ulangi dari halaman lupa kata sandi.");
      router.push("/forgot-password");
      return;
    }

    const result = verifyOtp(initialEmail, values.otp);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    router.push(`/reset-password?email=${encodeURIComponent(initialEmail)}`);
  };

  return (
    <Card className="w-full rounded-xl border border-border bg-background shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05),0px_4px_6px_-4px_rgba(0,0,0,0.05)]">
      <CardContent className="space-y-8 p-8">
        <BackNavLink href="/forgot-password" />
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-[-0.01em] text-foreground">
            Verifikasi OTP
          </h1>
          <p className="text-sm text-muted-foreground">
            Masukkan kode OTP 6 digit untuk melanjutkan reset kata sandi
          </p>
        </div>
        <Alert>
          <AlertTitle>OTP Simulasi</AlertTitle>
          <AlertDescription className="space-y-1">
            <p>OTP dummy: {forgotToken?.otp ?? "-"}</p>
            <p>Kedaluwarsa: {forgotToken?.expiresAt ?? "-"}</p>
          </AlertDescription>
        </Alert>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Kode OTP</FormLabel>
                  <FormControl>
                    <OtpCodeInput value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="h-10 w-full rounded-lg">
              Verifikasi OTP
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/forgot-password" className="font-medium text-primary hover:underline">
            Kembali kirim ulang OTP
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
