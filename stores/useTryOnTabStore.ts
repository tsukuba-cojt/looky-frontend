import { create } from "zustand";

type TryOnTab = "tops" | "bottoms";

type TryOnTabStore = {
  tab: TryOnTab;
  setTab: (tab: TryOnTab) => void;
};

export const useTryOnTabStore = create<TryOnTabStore>((set) => ({
  tab: "tops",
  setTab: (tab) => set({ tab }),
}));
