import { PostCard } from "@/components/post-card";
import { posts } from "@/content/posts";

// Trang chủ: "/". Là Server Component nên đọc dữ liệu trực tiếp, không cần useEffect.
export default function HomePage() {
  const latest = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  return (
    <>
      <h1>Ghi chép thực hành cho developer</h1>
      {latest.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </>
  );
}
