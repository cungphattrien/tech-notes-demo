import { pipeline } from "@xenova/transformers";

import type { Doan } from "./tach-doan.ts";

// Mô hình embedding nhỏ (384 chiều, khoảng 120 MB), chạy ngay trên máy, hiểu tiếng Việt.
// Lần chạy đầu nó tải về một lần rồi lưu vào thư mục cache của thư viện.
const TEN_MO_HINH = "Xenova/multilingual-e5-small";

let boNhung: Awaited<ReturnType<typeof pipeline>> | undefined;

async function nhung(cacChu: string[]): Promise<number[][]> {
  boNhung ??= await pipeline("feature-extraction", TEN_MO_HINH);
  const ketQua = await boNhung(cacChu, { pooling: "mean", normalize: true });
  return ketQua.tolist() as number[][];
}

// Họ mô hình e5 được huấn luyện với tiền tố: "query: " cho câu hỏi và "passage: " cho đoạn tài liệu.
export async function nhungCauHoi(cauHoi: string): Promise<number[]> {
  return (await nhung([`query: ${cauHoi}`]))[0];
}

// Mặc định chỉ nhúng nội dung đoạn. Đặt KEM_TIEU_DE=1 để nhúng cả tiêu đề mục (xem so sánh trong bài).
export async function nhungCacDoan(cacDoan: Doan[]): Promise<number[][]> {
  const kemTieuDe = process.env.KEM_TIEU_DE === "1";
  return nhung(cacDoan.map((d) => `passage: ${kemTieuDe ? `${d.tieuDe}. ` : ""}${d.noiDung}`));
}

// Vector đã chuẩn hóa độ dài về 1, nên tích vô hướng chính là độ giống nhau (cosine similarity).
export function doGiong(a: number[], b: number[]): number {
  return a.reduce((tong, x, i) => tong + x * b[i], 0);
}
