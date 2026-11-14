# Tập 12 — Đăng ký bản tin không cần dịch vụ trả phí

Tiếp tập 11. Người đọc đến rồi đi, blog cần một cách để họ để lại email. Tập này so hai cách làm bảng đăng ký (cho trình duyệt ghi thẳng, và chỉ mở một hàm `subscribe()` như blog Tech Notes đang dùng), rồi thử bộ lọc robot của form.

Không cần Supabase: `@electric-sql/pglite` chạy Postgres thật ngay trong Node. `migration.sql` là migration thật của blog (`supabase/migrations/20261104113040_newsletter_subscribers.sql`), còn `moi-truong.sql` dựng lại hai vai trò `anon`, `authenticated` và hàm `auth.jwt()` mà Supabase có sẵn. Mọi email là giả (`example.com`).

- `src/ban-tin.ts`: các hàm thuần (kiểm tra email, nhận ra robot, nguồn đăng ký) cùng ý với `src/lib/newsletter.ts` của blog.
- `chay.ts`: cách 1 (anon ghi và đọc thẳng bảng), cách 1b (bỏ policy đọc nhưng vẫn lộ qua lỗi trùng) và cách 2 (migration thật), gồm hủy đăng ký và chặn tràn 30 lượt mỗi phút.
- `thu-robot.ts`: năm lượt gửi form giả qua bộ lọc robot.
- `src/ban-tin.test.ts`: 12 test.

```bash
npm install
node chay.ts
node thu-robot.ts
node --test src/ban-tin.test.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts). Form React và Server Action của blog nằm trong repo `tech-notes`, không chạy ở đây.
