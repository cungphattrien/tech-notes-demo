-- Cách A (SAI): cứ đăng nhập là được ghi.
grant insert, update, delete on public.posts to authenticated;

create policy "Người đăng nhập đọc được mọi bài"
on public.posts for select
to authenticated
using (true);

create policy "Người đăng nhập thêm được bài"
on public.posts for insert
to authenticated
with check (true);

create policy "Người đăng nhập sửa được bài"
on public.posts for update
to authenticated
using (true)
with check (true);
