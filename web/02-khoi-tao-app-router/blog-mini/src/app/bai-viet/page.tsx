import type { Metadata } from "next";

import { PostCard } from "@/components/post-card";
import { posts } from "@/content/posts";

export const metadata: Metadata = { title: "Bài viết" };

// "/bai-viet": danh sách mọi bài.
export default function PostsPage() {
  return (
    <>
      <h1>Bài viết</h1>
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </>
  );
}
