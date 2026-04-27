"use client";

import { ChevronLeft, ChevronRight, Info, Share, ShoppingCart, User, X } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { BackNavLink } from "@/components/shared/back-nav-link";
import { BookTypeIcon } from "@/components/shop/book-type-icon";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";
import { buildBookImageGallery } from "@/lib/mock-content";
import { useCartStore } from "@/stores/cart-store";
import { useCatalogStore } from "@/stores/catalog-store";
import { DISCOUNT_BY_BOOK_ID } from "@/lib/discounts";

export default function BookDetailsPage() {
  const params = useParams();
  const bookId = params.id as string;
  const book = useCatalogStore((state) => state.getBookById(bookId));
  const allBooks = useCatalogStore((state) => state.books);
  const addItem = useCartStore((state) => state.addItem);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!book) {
    return notFound();
  }

  const discount = DISCOUNT_BY_BOOK_ID[book.id];
  const hasDiscount = Boolean(discount?.originalPrice && discount.originalPrice > book.harga);

  const onAddToCart = () => {
    addItem(book);
  };

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: book.judul,
          text: `Cek buku ${book.judul} di LPPM UPNVJ`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link berhasil disalin ke clipboard!");
      }
    } catch (err) {
      console.error("Gagal membagikan:", err);
    }
  };

  const otherBooks = allBooks.filter((b) => b.id !== book.id);
  const discountedBooks = otherBooks.filter(b => DISCOUNT_BY_BOOK_ID[b.id]);
  const normalBooks = otherBooks.filter(b => !DISCOUNT_BY_BOOK_ID[b.id]);
  
  const recommendations = [
    ...discountedBooks.slice(0, 1),
    ...normalBooks.slice(0, 5)
  ];

  // Simulasi jika ada banyak gambar (jika backend mengirimkan book.images)
  const bookImages: string[] =
    (book as { images?: string[] }).images ?? buildBookImageGallery(book.coverUrl);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === bookImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? bookImages.length - 1 : prev - 1));
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-4 md:px-8 xl:px-10">
      <div className="mb-6">
        <BackNavLink href="/etalase" className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors" />
      </div>

      <div className="flex flex-col gap-12 w-full">
        {/* Top Section: Centered Cover & CTA */}
        <section className="flex flex-col items-center text-center max-w-4xl mx-auto w-full">
          <div className="mb-8 w-full max-w-[400px] aspect-[2/3] rounded-xl shadow-xl overflow-hidden border border-border bg-muted relative group">
            <img 
              src={bookImages[currentImageIndex]} 
              alt={`${book.judul} - Gambar ${currentImageIndex + 1}`} 
              onClick={() => setIsModalOpen(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02] cursor-pointer" 
            />
            
            {hasDiscount ? (
              <div className="absolute left-4 top-4 rounded-full bg-rose-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm z-10">
                {discount.discountLabel}
              </div>
            ) : null}

            {/* Slider Controls */}
            {bookImages.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                  aria-label="Gambar sebelumnya"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                  aria-label="Gambar berikutnya"
                >
                  <ChevronRight className="size-5" />
                </button>

                {/* Slider Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                  {bookImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`Ke gambar ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <BookTypeIcon type={book.kategori} className="size-3.5 shrink-0 align-middle" />
              {book.kategori}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2 tracking-tight">
            {book.judul}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Oleh <a href="#" className="text-primary hover:underline font-medium">{book.penulis}</a>
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-3xl font-bold text-foreground">{formatRupiah(book.harga)}</span>
            {hasDiscount ? (
              <span className="text-lg text-muted-foreground line-through">{formatRupiah(discount.originalPrice)}</span>
            ) : null}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button onClick={onAddToCart} size="lg" className="px-8 font-medium flex items-center justify-center gap-2 min-w-[200px] text-base py-5">
              <ShoppingCart className="size-5" />
              Tambah ke Keranjang
            </Button>
            <Button variant="outline" size="lg" onClick={onShare} className="px-8 py-5 font-medium flex items-center justify-center gap-2 min-w-[200px] text-base hover:bg-slate-50">
              <Share className="size-5" />
              Bagikan
            </Button>
          </div>
        </section>

        {/* Full Width Synopsis */}
        <section className="w-full bg-slate-50 rounded-xl p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-4">Sinopsis</h2>
          <div className="w-full text-base text-muted-foreground space-y-4 max-w-full leading-relaxed">
            <p>
              Buku komprehensif ini membahas berbagai metode penelitian kuantitatif maupun kualitatif dalam konteks studi spesifik.
              Menyajikan wawasan mendalam dan instrumen yang tepat bagi mahasiswa serta peneliti di kalangan akademik.
            </p>
            <p>
              Topik-topik penting yang dibahas termasuk penyusunan proposal penelitian, etika riset, rancangan survei lanjutan, serta berbagai teknik komputasional dan statistik menggunakan perangkat lunak terkini. Penulis memberikan sudut pandang berdasarkan pengalaman lapangan selama bertahun-tahun di berbagai wilayah.
            </p>
          </div>
        </section>

        {/* Details & Author Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Product Details */}
          <div className="bg-card rounded-xl p-8 border border-border h-full shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Info className="size-5 text-primary" />
              Detail Produk
            </h2>
            <div className="grid grid-cols-2 gap-y-4 text-base">
              <div className="text-muted-foreground">ISBN-13</div>
              <div className="text-foreground font-medium">978-602-1234-56-7</div>
              
              <div className="text-muted-foreground">Penerbit</div>
              <div className="text-foreground font-medium">LPPM UPNVJ Press</div>
              
              <div className="text-muted-foreground">Tanggal Terbit</div>
              <div className="text-foreground font-medium">Oktober 2023</div>
              
              <div className="text-muted-foreground">Bahasa</div>
              <div className="text-foreground font-medium">Indonesia</div>
              
              <div className="text-muted-foreground">Jumlah Halaman</div>
              <div className="text-foreground font-medium">342</div>
              
              <div className="text-muted-foreground">Dimensi</div>
              <div className="text-foreground font-medium">15.5 x 23 cm</div>
            </div>
          </div>

          {/* About the Author */}
          <div className="bg-card rounded-xl p-8 border border-border h-full flex flex-col items-start shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <User className="size-5 text-primary" />
              Tentang Penulis
            </h2>
            <div className="flex items-start gap-4 mb-4 w-full">
              <div className="w-20 h-20 rounded-full bg-slate-300 overflow-hidden border border-border shrink-0 flex items-center justify-center text-slate-500 font-bold text-2xl">
                {book.penulis.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">{book.penulis}</h3>
                <p className="text-base font-semibold text-foreground mt-1">Fakultas Sains, UPN Veteran Jakarta</p>
              </div>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed">
              {book.penulis} memiliki gelar Ph.D dan memiliki pengalaman lebih dari belasan tahun di bidang riset dan kajian strategis. Beliau memimpin berbagai studi dan aktif dalam pengabdian kepada masyarakat di berbagai wilayah.
            </p>
            <button className="mt-auto pt-6 text-primary font-medium hover:underline flex items-center gap-1 self-start">
              Lihat karya lain dari penulis ini
            </button>
          </div>
        </section>
      </div>

      {/* Rekomendasi Buku Lainnya */}
      <section className="mt-20 border-t border-border pt-12 w-full">
        <h2 className="text-2xl font-bold text-foreground mb-8">Rekomendasi Buku Lainnya</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {recommendations.map((rec) => {
            const recDiscount = DISCOUNT_BY_BOOK_ID[rec.id];
            return (
              <ProductCard
                key={rec.id}
                book={rec}
                imageUrl={rec.coverUrl}
                meta={rec.kategori}
                originalPrice={recDiscount?.originalPrice}
                discountLabel={recDiscount?.discountLabel}
              />
            );
          })}
        </div>
      </section>

      {/* Lightbox / Modal View */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 sm:p-10 backdrop-blur-sm">
          <div className="absolute right-4 top-4 sm:right-8 sm:top-8 z-50">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Tutup tampilan gambar"
            >
              <X className="size-6" />
            </button>
          </div>
          
          <div className="relative w-full max-w-5xl flex flex-col items-center justify-center">
            <img 
              src={bookImages[currentImageIndex]} 
              alt={`${book.judul} - Gambar ${currentImageIndex + 1}`} 
              className="max-w-full max-h-[85vh] object-contain select-none"
            />
            
            {bookImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-0 sm:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
                  aria-label="Gambar sebelumnya"
                >
                  <ChevronLeft className="size-8" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-0 sm:-right-12 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
                  aria-label="Gambar berikutnya"
                >
                  <ChevronRight className="size-8" />
                </button>
              </>
            )}
          </div>
          
          {/* Indicators for Lightbox */}
          {bookImages.length > 1 && (
            <div className="absolute bottom-6 flex items-center gap-2">
              {bookImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentImageIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Ke gambar ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
