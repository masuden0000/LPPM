"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  FileText,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";
import type { Book } from "@/lib/types";
import { useCartStore } from "@/stores/cart-store";
import { useCatalogStore } from "@/stores/catalog-store";

const HERO_SLIDES = [
  {
    title: "Research knowledge, now easier to browse and collect.",
    description:
      "Explore scientific journals, faculty textbooks, and research reports from LPPM UPN Veteran Jakarta in one storefront.",
    imageUrl:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80&fm=webp",
  },
  {
    title: "Curated campus publications with a cleaner and more modern browsing flow.",
    description:
      "Find highlighted releases, faculty works, and academic references faster with a storefront that stays focused on content.",
    imageUrl:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80&fm=webp",
  },
  {
    title: "Journals, reports, and books arranged in a single storefront experience.",
    description:
      "Browse recent publications, spotlight collections, and limited offers without jumping between separate catalog views.",
    imageUrl:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80&fm=webp",
  },
] as const;

const DISCIPLINE_IMAGE =
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1400&q=80&fm=webp";

const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80&fm=webp",
  "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80&fm=webp",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80&fm=webp",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80&fm=webp",
  "https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=900&q=80&fm=webp",
];

const PRODUCT_META = ["Journal", "Textbook", "Report", "Monograph", "Proceeding"];

function ProductCard({
  book,
  imageUrl,
  meta,
  originalPrice,
  discountLabel,
}: {
  book: Book;
  imageUrl: string;
  meta: string;
  originalPrice?: number;
  discountLabel?: string;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const hasDiscount = Boolean(originalPrice && originalPrice > book.harga);

  const onAdd = () => {
    const result = addItem(book);
    if (result.ok) toast.success(result.message);
    else toast.error(result.message);
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05),0px_4px_6px_-4px_rgba(0,0,0,0.05)]">
      <div className="relative aspect-[3/4] overflow-hidden border-b border-border bg-muted/40 p-6">
        {/* The image stays full-bleed so each book card still reads like a product tile. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={book.judul}
          className="h-full w-full object-cover shadow-md transition-transform duration-300 hover:scale-[1.03]"
        />
        {hasDiscount ? (
          <div className="absolute left-4 top-4 rounded-full bg-rose-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
            {discountLabel ?? "Special Offer"}
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-3 inline-flex w-fit rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          {meta}
        </span>
        <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-tight tracking-[-0.01em] text-foreground">
          {book.judul}
        </h3>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">{book.penulis}</p>
        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex gap-2 items-center">
            <p className="text-sm font-bold text-foreground">{formatRupiah(book.harga)}</p>
            {hasDiscount ? (
              <p className="text-xs text-muted-foreground line-through">
                {formatRupiah(originalPrice ?? book.harga)}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            aria-label={`Tambah ${book.judul} ke keranjang`}
          >
            <ShoppingCart className="size-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

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
                alt="Research community and academic publications"
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
            Curated Disciplines
          </h2>
          <div className="grid h-auto grid-cols-12 gap-4 md:h-[500px] md:gap-6">
            <article className="relative col-span-12 row-span-2 overflow-hidden rounded-xl border border-border bg-background/80 p-6 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05),0px_4px_6px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm md:col-span-8 md:p-8">
              <div className="absolute inset-0 opacity-55">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={DISCIPLINE_IMAGE}
                  alt="Academic books in elegant slate palette"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              <div className="relative z-10 flex h-full flex-col justify-end">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Featured Series
                </p>
                <h3 className="mb-2 text-xl font-semibold tracking-[-0.01em] text-foreground md:text-2xl">
                  Scientific Journals
                </h3>
                <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                  Peer-reviewed publications spanning health sciences, engineering,
                  and social studies.
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
                  Textbooks
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">Authored by faculty experts.</p>
              </div>
            </article>

            <article className="col-span-12 flex flex-col justify-between rounded-xl border border-border bg-background/80 p-5 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05),0px_4px_6px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm md:col-span-4 md:p-6">
              <div className="mb-5 flex items-start justify-between">
                <FileText className="size-8 text-muted-foreground" />
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.01em] text-foreground">
                  Research Reports
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">Annual findings and case studies.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="mb-10 md:mb-12">
          <div className="mb-5 flex flex-col gap-2 border-b border-border pb-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-semibold leading-tight tracking-[-0.01em] text-foreground md:text-3xl">
              Recent Publications
            </h2>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View Complete Catalog
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
              (c) 2026 LPPM UPN Veteran Jakarta. Academic Excellence and Innovation.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/dashboard" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/dashboard" className="hover:text-foreground">
              Research Repository
            </Link>
            <Link href="/dashboard" className="hover:text-foreground">
              Contact Support
            </Link>
          </div>
        </div>
      </footer>
    </section>
  );
}
