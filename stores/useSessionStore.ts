import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";

type SessionStore = {
  session: Session | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setIsLoading: (isLoading: boolean) => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  isLoading: true,
  setSession: (session) => set({ session }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
