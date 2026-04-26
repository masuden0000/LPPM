import type { PaymentMethod } from "@/lib/types";

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function paymentMethodLabel(method: PaymentMethod): string {
  if (method === "BCA_VA") return "BCA Virtual Account";
  if (method === "BNI_VA") return "BNI Virtual Account";
  return "BRI Virtual Account";
}

export function getInitialName(nama: string): string {
  return nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
