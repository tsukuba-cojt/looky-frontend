import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import i18n from "@/locales";
import type { Language } from "@/types";

type LanguageStore = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export const useLanguageStore = create(
  persist<LanguageStore>(
    (set) => ({
      language: "system",
      setLanguage: async (language) => {
        set({ language });

        if (language === "system") {
          i18n.changeLanguage();
        } else {
          i18n.changeLanguage(language);
        }
      },
    }),
    {
      name: "@language",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
