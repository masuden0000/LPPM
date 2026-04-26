"use client";

import { useRef } from "react";

import { Input } from "@/components/ui/input";

type OtpCodeInputProps = {
    value?: string;
    onChange: (value: string) => void;
    length?: number;
};

export function OtpCodeInput({ value = "", onChange, length = 6 }: OtpCodeInputProps) {
    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

    return (
        <div className="flex items-center justify-center gap-2 sm:gap-3">
            {Array.from({ length }).map((_, index) => {
                const cellValue = value[index] ?? "";

                return (
                    <Input
                        key={index}
                        ref={(el) => {
                            otpRefs.current[index] = el;
                        }}
                        value={cellValue}
                        maxLength={1}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="h-14 w-11 rounded-lg text-center text-2xl font-semibold sm:w-12"
                        onChange={(event) => {
                            const rawValue = event.target.value.replace(/\D/g, "");
                            const char = rawValue.slice(-1);
                            const chars = value.padEnd(length, " ").split("");

                            chars[index] = char || " ";
                            const nextValue = chars.join("").replace(/\s/g, "");
                            onChange(nextValue);

                            if (char && index < length - 1) {
                                otpRefs.current[index + 1]?.focus();
                            }
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Backspace" && !value[index] && index > 0) {
                                otpRefs.current[index - 1]?.focus();
                            }
                        }}
                        onPaste={(event) => {
                            event.preventDefault();
                            const pasted = event.clipboardData
                                .getData("text")
                                .replace(/\D/g, "")
                                .slice(0, length);
                            onChange(pasted);

                            const focusIndex = Math.min(pasted.length, length - 1);
                            otpRefs.current[focusIndex]?.focus();
                        }}
                    />
                );
            })}
        </div>
    );
}