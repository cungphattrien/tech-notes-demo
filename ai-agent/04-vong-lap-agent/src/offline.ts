// Mô hình giả lập: một kịch bản viết tay trả về đúng hình dạng phản hồi của API, để chạy được khi chưa có key.
// Nó quyết định bằng regex, không hiểu câu như mô hình thật.
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

export function moHinhOffline(system: string, messages: Anthropic.MessageParam[]): PhanHoi {
  const cauHoi = String(messages[0].content).toLowerCase();
  const cuoi = messages.at(-1)!;

  // Lượt đầu: chỉ có câu hỏi của khách.
  if (typeof cuoi.content === "string") {
    const ma = cauHoi.match(/\b\d{4}\b/)?.[0];
    if (ma && muonThem(cauHoi)) return goiCongCu("them_mon", { ma_don: ma, mon: monTrongCau(cauHoi)!, so_luong: 1 });
    if (ma) return goiCongCu("xem_don", { ma_don: ma });
    const sdt = cauHoi.match(/\b0\d{9}\b/)?.[0];
    if (sdt) return goiCongCu("tim_don_theo_sdt", { so_dien_thoai: sdt });
    if (muonThem(cauHoi)) return traLoi("Dạ bạn cho Mộc xin mã đơn hoặc số điện thoại đặt hàng để Mộc thêm món nhé!");
    if (/giờ|mở cửa/.test(cauHoi)) {
      return traLoi(`Dạ, ${(system.split("\n").find((d) => /mở cửa từ/.test(d)) ?? "").replace("Mộc mở", "quán mở")}`);
    }
    return traLoi("Dạ Mộc chưa có thông tin này ạ.");
  }

  // Lượt sau: code của mình gửi lại kết quả công cụ (trong một tin nhắn vai "user").
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
