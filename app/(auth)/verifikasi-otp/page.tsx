"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
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
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

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
        <button
          type="button"
          onClick={() => router.push("/forgot-password")}
          className="inline-flex items-center gap-1 text-sm font-medium text-black"
        >
          <ArrowLeft className="size-4" />
          Kembali
        </button>
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
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      {Array.from({ length: 6 }).map((_, index) => {
                        const value = field.value?.[index] ?? "";

                        return (
                          <Input
                            key={index}
                            ref={(el) => {
                              otpRefs.current[index] = el;
                            }}
                            value={value}
                            maxLength={1}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="h-14 w-11 rounded-lg text-center text-2xl font-semibold sm:w-12"
                            onChange={(event) => {
                              const rawValue = event.target.value.replace(/\D/g, "");
                              const char = rawValue.slice(-1);
                              const current = field.value ?? "";
                              const chars = current.padEnd(6, " ").split("");

                              chars[index] = char || " ";
                              const nextValue = chars.join("").replace(/\s/g, "");
                              field.onChange(nextValue);

                              if (char && index < 5) {
                                otpRefs.current[index + 1]?.focus();
                              }
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Backspace") {
                                const current = field.value ?? "";
                                if (!current[index] && index > 0) {
                                  otpRefs.current[index - 1]?.focus();
                                }
                              }
                            }}
                            onPaste={(event) => {
                              event.preventDefault();
                              const pasted = event.clipboardData
                                .getData("text")
                                .replace(/\D/g, "")
                                .slice(0, 6);
                              field.onChange(pasted);

                              const focusIndex = Math.min(pasted.length, 5);
                              otpRefs.current[focusIndex]?.focus();
                            }}
                          />
                        );
                      })}
                    </div>
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
