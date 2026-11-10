-- Hai bài mẫu chuyển từ src/content/posts.ts sang database.
insert into public.posts (slug, title, description, body_markdown, status, published_at) values
  ('xin-chao', 'Xin chào', 'Bài đầu tiên của blog.',
   E'Đây là bài viết đầu tiên.\n\nBài viết giờ nằm trong bảng posts trên Supabase.',
   'published', '2026-11-03 08:00+07'),
  ('vi-sao-viet-blog', 'Vì sao mình viết blog', 'Ghi lại những gì học được khi đi làm.',
   E'Viết ra giúp mình hiểu kỹ hơn.\n\nVà người đi sau đỡ mất thời gian hơn.',
   'published', '2026-11-04 08:00+07');
