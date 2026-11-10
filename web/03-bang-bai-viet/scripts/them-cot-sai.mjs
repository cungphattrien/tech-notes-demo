// Thêm cột vào bảng ĐÃ CÓ dữ liệu: cách viết sai, rồi cách viết đúng.
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();
await db.exec(readFileSync("supabase/migrations/20261110080000_tao_bang_bai_viet.sql", "utf8"));
await db.exec(readFileSync("supabase/seed.sql", "utf8"));
console.log("Bảng posts đang có 2 bài.\n");

try {
  await db.exec("alter table public.posts add column tags text[] not null;");
  console.log("cách 1 chạy được");
} catch (error) {
  console.log(`cách 1 (not null, không có default) lỗi: ${error.message}`);
}

await db.exec(readFileSync("supabase/migrations/20261110090000_them_the_bai_viet.sql", "utf8"));
console.log("cách 2 (not null default '{}') chạy được");

// Bản app cũ chưa biết cột tags: câu insert của nó không nhắc tới tags.
await db.query("insert into public.posts (slug, title) values ('bai-tu-app-cu', 'Bài thêm từ bản app cũ')");
const rows = await db.query("select slug, tags from public.posts order by id");
for (const row of rows.rows) console.log(`  ${row.slug}: tags = ${JSON.stringify(row.tags)}`);
