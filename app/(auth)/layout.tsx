import { GuestGuard } from "@/components/guards/guest-guard";
import { AUTH_BRANDING_ASSETS } from "@/lib/mock-content";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuestGuard>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 md:p-6">
        {/* Background image layer for auth pages */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55"
          style={{ backgroundImage: `url('${AUTH_BRANDING_ASSETS.backgroundImageUrl}')` }}
        />
        {/* Gradient fade so image blends softly into the page background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/55 to-transparent" />

        <div className="relative z-10 flex w-full max-w-[400px] flex-col items-center gap-6">
          <div className="w-full">{children}</div>
          <p className="text-center text-xs text-foreground/80">
            Copyright (c) 2026 LPPM UPN Veteran Jakarta
          </p>
        </div>
      </div>
    </GuestGuard>
  );
}
