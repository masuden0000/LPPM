import type { Book } from "@/lib/types";

export const BOOK_LIST: Book[] = [
  {
    id: "book-1",
    judul: "Pengantar Ilmu Komputer",
    penulis: "J. Glenn Brookshear",
    harga: 150000,
    stok: 12,
    coverUrl: "/books/book-1.webp",
    kategori: "Teknologi",
  },
  {
    id: "book-2",
    judul: "Dasar-Dasar Manajemen Bisnis",
    penulis: "M. K. Hartono",
    harga: 120000,
    stok: 8,
    coverUrl: "/books/book-2.webp",
    kategori: "Bisnis",
  },
  {
    id: "book-3",
    judul: "Kimia: Pendekatan Molekuler",
    penulis: "N. Tro",
    harga: 180000,
    stok: 5,
    coverUrl: "/books/book-3.webp",
    kategori: "Sains",
  },
  {
    id: "book-4",
    judul: "Prinsip Desain Teknik",
    penulis: "A. M. Firman",
    harga: 200000,
    stok: 7,
    coverUrl: "/books/book-4.webp",
    kategori: "Teknik",
  },
  {
    id: "book-5",
    judul: "Strategi Pemasaran Digital (E-Book)",
    penulis: "K. R. Satria",
    harga: 80000,
    stok: 20,
    coverUrl: "/books/book-5.webp",
    kategori: "Bisnis",
  },
  {
    id: "book-6",
    judul: "Struktur Data dan Algoritma",
    penulis: "S. Malik",
    harga: 165000,
    stok: 7,
    coverUrl: "/books/book-6.webp",
    kategori: "Teknologi",
  },
  {
    id: "book-7",
    judul: "Ilmu Lingkungan",
    penulis: "R. Cunningham",
    harga: 145000,
    stok: 10,
    coverUrl: "/books/book-3.webp",
    kategori: "Sains",
  },
  {
    id: "book-8",
    judul: "Buku Pegangan Teknik Mesin",
    penulis: "M. Affandi",
    harga: 220000,
    stok: 6,
    coverUrl: "/books/book-3.webp",
    kategori: "Teknik",
  },
  {
    id: "book-9",
    judul: "Sastra Nusantara Kontemporer",
    penulis: "D. Prawira",
    harga: 135000,
    stok: 11,
    coverUrl: "/books/book-3.webp",
    kategori: "Sastra",
  },
  {
    id: "book-10",
    judul: "Menulis Novel untuk Pemula",
    penulis: "L. Yasmine",
    harga: 110000,
    stok: 14,
    coverUrl: "/books/book-3.webp",
    kategori: "Novel",
  },
  {
    id: "book-11",
    judul: "Sejarah Dunia Modern",
    penulis: "H. Prakoso",
    harga: 140000,
    stok: 9,
    coverUrl: "/books/book-3.webp",
    kategori: "Sejarah",
  },
  {
    id: "book-12",
    judul: "Psikologi Perilaku Sehari-hari",
    penulis: "A. Larasati",
    harga: 128000,
    stok: 13,
    coverUrl: "/books/book-3.webp",
    kategori: "Psikologi",
  },
];

export const UI_IMAGE_ASSETS = {
  dashboard: {
    heroSlides: [
      {
        title: "Wawasan riset kini lebih mudah dijelajahi dan dikoleksi.",
        description:
          "Jelajahi jurnal ilmiah, buku ajar dosen, dan laporan riset dari LPPM UPN Veteran Jakarta dalam satu etalase.",
        imageUrl:
          "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80&fm=webp",
      },
      {
        title: "Publikasi kampus pilihan dengan alur jelajah yang lebih rapi dan modern.",
        description:
          "Temukan terbitan unggulan, karya dosen, dan referensi akademik lebih cepat lewat etalase yang fokus pada konten.",
        imageUrl:
          "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80&fm=webp",
      },
      {
        title: "Jurnal, laporan, dan buku tersusun dalam satu pengalaman etalase.",
        description:
          "Telusuri publikasi terbaru, koleksi unggulan, dan penawaran terbatas tanpa berpindah antar tampilan katalog.",
        imageUrl:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80&fm=webp",
      },
    ],
    disciplineImage:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1400&q=80&fm=webp",
    cardImages: [
      "/books/book-3.webp",
      "/books/book-4.webp",
      "/books/book-5.webp",
      "/books/book-6.webp",
      "/books/book-7.webp",
    ],
    productMeta: ["Jurnal", "Buku Ajar", "Laporan", "Monograf", "Prosiding"],
  },
  bookDetail: {
    fallbackGalleryImages: [
      "/books/book-8.webp",
      "/books/book-5.webp",
    ],
  },
} as const;

export const AUTH_BRANDING_ASSETS = {
  backgroundImageUrl: "/images/universitas.webp",
  campusIconBasePaths: ["/icon_campus", "/images/icon_campus"],
  campusIconExtensions: ["png", "svg", "webp", "jpg", "jpeg", "ico"],
} as const;

export function buildBookImageGallery(
  coverUrl: string,
  additionalImages: readonly string[] = UI_IMAGE_ASSETS.bookDetail.fallbackGalleryImages
): string[] {
  // Keep gallery unique while preserving order.
  return [...new Set([coverUrl, ...additionalImages])];
}

export function getCampusIconSources(): string[] {
  return AUTH_BRANDING_ASSETS.campusIconBasePaths.flatMap((basePath) =>
    AUTH_BRANDING_ASSETS.campusIconExtensions.map((ext) => `${basePath}.${ext}`)
  );
}
