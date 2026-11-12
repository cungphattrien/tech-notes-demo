// Chạy: node thu.ts. Dựng head của một bài viết theo hai cách rồi chấm điểm; thử sơ đồ trang; thử JSON-LD khi tiêu đề chứa mã độc.
import { renderHead } from "./src/head.ts";
import { kiemSeo } from "./src/kiem-seo.ts";
import { blogPostingLd, serializeJsonLd } from "./src/ld.ts";
import { buildSitemapXml } from "./src/sitemap-xml.ts";

const SITE = "https://blog.example.com";
const bai = {
  title: "Nén ảnh trước khi upload: từ 8,7 MB xuống 440 KB cho blog",
  description: "Nén ảnh trước khi upload cho blog Next.js: thu nhỏ còn 1600 px, đổi sang WebP, bỏ EXIF và GPS. Có số đo thật, bẫy ảnh dọc bị nằm ngang.",
  url: `${SITE}/bai-viet/nen-anh-truoc-khi-upload`,
  publishedAt: "2026-11-15T08:00:00+07:00",
  tags: ["Next.js", "ảnh", "WebP"],
  authorName: "Tác giả",
  siteName: "Blog mẫu",
  siteUrl: SITE,
};
const BAN_EN = `${SITE}/en/posts/compress-images-before-upload`;

const inKetQua = (ten: string, head: string) => {
  console.log(`--- ${ten}`);
  for (const muc of kiemSeo(head)) console.log(`${muc.dau} ${muc.noiDung}`);
};

// Cách 1: chỉ có tiêu đề, như một trang vừa tạo xong chưa ai nghĩ tới SEO.
inKetQua("Trang chỉ có tiêu đề", renderHead({ title: "Bài viết" }));

// Cách 2: đủ metadata và JSON-LD, như generateMetadata cộng với thẻ <script> JSON-LD tạo ra.
inKetQua("Trang đủ metadata và JSON-LD", renderHead({
  title: bai.title,
  description: bai.description,
  canonical: bai.url,
  languages: { vi: bai.url, en: BAN_EN, "x-default": bai.url },
  jsonLd: blogPostingLd(bai),
}));

console.log("\n--- Sơ đồ trang");
console.log(buildSitemapXml([
  { url: bai.url, lastModified: bai.publishedAt, languages: { vi: bai.url, en: BAN_EN } },
  { url: `${SITE}/chu-de/web-thuc-chien` },
]));

// Tiêu đề do người viết đặt: nếu chứa </script>, serialize ngây thơ cho phép thoát khỏi thẻ.
console.log("--- JSON-LD khi tiêu đề chứa mã độc");
const doc = blogPostingLd({ ...bai, title: 'Bài </script><script>alert("xss")</script>' });
const ngayTho = `<script type="application/ld+json">${JSON.stringify(doc)}</script>`;
const antoan = `<script type="application/ld+json">${serializeJsonLd(doc)}</script>`;
const demThe = (html: string) => (html.match(/<script/g) ?? []).length;
console.log(`JSON.stringify thẳng: ${demThe(ngayTho)} thẻ <script> trong kết quả`);
console.log(`serializeJsonLd:      ${demThe(antoan)} thẻ <script> trong kết quả`);
