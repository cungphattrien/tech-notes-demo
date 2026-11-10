// Cách sửa nhanh (không nên): trang báo "permission denied" thì cấp hết quyền cho anon.
import { demBai, taoDb, voiVaiAnon } from "./gia-lap-supabase.mjs";

const db = await taoDb(2); // hai migration của bài trước: bảng posts và cột tags, chưa có RLS

await voiVaiAnon(db, "Trước khi grant, anon đọc bài", "select slug from public.posts");

await db.exec("grant all on public.posts to anon;");
console.log("\n-- đã chạy: grant all on public.posts to anon --\n");

await voiVaiAnon(db, "anon đọc bài", "select slug, status from public.posts order by id");
await voiVaiAnon(db, "anon sửa tiêu đề", "update public.posts set title = 'Blog này đã bị sửa' where slug = 'xin-chao' returning slug, title");
await voiVaiAnon(db, "anon xóa bài", "delete from public.posts where slug = 'vi-sao-viet-blog'");
console.log(`\nSố bài còn lại trong bảng: ${await demBai(db)}`);
