export const siteConfig = {
  name: {
    ja: "Lambda Laboratory",
    en: "Lambda Laboratory",
    la: "Laboratorium Lambda",
    zh: "λ研究室",
  },
  description: {
    ja: "Lambda Laboratoryでは、プログラミング言語理論、型システム、形式手法とその応用に関する研究を行っています。",
    en: "The Lambda Laboratory conducts research on programming language theory, type systems, formal methods, and their applications.",
    la: "Laboratorium Lambda investigationem agit de theoria linguarum programmandi, systematibus typorum, methodis formalibus earumque applicationibus.",
    zh: "λ研究室究程序言語理論型系形式法及其用。",
  },
  url: "https://www.lambda.comp.isct.ac.jp",
  repository: "https://github.com/lambda-lab-isct/lambda-lab-isct.github.io",
  futureUrl: "https://www.lambda.comp.isct.ac.jp/",
  defaultLocale: "ja",
  locales: ["ja", "en", "la", "zh"] as const,
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
    label: {
      ja: "WCTP 2026",
      en: "WCTP 2026",
      la: "WCTP 2026",
      zh: "WCTP 2026",
    },
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
    path: { ja: "/", en: "/en/", la: "/la/", zh: "/zh/" },
    label: { ja: "ホーム", en: "Home", la: "Initium", zh: "初頁" },
    title: { ja: "ホーム", en: "Home", la: "Initium", zh: "初頁" },
    description: {
      ja: "Lambda Laboratoryの概要と研究情報を紹介します。",
      en: "Overview and research information from Lambda Laboratory.",
      la: "Conspectus et notitia investigationis Laboratorii Lambda.",
      zh: "記λ研究室大概及研究之事。",
    },
  },
  research: {
    path: {
      ja: "/research/",
      en: "/en/research/",
      la: "/la/research/",
      zh: "/zh/research/",
    },
    label: { ja: "研究", en: "Research", la: "Investigatio", zh: "研究" },
    title: { ja: "研究", en: "Research", la: "Investigatio", zh: "研究" },
    description: {
      ja: "Lambda Laboratoryの研究テーマを紹介します。",
      en: "Research themes at Lambda Laboratory.",
      la: "Argumenta investigationis Laboratorii Lambda.",
      zh: "述λ研究室所究題目。",
    },
  },
  members: {
    path: {
      ja: "/members/",
      en: "/en/members/",
      la: "/la/members/",
      zh: "/zh/members/",
    },
    label: { ja: "メンバー", en: "Members", la: "Sodales", zh: "諸員" },
    title: { ja: "メンバー", en: "Members", la: "Sodales", zh: "諸員" },
    description: {
      ja: "Lambda Laboratoryのメンバー情報を掲載します。",
      en: "Members of Lambda Laboratory.",
      la: "Notitia de sodalibus Laboratorii Lambda.",
      zh: "載λ研究室諸員之事。",
    },
  },
  publications: {
    path: {
      ja: "/publications/",
      en: "/en/publications/",
      la: "/la/publications/",
      zh: "/zh/publications/",
    },
    label: {
      ja: "研究業績",
      en: "Publications",
      la: "Publicationes",
      zh: "論著",
    },
    title: {
      ja: "研究業績",
      en: "Publications",
      la: "Publicationes",
      zh: "論著",
    },
    description: {
      ja: "Lambda Laboratoryの研究業績を分類して掲載します。",
      en: "Publication records from Lambda Laboratory.",
      la: "Index publicationum Laboratorii Lambda.",
      zh: "列λ研究室論著之目。",
    },
  },
  news: {
    path: { ja: "/news/", en: "/en/news/", la: "/la/news/", zh: "/zh/news/" },
    label: { ja: "ニュース", en: "News", la: "Nuntii", zh: "告知" },
    title: { ja: "ニュース", en: "News", la: "Nuntii", zh: "告知" },
    description: {
      ja: "Lambda Laboratoryからのお知らせを掲載します。",
      en: "News from Lambda Laboratory.",
      la: "Nuntii a Laboratorio Lambda.",
      zh: "載λ研究室告知。",
    },
  },
  education: {
    path: {
      ja: "/education/",
      en: "/en/education/",
      la: "/la/education/",
      zh: "/zh/education/",
    },
    label: { ja: "教育", en: "Education", la: "Educatio", zh: "教育" },
    title: { ja: "教育", en: "Education", la: "Educatio", zh: "教育" },
    description: {
      ja: "Lambda Laboratoryの教育活動に関する情報を掲載します。",
      en: "Information about educational activities at Lambda Laboratory.",
      la: "Notitia de operibus educatoriis Laboratorii Lambda.",
      zh: "載λ研究室教育之事。",
    },
  },
  seminars: {
    path: {
      ja: "/seminars/",
      en: "/en/seminars/",
      la: "/la/seminars/",
      zh: "/zh/seminars/",
    },
    label: { ja: "セミナー", en: "Seminars", la: "Seminaria", zh: "講会" },
    title: { ja: "セミナー", en: "Seminars", la: "Seminaria", zh: "講会" },
    description: {
      ja: "Lambda Laboratoryのセミナー情報を掲載します。",
      en: "Seminar information from Lambda Laboratory.",
      la: "Notitia de seminariis Laboratorii Lambda.",
      zh: "載λ研究室講会之事。",
    },
  },
  wctp: {
    path: { ja: "/wctp/", en: "/en/wctp/", la: "/la/wctp/", zh: "/zh/wctp/" },
    label: { ja: "WCTP", en: "WCTP", la: "WCTP", zh: "WCTP" },
    title: { ja: "WCTP", en: "WCTP", la: "WCTP", zh: "WCTP" },
    description: {
      ja: "WCTPに関する情報を掲載します。",
      en: "Information about WCTP.",
      la: "Notitia de WCTP.",
      zh: "載WCTP之事。",
    },
  },
  access: {
    path: {
      ja: "/access/",
      en: "/en/access/",
      la: "/la/access/",
      zh: "/zh/access/",
    },
    label: {
      ja: "アクセス・連絡先",
      en: "Access and Contact",
      la: "Accessus et Contactus",
      zh: "所在及連絡",
    },
    title: {
      ja: "アクセス・連絡先",
      en: "Access and Contact",
      la: "Accessus et Contactus",
      zh: "所在及連絡",
    },
    description: {
      ja: "Lambda Laboratoryへのアクセスと連絡先を掲載します。",
      en: "Access and contact information for Lambda Laboratory.",
      la: "Accessus et notitia contactus Laboratorii Lambda.",
      zh: "載λ研究室所在及連絡之事。",
    },
  },
};

export function localizedPath(page: PageKey, locale: Locale) {
  return pages[page].path[locale];
}
