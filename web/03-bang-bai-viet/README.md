# Tập 3 — Thiết kế bảng bài viết trên Supabase và viết migration

Bài viết chuyển từ `src/content/posts.ts` vào bảng `posts`. Bảng được tạo bằng migration (file SQL có trong Git),
không bấm tay trên Dashboard.

```bash
npm install                        # chỉ cài PGlite: Postgres thật chạy trong Node, không cần Docker
node scripts/bang-long-leo.mjs     # cách làm đầu tiên: bảng toàn cột text, nhận mọi dữ liệu sai
node scripts/chay-migration.mjs    # chạy hai migration + seed, rồi thử lại dữ liệu sai
node scripts/them-cot-sai.mjs      # thêm cột vào bảng đã có dữ liệu: cách sai và cách đúng
```

Với Supabase thật (cần Supabase CLI; `db reset` chạy local cần Docker):

```bash
npx supabase migration new tao_bang_bai_viet   # tạo file rỗng trong supabase/migrations/
npx supabase db reset                          # local: chạy lại mọi migration rồi seed.sql
npx supabase db push                           # đẩy migration lên project đã link
```

Còn lại: bảng chưa bật Row Level Security. Từ 30/10/2026 Supabase không tự mở bảng mới cho Data API,
nên muốn trang đọc được thì phải `grant`; cấp nhầm quyền ghi cho `anon` là ai có key cũng sửa được bài. Bài sau: RLS.
