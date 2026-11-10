-- Thêm thẻ (tags) cho bài viết. Tương thích ngược: các bài đã có nhận mảng rỗng,
-- và bản app cũ (chưa biết cột này) vẫn thêm bài được vì cột có giá trị mặc định.
alter table public.posts
  add column tags text[] not null default '{}'
    constraint posts_tags_limit check (cardinality(tags) <= 10);
