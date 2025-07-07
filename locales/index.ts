import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n, { type LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next } from "react-i18next";
import type { Language } from "@/types";
import en from "./translations/en.json";
import ja from "./translations/ja.json";

const locale = Localization.getLocales()[0];

const languageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  init: () => {},
  detect: async () => {
    const value = await AsyncStorage.getItem("@language");
    const language = value
      ? (JSON.parse(value).state.language as Language)
      : "system";

    if (language === "system") {
      return locale.languageCode ?? "ja";
    }

    return language;
  },
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ja",
    supportedLngs: ["en", "ja"],
    resources: { en, ja },
  });

export default i18n;
