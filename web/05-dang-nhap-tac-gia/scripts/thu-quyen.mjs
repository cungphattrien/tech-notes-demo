// Thử ba bộ policy với bốn người, mỗi người làm ba việc: đếm bài nhìn thấy, sửa một tiêu đề, thêm một bài.
import { chayVoi, taoDb } from "./gia-lap-supabase.mjs";

// Nội dung JWT (claims) của từng người. Supabase tự tạo phần này khi người dùng đăng nhập.
const NGUOI = [
  ["người lạ, chưa đăng nhập", null],
  ["khách vừa tự đăng ký", { sub: "00000000-0000-0000-0000-000000000002", role: "authenticated", app_metadata: {}, user_metadata: {} }],
  ["khách tự ghi role=author vào user_metadata", { sub: "00000000-0000-0000-0000-000000000003", role: "authenticated", app_metadata: {}, user_metadata: { role: "author" } }],
  ["tác giả (app_metadata.role=author)", { sub: "00000000-0000-0000-0000-000000000001", role: "authenticated", app_metadata: { role: "author" }, user_metadata: {} }],
];

const BO_POLICY = [
  ["A. Cứ đăng nhập là được ghi", 3, "policy-thu/a-ai-dang-nhap-cung-ghi.sql"],
  ["B. Kiểm tra user_metadata", 3, "policy-thu/b-user-metadata.sql"],
  ["C. Kiểm tra app_metadata (migration thứ tư)", 4, undefined],
];

for (const [ten, soMigration, sqlThem] of BO_POLICY) {
  console.log(`=== ${ten} ===`);
  for (const [nguoi, claims] of NGUOI) {
    const db = await taoDb(soMigration, sqlThem); // mỗi người một database mới, để không ai thấy thay đổi của ai
    const thay = await chayVoi(db, claims, "select count(*)::int from public.posts");
    const sua = await chayVoi(db, claims, "update public.posts set title = 'Đã bị sửa' where slug = 'xin-chao'");
    const them = await chayVoi(db, claims, "insert into public.posts (slug, title) values ('bai-moi', 'Bài mới')");
    console.log(`${nguoi}\n    thấy ${thay} bài | sửa: ${sua} | thêm: ${them}`);
  }
  console.log();
}
