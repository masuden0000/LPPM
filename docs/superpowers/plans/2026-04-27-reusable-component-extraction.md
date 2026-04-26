# Reusable Component Extraction — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ekstrak pola UI yang berulang di seluruh halaman menjadi komponen reusable yang terpusat di `components/`.

**Architecture:** Setiap komponen baru ditempatkan di folder sesuai domain (`ui/` untuk primitif, `shared/` untuk pola app-specific, `shop/` untuk domain belanja). Halaman diupdate untuk menggunakan komponen baru, state management tidak diubah.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/base-ui, React Hook Form, Zod

---

## File Map

| File | Status | Tanggung jawab |
|---|---|---|
| `lib/discounts.ts` | CREATE | Konstanta diskon shared |
| `components/ui/button.tsx` | MODIFY | Tambah size md, lg, xl |
| `components/ui/input.tsx` | MODIFY | Tinggi default h-10, tambah InputWithLeadingIcon + InputWithIcon |
| `components/ui/page-wrapper.tsx` | CREATE | Outer container standar |
| `components/ui/section-card.tsx` | CREATE | Card dengan icon header |
| `components/ui/empty-state-card.tsx` | CREATE | Empty state dengan CTA |
| `components/shared/page-header.tsx` | CREATE | BackNavLink + h1 |
| `components/shop/order-summary.tsx` | CREATE | Sidebar ringkasan pesanan |
| `components/shop/address-fields.tsx` | CREATE | 6 form field alamat |
| `app/(shop)/etalase/page.tsx` | MODIFY | Pakai DISCOUNT_BY_BOOK_ID dari lib |
| `app/(shop)/etalase/[id]/page.tsx` | MODIFY | Pakai DISCOUNT_BY_BOOK_ID dari lib |
| `app/(auth)/login/page.tsx` | MODIFY | Button size md, InputWithIcon |
| `app/(auth)/daftar/page.tsx` | MODIFY | Button size md, InputWithIcon |
| `app/(auth)/forgot-password/page.tsx` | MODIFY | Button size md, InputWithIcon |
| `app/(auth)/reset-password/page.tsx` | MODIFY | Button size md, Input h-10 default |
| `app/(shop)/keranjang/page.tsx` | MODIFY | Button sizes, PageWrapper, PageHeader, EmptyStateCard, OrderSummary |
| `app/(shop)/checkout/page.tsx` | MODIFY | Button sizes, PageWrapper, AddressFields |
| `app/(shop)/pembayaran/page.tsx` | MODIFY | Button sizes, PageWrapper, PageHeader, SectionCard, OrderSummary |
| `app/(shop)/pembayaran/va/page.tsx` | MODIFY | Button sizes, PageWrapper, PageHeader, SectionCard, OrderSummary |
| `app/(shop)/pembayaran/berhasil/page.tsx` | MODIFY | Button sizes, PageWrapper |
| `app/(shop)/lacak-pesanan/page.tsx` | MODIFY | Button sizes, PageWrapper, EmptyStateCard |
| `app/(shop)/dashboard/page.tsx` | MODIFY | Button size lg |
| `app/(shop)/profil/page.tsx` | MODIFY | Button sizes, PageWrapper, PageHeader, AddressFields |

---

## Task 1: Ekstrak `DISCOUNT_BY_BOOK_ID` ke `lib/discounts.ts`

**Files:**
- Create: `lib/discounts.ts`
- Modify: `app/(shop)/etalase/page.tsx`
- Modify: `app/(shop)/etalase/[id]/page.tsx`

- [ ] **Step 1: Buat `lib/discounts.ts`**

```ts
export const DISCOUNT_BY_BOOK_ID: Record<
  string,
  { originalPrice: number; discountLabel: string }
> = {
  "book-2": { originalPrice: 155000, discountLabel: "Diskon 23%" },
  "book-8": { originalPrice: 275000, discountLabel: "Diskon 20%" },
};
```

- [ ] **Step 2: Update `app/(shop)/etalase/page.tsx`**

Hapus blok konstanta lokal (baris ~21-24):
```tsx
// HAPUS ini:
const DISCOUNT_BY_BOOK_ID: Record<string, { originalPrice: number; discountLabel: string }> = {
  "book-2": { originalPrice: 155000, discountLabel: "Diskon 23%" },
  "book-8": { originalPrice: 275000, discountLabel: "Diskon 20%" },
};
```

Tambah import di bagian atas file (setelah import lainnya):
```tsx
import { DISCOUNT_BY_BOOK_ID } from "@/lib/discounts";
```

- [ ] **Step 3: Update `app/(shop)/etalase/[id]/page.tsx`**

Hapus blok konstanta lokal (baris ~18-21):
```tsx
// HAPUS ini:
const DISCOUNT_BY_BOOK_ID: Record<string, { originalPrice: number; discountLabel: string }> = {
  "book-2": { originalPrice: 155000, discountLabel: "Diskon 23%" },
  "book-8": { originalPrice: 275000, discountLabel: "Diskon 20%" },
};
```

Tambah import:
```tsx
import { DISCOUNT_BY_BOOK_ID } from "@/lib/discounts";
```

- [ ] **Step 4: Verifikasi TypeScript**

```bash
cd "c:/Users/hudar/Documents/[1] Huda Rasyad Wicaksono/[3] Project/[1] Project Website/LPPM"
npx tsc --noEmit
```

Expected: tidak ada error.

- [ ] **Step 5: Commit**

```bash
git add lib/discounts.ts "app/(shop)/etalase/page.tsx" "app/(shop)/etalase/[id]/page.tsx"
git commit -m "refactor: extract DISCOUNT_BY_BOOK_ID to lib/discounts"
```

---

## Task 2: Tambah Size Variants ke `button.tsx`

**Files:**
- Modify: `components/ui/button.tsx`

- [ ] **Step 1: Tambah size `md`, `lg`, `xl` ke `buttonVariants`**

Di `components/ui/button.tsx`, update bagian `size` di dalam `buttonVariants`. Tambah tiga baris setelah baris `lg`:

```tsx
// Sebelum (bagian size):
size: {
  default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
  xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
  sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
  lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
  icon: "size-8",
  "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
  "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
  "icon-lg": "size-9",
},

// Sesudah (tambah md, lg baru, xl — ganti lg yang lama dengan lg baru):
size: {
  default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
  xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
  sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
  lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
  md: "h-10 gap-1.5 px-4 py-2 text-sm",
  "lg-app": "h-11 gap-1.5 px-6 py-2.5 text-base",
  xl: "h-12 gap-2 px-8 py-3 text-base",
  icon: "size-8",
  "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
  "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
  "icon-lg": "size-9",
},
```

> Catatan: Size yang sudah ada (`lg` = h-9) tidak diubah agar tidak breaking. Size baru `lg-app` = h-11 (untuk dashboard hero button), `md` = h-10, `xl` = h-12.

- [ ] **Step 2: Update type signature function `Button`**

Pastikan `VariantProps<typeof buttonVariants>` otomatis mengambil semua size baru — tidak perlu perubahan karena `cva` sudah generate types dari `buttonVariants`.

- [ ] **Step 3: Verifikasi TypeScript**

```bash
npx tsc --noEmit
```

Expected: tidak ada error.

- [ ] **Step 4: Commit**

```bash
git add components/ui/button.tsx
git commit -m "feat(ui): add button size variants md, lg-app, xl"
```

---

## Task 3: Audit Button Usage — Semua Halaman

**Files:** 9 file halaman

- [ ] **Step 1: Update `app/(auth)/login/page.tsx` baris 121**

```tsx
// Sebelum:
<Button type="submit" className="h-10 w-full rounded-lg">

// Sesudah:
<Button type="submit" size="md" className="w-full rounded-lg">
```

- [ ] **Step 2: Update `app/(auth)/daftar/page.tsx` baris 165**

```tsx
// Sebelum:
<Button type="submit" className="h-10 w-full rounded-lg">

// Sesudah:
<Button type="submit" size="md" className="w-full rounded-lg">
```

- [ ] **Step 3: Update `app/(auth)/forgot-password/page.tsx` baris 93**

```tsx
// Sebelum:
<Button type="submit" className="h-10 w-full rounded-lg">

// Sesudah:
<Button type="submit" size="md" className="w-full rounded-lg">
```

- [ ] **Step 4: Update `app/(auth)/reset-password/page.tsx` baris 129**

```tsx
// Sebelum:
<Button type="submit" className="h-10 w-full rounded-lg">

// Sesudah:
<Button type="submit" size="md" className="w-full rounded-lg">
```

- [ ] **Step 5: Update `app/(shop)/dashboard/page.tsx` baris ~66**

```tsx
// Sebelum:
<Button
  variant="outline"
  className="h-11 rounded-full border-white/25 bg-white/8 px-5 text-white hover:bg-white/14 hover:text-white"
>

// Sesudah:
<Button
  variant="outline"
  size="lg-app"
  className="rounded-full border-white/25 bg-white/8 px-5 text-white hover:bg-white/14 hover:text-white"
>
```

- [ ] **Step 6: Update `app/(shop)/keranjang/page.tsx` — 2 button**

Baris ~45 (Link Empty State):
```tsx
// Sebelum:
<Link href="/etalase" className={cn(buttonVariants({ variant: "default" }), "h-10 px-8 rounded-lg")}>

// Sesudah:
<Link href="/etalase" className={cn(buttonVariants({ variant: "default", size: "md" }), "px-8 rounded-lg")}>
```

Baris ~120 (Link Checkout CTA):
```tsx
// Sebelum:
<Link href="/checkout" className={cn(buttonVariants({ variant: "default" }), "flex h-12 w-full items-center justify-center gap-2 rounded-lg")}>

// Sesudah:
<Link href="/checkout" className={cn(buttonVariants({ variant: "default", size: "xl" }), "w-full rounded-lg")}>
```

- [ ] **Step 7: Update `app/(shop)/pembayaran/page.tsx` baris ~117**

```tsx
// Sebelum:
<Button
  className="w-full h-12 rounded-full font-semibold text-base gap-2 hover:opacity-90 active:scale-95 transition-all"
  onClick={onContinue}
>

// Sesudah:
<Button
  size="xl"
  className="w-full rounded-full hover:opacity-90 active:scale-95"
  onClick={onContinue}
>
```

- [ ] **Step 8: Update `app/(shop)/pembayaran/va/page.tsx` — 2 button**

Baris ~60 (error state Link):
```tsx
// Sebelum:
<Link href="/etalase" className={cn(buttonVariants({ variant: "default" }), "h-12 rounded-full px-8 font-semibold text-base")}>

// Sesudah:
<Link href="/etalase" className={cn(buttonVariants({ variant: "default", size: "xl" }), "rounded-full")}>
```

Baris ~119 (AlertDialogTrigger):
```tsx
// Sebelum:
<AlertDialogTrigger className={cn(buttonVariants({ variant: "default" }), "w-full h-12 rounded-full font-semibold text-base hover:opacity-90 active:scale-95 transition-all")}>

// Sesudah:
<AlertDialogTrigger className={cn(buttonVariants({ variant: "default", size: "xl" }), "w-full rounded-full hover:opacity-90 active:scale-95")}>
```

- [ ] **Step 9: Update `app/(shop)/pembayaran/berhasil/page.tsx` — 2 Link button**

Baris ~85-100:
```tsx
// Sebelum:
<Link href="/etalase" className={cn(buttonVariants({ variant: "default" }), "h-12 flex-1 justify-center rounded-full font-semibold text-base hover:opacity-90 active:scale-95 transition-all")}>

// Sesudah:
<Link href="/etalase" className={cn(buttonVariants({ variant: "default", size: "xl" }), "flex-1 justify-center rounded-full hover:opacity-90 active:scale-95")}>
```

```tsx
// Sebelum:
<Link href={`/lacak-pesanan?orderId=...`} className={cn(buttonVariants({ variant: "outline" }), "h-12 flex-1 justify-center rounded-full font-semibold text-base")}>

// Sesudah:
<Link href={`/lacak-pesanan?orderId=...`} className={cn(buttonVariants({ variant: "outline", size: "xl" }), "flex-1 justify-center rounded-full")}>
```

- [ ] **Step 10: Update `app/(shop)/lacak-pesanan/page.tsx` — 2 Link button**

Baris ~73 (empty state):
```tsx
// Sebelum:
<Link href="/etalase" className={cn(buttonVariants({ variant: "default" }), "mt-6 h-12 rounded-full px-8 font-semibold text-base")}>

// Sesudah:
<Link href="/etalase" className={cn(buttonVariants({ variant: "default", size: "xl" }), "mt-6 rounded-full")}>
```

Baris ~353-358 (lanjutkan pembayaran):
```tsx
// Sebelum:
<Link href="/checkout" className={cn(buttonVariants({ variant: "default" }), "mt-4 h-12 w-full rounded-full font-semibold text-base hover:opacity-90 active:scale-95 transition-all")}>

// Sesudah:
<Link href="/checkout" className={cn(buttonVariants({ variant: "default", size: "xl" }), "mt-4 w-full rounded-full hover:opacity-90 active:scale-95")}>
```

- [ ] **Step 11: Update `app/(shop)/etalase/[id]/page.tsx` — 2 Button**

Baris ~161:
```tsx
// Sebelum:
<Button onClick={onAddToCart} size="lg" className="px-8 font-medium flex items-center justify-center gap-2 min-w-[200px] text-base py-5">

// Sesudah:
<Button onClick={onAddToCart} size="xl" className="min-w-[200px]">
```

Baris ~165:
```tsx
// Sebelum:
<Button variant="outline" size="lg" onClick={onShare} className="px-8 py-5 font-medium flex items-center justify-center gap-2 min-w-[200px] text-base hover:bg-slate-50">

// Sesudah:
<Button variant="outline" size="xl" onClick={onShare} className="min-w-[200px] hover:bg-slate-50">
```

- [ ] **Step 12: Update `app/(shop)/checkout/page.tsx` — main CTA button (baris ~488)**

```tsx
// Sebelum:
<Button
  type="button"
  onClick={handleCheckout}
  className="w-full h-12 rounded-full font-semibold text-base flex justify-center items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
>

// Sesudah:
<Button
  type="button"
  onClick={handleCheckout}
  size="xl"
  className="w-full rounded-full hover:opacity-90 active:scale-95"
>
```

Sheet footer buttons (baris ~627-636) tidak perlu diubah — sudah menggunakan default size yang sesuai.

- [ ] **Step 13: Update `app/(shop)/profil/page.tsx` — cek button h-11/h-12**

Baca baris 370-386 dan 402-470 untuk tombol-tombol di card profil. Jika ada `className` berisi `h-11` atau `h-12`, ganti dengan size variant yang sesuai (`size="lg-app"` atau `size="xl"`). Tombol yang sudah menggunakan `size` prop tidak perlu diubah.

Sheet footer buttons (baris ~724-733) tidak perlu diubah.

- [ ] **Step 14: Verifikasi TypeScript**

```bash
npx tsc --noEmit
```

Expected: tidak ada error.

- [ ] **Step 15: Commit**

```bash
git add "app/(auth)/login/page.tsx" "app/(auth)/daftar/page.tsx" "app/(auth)/forgot-password/page.tsx" "app/(auth)/reset-password/page.tsx" "app/(shop)/dashboard/page.tsx" "app/(shop)/keranjang/page.tsx" "app/(shop)/pembayaran/page.tsx" "app/(shop)/pembayaran/va/page.tsx" "app/(shop)/pembayaran/berhasil/page.tsx" "app/(shop)/lacak-pesanan/page.tsx" "app/(shop)/etalase/[id]/page.tsx" "app/(shop)/checkout/page.tsx" "app/(shop)/profil/page.tsx"
git commit -m "refactor: standardize button sizes using md/lg-app/xl variants"
```

---

## Task 4: Update `input.tsx` — Tinggi Default & InputWithIcon

**Files:**
- Modify: `components/ui/input.tsx`

- [ ] **Step 1: Ubah tinggi default Input dari `h-8` ke `h-10` dan tambah komponen baru**

Ganti seluruh isi `components/ui/input.tsx` dengan:

```tsx
import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

/**
 * Slot wrapper: pasang icon di kiri dan children (Input atau PasswordInput) di kanan.
 * Gunakan ini saat perlu wrapping PasswordInput dengan icon.
 *
 * Contoh:
 *   <InputWithLeadingIcon icon={LockKeyhole}>
 *     <PasswordInput className="pl-10" {...field} />
 *   </InputWithLeadingIcon>
 */
function InputWithLeadingIcon({
  icon: Icon,
  children,
  className,
}: {
  icon: React.ElementType
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      <Icon className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
      {children}
    </div>
  )
}

/**
 * Input teks dengan icon di kiri — shorthand untuk InputWithLeadingIcon + Input.
 *
 * Contoh:
 *   <InputWithIcon icon={Mail} placeholder="nama@email.com" {...field} />
 */
function InputWithIcon({
  icon,
  className,
  ...props
}: { icon: React.ElementType } & React.ComponentProps<"input">) {
  return (
    <InputWithLeadingIcon icon={icon}>
      <Input className={cn("pl-10", className)} {...props} />
    </InputWithLeadingIcon>
  )
}

export { Input, InputWithIcon, InputWithLeadingIcon }
```

- [ ] **Step 2: Verifikasi TypeScript**

```bash
npx tsc --noEmit
```

Expected: tidak ada error.

- [ ] **Step 3: Commit**

```bash
git add components/ui/input.tsx
git commit -m "feat(ui): change Input default height to h-10, add InputWithIcon + InputWithLeadingIcon"
```

---

## Task 5: Audit Input & Icon Pattern — Halaman Auth + Reset Password

**Files:** 4 file auth

- [ ] **Step 1: Update `app/(auth)/login/page.tsx`**

Tambah import `InputWithIcon` dan `InputWithLeadingIcon`:
```tsx
import { InputWithIcon, InputWithLeadingIcon } from "@/components/ui/input";
```

Hapus import `Input` (tidak lagi dipakai langsung di login).

Ganti field email (baris ~73-91):
```tsx
// Sebelum:
render={({ field }) => (
  <FormItem>
    <FormLabel>Email</FormLabel>
    <FormControl>
      <div className="relative">
        <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="nama@email.com" className="h-10 rounded-lg pl-10" {...field} />
      </div>
    </FormControl>
    <FormMessage className="min-h-0" />
  </FormItem>
)}

// Sesudah:
render={({ field }) => (
  <FormItem>
    <FormLabel>Email</FormLabel>
    <FormControl>
      <InputWithIcon icon={Mail} placeholder="nama@email.com" {...field} />
    </FormControl>
    <FormMessage className="min-h-0" />
  </FormItem>
)}
```

Ganti field password (baris ~93-120):
```tsx
// Sebelum:
render={({ field }) => (
  <FormItem>
    <div className="flex items-center justify-between">
      <FormLabel>Kata Sandi</FormLabel>
      <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
        Lupa kata sandi?
      </Link>
    </div>
    <FormControl>
      <div className="relative">
        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
        <PasswordInput placeholder="••••••••" className="h-10 rounded-lg pl-10" {...field} />
      </div>
    </FormControl>
    <FormMessage className="min-h-0" />
  </FormItem>
)}

// Sesudah:
render={({ field }) => (
  <FormItem>
    <div className="flex items-center justify-between">
      <FormLabel>Kata Sandi</FormLabel>
      <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
        Lupa kata sandi?
      </Link>
    </div>
    <FormControl>
      <InputWithLeadingIcon icon={LockKeyhole}>
        <PasswordInput placeholder="••••••••" className="pl-10" {...field} />
      </InputWithLeadingIcon>
    </FormControl>
    <FormMessage className="min-h-0" />
  </FormItem>
)}
```

- [ ] **Step 2: Update `app/(auth)/daftar/page.tsx`**

Tambah import:
```tsx
import { InputWithIcon, InputWithLeadingIcon } from "@/components/ui/input";
```

Ganti field `nama` (baris ~89-104):
```tsx
// Sebelum:
<div className="relative">
  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
  <Input placeholder="Nama lengkap" className="h-10 rounded-lg pl-10" {...field} />
</div>

// Sesudah:
<InputWithIcon icon={User} placeholder="Nama lengkap" {...field} />
```

Ganti field `email` (baris ~105-124):
```tsx
// Sebelum:
<div className="relative">
  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
  <Input placeholder="nama@email.com" className="h-10 rounded-lg pl-10" {...field} />
</div>

// Sesudah:
<InputWithIcon icon={Mail} placeholder="nama@email.com" {...field} />
```

Ganti field `password` (baris ~125-142):
```tsx
// Sebelum:
<div className="relative">
  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
  <PasswordInput placeholder="Masukkan kata sandi" className="h-10 rounded-lg pl-10" {...field} />
</div>

// Sesudah:
<InputWithLeadingIcon icon={LockKeyhole}>
  <PasswordInput placeholder="Masukkan kata sandi" className="pl-10" {...field} />
</InputWithLeadingIcon>
```

Ganti field `confirmPassword` (baris ~143-162):
```tsx
// Sebelum:
<div className="relative">
  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
  <PasswordInput placeholder="Ulangi kata sandi" className="h-10 rounded-lg pl-10" {...field} />
</div>

// Sesudah:
<InputWithLeadingIcon icon={LockKeyhole}>
  <PasswordInput placeholder="Ulangi kata sandi" className="pl-10" {...field} />
</InputWithLeadingIcon>
```

- [ ] **Step 3: Update `app/(auth)/forgot-password/page.tsx`**

Tambah import:
```tsx
import { InputWithIcon } from "@/components/ui/input";
```

Ganti field email (baris ~79-88):
```tsx
// Sebelum:
<div className="relative">
  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
  <Input placeholder="nama@email.com" className="h-10 rounded-lg pl-10" {...field} />
</div>

// Sesudah:
<InputWithIcon icon={Mail} placeholder="nama@email.com" {...field} />
```

Hapus import `Input` jika tidak ada penggunaan lain.

- [ ] **Step 4: Update `app/(auth)/reset-password/page.tsx`**

Field email tidak punya icon — `h-10 rounded-lg` sekarang redundant karena sudah jadi default. Hapus className tersebut:

Baris ~85:
```tsx
// Sebelum:
<Input placeholder="nama@email.com" className="h-10 rounded-lg" {...field} />

// Sesudah:
<Input placeholder="nama@email.com" {...field} />
```

Field password baris ~102:
```tsx
// Sebelum:
<PasswordInput placeholder="••••••••" className="h-10 rounded-lg" {...field} />

// Sesudah:
<PasswordInput placeholder="••••••••" {...field} />
```

Field confirmPassword baris ~119:
```tsx
// Sebelum:
<PasswordInput placeholder="••••••••" className="h-10 rounded-lg" {...field} />

// Sesudah:
<PasswordInput placeholder="••••••••" {...field} />
```

- [ ] **Step 5: Verifikasi TypeScript**

```bash
npx tsc --noEmit
```

Expected: tidak ada error.

- [ ] **Step 6: Commit**

```bash
git add "app/(auth)/login/page.tsx" "app/(auth)/daftar/page.tsx" "app/(auth)/forgot-password/page.tsx" "app/(auth)/reset-password/page.tsx"
git commit -m "refactor(auth): use InputWithIcon and InputWithLeadingIcon in forms"
```

---

## Task 6: Buat `PageWrapper`, `PageHeader`, `SectionCard`, `EmptyStateCard`

**Files:**
- Create: `components/ui/page-wrapper.tsx`
- Create: `components/shared/page-header.tsx`
- Create: `components/ui/section-card.tsx`
- Create: `components/ui/empty-state-card.tsx`

- [ ] **Step 1: Buat `components/ui/page-wrapper.tsx`**

```tsx
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1440px] px-5 pb-16 pt-4 md:px-8 xl:px-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Buat `components/shared/page-header.tsx`**

```tsx
import { BackNavLink } from "@/components/shared/back-nav-link";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  backHref: string;
  className?: string;
}

export function PageHeader({ title, backHref, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <BackNavLink href={backHref} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors" />
      <h1 className="mb-5 text-2xl font-semibold leading-tight tracking-[-0.01em] text-foreground md:mb-6 md:text-3xl">
        {title}
      </h1>
    </div>
  );
}
```

- [ ] **Step 3: Buat `components/ui/section-card.tsx`**

```tsx
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, icon: Icon, children, className }: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md",
        className,
      )}
    >
      <h2 className="mb-6 flex items-center gap-2 border-b border-border pb-4 text-xl font-bold text-foreground">
        {Icon && <Icon className="size-5 text-muted-foreground" />}
        {title}
      </h2>
      {children}
    </section>
  );
}
```

- [ ] **Step 4: Buat `components/ui/empty-state-card.tsx`**

```tsx
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  className?: string;
}

export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  className,
}: EmptyStateCardProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-xl rounded-xl border border-border bg-card p-8 text-center",
        className,
      )}
    >
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
        <Icon className="size-7 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-semibold text-foreground md:text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <Link
        href={ctaHref}
        className={cn(
          buttonVariants({ variant: "default", size: "xl" }),
          "mt-6 rounded-full",
        )}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
```

- [ ] **Step 5: Verifikasi TypeScript**

```bash
npx tsc --noEmit
```

Expected: tidak ada error.

- [ ] **Step 6: Commit**

```bash
git add components/ui/page-wrapper.tsx components/shared/page-header.tsx components/ui/section-card.tsx components/ui/empty-state-card.tsx
git commit -m "feat(ui/shared): add PageWrapper, PageHeader, SectionCard, EmptyStateCard"
```

---

## Task 7: Buat `OrderSummary`

**Files:**
- Create: `components/shop/order-summary.tsx`

- [ ] **Step 1: Buat `components/shop/order-summary.tsx`**

```tsx
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface OrderSummaryRow {
  label: string;
  value: React.ReactNode;
}

interface OrderSummaryProps {
  title?: string;
  rows: OrderSummaryRow[];
  totalLabel?: string;
  total: number;
  children?: React.ReactNode;
  className?: string;
}

export function OrderSummary({
  title = "Ringkasan Pesanan",
  rows,
  totalLabel = "Total",
  total,
  children,
  className,
}: OrderSummaryProps) {
  return (
    <div
      className={cn(
        "sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm",
        className,
      )}
    >
      <h2 className="mb-6 text-xl font-bold text-foreground">{title}</h2>

      <div className="mb-6 flex flex-col gap-3 border-b border-border pb-6">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-base text-muted-foreground">{row.label}</span>
            <span className="text-base font-medium text-foreground">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between">
        <span className="text-lg font-bold text-foreground">{totalLabel}</span>
        <span className="text-2xl font-bold tracking-tight text-foreground">
          {formatRupiah(total)}
        </span>
      </div>

      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
```

- [ ] **Step 2: Verifikasi TypeScript**

```bash
npx tsc --noEmit
```

Expected: tidak ada error.

- [ ] **Step 3: Commit**

```bash
git add components/shop/order-summary.tsx
git commit -m "feat(shop): add OrderSummary component"
```

---

## Task 8: Buat `AddressFields`

**Files:**
- Create: `components/shop/address-fields.tsx`

- [ ] **Step 1: Buat `components/shop/address-fields.tsx`**

```tsx
import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface AddressFormValues {
  namaPenerima: string;
  telepon: string;
  alamatLengkap: string;
  provinsi: string;
  kota: string;
  kodePos: string;
}

export const PROVINSI_OPTIONS = [
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Banten",
  "Lainnya",
] as const;

interface AddressFieldsProps {
  control: Control<AddressFormValues>;
}

export function AddressFields({ control }: AddressFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="namaPenerima"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Penerima</FormLabel>
            <FormControl>
              <Input placeholder="Nama lengkap penerima" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="telepon"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nomor Telepon</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="08xxxxxxxxxx" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="alamatLengkap"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alamat Lengkap</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Jl. Nama Jalan No. X, RT/RW, Kelurahan, Kecamatan"
                className="min-h-[80px] resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="provinsi"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Provinsi</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih provinsi" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PROVINSI_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="kota"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kota / Kabupaten</FormLabel>
            <FormControl>
              <Input placeholder="Nama kota atau kabupaten" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="kodePos"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kode Pos</FormLabel>
            <FormControl>
              <Input
                placeholder="12345"
                maxLength={5}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verifikasi TypeScript**

```bash
npx tsc --noEmit
```

Expected: tidak ada error.

- [ ] **Step 3: Commit**

```bash
git add components/shop/address-fields.tsx
git commit -m "feat(shop): add AddressFields component with shared AddressFormValues type"
```

---

## Task 9: Apply Layout Components ke Pages Shop

**Files:** `keranjang`, `pembayaran`, `pembayaran/va`, `pembayaran/berhasil`, `lacak-pesanan`

- [ ] **Step 1: Update `app/(shop)/keranjang/page.tsx`**

Tambah imports:
```tsx
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { OrderSummary, type OrderSummaryRow } from "@/components/shop/order-summary";
import { formatRupiah } from "@/lib/format";
```

Ganti outer `div` di kedua return statement dengan `<PageWrapper>`:
```tsx
// Sebelum (empty state):
<div className="mx-auto w-full max-w-[1440px] space-y-8 px-5 pb-16 pt-4 md:px-8 xl:px-10">
  <div className="mb-6"><BackNavLink href="/dashboard" /></div>
  <h2 className="mb-5 text-2xl font-semibold leading-tight tracking-[-0.01em] text-foreground md:mb-6 md:text-3xl">Keranjang Belanja</h2>
  <Card className="flex flex-col items-center justify-center border-border p-12 text-center shadow-sm">
    <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
      <ShoppingBag className="size-10 text-muted-foreground" />
    </div>
    <h2 className="mb-2 text-2xl font-semibold text-foreground">Keranjang Anda Kosong</h2>
    <p className="mb-8 text-muted-foreground">Belum ada buku di keranjang. Ayo cari buku yang Anda butuhkan di katalog kami.</p>
    <Link href="/etalase" className={cn(buttonVariants({ variant: "default" }), "h-10 px-8 rounded-lg")}>
      Mulai Belanja
    </Link>
  </Card>
</div>

// Sesudah (empty state):
<PageWrapper className="space-y-8">
  <div className="mb-6"><BackNavLink href="/dashboard" /></div>
  <h2 className="mb-5 text-2xl font-semibold leading-tight tracking-[-0.01em] text-foreground md:mb-6 md:text-3xl">Keranjang Belanja</h2>
  <EmptyStateCard
    icon={ShoppingBag}
    title="Keranjang Anda Kosong"
    description="Belum ada buku di keranjang. Ayo cari buku yang Anda butuhkan di katalog kami."
    ctaLabel="Mulai Belanja"
    ctaHref="/etalase"
  />
</PageWrapper>
```

Ganti order summary sidebar (baris ~99-129) dengan `<OrderSummary>`:
```tsx
// Sebelum:
<div className="lg:col-span-4">
  <Card className="sticky top-32 rounded-lg border-border p-6">
    <h2 className="mb-6 text-2xl font-semibold text-foreground">Ringkasan Pesanan</h2>
    <div className="mb-6 space-y-3 border-b border-border pb-6 text-base">
      <div className="flex justify-between text-muted-foreground">
        <span>Subtotal</span>
        <span className="text-foreground">{formatRupiah(subtotal)}</span>
      </div>
      <div className="flex justify-between text-muted-foreground">
        <span>Biaya Layanan</span>
        <span className="text-foreground">{formatRupiah(0)}</span>
      </div>
      <div className="flex justify-between text-muted-foreground">
        <span>Pengiriman</span>
        <span className="text-foreground">Dihitung saat pembayaran</span>
      </div>
    </div>
    <div className="mb-6 flex items-center justify-between">
      <span className="text-2xl font-semibold text-foreground">Total</span>
      <span className="text-3xl font-bold text-foreground">{formatRupiah(subtotal)}</span>
    </div>
    <Link href="/checkout" className={...}>Lanjut Checkout<ArrowRight /></Link>
    <p>...secure...</p>
  </Card>
</div>

// Sesudah:
<div className="lg:col-span-4">
  <OrderSummary
    title="Ringkasan Pesanan"
    rows={[
      { label: "Subtotal", value: formatRupiah(subtotal) },
      { label: "Biaya Layanan", value: formatRupiah(0) },
      { label: "Pengiriman", value: "Dihitung saat pembayaran" },
    ]}
    totalLabel="Total"
    total={subtotal}
    className="top-32"
  >
    <Link
      href="/checkout"
      className={cn(buttonVariants({ variant: "default", size: "xl" }), "flex w-full items-center justify-center gap-2 rounded-lg")}
    >
      Lanjut Checkout
      <ArrowRight className="size-4" />
    </Link>
    <p className="mt-3 flex items-center justify-center gap-1 text-center text-xs text-muted-foreground">
      <Lock className="size-3" />
      Pembayaran aman dan terenkripsi oleh LPPM UPNVJ.
    </p>
  </OrderSummary>
</div>
```

Ganti outer div utama dengan `<PageWrapper className="space-y-8">`.

- [ ] **Step 2: Update `app/(shop)/pembayaran/page.tsx`**

Tambah imports:
```tsx
import { PageWrapper } from "@/components/ui/page-wrapper";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { OrderSummary } from "@/components/shop/order-summary";
import { Badge } from "@/components/ui/badge";
```

Ganti outer `div` dengan `<PageWrapper>`.

Ganti header section (baris ~59-68) dengan `<PageHeader>`:
```tsx
// Sebelum:
<div className="mb-8">
  <BackNavLink href="/checkout" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors" />
  <h1 className="mb-5 text-2xl font-semibold leading-tight tracking-[-0.01em] text-foreground md:mb-6 md:text-3xl">
    Metode Pembayaran
  </h1>
</div>

// Sesudah:
<PageHeader title="Metode Pembayaran" backHref="/checkout" />
```

Ganti section kiri (baris ~73-123) dengan `<SectionCard>`:
```tsx
// Sebelum:
<section className="bg-card border border-border rounded-xl p-6 transition-shadow hover:shadow-md">
  <h2 className="mb-6 flex items-center gap-2 border-b border-border pb-4 text-xl font-bold text-foreground">
    <Landmark className="size-5 text-muted-foreground" />
    Pilih Metode Pembayaran
  </h2>
  {/* content */}
</section>

// Sesudah:
<SectionCard title="Pilih Metode Pembayaran" icon={Landmark}>
  {/* content — sama, tidak berubah */}
</SectionCard>
```

Ganti aside kanan (baris ~127-157) dengan `<OrderSummary>`:
```tsx
// Sebelum:
<aside className="w-full lg:w-[380px]">
  <div className="sticky top-24 bg-card border border-border rounded-xl p-6 shadow-sm">
    <h2 className="mb-6 text-xl font-bold text-foreground">Ringkasan Pembayaran</h2>
    <div className="mb-6 flex flex-col gap-3 border-b border-border pb-6">
      <div className="flex items-center justify-between">
        <span className="text-base text-muted-foreground">Jumlah Item</span>
        <Badge variant="secondary">{items.length}</Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-base text-muted-foreground">Subtotal</span>
        <span className="text-base font-medium text-foreground">{formatRupiah(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-base text-muted-foreground">Biaya Layanan</span>
        <span className="text-base font-medium text-foreground">{formatRupiah(biayaLayanan)}</span>
      </div>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-lg font-bold text-foreground">Total Bayar</span>
      <span className="text-2xl font-bold tracking-tight text-foreground">{formatRupiah(total)}</span>
    </div>
  </div>
</aside>

// Sesudah:
<aside className="w-full lg:w-[380px]">
  <OrderSummary
    title="Ringkasan Pembayaran"
    rows={[
      { label: "Jumlah Item", value: <Badge variant="secondary">{items.length}</Badge> },
      { label: "Subtotal", value: formatRupiah(subtotal) },
      { label: "Biaya Layanan", value: formatRupiah(biayaLayanan) },
    ]}
    totalLabel="Total Bayar"
    total={total}
  />
</aside>
```

- [ ] **Step 3: Update `app/(shop)/pembayaran/va/page.tsx`**

Tambah imports:
```tsx
import { PageWrapper } from "@/components/ui/page-wrapper";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { OrderSummary } from "@/components/shop/order-summary";
```

Ganti outer `div` dengan `<PageWrapper>` di kedua return.

Error state return — wrap error card dalam `<PageWrapper>` (tidak pakai komponen lain, card tetap sama).

Main return: ganti header dengan `<PageHeader title="Instruksi Pembayaran" backHref="/pembayaran" />`.

Ganti section kiri dengan `<SectionCard title="Nomor Akun Virtual (VA)">` (tanpa icon, konten dalam tetap sama).

Ganti aside ringkasan (baris ~145-171) dengan `<OrderSummary>`:
```tsx
<OrderSummary
  title="Ringkasan Tagihan"
  rows={[
    { label: "Status", value: <Badge variant="secondary">Menunggu Pembayaran</Badge> },
    { label: "Subtotal", value: formatRupiah(order.subtotal) },
    { label: "Biaya Layanan", value: formatRupiah(order.biayaLayanan) },
  ]}
  totalLabel="Total Bayar"
  total={order.total}
/>
```

- [ ] **Step 4: Update `app/(shop)/pembayaran/berhasil/page.tsx`**

Tambah import `PageWrapper`. Ganti outer `div` (kedua return) dengan `<PageWrapper>`.

- [ ] **Step 5: Update `app/(shop)/lacak-pesanan/page.tsx`**

Tambah imports:
```tsx
import { PageWrapper } from "@/components/ui/page-wrapper";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
```

Ganti outer `div` di kedua return dengan `<PageWrapper>`.

Ganti empty state return (baris ~59-83):
```tsx
// Sebelum:
<div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-8 text-center">
  <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
    <ClipboardList className="size-7 text-muted-foreground" />
  </div>
  <h1 className="text-2xl font-semibold text-foreground md:text-3xl">Belum Ada Pesanan</h1>
  <p className="mt-2 text-sm text-muted-foreground">Pesanan Anda akan muncul di sini setelah proses checkout selesai.</p>
  <Link href="/etalase" className={cn(buttonVariants({ variant: "default" }), "mt-6 h-12 rounded-full px-8 font-semibold text-base")}>
    Mulai Belanja
  </Link>
</div>

// Sesudah:
<EmptyStateCard
  icon={ClipboardList}
  title="Belum Ada Pesanan"
  description="Pesanan Anda akan muncul di sini setelah proses checkout selesai."
  ctaLabel="Mulai Belanja"
  ctaHref="/etalase"
/>
```

- [ ] **Step 6: Verifikasi TypeScript**

```bash
npx tsc --noEmit
```

Expected: tidak ada error.

- [ ] **Step 7: Commit**

```bash
git add "app/(shop)/keranjang/page.tsx" "app/(shop)/pembayaran/page.tsx" "app/(shop)/pembayaran/va/page.tsx" "app/(shop)/pembayaran/berhasil/page.tsx" "app/(shop)/lacak-pesanan/page.tsx"
git commit -m "refactor(shop): apply PageWrapper, SectionCard, EmptyStateCard, OrderSummary to pages"
```

---

## Task 10: Apply `AddressFields` ke `checkout` dan `profil`

**Files:** `app/(shop)/checkout/page.tsx`, `app/(shop)/profil/page.tsx`

- [ ] **Step 1: Update `app/(shop)/checkout/page.tsx`**

Tambah import:
```tsx
import { AddressFields, type AddressFormValues, PROVINSI_OPTIONS } from "@/components/shop/address-fields";
import { PageWrapper } from "@/components/ui/page-wrapper";
```

Hapus `PROVINSI_OPTIONS` lokal (baris 56-64) — sudah dipindah ke `address-fields.tsx`.

Ubah tipe form dari `AddressInput` menjadi `AddressFormValues`:
```tsx
// Sebelum:
const manualForm = useForm<AddressInput>({...})

// Sesudah — AddressInput tetap ada untuk Zod schema, tapi form ditype sebagai AddressFormValues:
const manualForm = useForm<AddressFormValues>({
  resolver: zodResolver(addressSchema),
  defaultValues: {
    namaPenerima: "",
    telepon: "",
    alamatLengkap: "",
    provinsi: "",
    kota: "",
    kodePos: "",
  },
})
```

Di dalam Sheet form (form manual), ganti 6 `<FormField>` block alamat dengan satu baris:
```tsx
// Sebelum: 6 blok FormField inline (nama, telepon, alamat, provinsi, kota, kodePos)

// Sesudah:
<AddressFields control={manualForm.control} />
```

Lakukan hal yang sama untuk form edit alamat jika ada Sheet terpisah untuk edit.

Ganti outer `div` utama halaman dengan `<PageWrapper>`.

- [ ] **Step 2: Update `app/(shop)/profil/page.tsx`**

Tambah import:
```tsx
import { AddressFields, type AddressFormValues, PROVINSI_OPTIONS } from "@/components/shop/address-fields";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { PageHeader } from "@/components/shared/page-header";
```

Hapus `PROVINSI_OPTIONS` lokal dari profil jika ada.

Ubah form alamat untuk memakai `AddressFormValues` sebagai tipe.

Di dalam Sheet form tambah alamat, ganti 6 FormField alamat dengan:
```tsx
<AddressFields control={addressForm.control} />
```

Di dalam Sheet form edit alamat, lakukan hal yang sama.

Ganti outer `div` dengan `<PageWrapper>`.

- [ ] **Step 3: Verifikasi TypeScript**

```bash
npx tsc --noEmit
```

Expected: tidak ada error.

- [ ] **Step 4: Commit**

```bash
git add "app/(shop)/checkout/page.tsx" "app/(shop)/profil/page.tsx"
git commit -m "refactor(shop): use AddressFields component in checkout and profil forms"
```

---

## Task 11: Final Build Check

- [ ] **Step 1: Jalankan full TypeScript check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 2: Jalankan build**

```bash
npm run build
```

Expected: Build sukses, tidak ada error. Warning tentang `img` element boleh diabaikan (sudah ada sebelumnya).

- [ ] **Step 3: Verifikasi visual di browser**

Jalankan dev server:
```bash
npm run dev
```

Cek halaman-halaman berikut:
- `/login` — form email + password punya icon, button tinggi konsisten
- `/daftar` — 4 field, semua icon & height seragam
- `/dashboard` — hero button tinggi konsisten
- `/etalase` — product card & sorting berfungsi
- `/etalase/[id]` — tombol "Tambah ke Keranjang" & "Bagikan" seragam
- `/keranjang` — empty state tampil, order summary sidebar tampil
- `/checkout` — form alamat 6 field seragam
- `/pembayaran` — SectionCard & OrderSummary tampil
- `/pembayaran/va` — SectionCard & OrderSummary tampil
- `/pembayaran/berhasil` — tombol seragam
- `/lacak-pesanan` — empty state tampil, tombol seragam
- `/profil` — form alamat 6 field seragam di Sheet
