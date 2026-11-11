// Mô hình giả lập: một kịch bản viết tay trả về đúng hình dạng phản hồi của API, để chạy được khi chưa có key.
// Nó quyết định bằng regex, không hiểu câu như mô hình thật. Từ bài này nó đọc cả phần trước của cuộc trò chuyện.
import type Anthropic from "@anthropic-ai/sdk";

import { MENU } from "./thong-tin-quan.ts";

export type PhanHoi = Pick<Anthropic.Message, "content" | "stop_reason"> & { inputTokens: number; outputTokens: number };

let dem = 0;
function goiCongCu(name: string, input: Record<string, string | number>): PhanHoi {
  dem += 1;
  const block = { type: "tool_use", id: `toolu_offline_${dem}`, name, input } as Anthropic.ToolUseBlock;
  return { content: [block], stop_reason: "tool_use", inputTokens: 0, outputTokens: 0 };
}

function traLoi(text: string): PhanHoi {
  return { content: [{ type: "text", text } as Anthropic.TextBlock], stop_reason: "end_turn", inputTokens: 0, outputTokens: 0 };
}

const monTrongCau = (cau: string) => Object.keys(MENU).find((mon) => cau.includes(mon));
const muonThem = (cau: string) => /\bthêm\b/.test(cau) && monTrongCau(cau) !== undefined;

// Tên công cụ của lượt gọi gần nhất: tìm khối tool_use có id trùng với tool_use_id của kết quả.
function tenCongCu(messages: Anthropic.MessageParam[], toolUseId: string): string {
  const truoc = messages.at(-2)!.content as Anthropic.ContentBlock[];
  return (truoc.find((b) => b.type === "tool_use" && b.id === toolUseId) as Anthropic.ToolUseBlock).name;
}

// Câu hỏi của lượt hiện tại: tin nhắn bằng chữ gần nhất của khách.
function cauHoiHienTai(messages: Anthropic.MessageParam[]): { cau: string; viTri: number } {
  const viTri = messages.findLastIndex((tin) => tin.role === "user" && typeof tin.content === "string");
  return { cau: String(messages[viTri].content).toLowerCase(), viTri };
}

// Bắt chước việc mô hình thật đọc lại phần trước của cuộc trò chuyện: tìm mã đơn trong thẻ <ghi_nho>
// của system prompt, rồi tới các tin nhắn và kết quả công cụ đứng trước câu hỏi, từ gần tới xa.
function maDonDaNhac(system: string, messages: Anthropic.MessageParam[], truocViTri: number): string | undefined {
  const ghiNho = /<ghi_nho>[\s\S]*?đơn (\d{4})/.exec(system)?.[1];
  if (ghiNho) return ghiNho;
  for (let i = truocViTri - 1; i >= 0; i--) {
    const ma = /\b(\d{4})\b/.exec(JSON.stringify(messages[i].content))?.[1];
    if (ma) return ma;
  }
  return undefined;
}

export function moHinhOffline(system: string, messages: Anthropic.MessageParam[]): PhanHoi {
  const { cau: cauHoi, viTri } = cauHoiHienTai(messages);
  const cuoi = messages.at(-1)!;

  // Lượt mới: tin nhắn cuối là câu hỏi của khách.
  if (typeof cuoi.content === "string") {
    const ma = cauHoi.match(/\b\d{4}\b/)?.[0];
    if (ma && muonThem(cauHoi)) return goiCongCu("them_mon", { ma_don: ma, mon: monTrongCau(cauHoi)!, so_luong: 1 });
    if (ma) return goiCongCu("xem_don", { ma_don: ma });
    const sdt = cauHoi.match(/\b0\d{9}\b/)?.[0];
    if (sdt) return goiCongCu("tim_don_theo_sdt", { so_dien_thoai: sdt });
    if (muonThem(cauHoi)) {
      const maCu = maDonDaNhac(system, messages, viTri);
      if (maCu) return goiCongCu("them_mon", { ma_don: maCu, mon: monTrongCau(cauHoi)!, so_luong: 1 });
      return traLoi("Dạ bạn cho Mộc xin mã đơn hoặc số điện thoại đặt hàng để Mộc thêm món nhé!");
    }
    if (/giờ|mở cửa/.test(cauHoi)) {
      return traLoi(`Dạ, ${(system.split("\n").find((d) => /mở cửa từ/.test(d)) ?? "").replace("Mộc mở", "quán mở")}`);
    }
    if (/ship|phí/.test(cauHoi)) return traLoi(`Dạ, ${system.split("\n").find((d) => /bán kính/.test(d)) ?? ""}`);
    const mon = monTrongCau(cauHoi);
    if (mon) return traLoi(`Dạ ${mon} bên Mộc giá ${MENU[mon].toLocaleString("vi-VN")}đ ạ.`);
    return traLoi("Dạ Mộc chưa có thông tin này ạ.");
  }

  // Giữa lượt: code của mình vừa gửi lại kết quả công cụ (trong một tin nhắn vai "user").
  const ketQua = (cuoi.content as Anthropic.ToolResultBlockParam[]).find((b) => b.type === "tool_result")!;
  const noiDung = String(ketQua.content);
  if (ketQua.is_error) return traLoi(`Dạ Mộc rất tiếc, ${noiDung.charAt(0).toLowerCase()}${noiDung.slice(1)} Bạn cần Mộc hỗ trợ gì thêm không ạ?`);

  const don = JSON.parse(noiDung) as { ma_don: string; mon?: string[]; trang_thai?: string; dat_luc?: string };
  const congCu = tenCongCu(messages, ketQua.tool_use_id);
  if (congCu === "tim_don_theo_sdt") return goiCongCu("xem_don", { ma_don: don.ma_don });
  if (congCu === "xem_don" && muonThem(cauHoi) && don.trang_thai === "đang pha chế") {
    return goiCongCu("them_mon", { ma_don: don.ma_don, mon: monTrongCau(cauHoi)!, so_luong: 1 });
  }
  if (congCu === "them_mon") return traLoi(`Dạ Mộc đã thêm vào đơn ${don.ma_don}. Đơn giờ gồm: ${don.mon!.join(", ")}, vẫn đang pha chế ạ.`);
  return traLoi(`Dạ đơn ${don.ma_don} (${don.mon!.join(", ")}) bạn đặt ${don.dat_luc} hiện ${don.trang_thai} ạ.`);
}
