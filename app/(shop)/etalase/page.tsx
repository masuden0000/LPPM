"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { BookCard } from "@/components/shop/book-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCatalogStore } from "@/stores/catalog-store";

type SortOption = "judul-asc" | "judul-desc" | "harga-asc" | "harga-desc";

export default function EtalasePage() {
  const books = useCatalogStore((state) => state.books);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("judul-asc");

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
      return b.harga - a.harga;
    });
  }, [books, searchKeyword, selectedCategory, sortBy]);

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchKeyword(searchInput.trim());
  };

  return (
    <section className="-mt-6 pb-14 md:-mt-8">
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-6 md:px-8 md:pt-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-border bg-background p-4 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05),0px_4px_6px_-4px_rgba(0,0,0,0.05)] lg:sticky lg:top-24">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Kategori</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => setSelectedCategory(category.name)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors",
                    selectedCategory === category.name
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground hover:border-primary/40"
                  )}
                >
                  <span className="truncate text-left">{category.name}</span>
                  <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <div>
            <div className="mb-5 rounded-2xl border border-border bg-background p-4 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05),0px_4px_6px_-4px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <form onSubmit={onSearch} className="flex flex-1 items-center gap-2">
                  <Input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Cari judul atau penulis"
                    className="h-10 rounded-lg"
                  />
                  <Button type="submit" className="h-10 rounded-lg px-4">
                    <Search className="mr-1.5 size-4" />
                    Search
                  </Button>
                </form>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <SlidersHorizontal className="size-4" />
                    Sort
                  </span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortOption)}
                    className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring"
                    aria-label="Sort buku"
                  >
                    <option value="judul-asc">Judul A-Z</option>
                    <option value="judul-desc">Judul Z-A</option>
                    <option value="harga-asc">Harga termurah</option>
                    <option value="harga-desc">Harga termahal</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-12 text-center">
                <p className="text-sm font-medium text-foreground">Buku tidak ditemukan.</p>
                <p className="mt-1 text-xs text-muted-foreground">Coba keyword lain atau pilih kategori lain.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
