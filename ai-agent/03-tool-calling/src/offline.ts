// Chế độ offline: KHÔNG phải mô hình thật. Nó trả về đúng HÌNH DẠNG phản hồi của API khi có công cụ
// (khối tool_use, stop_reason "tool_use"), theo kịch bản cho mấy câu hỏi mẫu, để bạn chạy được code
// khi chưa có key. Câu chữ của mô hình thật mỗi lần mỗi khác, và nó tự quyết định có gọi công cụ hay không.
import type Anthropic from "@anthropic-ai/sdk";

export type PhanHoi = Pick<Anthropic.Message, "content" | "stop_reason"> & { inputTokens: number; outputTokens: number };

let dem = 0;
function goiCongCu(name: string, input: Record<string, string>): PhanHoi {
  dem += 1;
  const block = { type: "tool_use", id: `toolu_offline_${dem}`, name, input } as Anthropic.ToolUseBlock;
  return { content: [block], stop_reason: "tool_use", inputTokens: 0, outputTokens: 0 };
}

function traLoi(text: string): PhanHoi {
  return { content: [{ type: "text", text } as Anthropic.TextBlock], stop_reason: "end_turn", inputTokens: 0, outputTokens: 0 };
}

function dongCo(system: string, tuKhoa: RegExp): string | undefined {
  return system.split("\n").find((dong) => tuKhoa.test(dong));
}

export function moHinhOffline(system: string, messages: Anthropic.MessageParam[]): PhanHoi {
  const cauHoi = String(messages[0].content).toLowerCase();
  const cuoi = messages.at(-1)!;

  // Lượt đầu: chỉ có câu hỏi của khách.
  if (typeof cuoi.content === "string") {
    const ma = cauHoi.match(/\b\d{4}\b/)?.[0];
    if (ma) return goiCongCu("xem_don", { ma_don: ma });
    const sdt = cauHoi.match(/\b0\d{9}\b/)?.[0];
    if (sdt) return goiCongCu("tim_don_theo_sdt", { so_dien_thoai: sdt });
    if (/giờ|mở cửa/.test(cauHoi)) return traLoi(`Dạ, ${(dongCo(system, /mở cửa từ/) ?? "").replace("Mộc mở", "quán mở")}`);
    return traLoi("Dạ Mộc chưa có thông tin này ạ.");
  }

  // Lượt sau: code của mình gửi lại kết quả công cụ (trong một tin nhắn vai "user").
  const ketQua = (cuoi.content as Anthropic.ToolResultBlockParam[]).find((b) => b.type === "tool_result")!;
  const noiDung = String(ketQua.content);
  if (ketQua.is_error) {
    return traLoi(`Dạ Mộc chưa tìm thấy đơn này (${noiDung.replace(/\.$/, "")}). Bạn kiểm tra lại mã đơn hoặc gửi Mộc số điện thoại đặt hàng nhé!`);
  }
  const don = JSON.parse(noiDung) as { ma_don: string; mon?: string[]; trang_thai?: string; dat_luc?: string };
  // Mới có mã đơn mà khách hỏi trạng thái: cần gọi thêm xem_don.
  if (!don.trang_thai) return goiCongCu("xem_don", { ma_don: don.ma_don });
  return traLoi(`Dạ đơn ${don.ma_don} (${don.mon!.join(", ")}) bạn đặt ${don.dat_luc} hiện vẫn ${don.trang_thai}, chưa giao ạ. Mộc sẽ báo bạn ngay khi đơn lên đường nhé!`);
}
