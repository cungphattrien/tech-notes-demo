import { notFound } from "next/navigation";

import { layBai, layTatCaSlug } from "../../../lib/posts.js";

// Phiên bản 3: ISR. Trang được lưu cache, và tối đa 10 giây một lần Next.js dựng lại nó ở nền.
export const revalidate = 10;
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
