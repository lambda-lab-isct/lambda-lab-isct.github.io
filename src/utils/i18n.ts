import { pages, siteConfig, type Locale, type PageKey } from "@/config/site";

export function t(value: Record<Locale, string>, locale: Locale) {
  return value[locale] ?? value.ja;
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "ja" ? "en" : "ja";
}

export function getAlternatePath(page: PageKey, locale: Locale) {
  return pages[page].path[alternateLocale(locale)];
}

export function getCanonicalUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
