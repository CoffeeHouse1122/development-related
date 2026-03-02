import { createI18n } from "vue-i18n";
import zhCN from "./languages/zh-CN";
import enUS from "./languages/en-US";

const fallbackLocale = "zh-CN";
const defaultLocale = import.meta.env.VITE_DEFAULT_LOCALE || fallbackLocale;

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale,
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
  },
});

export const supportedLocales = ["zh-CN", "en-US"];

export function isSupportedLocale(locale) {
  return supportedLocales.includes(locale);
}

export function setLocale(locale) {
  if (!isSupportedLocale(locale)) return;
  i18n.global.locale.value = locale;
}

export default i18n;
