import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import ja from "./translations/ja.json";

i18n.use(initReactI18next).init({
  lng: Localization.getLocales()[0].languageCode ?? "ja",
  fallbackLng: "ja",
  supportedLngs: ["en", "ja"],
  ns: ["top", "signup", "login", "verify", "camera"],
  resources: { en, ja },
});
