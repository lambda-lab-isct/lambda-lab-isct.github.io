export const siteConfig = {
  name: {
    ja: "Lambda Laboratory",
    en: "Lambda Laboratory",
  },
  description: {
    ja: "Lambda Laboratoryでは、プログラミング言語理論、型システム、形式手法とその応用に関する研究を行っています。",
    en: "The Lambda Laboratory conducts research on programming language theory, type systems, formal methods, and their applications.",
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
      ja: "Lambda Laboratoryの概要と研究情報を紹介します。",
      en: "Overview and research information from Lambda Laboratory.",
    },
  },
  research: {
    path: { ja: "/research/", en: "/en/research/" },
    label: { ja: "研究", en: "Research" },
    title: { ja: "研究", en: "Research" },
    description: {
      ja: "Lambda Laboratoryの研究テーマを紹介します。",
      en: "Research themes at Lambda Laboratory.",
    },
  },
  members: {
    path: { ja: "/members/", en: "/en/members/" },
    label: { ja: "メンバー", en: "Members" },
    title: { ja: "メンバー", en: "Members" },
    description: {
      ja: "Lambda Laboratoryのメンバー情報を掲載します。",
      en: "Members of Lambda Laboratory.",
    },
  },
  publications: {
    path: { ja: "/publications/", en: "/en/publications/" },
    label: { ja: "研究業績", en: "Publications" },
    title: { ja: "研究業績", en: "Publications" },
    description: {
      ja: "Lambda Laboratoryの研究業績を分類して掲載します。",
      en: "Publication records from Lambda Laboratory.",
    },
  },
  news: {
    path: { ja: "/news/", en: "/en/news/" },
    label: { ja: "ニュース", en: "News" },
    title: { ja: "ニュース", en: "News" },
    description: {
      ja: "Lambda Laboratoryからのお知らせを掲載します。",
      en: "News from Lambda Laboratory.",
    },
  },
  education: {
    path: { ja: "/education/", en: "/en/education/" },
    label: { ja: "教育", en: "Education" },
    title: { ja: "教育", en: "Education" },
    description: {
      ja: "Lambda Laboratoryの教育活動に関する情報を掲載します。",
      en: "Information about educational activities at Lambda Laboratory.",
    },
  },
  seminars: {
    path: { ja: "/seminars/", en: "/en/seminars/" },
    label: { ja: "セミナー", en: "Seminars" },
    title: { ja: "セミナー", en: "Seminars" },
    description: {
      ja: "Lambda Laboratoryのセミナー情報を掲載します。",
      en: "Seminar information from Lambda Laboratory.",
    },
  },
  wctp: {
    path: { ja: "/wctp/", en: "/en/wctp/" },
    label: { ja: "WCTP", en: "WCTP" },
    title: { ja: "WCTP", en: "WCTP" },
    description: {
      ja: "WCTPに関する情報を掲載します。",
      en: "Information about WCTP.",
    },
  },
  access: {
    path: { ja: "/access/", en: "/en/access/" },
    label: { ja: "アクセス・連絡先", en: "Access and Contact" },
    title: { ja: "アクセス・連絡先", en: "Access and Contact" },
    description: {
      ja: "Lambda Laboratoryへのアクセスと連絡先を掲載します。",
      en: "Access and contact information for Lambda Laboratory.",
    },
  },
};

export function localizedPath(page: PageKey, locale: Locale) {
  return pages[page].path[locale];
}
