import i18n from "npm:i18next";
import { initReactI18next } from "npm:react-i18next";

import ja from "./translations/ja.json" with { type: "json" };
import en from "./translations/en.json" with { type: "json" };

await i18n.use(initReactI18next).init({
    fallbackLng: "ja",
    supportedLngs: ["en", "ja"],
    resources: {
      ja: { translation: ja },
      en: { translation: en },
    },
});

export default i18n
