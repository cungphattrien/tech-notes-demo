import type Anthropic from "@anthropic-ai/sdk";

import type { TinNhan } from "./agent.ts";

// Cách cắt ngây thơ: giữ N tin nhắn cuối, không quan tâm chúng là gì.
export function catTheoSoTinNhan(lichSu: TinNhan[], giu: number): TinNhan[] {
  return lichSu.slice(-giu);
}

// Một lượt bắt đầu bằng tin nhắn của khách (vai user, nội dung là chữ) và kéo dài tới trước tin nhắn kế tiếp của khách.
const laDauLuot = (tin: TinNhan) => tin.role === "user" && typeof tin.content === "string";

// Cách cắt đúng: giữ N lượt cuối, luôn cắt ở ranh giới lượt nên không bao giờ chẻ đôi một cặp tool_use / tool_result.
export function catTheoLuot(lichSu: TinNhan[], giuLuot: number): TinNhan[] {
  const dauLuot = lichSu.flatMap((tin, i) => (laDauLuot(tin) ? [i] : []));
  if (dauLuot.length <= giuLuot) return lichSu;
  return lichSu.slice(dauLuot[dauLuot.length - giuLuot]);
}

// Kiểm tra hai quy tắc của Messages API mà một lịch sử bị cắt sai hay vi phạm. Trả về lỗi đầu tiên, hoặc null.
// Hàm này do mình viết để bắt lỗi khi chạy offline; API thật trả về lỗi 400 với lời văn của riêng nó.
export function kiemTraLichSu(messages: TinNhan[]): string | null {
  if (messages[0]?.role !== "user") return `tin nhắn đầu tiên có vai "${messages[0]?.role}", phải là "user"`;
  for (let i = 0; i < messages.length; i++) {
    const noiDung = messages[i].content;
    if (typeof noiDung === "string") continue;
    for (const block of noiDung) {
      if (block.type !== "tool_result") continue;
      const truoc = i > 0 ? messages[i - 1].content : [];
      const coCap = typeof truoc !== "string" && truoc.some((b) => b.type === "tool_use" && (b as Anthropic.ToolUseBlock).id === block.tool_use_id);
      if (!coCap) return `tin nhắn ${i} chứa tool_result của ${block.tool_use_id}, nhưng tin nhắn ngay trước không có tool_use đó`;
    }
  }
  return null;
}
