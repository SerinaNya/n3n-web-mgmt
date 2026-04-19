import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import en from "./en.json"
import zhCN from "./zh-CN.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    resources: {
      en: {
        translation: en,
      },
      "zh-CN": {
        translation: zhCN,
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React 已经处理了 XSS
    },
  })

export default i18n