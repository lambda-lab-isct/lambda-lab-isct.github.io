export const siteConfig = {
  name: {
    ja: "Lambda Laboratory",
    en: "Lambda Laboratory",
  },
  description: {
    ja: "Lambda Laboratory の公式Webサイトです。研究、メンバー、研究業績、ニュース、教育、セミナー、WCTP、アクセス情報を掲載します。",
    en: "Official website of Lambda Laboratory, providing research, members, publications, news, education, seminars, WCTP, and access information.",
  },
  url: "https://lambda-lab-isct.github.io",
  repository: "https://github.com/lambda-lab-isct/lambda-lab-isct.github.io",
  futureUrl: "https://www.lambda.comp.isct.ac.jp/",
  defaultLocale: "ja",
  locales: ["ja", "en"] as const,
};

export type Locale = (typeof siteConfig.locales)[number];

export type PageKey =
  | "home"
  | "research"
  | "members"
  | "publications"
  | "news"
  | "education"
  | "seminars"
  | "wctp"
  | "access";

export const pages: Record<
  PageKey,
  {
    path: Record<Locale, string>;
    label: Record<Locale, string>;
    title: Record<Locale, string>;
    description: Record<Locale, string>;
  }
> = {
  home: {
    path: { ja: "/", en: "/en/" },
    label: { ja: "ホーム", en: "Home" },
    title: { ja: "ホーム", en: "Home" },
    description: {
      ja: "Lambda Laboratory の概要と最新情報を掲載します。",
      en: "Overview and updates from Lambda Laboratory.",
    },
  },
  research: {
    path: { ja: "/research/", en: "/en/research/" },
    label: { ja: "研究", en: "Research" },
    title: { ja: "研究", en: "Research" },
    description: {
      ja: "Lambda Laboratory の研究テーマを紹介します。",
      en: "Research themes at Lambda Laboratory.",
    },
  },
  members: {
    path: { ja: "/members/", en: "/en/members/" },
    label: { ja: "メンバー", en: "Members" },
    title: { ja: "メンバー", en: "Members" },
    description: {
      ja: "Lambda Laboratory のメンバー情報を掲載します。",
      en: "Members of Lambda Laboratory.",
    },
  },
  publications: {
    path: { ja: "/publications/", en: "/en/publications/" },
    label: { ja: "研究業績", en: "Publications" },
    title: { ja: "研究業績", en: "Publications" },
    description: {
      ja: "Lambda Laboratory の研究業績を分類して掲載します。",
      en: "Publication records from Lambda Laboratory.",
    },
  },
  news: {
    path: { ja: "/news/", en: "/en/news/" },
    label: { ja: "ニュース", en: "News" },
    title: { ja: "ニュース", en: "News" },
    description: {
      ja: "Lambda Laboratory のお知らせを掲載します。",
      en: "News from Lambda Laboratory.",
    },
  },
  education: {
    path: { ja: "/education/", en: "/en/education/" },
    label: { ja: "教育", en: "Education" },
    title: { ja: "教育", en: "Education" },
    description: {
      ja: "教育活動と学生向け情報を掲載します。",
      en: "Education activities and information for students.",
    },
  },
  seminars: {
    path: { ja: "/seminars/", en: "/en/seminars/" },
    label: { ja: "セミナー", en: "Seminars" },
    title: { ja: "セミナー", en: "Seminars" },
    description: {
      ja: "セミナー情報を掲載します。",
      en: "Seminar information.",
    },
  },
  wctp: {
    path: { ja: "/wctp/", en: "/en/wctp/" },
    label: { ja: "WCTP", en: "WCTP" },
    title: { ja: "WCTP", en: "WCTP" },
    description: {
      ja: "WCTP 関連情報と過去サイトへの入口です。",
      en: "Entry point for WCTP information and archived static sites.",
    },
  },
  access: {
    path: { ja: "/access/", en: "/en/access/" },
    label: { ja: "アクセス・連絡先", en: "Access and Contact" },
    title: { ja: "アクセス・連絡先", en: "Access and Contact" },
    description: {
      ja: "アクセスと連絡先の未確定情報を掲載するページです。",
      en: "Access and contact information placeholders.",
    },
  },
};

export function localizedPath(page: PageKey, locale: Locale) {
  return pages[page].path[locale];
}
