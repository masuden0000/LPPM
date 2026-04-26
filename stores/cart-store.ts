"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Book, CartItem } from "@/lib/types";

type CartState = {
  items: CartItem[];
  addItem: (book: Book) => { ok: boolean; message: string };
  increaseQty: (book: Book) => void;
  decreaseQty: (bookId: string) => void;
  removeItem: (bookId: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (book) => {
        const existing = get().items.find((item) => item.bookId === book.id);

        if (book.stok <= 0) {
          return { ok: false, message: "Stok buku ini habis." };
        }

        if (existing && existing.qty >= book.stok) {
          return { ok: false, message: "Jumlah melebihi stok tersedia." };
        }

        set((state) => {
          const target = state.items.find((item) => item.bookId === book.id);
          if (target) {
            return {
              items: state.items.map((item) =>
                item.bookId === book.id ? { ...item, qty: item.qty + 1 } : item,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { bookId: book.id, qty: 1, hargaSnapshot: book.harga },
            ],
          };
        });

        return { ok: true, message: "Buku ditambahkan ke keranjang." };
      },
      increaseQty: (book) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.bookId !== book.id) return item;
            const nextQty = Math.min(item.qty + 1, book.stok);
            return { ...item, qty: nextQty };
          }),
        }));
      },
      decreaseQty: (bookId) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.bookId === bookId ? { ...item, qty: item.qty - 1 } : item,
            )
            .filter((item) => item.qty > 0),
        }));
      },
      removeItem: (bookId) => {
        set((state) => ({
          items: state.items.filter((item) => item.bookId !== bookId),
        }));
      },
      clearCart: () => set({ items: [] }),
      getSubtotal: () =>
        get().items.reduce((acc, item) => acc + item.hargaSnapshot * item.qty, 0),
    }),
    {
      name: "lppm-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
