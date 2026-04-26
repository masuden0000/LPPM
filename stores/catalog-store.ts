"use client";

import { create } from "zustand";

import { BOOK_LIST } from "@/lib/mock-content";
import type { Book } from "@/lib/types";

type CatalogState = {
  books: Book[];
  getBookById: (bookId: string) => Book | undefined;
};

export const useCatalogStore = create<CatalogState>((_, get) => ({
  books: BOOK_LIST,
  getBookById: (bookId) => get().books.find((book) => book.id === bookId),
}));
