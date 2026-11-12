// Sơ đồ trang (sitemap) dạng XML: mỗi trang một <url>, kèm bản ngôn ngữ khác (hreflang) và ngày sửa lần cuối.
export type MucSitemap = { url: string; lastModified?: string; languages?: Record<string, string> };

// Mọi giá trị trong XML phải được escape; một dấu & trong URL mà không escape làm hỏng cả tệp.
export function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export function buildSitemapXml(entries: MucSitemap[]): string {
  const urls = entries.map((entry) => {
    const lines = ["<url>", `<loc>${escapeXml(entry.url)}</loc>`];
    for (const [hreflang, href] of Object.entries(entry.languages ?? {})) {
      lines.push(`<xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}" />`);
    }
    if (entry.lastModified) lines.push(`<lastmod>${escapeXml(entry.lastModified)}</lastmod>`);
    lines.push("</url>");
    return lines.join("\n");
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}
