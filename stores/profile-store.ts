"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Address } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";

type ProfilePayload = {
  nama: string;
  email: string;
  passwordBaru?: string;
};

type ProfileState = {
  lastUpdatedAt: string | null;
  updateProfile: (payload: ProfilePayload) => { ok: boolean; message: string };
  addAddress: (address: Omit<Address, "id">) => { ok: boolean; message: string };
  updateAddress: (address: Address) => { ok: boolean; message: string };
  removeAddress: (addressId: string) => { ok: boolean; message: string };
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      lastUpdatedAt: null,
      updateProfile: (payload) => {
        const authState = useAuthStore.getState();
        const result = authState.updateCurrentUserProfile({
          nama: payload.nama,
          email: payload.email,
        });

        if (!result.ok) return result;

        if (payload.passwordBaru) {
          const passwordResult = authState.updateCurrentUserPassword(
            payload.passwordBaru,
          );
          if (!passwordResult.ok) return passwordResult;
        }

        set({ lastUpdatedAt: new Date().toISOString() });
        return { ok: true, message: "Profil berhasil disimpan." };
      },
      addAddress: (address) => {
        const result = useAuthStore.getState().addAddress(address);
        return result;
      },
      updateAddress: (address) => {
        const result = useAuthStore.getState().updateAddress(address);
        return result;
      },
      removeAddress: (addressId) => {
        const result = useAuthStore.getState().removeAddress(addressId);
        return result;
      },
    }),
    {
      name: "lppm-profile",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
