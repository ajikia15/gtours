import { createI18n } from "next-international";

export const { useI18n, I18nProvider } = createI18n({
  en: () => import("@/locales/en.json"),
  ge: () => import("@/locales/ge.json"),
  ru: () => import("@/locales/ru.json"),
});
