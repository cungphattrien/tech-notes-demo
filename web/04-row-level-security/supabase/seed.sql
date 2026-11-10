-- Bốn bài mẫu: hai bài đã đăng, một bài nháp, một bài hẹn giờ đăng trong tương lai.
insert into public.posts (slug, title, description, body_markdown, status, published_at) values
  ('xin-chao', 'Xin chào', 'Bài đầu tiên của blog.',
   E'Đây là bài viết đầu tiên.\n\nBài viết giờ nằm trong bảng posts trên Supabase.',
   'published', '2026-11-03 08:00+07'),
  ('vi-sao-viet-blog', 'Vì sao mình viết blog', 'Ghi lại những gì học được khi đi làm.',
   E'Viết ra giúp mình hiểu kỹ hơn.\n\nVà người đi sau đỡ mất thời gian hơn.',
   'published', '2026-11-04 08:00+07'),
  ('bai-dang-viet-do', 'Bài đang viết dở', 'Chưa xong, chưa muốn ai đọc.',
   'Mới có dàn ý.', 'draft', null),
  ('bai-hen-gio', 'Bài hẹn giờ', 'Đã viết xong, hẹn đăng đầu năm 2030.',
   'Nội dung sẽ lên lúc 8:00 ngày 1/1/2030.', 'published', '2030-01-01 08:00+07');
