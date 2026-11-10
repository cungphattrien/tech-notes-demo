-- Người đọc (vai anon) chỉ được ĐỌC các bài đã đăng và đã tới giờ đăng.
-- Lớp 1: grant quyết định vai nào được làm thao tác gì trên bảng.
revoke all on public.posts from anon, authenticated;
grant select on public.posts to anon, authenticated;

-- Lớp 2: Row Level Security quyết định vai đó thấy những DÒNG nào.
alter table public.posts enable row level security;

create policy "Ai cũng đọc được bài đã đăng"
on public.posts for select
to anon, authenticated
using (status = 'published' and published_at <= now());
