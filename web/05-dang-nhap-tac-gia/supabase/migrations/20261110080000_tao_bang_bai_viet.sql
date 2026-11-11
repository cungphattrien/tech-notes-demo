-- Bảng bài viết của blog-mini. Mỗi ràng buộc dưới đây chặn một kiểu dữ liệu sai cụ thể.

create table public.posts (
  id bigint generated always as identity primary key,
  slug text not null unique
    constraint posts_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null
    constraint posts_title_length check (char_length(title) between 1 and 200),
  description text not null default '',
  body_markdown text not null default '',
  status text not null default 'draft'
    constraint posts_status_known check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_published_has_date check (status = 'draft' or published_at is not null)
);

comment on table public.posts is 'Bài viết của blog. Nội dung lưu dạng Markdown.';

-- Trang chủ liệt kê bài đã đăng, mới nhất trước: index cho đúng truy vấn đó.
create index posts_published_at_idx on public.posts (published_at desc) where status = 'published';

-- Tự cập nhật updated_at mỗi lần sửa, không phụ thuộc vào code phía client.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();
