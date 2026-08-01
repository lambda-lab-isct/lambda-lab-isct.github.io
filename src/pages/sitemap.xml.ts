import { pages, siteConfig } from "@/config/site";

export function GET() {
  const urls = Object.values(pages).flatMap((page) =>
    siteConfig.locales.map((locale) =>
      new URL(page.path[locale], siteConfig.url).toString(),
    ),
  );

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
