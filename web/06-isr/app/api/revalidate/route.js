import { revalidatePath } from "next/cache";

// Gọi sau khi tác giả sửa bài: bỏ cache của đúng trang đó, lần xem kế tiếp dựng lại ngay.
// Chỉ ai biết REVALIDATE_SECRET mới gọi được. Chưa đặt biến này thì từ chối mọi request.
export async function POST(request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ loi: "không có quyền" }, { status: 401 });
  }
  const { slug } = await request.json();
  revalidatePath(`/bai-viet/${slug}`);
  return Response.json({ daLamMoi: `/bai-viet/${slug}` });
}
