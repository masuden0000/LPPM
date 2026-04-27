"use client";

import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { BookTypeIcon } from "@/components/shop/book-type-icon";
import { ProductCard } from "@/components/shop/product-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCatalogStore } from "@/stores/catalog-store";
import { DISCOUNT_BY_BOOK_ID } from "@/lib/discounts";

type SortOption = "newest" | "judul-asc" | "judul-desc" | "harga-asc" | "harga-desc";

export default function EtalasePage() {
  const books = useCatalogStore((state) => state.books);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const categories = useMemo(() => {
    const grouped = books.reduce<Record<string, number>>((acc, book) => {
      acc[book.kategori] = (acc[book.kategori] ?? 0) + 1;
      return acc;
    }, {});

    const sortedCategories = Object.keys(grouped).sort((a, b) => a.localeCompare(b));
    return [{ name: "Semua", count: books.length }, ...sortedCategories.map((name) => ({ name, count: grouped[name] }))];
  }, [books]);

  const filteredBooks = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase();
    const result = books.filter((book) => {
      const matchCategory = selectedCategory === "Semua" || book.kategori === selectedCategory;
      const matchKeyword =
        normalizedKeyword.length === 0 ||
        book.judul.toLowerCase().includes(normalizedKeyword) ||
        book.penulis.toLowerCase().includes(normalizedKeyword);
      return matchCategory && matchKeyword;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "judul-asc") return a.judul.localeCompare(b.judul);
      if (sortBy === "judul-desc") return b.judul.localeCompare(a.judul);
      if (sortBy === "harga-asc") return a.harga - b.harga;
      if (sortBy === "harga-desc") return b.harga - a.harga;
      return 0; // "newest" keeps original order
    });
  }, [books, searchKeyword, selectedCategory, sortBy]);

  return (
    <section className="-mt-6 bg-slate-50 pb-16 md:-mt-8">
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-6 md:px-8 md:pt-8">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="sticky hidden h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_-16px_rgba(15,23,42,0.45)] lg:block">
            <div className="mb-5 border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold tracking-[-0.01em] text-slate-900">Kategori</h2>
              <p className="mt-1 text-xs font-medium text-slate-500">Disiplin Akademik</p>
            </div>
            <div className="space-y-1.5">
              {categories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => setSelectedCategory(category.name)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all",
                    selectedCategory === category.name
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <span className="flex items-center gap-2 truncate text-left">
                    <BookTypeIcon type={category.name} className="size-4 shrink-0" />
                    {category.name}
                  </span>
                  <span className="ml-2 text-xs text-slate-500">{category.count}</span>
                </button>
              ))}
            </div>
          </aside>

          <div>
            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_8px_20px_-16px_rgba(15,23,42,0.45)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-semibold tracking-[-0.01em] text-slate-900">Semua Buku</h1>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={searchInput}
                      onChange={(event) => {
                        const value = event.target.value;
                        setSearchInput(value);
                        setSearchKeyword(value.trim());
                      }}
                      placeholder="Cari judul atau penulis..."
                      className="h-10 w-full rounded-md border-slate-300 bg-white pl-9 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={cn(
                        "inline-flex h-10 shrink-0 items-center rounded-md border border-slate-300 bg-white px-3 text-sm transition-colors outline-none hover:bg-slate-50",
                        "focus-visible:ring-2 focus-visible:ring-slate-300"
                      )}
                    >
                      <SlidersHorizontal className="mr-2 size-4 text-slate-500" />
                      <span className="font-normal text-slate-700">Urutkan</span>
                      <ChevronDown className="ml-2 size-4 text-slate-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                        <DropdownMenuRadioItem value="newest">Terbaru</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="judul-asc">Judul A-Z</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="judul-desc">Judul Z-A</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="harga-asc">Harga: Murah ke Mahal</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="harga-desc">Harga: Mahal ke Murah</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

            </div>

            {filteredBooks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center">
                <p className="text-sm font-medium text-slate-900">Buku tidak ditemukan.</p>
                <p className="mt-1 text-xs text-slate-500">Coba kata kunci atau kategori lain.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredBooks.map((book) => {
                  const discount = DISCOUNT_BY_BOOK_ID[book.id];
                  return (
                  <ProductCard
                    key={book.id}
                    book={book}
                    imageUrl={book.coverUrl}
                    meta={book.kategori}
                    originalPrice={discount?.originalPrice}
                    discountLabel={discount?.discountLabel}
                  />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
