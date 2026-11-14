import { hoiMoHinhGia } from "../../../lib/mo-hinh-gia.js";

export const dynamic = "force-dynamic";

// POST /api/chat-cho-du: bản cũ. Đợi mô hình viết xong cả câu rồi mới trả một cục JSON.
export async function POST(request) {
  const { tin } = await request.json();
  let cauTraLoi = "";
  for await (const manh of hoiMoHinhGia(tin)) cauTraLoi += manh;
  return Response.json({ cauTraLoi });
}
