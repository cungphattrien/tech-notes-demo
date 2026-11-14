import assert from "node:assert/strict";
import { test } from "node:test";
import { kiemSauDeploy, type Lay } from "./kiem-sau-deploy.ts";

const trang = (opts: { status?: number; robots?: string; header?: string; canonical?: string; title?: string } = {}) =>
  `<html><head>${opts.title ?? "<title>Tech Notes</title>"}${opts.robots ? `<meta name="robots" content="${opts.robots}"/>` : ""}${
    opts.canonical ? `<link rel="canonical" href="${opts.canonical}"/><meta property="og:image" content="${opts.canonical}/og.png"/>` : ""
  }</head><body>x</body></html>`;

const gia = (cacTrang: Record<string, { status?: number; body: string; header?: string }>): Lay => async (url) => {
  const duong = new URL(url).pathname;
  const t = cacTrang[duong] ?? { status: 404, body: "" };
  return { status: t.status ?? 200, headers: { get: (ten: string) => (ten.toLowerCase() === "x-robots-tag" ? (t.header ?? null) : null) }, text: async () => t.body };
};

const DUNG_PRODUCTION = {
  "/": { body: trang({ canonical: "https://example.com" }) },
  "/bai-viet": { body: trang({ canonical: "https://example.com/bai-viet" }) },
  "/robots.txt": { body: "User-Agent: *\nAllow: /\nDisallow: /tim-kiem\n" },
};
const DUNG_PREVIEW = {
  "/": { body: trang({ robots: "noindex, nofollow" }) },
  "/bai-viet": { body: trang({}), header: "noindex" },
  "/robots.txt": { body: "User-Agent: *\nDisallow: /\n" },
};

test("production đúng: 200, có title, index được, robots.txt cho phép", async () => {
  const kq = await kiemSauDeploy("https://example.com/", "production", gia(DUNG_PRODUCTION));
  assert.equal(kq.length, 3);
  assert.ok(kq.every((k) => k.dat), JSON.stringify(kq));
});

test("preview đúng: noindex qua thẻ meta hoặc qua header X-Robots-Tag, robots.txt chặn hết", async () => {
  const kq = await kiemSauDeploy("https://preview.example.com", "preview", gia(DUNG_PREVIEW));
  assert.ok(kq.every((k) => k.dat), JSON.stringify(kq));
});

test("production mà có noindex hoặc robots.txt chặn hết thì báo", async () => {
  const kq = await kiemSauDeploy("https://example.com", "production", gia(DUNG_PREVIEW));
  assert.equal(kq.filter((k) => !k.dat).length, 3);
  assert.match(kq[0]!.chiTiet, /production mà có noindex/);
  assert.match(kq[2]!.chiTiet, /chặn toàn bộ/);
});

test("preview mà không noindex hoặc robots.txt cho phép thì báo", async () => {
  const kq = await kiemSauDeploy("https://preview.example.com", "preview", gia(DUNG_PRODUCTION));
  assert.match(kq[0]!.chiTiet, /preview mà không có noindex/);
  assert.match(kq[2]!.chiTiet, /không chặn toàn bộ/);
});

test("production mà canonical hoặc og:image trỏ về localhost thì báo, nhắc NEXT_PUBLIC_SITE_URL", async () => {
  const kq = await kiemSauDeploy("https://example.com", "production", gia({ ...DUNG_PRODUCTION, "/": { body: trang({ canonical: "http://localhost:3000" }) } }));
  assert.equal(kq[0]!.dat, false);
  assert.match(kq[0]!.chiTiet, /localhost.*NEXT_PUBLIC_SITE_URL/);
});

test("mã khác 200 và trang thiếu title đều bị báo", async () => {
  const kq = await kiemSauDeploy("https://example.com", "production", gia({ ...DUNG_PRODUCTION, "/": { status: 500, body: trang({ title: "" }) } }));
  assert.match(kq[0]!.chiTiet, /mã 500/);
  assert.match(kq[0]!.chiTiet, /không có <title>/);
});

test("không kết nối được thì báo thay vì ném lỗi, các chỗ khác vẫn được kiểm", async () => {
  let lanGoi = 0;
  const lay: Lay = async (url) => {
    if (++lanGoi === 1) throw new Error("ECONNREFUSED");
    return gia(DUNG_PRODUCTION)(url);
  };
  const kq = await kiemSauDeploy("https://example.com", "production", lay);
  assert.match(kq[0]!.chiTiet, /không kết nối được \(ECONNREFUSED\)/);
  assert.equal(kq[1]!.dat, true);
});
