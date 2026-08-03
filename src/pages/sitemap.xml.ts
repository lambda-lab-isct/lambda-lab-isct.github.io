import {
  pages,
  siteConfig,
  sitemapPages,
  wctpArchiveLinks,
} from "@/config/site";

export function GET() {
  const urls = [
    ...sitemapPages.flatMap((pageKey) =>
      siteConfig.locales.map((locale) =>
        new URL(pages[pageKey].path[locale], siteConfig.url).toString(),
      ),
    ),
    ...wctpArchiveLinks.map((archive) =>
      new URL(archive.path, siteConfig.url).toString(),
    ),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
