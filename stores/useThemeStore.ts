import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Theme } from "@/types";

type ThemeStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: () => "light" | "dark";
};

export const useThemeStore = create(
  persist<ThemeStore>(
    (set, get) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
      resolvedTheme: () => {
        const colorScheme = Appearance.getColorScheme() ?? "light";
        const theme = get().theme;
        return theme === "system" ? colorScheme : theme;
      },
    }),
    {
      name: "@theme",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
