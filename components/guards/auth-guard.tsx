"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useHydrated } from "@/hooks/use-hydrated";
import { useAuthStore } from "@/stores/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const currentUserId = useAuthStore((state) => state.currentUserId);

  useEffect(() => {
    if (hydrated && !currentUserId) {
      router.replace("/login");
    }
  }, [currentUserId, hydrated, router]);

  if (!hydrated || !currentUserId) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Memuat sesi...
      </div>
    );
  }

  return <>{children}</>;
}
