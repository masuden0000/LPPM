"use client";

import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { UI_IMAGE_ASSETS } from "@/lib/mock-content";
import { useCatalogStore } from "@/stores/catalog-store";

const HERO_SLIDES = UI_IMAGE_ASSETS.dashboard.heroSlides;
const DISCIPLINE_IMAGE = UI_IMAGE_ASSETS.dashboard.disciplineImage;
const CARD_IMAGES = UI_IMAGE_ASSETS.dashboard.cardImages;
const PRODUCT_META = UI_IMAGE_ASSETS.dashboard.productMeta;

export default function DashboardPage() {
  const books = useCatalogStore((state) => state.books);
  const featuredBooks = books.slice(0, 5);
  const [activeSlide, setActiveSlide] = useState(0);
  const currentSlide = HERO_SLIDES[activeSlide];

  useEffect(() => {
    // Auto-rotate every 3 seconds so the hero behaves like a lightweight slider.
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="-mt-6 md:-mt-8">
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-4 md:px-8 md:pb-16 md:pt-8 xl:px-10">
        <section className="mb-14 md:mb-20">
          <article className="relative overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-slate-950 p-6 text-white shadow-[0_28px_80px_-34px_rgba(15,23,42,0.75)] md:p-8 lg:p-10">
            {/* Switch the hero image based on the active index instead of rendering a separate slider library. */}
            <div className="absolute inset-0 opacity-60 transition-all duration-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentSlide.imageUrl}
                alt="Komunitas riset dan publikasi akademik"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(2,6,23,0.92)_5%,rgba(2,6,23,0.78)_38%,rgba(2,6,23,0.48)_60%,rgba(2,6,23,0.1)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.16),transparent_28%)]" />

            <div className="relative z-10 flex h-full min-h-0 flex-col justify-end overflow-hidden gap-5 md:gap-6">
              <div className="max-w-[680px] overflow-hidden">
                <h1 className="line-clamp-2 max-w-[520px] text-3xl font-semibold leading-tight tracking-[-0.03em] text-white md:max-w-[560px] md:text-4xl lg:max-w-[620px] lg:text-[2.5rem]">
                  {currentSlide.title}
                </h1>

                <p className="mt-4 line-clamp-2 max-w-[480px] text-sm leading-6 text-slate-200 md:max-w-[520px] md:text-base">
                  {currentSlide.description}
                </p>

                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="h-11 rounded-full border-white/25 bg-white/8 px-5 text-white hover:bg-white/14 hover:text-white"
                  >
                    Lihat Detail
                    <ArrowUpRight className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 border-t border-white/10 pt-5">
                {HERO_SLIDES.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={
                      index === activeSlide
                        ? "h-2.5 w-7 rounded-full bg-white transition-all"
                        : "h-2.5 w-2.5 rounded-full bg-white/35 transition-all hover:bg-white/60"
                    }
                    aria-label={`Pilih slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </article>
        </section>

        <section className="mb-14 md:mb-20">
          <h2 className="mb-5 text-2xl font-semibold leading-tight tracking-[-0.01em] text-foreground md:mb-6 md:text-3xl">
            Disiplin Pilihan
          </h2>
          <div className="grid h-auto grid-cols-12 gap-4 md:h-[500px] md:gap-6">
            <article className="relative col-span-12 row-span-2 overflow-hidden rounded-xl border border-border bg-background/80 p-6 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05),0px_4px_6px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm md:col-span-8 md:p-8">
              <div className="absolute inset-0 opacity-55">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={DISCIPLINE_IMAGE}
                  alt="Buku akademik dalam nuansa slate elegan"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              <div className="relative z-10 flex h-full flex-col justify-end">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Seri Unggulan
                </p>
                <h3 className="mb-2 text-xl font-semibold tracking-[-0.01em] text-foreground md:text-2xl">
                  Jurnal Ilmiah
                </h3>
                <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                  Publikasi telaah sejawat yang mencakup ilmu kesehatan, teknik,
                  dan ilmu sosial.
                </p>
              </div>
            </article>

            <article className="col-span-12 flex flex-col justify-between rounded-xl border border-border bg-background/80 p-5 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05),0px_4px_6px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm md:col-span-4 md:p-6">
              <div className="mb-5 flex items-start justify-between">
                <BookOpenText className="size-8 text-muted-foreground" />
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.01em] text-foreground">
                  Buku Ajar
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">Ditulis oleh para ahli dosen.</p>
              </div>
            </article>

            <article className="col-span-12 flex flex-col justify-between rounded-xl border border-border bg-background/80 p-5 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05),0px_4px_6px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm md:col-span-4 md:p-6">
              <div className="mb-5 flex items-start justify-between">
                <FileText className="size-8 text-muted-foreground" />
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.01em] text-foreground">
                  Laporan Riset
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">Temuan tahunan dan studi kasus.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="mb-10 md:mb-12">
          <div className="mb-5 flex flex-col gap-2 border-b border-border pb-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-semibold leading-tight tracking-[-0.01em] text-foreground md:text-3xl">
              Publikasi Terbaru
            </h2>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Lihat Katalog Lengkap
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 xl:grid-cols-5">
            {featuredBooks.map((book, idx) => (
              <ProductCard
                key={book.id}
                book={book}
                imageUrl={CARD_IMAGES[idx % CARD_IMAGES.length]}
                meta={PRODUCT_META[idx % PRODUCT_META.length]}
                originalPrice={idx === 1 ? 155000 : undefined}
                discountLabel={idx === 1 ? "Diskon 23%" : undefined}
              />
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-4 px-5 py-10 md:flex-row md:px-8 xl:px-10">
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold tracking-[-0.01em] text-foreground">LPPM UPNVJ STORE</p>
            <p className="mt-1 text-xs text-muted-foreground">
              (c) 2026 LPPM UPN Veteran Jakarta. Keunggulan Akademik dan Inovasi.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground">
              Kebijakan Privasi
            </Link>
            <Link href="/dashboard" className="hover:text-foreground">
              Syarat Layanan
            </Link>
            <Link href="/dashboard" className="hover:text-foreground">
              Repositori Riset
            </Link>
            <Link href="/dashboard" className="hover:text-foreground">
              Hubungi Dukungan
            </Link>
          </div>
        </div>
      </footer>
    </section>
  );
}
