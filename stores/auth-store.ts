"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Address, ForgotPasswordToken, User } from "@/lib/types";

type Result = { ok: boolean; message: string };
type ResetResult = Result & { otp?: string; expiresAt?: string };

type RegisterInput = {
  nama: string;
  email: string;
  password: string;
};

type AuthState = {
  users: User[];
  currentUserId: string | null;
  forgotPasswordToken: ForgotPasswordToken | null;
  register: (payload: RegisterInput) => Result;
  login: (email: string, password: string) => Result;
  logout: () => void;
  requestPasswordReset: (email: string) => ResetResult;
  verifyOtp: (email: string, otp: string) => Result;
  resetPassword: (email: string, password: string) => Result;
  updateCurrentUserProfile: (payload: {
    nama: string;
    email: string;
    alamatDefault: Address;
  }) => Result;
  updateCurrentUserPassword: (password: string) => Result;
  getCurrentUser: () => User | null;
};

function makePasswordHash(password: string): string {
  return `mock_hash:${password}`;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function randomOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUserId: null,
      forgotPasswordToken: null,
      register: ({ nama, email, password }) => {
        const cleanEmail = normalizeEmail(email);
        const exists = get().users.some((user) => user.email === cleanEmail);

        if (exists) {
          return { ok: false, message: "Email sudah digunakan." };
        }

        const user: User = {
          id: crypto.randomUUID(),
          nama: nama.trim(),
          email: cleanEmail,
          passwordHashMock: makePasswordHash(password),
          role: "PENGGUNA",
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          users: [...state.users, user],
          currentUserId: user.id,
        }));

        return { ok: true, message: "Akun berhasil dibuat." };
      },
      login: (email, password) => {
        const cleanEmail = normalizeEmail(email);
        const user = get().users.find(
          (item) =>
            item.email === cleanEmail &&
            item.passwordHashMock === makePasswordHash(password),
        );

        if (!user) {
          return { ok: false, message: "Email atau kata sandi salah." };
        }

        set({ currentUserId: user.id });
        return { ok: true, message: "Login berhasil." };
      },
      logout: () => set({ currentUserId: null }),
      requestPasswordReset: (email) => {
        const cleanEmail = normalizeEmail(email);
        const user = get().users.find((item) => item.email === cleanEmail);

        if (!user) {
          return { ok: false, message: "Email tidak ditemukan." };
        }

        const otp = randomOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        set({
          forgotPasswordToken: {
            email: cleanEmail,
            otp,
            expiresAt,
            verified: false,
          },
        });
        return {
          ok: true,
          message: "OTP reset kata sandi berhasil dibuat.",
          otp,
          expiresAt,
        };
      },
      verifyOtp: (email, otp) => {
        const cleanEmail = normalizeEmail(email);
        const token = get().forgotPasswordToken;
        if (!token || token.email !== cleanEmail) {
          return { ok: false, message: "Token reset tidak ditemukan." };
        }
        if (new Date(token.expiresAt).getTime() < Date.now()) {
          return { ok: false, message: "OTP sudah kedaluwarsa." };
        }
        if (token.otp !== otp) {
          return { ok: false, message: "OTP tidak valid." };
        }

        set({ forgotPasswordToken: { ...token, verified: true } });
        return { ok: true, message: "OTP valid." };
      },
      resetPassword: (email, password) => {
        const cleanEmail = normalizeEmail(email);
        const token = get().forgotPasswordToken;
        if (!token || token.email !== cleanEmail || !token.verified) {
          return { ok: false, message: "Silakan verifikasi OTP terlebih dulu." };
        }

        set((state) => ({
          users: state.users.map((user) =>
            user.email === cleanEmail
              ? { ...user, passwordHashMock: makePasswordHash(password) }
              : user,
          ),
          forgotPasswordToken: null,
        }));

        return { ok: true, message: "Kata sandi berhasil diperbarui." };
      },
      updateCurrentUserProfile: ({ nama, email, alamatDefault }) => {
        const user = get().getCurrentUser();
        if (!user) {
          return { ok: false, message: "Pengguna tidak ditemukan." };
        }

        const cleanEmail = normalizeEmail(email);
        const emailExists = get().users.some(
          (item) => item.email === cleanEmail && item.id !== user.id,
        );

        if (emailExists) {
          return { ok: false, message: "Email sudah digunakan akun lain." };
        }

        set((state) => ({
          users: state.users.map((item) =>
            item.id === user.id
              ? { ...item, nama: nama.trim(), email: cleanEmail, alamatDefault }
              : item,
          ),
        }));

        return { ok: true, message: "Profil berhasil diperbarui." };
      },
      updateCurrentUserPassword: (password) => {
        const user = get().getCurrentUser();
        if (!user) {
          return { ok: false, message: "Pengguna tidak ditemukan." };
        }

        set((state) => ({
          users: state.users.map((item) =>
            item.id === user.id
              ? { ...item, passwordHashMock: makePasswordHash(password) }
              : item,
          ),
        }));

        return { ok: true, message: "Kata sandi berhasil diperbarui." };
      },
      getCurrentUser: () => {
        const state = get();
        if (!state.currentUserId) return null;
        return state.users.find((user) => user.id === state.currentUserId) ?? null;
      },
    }),
    {
      name: "lppm-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
