-- Tác giả (người đăng nhập có app_metadata.role = 'author') được đọc mọi bài, thêm, sửa và xóa bài.
-- app_metadata chỉ sửa được từ phía quản trị (SQL, Dashboard), người dùng không tự sửa được.

-- Lớp 1: vai authenticated được phép ghi vào bảng.
grant insert, update, delete on public.posts to authenticated;

-- Lớp 2: nhưng chỉ những dòng mà policy cho phép, và policy chỉ nhận tác giả.
create policy "Tác giả đọc được mọi bài"
on public.posts for select
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'author');

create policy "Tác giả thêm được bài"
on public.posts for insert
to authenticated
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'author');

create policy "Tác giả sửa được bài"
on public.posts for update
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'author')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'author');

create policy "Tác giả xóa được bài"
on public.posts for delete
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'author');
