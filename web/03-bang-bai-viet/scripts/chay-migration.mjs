// Chạy các file trong supabase/migrations theo thứ tự tên, rồi seed.sql, trên PGlite.
// Sau đó thử lại đúng bốn dòng dữ liệu sai của bảng "cho nhanh".
import { readdirSync, readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();
for (const file of readdirSync("supabase/migrations").sort()) {
  await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8"));
  console.log(`migration ok: ${file}`);
}
await db.exec(readFileSync("supabase/seed.sql", "utf8"));
console.log("seed ok: supabase/seed.sql\n");

const duLieuSai = [
  ["Xin Chao", "Xin chào", "published", "2026-11-03"],
  ["vi-sao-viet-blog-2", "Vì sao mình viết blog", "publised", "2026-11-04"],
  ["bai-chua-xong", "Bài chưa xong", "published", null],
  ["xin-chao", "Xin chào (bản trùng)", "published", "2026-11-03"],
  ["ngay-sai", "Ngày viết kiểu Việt", "published", "13/11/2026"],
  ["ngay-03-11", "Ngày 3 tháng 11 viết kiểu Việt", "published", "03/11/2026"],
];
for (const [slug, title, status, publishedAt] of duLieuSai) {
  try {
    await db.query("insert into public.posts (slug, title, status, published_at) values ($1, $2, $3, $4)", [slug, title, status, publishedAt]);
    const { rows } = await db.query("select published_at::date::text as ngay from public.posts where slug = $1", [slug]);
    console.log(`đã lưu ${slug}, nhưng published_at = ${rows[0].ngay}`);
  } catch (error) {
    console.log(`từ chối ${slug}: ${error.message}`);
  }
}

const truoc = await db.query("select updated_at from public.posts where slug = 'xin-chao'");
await db.query("update public.posts set title = 'Xin chào!' where slug = 'xin-chao'");
const sau = await db.query("select updated_at from public.posts where slug = 'xin-chao'");
console.log(`\nupdated_at tự đổi khi sửa bài: ${truoc.rows[0].updated_at.getTime() !== sau.rows[0].updated_at.getTime()}`);

const trangChu = await db.query("select slug, tags from public.posts where status = 'published' order by published_at desc");
console.log(`Trang chủ: ${trangChu.rows.map((r) => `${r.slug} (tags: ${JSON.stringify(r.tags)})`).join(", ")}`);
