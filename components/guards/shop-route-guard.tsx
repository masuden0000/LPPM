"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useHydrated } from "@/hooks/use-hydrated";
import { useAuthStore } from "@/stores/auth-store";

export function ShopRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const currentUserId = useAuthStore((state) => state.currentUserId);

  useEffect(() => {
    if (!hydrated) return;
    if (!currentUserId) {
      router.replace("/login");
    }
  }, [currentUserId, hydrated, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Memuat sesi...
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Mengalihkan ke halaman login...
      </div>
    );
  }

  return <>{children}</>;
}
