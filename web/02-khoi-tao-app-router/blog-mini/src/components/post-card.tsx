import Link from "next/link";

import type { Post } from "@/content/posts";

// Component dùng chung, để ngoài app/ nên không bao giờ bị hiểu nhầm thành một trang.
export function PostCard({ post }: { post: Post }) {
  return (
    <article>
      <h2>
        <Link href={`/bai-viet/${post.slug}`}>{post.title}</Link>
      </h2>
      <p>{post.description}</p>
    </article>
  );
}
