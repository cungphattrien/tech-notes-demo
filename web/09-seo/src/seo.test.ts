import assert from "node:assert/strict";
import { test } from "node:test";

import { renderHead } from "./head.ts";
import { kiemSeo } from "./kiem-seo.ts";
import { blogPostingLd, breadcrumbLd, serializeJsonLd } from "./ld.ts";
import { buildSitemapXml, escapeXml } from "./sitemap-xml.ts";

const bai = { title: "T", description: "D", url: "https://x.test/a", publishedAt: "2026-11-15", tags: ["a", "b"], authorName: "A", siteName: "S", siteUrl: "https://x.test" };

test("serializeJsonLd không để lộ ký tự < nên không đóng được thẻ script", () => {
  const chuoi = serializeJsonLd({ ten: "</script><script>alert(1)</script>" });
  assert.ok(!chuoi.includes("<"));
  assert.deepEqual(JSON.parse(chuoi), { ten: "</script><script>alert(1)</script>" }); // đọc lại vẫn đúng nội dung gốc
});

test("blogPostingLd: dateModified mặc định bằng datePublished, keywords nối bằng dấu phẩy", () => {
  const ld = blogPostingLd(bai);
  assert.equal(ld.dateModified, ld.datePublished);
  assert.equal(ld.keywords, "a, b");
});

test("breadcrumbLd đánh số vị trí từ 1", () => {
  const ld = breadcrumbLd([{ name: "A", url: "u1" }, { name: "B", url: "u2" }]);
  assert.deepEqual(ld.itemListElement.map((m) => m.position), [1, 2]);
});

test("escapeXml xử lý đủ năm ký tự đặc biệt", () => {
  assert.equal(escapeXml(`a&b<c>d"e'f`), "a&amp;b&lt;c&gt;d&quot;e&apos;f");
});

test("sơ đồ trang: URL có dấu & được escape, bản ngôn ngữ và ngày sửa có mặt", () => {
  const xml = buildSitemapXml([{ url: "https://x.test/tim?a=1&b=2", lastModified: "2026-11-15", languages: { vi: "https://x.test/v", en: "https://x.test/e" } }]);
  assert.match(xml, /<loc>https:\/\/x\.test\/tim\?a=1&amp;b=2<\/loc>/);
  assert.match(xml, /hreflang="en" href="https:\/\/x\.test\/e"/);
  assert.match(xml, /<lastmod>2026-11-15<\/lastmod>/);
});

test("renderHead escape tiêu đề trong thuộc tính và bỏ qua phần không có", () => {
  const head = renderHead({ title: 'Tiêu đề "có" <dấu>' });
  assert.match(head, /<title>Tiêu đề &quot;có&quot; &lt;dấu&gt;<\/title>/);
  assert.ok(!head.includes("canonical"));
});

test("kiemSeo: một hreflang đơn lẻ và noindex đều bị báo", () => {
  const head = renderHead({ title: "x".repeat(40), description: "y".repeat(130), canonical: "https://x.test/a", languages: { vi: "https://x.test/a" }, noindex: true, jsonLd: blogPostingLd(bai) });
  const loi = kiemSeo(head).filter((muc) => muc.dau === "✗").map((muc) => muc.noiDung);
  assert.equal(loi.length, 2);
  assert.match(loi.join(" "), /hreflang/);
  assert.match(loi.join(" "), /noindex/);
});

test("kiemSeo: JSON-LD hỏng bị báo", () => {
  const head = '<title>t</title><script type="application/ld+json">{khong phai json}</script>';
  assert.ok(kiemSeo(head).some((muc) => muc.dau === "✗" && /không đọc được/.test(muc.noiDung)));
});
