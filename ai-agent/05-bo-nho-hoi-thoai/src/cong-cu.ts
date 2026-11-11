import type Anthropic from "@anthropic-ai/sdk";

import { themMon, timDonTheoMa, timDonTheoSdt } from "./don-hang.ts";

export const CONG_CU: Anthropic.Tool[] = [
  {
    name: "xem_don",
    description:
      "Xem món và trạng thái hiện tại của một đơn hàng theo mã đơn (4 chữ số, ví dụ 1041). " +
      "Gọi công cụ này mỗi khi khách hỏi đơn đã giao chưa, đang ở đâu, khi nào tới.",
    strict: true,
    input_schema: {
      type: "object",
      properties: { ma_don: { type: "string", description: "Mã đơn gồm 4 chữ số, không có dấu #" } },
      required: ["ma_don"],
      additionalProperties: false,
    },
  },
  {
    name: "tim_don_theo_sdt",
    description:
      "Tìm mã đơn gần nhất của khách theo số điện thoại (10 chữ số, bắt đầu bằng 0). " +
      "Chỉ trả về mã đơn; muốn biết trạng thái thì gọi tiếp xem_don.",
    strict: true,
    input_schema: {
      type: "object",
      properties: { so_dien_thoai: { type: "string", description: "Số điện thoại 10 chữ số" } },
      required: ["so_dien_thoai"],
      additionalProperties: false,
    },
  },
  {
    name: "them_mon",
    description:
      "Thêm món vào một đơn còn đang pha chế. Chỉ gọi khi khách nói rõ muốn thêm món nào, bao nhiêu phần. " +
      "Đơn đang giao hoặc đã giao thì công cụ sẽ báo lỗi.",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        ma_don: { type: "string", description: "Mã đơn gồm 4 chữ số" },
        mon: { type: "string", description: "Tên món đúng như trong bảng giá, ví dụ: bạc xỉu" },
        so_luong: { type: "integer", description: "Số phần, từ 1 đến 5" },
      },
      required: ["ma_don", "mon", "so_luong"],
      additionalProperties: false,
    },
  },
];

export type KetQuaCongCu = { noiDung: string; loi: boolean };

// Đầu vào do mô hình viết ra: luôn kiểm tra lại trước khi dùng, như với dữ liệu người dùng gửi lên.
export function chayCongCu(ten: string, dauVao: unknown): KetQuaCongCu {
  const input = (dauVao ?? {}) as Record<string, unknown>;
  if (ten === "xem_don") {
    const ma = String(input.ma_don ?? "").trim();
    if (!/^\d{4}$/.test(ma)) return { noiDung: `Mã đơn "${ma}" không hợp lệ, cần đúng 4 chữ số.`, loi: true };
    const don = timDonTheoMa(ma);
    if (!don) return { noiDung: `Không có đơn ${ma}.`, loi: true };
    return { noiDung: JSON.stringify({ ma_don: don.maDon, mon: don.mon, trang_thai: don.trangThai, dat_luc: don.datLuc }), loi: false };
  }
  if (ten === "tim_don_theo_sdt") {
    const sdt = String(input.so_dien_thoai ?? "").replace(/\s/g, "");
    if (!/^0\d{9}$/.test(sdt)) return { noiDung: `Số điện thoại "${sdt}" không hợp lệ.`, loi: true };
    const don = timDonTheoSdt(sdt);
    if (!don) return { noiDung: "Không tìm thấy đơn nào với số này.", loi: true };
    return { noiDung: JSON.stringify({ ma_don: don.maDon }), loi: false };
  }
  if (ten === "them_mon") {
    const ma = String(input.ma_don ?? "").trim();
    const mon = String(input.mon ?? "").trim().toLowerCase();
    const soLuong = Number(input.so_luong);
    if (!/^\d{4}$/.test(ma)) return { noiDung: `Mã đơn "${ma}" không hợp lệ, cần đúng 4 chữ số.`, loi: true };
    if (!Number.isInteger(soLuong) || soLuong < 1 || soLuong > 5) return { noiDung: `Số lượng ${input.so_luong} không hợp lệ (1 đến 5).`, loi: true };
    const kq = themMon(ma, mon, soLuong);
    if (!kq.ok) return { noiDung: kq.lyDo, loi: true };
    return { noiDung: JSON.stringify({ ma_don: kq.don.maDon, mon: kq.don.mon, trang_thai: kq.don.trangThai }), loi: false };
  }
  return { noiDung: `Không có công cụ tên "${ten}".`, loi: true };
}
