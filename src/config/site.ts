export const siteConfig = {
  name: {
    ja: "Lambda Laboratory",
    en: "Lambda Laboratory",
    la: "Laboratorium Lambda",
  },
  description: {
    ja: "Lambda Laboratoryでは、プログラミング言語理論、型システム、形式手法とその応用に関する研究を行っています。",
    en: "The Lambda Laboratory conducts research on programming language theory, type systems, formal methods, and their applications.",
    la: "Laboratorium Lambda investigationem agit de theoria linguarum programmandi, systematibus typorum, methodis formalibus earumque applicationibus.",
  },
  url: "https://www.lambda.comp.isct.ac.jp",
  repository: "https://github.com/lambda-lab-isct/lambda-lab-isct.github.io",
  futureUrl: "https://www.lambda.comp.isct.ac.jp/",
  defaultLocale: "ja",
  locales: ["ja", "en", "la"] as const,
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

export const navigationPages: PageKey[] = [
  "home",
  "research",
  "members",
  "publications",
  "access",
];

export const sitemapPages: PageKey[] = [...navigationPages, "wctp"];
export const wctpArchiveLinks = [
  {
    year: "2026",
    path: "/wctp/wctp2026/",
    label: { ja: "WCTP 2026", en: "WCTP 2026", la: "WCTP 2026" },
  },
] as const;

export const deferredPages: PageKey[] = ["news", "education", "seminars"];

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
    path: { ja: "/", en: "/en/", la: "/la/" },
    label: { ja: "ホーム", en: "Home", la: "Initium" },
    title: { ja: "ホーム", en: "Home", la: "Initium" },
    description: {
      ja: "Lambda Laboratoryの概要と研究情報を紹介します。",
      en: "Overview and research information from Lambda Laboratory.",
      la: "Conspectus et notitia investigationis Laboratorii Lambda.",
    },
  },
  research: {
    path: { ja: "/research/", en: "/en/research/", la: "/la/research/" },
    label: { ja: "研究", en: "Research", la: "Investigatio" },
    title: { ja: "研究", en: "Research", la: "Investigatio" },
    description: {
      ja: "Lambda Laboratoryの研究テーマを紹介します。",
      en: "Research themes at Lambda Laboratory.",
      la: "Argumenta investigationis Laboratorii Lambda.",
    },
  },
  members: {
    path: { ja: "/members/", en: "/en/members/", la: "/la/members/" },
    label: { ja: "メンバー", en: "Members", la: "Sodales" },
    title: { ja: "メンバー", en: "Members", la: "Sodales" },
    description: {
      ja: "Lambda Laboratoryのメンバー情報を掲載します。",
      en: "Members of Lambda Laboratory.",
      la: "Notitia de sodalibus Laboratorii Lambda.",
    },
  },
  publications: {
    path: {
      ja: "/publications/",
      en: "/en/publications/",
      la: "/la/publications/",
    },
    label: { ja: "研究業績", en: "Publications", la: "Publicationes" },
    title: { ja: "研究業績", en: "Publications", la: "Publicationes" },
    description: {
      ja: "Lambda Laboratoryの研究業績を分類して掲載します。",
      en: "Publication records from Lambda Laboratory.",
      la: "Index publicationum Laboratorii Lambda.",
    },
  },
  news: {
    path: { ja: "/news/", en: "/en/news/", la: "/la/news/" },
    label: { ja: "ニュース", en: "News", la: "Nuntii" },
    title: { ja: "ニュース", en: "News", la: "Nuntii" },
    description: {
      ja: "Lambda Laboratoryからのお知らせを掲載します。",
      en: "News from Lambda Laboratory.",
      la: "Nuntii a Laboratorio Lambda.",
    },
  },
  education: {
    path: { ja: "/education/", en: "/en/education/", la: "/la/education/" },
    label: { ja: "教育", en: "Education", la: "Educatio" },
    title: { ja: "教育", en: "Education", la: "Educatio" },
    description: {
      ja: "Lambda Laboratoryの教育活動に関する情報を掲載します。",
      en: "Information about educational activities at Lambda Laboratory.",
      la: "Notitia de operibus educatoriis Laboratorii Lambda.",
    },
  },
  seminars: {
    path: { ja: "/seminars/", en: "/en/seminars/", la: "/la/seminars/" },
    label: { ja: "セミナー", en: "Seminars", la: "Seminaria" },
    title: { ja: "セミナー", en: "Seminars", la: "Seminaria" },
    description: {
      ja: "Lambda Laboratoryのセミナー情報を掲載します。",
      en: "Seminar information from Lambda Laboratory.",
      la: "Notitia de seminariis Laboratorii Lambda.",
    },
  },
  wctp: {
    path: { ja: "/wctp/", en: "/en/wctp/", la: "/la/wctp/" },
    label: { ja: "WCTP", en: "WCTP", la: "WCTP" },
    title: { ja: "WCTP", en: "WCTP", la: "WCTP" },
    description: {
      ja: "WCTPに関する情報を掲載します。",
      en: "Information about WCTP.",
      la: "Notitia de WCTP.",
    },
  },
  access: {
    path: { ja: "/access/", en: "/en/access/", la: "/la/access/" },
    label: {
      ja: "アクセス・連絡先",
      en: "Access and Contact",
      la: "Accessus et Contactus",
    },
    title: {
      ja: "アクセス・連絡先",
      en: "Access and Contact",
      la: "Accessus et Contactus",
    },
    description: {
      ja: "Lambda Laboratoryへのアクセスと連絡先を掲載します。",
      en: "Access and contact information for Lambda Laboratory.",
      la: "Accessus et notitia contactus Laboratorii Lambda.",
    },
  },
};

export function localizedPath(page: PageKey, locale: Locale) {
  return pages[page].path[locale];
}
