// Bài viết nằm thẳng trong code. Tiện để bắt đầu, nhưng mỗi lần sửa một chữ là một lần commit và deploy.
export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  body: string;
};

export const posts: Post[] = [
  {
    slug: "xin-chao",
    title: "Xin chào",
    description: "Bài đầu tiên của blog.",
    date: "2026-11-03",
    body: "Đây là bài viết đầu tiên.\n\nBài viết đang nằm trong file src/content/posts.ts.",
  },
  {
    slug: "vi-sao-viet-blog",
    title: "Vì sao mình viết blog",
    description: "Ghi lại những gì học được khi đi làm.",
    date: "2026-11-04",
    body: "Viết ra giúp mình hiểu kỹ hơn.\n\nVà người đi sau đỡ mất thời gian hơn.",
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
