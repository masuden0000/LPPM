"use client";

import { create } from "zustand";

import { MOCK_BOOKS } from "@/lib/mock-books";
import type { Book } from "@/lib/types";

type CatalogState = {
  books: Book[];
  getBookById: (bookId: string) => Book | undefined;
};

export const useCatalogStore = create<CatalogState>((_, get) => ({
  books: MOCK_BOOKS,
  getBookById: (bookId) => get().books.find((book) => book.id === bookId),
}));
