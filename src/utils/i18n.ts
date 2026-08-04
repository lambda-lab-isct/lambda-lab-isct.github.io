import { pages, siteConfig, type Locale, type PageKey } from "@/config/site";

export function t(value: Record<Locale, string>, locale: Locale) {
  return value[locale];
}

export const localeLabels: Record<Locale, string> = {
  ja: "日本語",
  en: "English",
  la: "Latina",
  zh: "Chinese",
};

export const localeLanguageTags: Record<Locale, string> = {
  ja: "ja",
  en: "en",
  la: "la",
  zh: "lzh",
};

export function getAlternatePath(page: PageKey, locale: Locale) {
  return pages[page].path[locale];
}

export function getCanonicalUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
