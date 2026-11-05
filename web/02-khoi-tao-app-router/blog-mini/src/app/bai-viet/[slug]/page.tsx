import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPost, posts } from "@/content/posts";

// Tạo sẵn trang cho từng bài lúc build.
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

// Từ Next.js 15, params là một Promise: phải await trước khi dùng.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return post ? { title: post.title, description: post.description } : {};
}

// "/bai-viet/<slug>": một bài viết.
export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      {post.body.split("\n\n").map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </article>
  );
}
