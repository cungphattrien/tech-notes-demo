// Chạy cả ba migration (có RLS và policy), rồi thử mọi thao tác dưới vai anon.
import { demBai, taoDb, voiVaiAnon } from "./gia-lap-supabase.mjs";

const db = await taoDb(3);
console.log(`Bảng posts có ${await demBai(db)} bài: 2 đã đăng, 1 nháp, 1 hẹn giờ năm 2030.\n`);

await voiVaiAnon(db, "anon đọc bài", "select slug from public.posts order by published_at desc");
await voiVaiAnon(db, "anon hỏi thẳng bài nháp", "select count(*)::int as so_dong from public.posts where slug = 'bai-dang-viet-do'");
await voiVaiAnon(db, "anon sửa tiêu đề", "update public.posts set title = 'Blog này đã bị sửa' where slug = 'xin-chao'");
await voiVaiAnon(db, "anon xóa bài", "delete from public.posts where slug = 'vi-sao-viet-blog'");
await voiVaiAnon(db, "anon thêm bài", "insert into public.posts (slug, title) values ('bai-la', 'Bài lạ')");

// Giả sử một ngày có người lỡ tay cấp lại hết quyền cho anon. RLS vẫn còn đó.
await db.exec("grant all on public.posts to anon;");
console.log("\n-- lỡ tay chạy: grant all on public.posts to anon --\n");

await voiVaiAnon(db, "anon đọc bài", "select slug from public.posts order by published_at desc");
await voiVaiAnon(db, "anon sửa tiêu đề", "update public.posts set title = 'Blog này đã bị sửa' where slug = 'xin-chao'");
await voiVaiAnon(db, "anon xóa bài", "delete from public.posts where slug = 'vi-sao-viet-blog'");
await voiVaiAnon(db, "anon thêm bài", "insert into public.posts (slug, title) values ('bai-la', 'Bài lạ')");

const tieuDe = await db.query("select title from public.posts where slug = 'xin-chao'");
console.log(`\nSố bài còn lại: ${await demBai(db)}. Tiêu đề bài xin-chao: ${tieuDe.rows[0].title}`);
