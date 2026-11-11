import { notFound } from "next/navigation";

import { layBai, layTatCaSlug } from "../../../lib/posts.js";

// Phiên bản 1: chưa có dòng nào nói với Next.js về việc lưu cache.
export async function generateStaticParams() {
  return (await layTatCaSlug()).map((slug) => ({ slug }));
}

export default async function TrangBai({ params }) {
  const { slug } = await params;
  const bai = await layBai(slug);
  if (!bai) notFound();
  return (
    <main>
      <h1>{bai.title}</h1>
      <p>{bai.body}</p>
    </main>
  );
}
