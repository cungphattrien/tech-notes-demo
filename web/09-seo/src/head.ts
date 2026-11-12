// Dựng phần <head> của một trang bài viết: thứ mà metadata của Next.js (generateMetadata) cuối cùng cũng tạo ra.
import { serializeJsonLd } from "./ld.ts";
import { escapeXml as escapeHtml } from "./sitemap-xml.ts";

export type ThongTinTrang = {
  title?: string;
  description?: string;
  canonical?: string;
  languages?: Record<string, string>;
  noindex?: boolean;
  jsonLd?: object;
};

export function renderHead(page: ThongTinTrang): string {
  const lines: string[] = ['<meta charset="utf-8" />'];
  if (page.title) lines.push(`<title>${escapeHtml(page.title)}</title>`, `<meta property="og:title" content="${escapeHtml(page.title)}" />`);
  if (page.description) lines.push(`<meta name="description" content="${escapeHtml(page.description)}" />`, `<meta property="og:description" content="${escapeHtml(page.description)}" />`);
  if (page.canonical) lines.push(`<link rel="canonical" href="${escapeHtml(page.canonical)}" />`);
  for (const [hreflang, href] of Object.entries(page.languages ?? {})) lines.push(`<link rel="alternate" hreflang="${escapeHtml(hreflang)}" href="${escapeHtml(href)}" />`);
  if (page.noindex) lines.push('<meta name="robots" content="noindex" />');
  if (page.jsonLd) lines.push(`<script type="application/ld+json">${serializeJsonLd(page.jsonLd)}</script>`);
  return lines.join("\n");
}
