"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Address, CartItem, Order, PaymentMethod } from "@/lib/types";

type OrderState = {
  orders: Order[];
  checkoutAddress: Address | null;
  selectedPaymentMethod: PaymentMethod | null;
  setCheckoutAddress: (address: Address) => void;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;
  createPendingOrder: (payload: {
    items: CartItem[];
    paymentMethod: PaymentMethod;
  }) => Order | null;
  markOrderPaid: (orderId: string) => void;
  clearCheckout: () => void;
  getOrderById: (orderId: string) => Order | undefined;
};

const BIAYA_LAYANAN = 4000;

function generateVANumber(method: PaymentMethod): string {
  const prefix = method === "BCA_VA" ? "014" : method === "BNI_VA" ? "009" : "002";
  const random = Math.floor(100000000 + Math.random() * 900000000).toString();
  return `${prefix}${random}`;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      checkoutAddress: null,
      selectedPaymentMethod: null,
      setCheckoutAddress: (address) => set({ checkoutAddress: address }),
      setSelectedPaymentMethod: (method) => set({ selectedPaymentMethod: method }),
      createPendingOrder: ({ items, paymentMethod }) => {
        const address = get().checkoutAddress;
        if (!address || items.length === 0) return null;

        const subtotal = items.reduce(
          (total, item) => total + item.hargaSnapshot * item.qty,
          0,
        );
        const total = subtotal + BIAYA_LAYANAN;

        const order: Order = {
          id: `ORD-${Date.now()}`,
          items,
          subtotal,
          biayaLayanan: BIAYA_LAYANAN,
          total,
          address,
          paymentMethod,
          vaNumber: generateVANumber(paymentMethod),
          status: "pending_payment",
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          orders: [order, ...state.orders],
        }));

        return order;
      },
      markOrderPaid: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status: "paid" } : order,
          ),
        }));
      },
      clearCheckout: () =>
        set({
          checkoutAddress: null,
          selectedPaymentMethod: null,
        }),
      getOrderById: (orderId) => get().orders.find((order) => order.id === orderId),
    }),
    {
      name: "lppm-order",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
