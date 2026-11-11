-- Cách B (SAI): kiểm tra vai trò trong user_metadata, phần mà người dùng tự sửa được.
grant insert, update, delete on public.posts to authenticated;

create policy "Tác giả đọc được mọi bài"
on public.posts for select
to authenticated
using ((select auth.jwt() -> 'user_metadata' ->> 'role') = 'author');

create policy "Tác giả thêm được bài"
on public.posts for insert
to authenticated
with check ((select auth.jwt() -> 'user_metadata' ->> 'role') = 'author');

create policy "Tác giả sửa được bài"
on public.posts for update
to authenticated
using ((select auth.jwt() -> 'user_metadata' ->> 'role') = 'author')
with check ((select auth.jwt() -> 'user_metadata' ->> 'role') = 'author');
