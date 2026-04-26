# Design: Reusable Component Extraction

**Date:** 2026-04-27  
**Status:** Approved  
**Scope:** Extract repeated UI patterns across `app/` pages into shared reusable components

---

## Problem

Scanning all pages under `app/(shop)/` and `app/(auth)/` revealed the following redundancies:

| Pattern | Pages | Issue |
|---|---|---|
| Outer container `max-w-[1440px]` + padding | 6+ halaman | Copy-paste, sulit diubah serentak |
| BackNavLink + h1 page title | 4 halaman | Tidak konsisten margin/style |
| Rounded-xl card dengan icon + divider header | `pembayaran`, `pembayaran/va` | Duplikat |
| Empty state (icon circle + title + desc + CTA) | `keranjang`, `lacak-pesanan` | Duplikat |
| Order summary sidebar (rows + total) | `keranjang`, `pembayaran`, `pembayaran/va` | Struktur sama, data berbeda |
| Address form fields (6 field) | `profil`, `checkout` | Label & validasi tidak seragam |
| Icon + Input pattern (`div.relative` + icon absolute) | semua form | Boilerplate 5 baris diulang per field |
| `DISCOUNT_BY_BOOK_ID` constant | `etalase`, `etalase/[id]` | Hardcode duplikat |
| Button sizes (h-10, h-11, h-12 inline override) | semua halaman | Tidak ada size variant standar |

---

## Architecture

### Folder Structure

```
components/
  ui/
    button.tsx          ← UPDATE: tambah size md, lg, xl
    input.tsx           ← UPDATE: tambah InputWithIcon
    page-wrapper.tsx    ← BARU
    section-card.tsx    ← BARU
    empty-state-card.tsx ← BARU

  shared/
    back-nav-link.tsx   ← TETAP
    page-header.tsx     ← BARU

  shop/
    order-summary.tsx   ← BARU
    address-fields.tsx  ← BARU

lib/
  discounts.ts          ← BARU
```

### Placement Rules
- **`components/ui/`** — primitif desain murni: stateless, no business logic, no app-specific routes. Bisa dipakai di proyek manapun.
- **`components/shared/`** — pola app-specific yang dipakai lintas domain (tahu tentang navigasi LPPM).
- **`components/shop/`** — komposisi domain belanja (tahu tentang alur order, address).
- **`lib/`** — konstanta & data shared non-UI.

---

## Component Specifications

### 1. `button.tsx` — Size Variants

Tambah 3 size baru ke `buttonVariants`. Semua halaman WAJIB pakai size variant ini; tidak boleh ada `className="h-10"` atau `className="h-12"` inline.

| Size | Height | Padding X | Padding Y | Font | Penggunaan khas |
|---|---|---|---|---|---|
| `sm` (existing) | h-7 | px-2.5 | — | 0.8rem | Aksi kecil |
| `default` (existing) | h-8 | px-2.5 | — | sm | Button reguler |
| `md` (baru) | h-10 | px-4 | py-2 | sm | Form submit (login, daftar) |
| `lg` (baru) | h-11 | px-6 | py-2.5 | base | Section CTA |
| `xl` (baru) | h-12 | px-8 | py-3 | base | Primary full-width CTA |

**Setelah update:** audit semua halaman dan ganti inline height override ke variant yang sesuai.

---

### 2. `input.tsx` — InputWithIcon

Tambah export `InputWithIcon` ke file yang sudah ada.

```tsx
// Props
interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ElementType;  // Lucide icon component
  className?: string;
}
```

Mengurus: `div.relative`, positioning icon absolut, dan `pl-10` pada input. Semua form field yang punya icon leading pakai ini.

---

### 3. `page-wrapper.tsx` — PageWrapper

Outer container standar untuk semua halaman shop.

```tsx
// Props
interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}
// Output: div dengan mx-auto w-full max-w-[1440px] px-5 pb-16 pt-4 md:px-8 xl:px-10
```

**Dipakai di:** `keranjang`, `checkout`, `pembayaran`, `pembayaran/va`, `pembayaran/berhasil`, `lacak-pesanan`, `etalase/[id]`

---

### 4. `section-card.tsx` — SectionCard

Card dengan header berisi icon + judul + garis bawah, dipakai sebagai section container.

```tsx
// Props
interface SectionCardProps {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}
// Output: section.bg-card.border.rounded-xl.p-6 + h2 dengan icon + border-b
```

**Dipakai di:** `pembayaran`, `pembayaran/va`

---

### 5. `empty-state-card.tsx` — EmptyStateCard

Centered state ketika data kosong: icon dalam lingkaran + judul + deskripsi + tombol CTA.

```tsx
// Props
interface EmptyStateCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  className?: string;
}
```

**Dipakai di:** `keranjang` (keranjang kosong), `lacak-pesanan` (belum ada pesanan)

---

### 6. `page-header.tsx` — PageHeader

Kombinasi `BackNavLink` + `<h1>` dengan styling yang konsisten.

```tsx
// Props
interface PageHeaderProps {
  title: string;
  backHref: string;
  className?: string;
}
```

**Dipakai di:** `keranjang`, `pembayaran`, `pembayaran/va`, `profil`

---

### 7. `order-summary.tsx` — OrderSummary

Sticky sidebar card untuk ringkasan pesanan. Fleksibel: menerima array baris yang dapat dikustomisasi per halaman.

```tsx
// Props
interface OrderSummaryRow {
  label: string;
  value: React.ReactNode;  // string, badge, atau elemen lain
}

interface OrderSummaryProps {
  title?: string;            // default: "Ringkasan Pesanan"
  rows: OrderSummaryRow[];
  totalLabel?: string;       // default: "Total"
  total: number;             // nilai dalam rupiah, diformat otomatis
  children?: React.ReactNode; // slot untuk CTA button di bawah total
}
```

**Struktur baris per halaman:**

| Halaman | Baris |
|---|---|
| `keranjang` | Subtotal, Biaya Layanan, Pengiriman (teks) |
| `pembayaran` | Jumlah Item (badge), Subtotal, Biaya Layanan |
| `pembayaran/va` | Status (badge), Subtotal, Biaya Layanan |

**Dipakai di:** `keranjang`, `pembayaran`, `pembayaran/va`

---

### 8. `address-fields.tsx` — AddressFields

Komposisi 6 field alamat yang dipakai di `profil` (manage saved addresses) dan `checkout` (select + add address). Menerima RHF `control` sebagai prop; state management tetap di halaman masing-masing.

```tsx
// Tipe address yang di-export agar halaman dapat meng-include ke schema mereka
export interface AddressFormValues {
  namaPenerima: string;
  telepon: string;
  alamatLengkap: string;
  provinsi: string;
  kota: string;
  kodePos: string;
}

// Props — halaman cukup passing control dari useForm yang schema-nya include AddressFormValues
interface AddressFieldsProps {
  control: Control<AddressFormValues>;
}
```

Field yang distandarisasi (label, placeholder, urutan):
1. Nama Penerima (`namaPenerima`) — text input
2. Nomor Telepon (`telepon`) — text input, type="tel"
3. Alamat Lengkap (`alamatLengkap`) — textarea
4. Provinsi (`provinsi`) — select
5. Kota/Kabupaten (`kota`) — text input
6. Kode Pos (`kodePos`) — text input, maxLength=5

---

### 9. `lib/discounts.ts` — DISCOUNT_BY_BOOK_ID

Pindahkan konstanta duplikat ke shared lib.

```ts
export const DISCOUNT_BY_BOOK_ID: Record<string, { originalPrice: number; discountLabel: string }> = {
  "book-2": { originalPrice: 155000, discountLabel: "Diskon 23%" },
  "book-8": { originalPrice: 275000, discountLabel: "Diskon 20%" },
};
```

**Dipakai di:** `etalase/page.tsx`, `etalase/[id]/page.tsx`

---

## Implementation Order

1. `lib/discounts.ts` — paling aman, tidak ada dependensi UI
2. `button.tsx` — update size variants + audit semua halaman
3. `input.tsx` — tambah InputWithIcon + update semua form field
4. `page-wrapper.tsx` + `page-header.tsx` — layout primitives
5. `empty-state-card.tsx` + `section-card.tsx` — UI cards
6. `order-summary.tsx` — shop domain
7. `address-fields.tsx` — shop domain, paling kompleks

---

## Constraints

- Tidak mengubah logika state management di halaman manapun
- Tidak mengubah skema Zod validasi yang sudah ada
- Tidak menambah/membuang halaman — hanya refactor komponen
- Setiap komponen baru harus TypeScript-safe (tidak ada `any`)
- `form.tsx` tidak diubah — sudah seragam dan dipakai semua halaman
