import { ShopRouteGuard } from "@/components/guards/shop-route-guard";
import { ShopHeader } from "@/components/shop/shop-header";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShopRouteGuard>
      <div className="min-h-screen">
        <ShopHeader />
        {/* Let the dashboard page control its own width so the layout feels more open. */}
        <main className="w-full px-0 pt-6">
          {children}
        </main>
      </div>
    </ShopRouteGuard>
  );
}
