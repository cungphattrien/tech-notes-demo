// Cách làm đầu tiên: tạo bảng kiểu "cho nhanh", cột nào cũng là text và được để trống.
// Chạy trên PGlite (Postgres thật, chạy trong Node), không cần Docker hay tài khoản Supabase.
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();
await db.exec(`
  create table posts (id serial primary key, slug text, title text, body text, status text, published_at text);
`);

const duLieu = [
  ["Xin Chao", "Xin chào", "published", "2026-11-03"],
  ["vi-sao-viet-blog", "Vì sao mình viết blog", "publised", "2026-11-04"],
  ["bai-chua-xong", "Bài chưa xong", "published", null],
  ["xin-chao", "Xin chào (bản trùng)", "published", "03/11/2026"],
];
for (const [slug, title, status, publishedAt] of duLieu) {
  await db.query("insert into posts (slug, title, status, published_at) values ($1, $2, $3, $4)", [slug, title, status, publishedAt]);
  console.log(`đã lưu: ${slug} | ${status} | ${publishedAt}`);
}

const trangChu = await db.query("select slug from posts where status = 'published' order by published_at desc");
console.log(`\nTrang chủ (status = 'published', mới nhất trước): ${trangChu.rows.map((r) => r.slug).join(", ")}`);
