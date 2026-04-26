"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type BackNavLinkProps = {
    href: string;
    label?: string;
    className?: string;
};

export function BackNavLink({ href, label = "Kembali", className }: BackNavLinkProps) {
    const router = useRouter();

    const handleBack = () => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
            return;
        }

        router.push(href);
    };

    return (
        <button
            type="button"
            onClick={handleBack}
            className={
                className ?? "inline-flex items-center gap-1 text-sm font-medium text-black"
            }
        >
            <ArrowLeft className="size-4" />
            {label}
        </button>
    );
}