import type { TinNhan } from "./agent.ts";
import { SYSTEM_V4 } from "./prompts.ts";

// Đọc toàn bộ lịch sử, rút ra điều cần nhớ lâu: mã đơn gần nhất mà một công cụ đã trả về.
// Code tự rút từ kết quả công cụ, không nhờ mô hình tóm tắt, nên không thể nhớ sai.
export function donDangNoi(lichSu: TinNhan[]): string | null {
  let maDon: string | null = null;
  for (const tin of lichSu) {
    if (typeof tin.content === "string") continue;
    for (const block of tin.content) {
      if (block.type !== "tool_result" || block.is_error) continue;
      const ma = /"ma_don":"(\d{4})"/.exec(String(block.content))?.[1];
      if (ma) maDon = ma;
    }
  }
  return maDon;
}

// System prompt của quán, thêm một thẻ <ghi_nho> khi đã biết khách đang nói về đơn nào.
export function systemCoGhiNho(lichSu: TinNhan[]): string {
  const ma = donDangNoi(lichSu);
  if (!ma) return SYSTEM_V4;
  return `${SYSTEM_V4}\n\n<ghi_nho>\nTrong cuộc trò chuyện này khách đang nói về đơn ${ma}.\n</ghi_nho>`;
}
