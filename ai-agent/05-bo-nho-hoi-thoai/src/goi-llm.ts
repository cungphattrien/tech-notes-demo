// Gửi cuộc hội thoại kèm danh sách công cụ cho mô hình, nhận về phản hồi.
// Có ANTHROPIC_API_KEY: gọi Claude thật. Không có key: dùng chế độ offline (giả lập).
import Anthropic from "@anthropic-ai/sdk";

import { CONG_CU } from "./cong-cu.ts";
import { moHinhOffline, type PhanHoi } from "./offline.ts";

export const MODEL = "claude-opus-5-5";

export function coKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY) && process.env.MOC_OFFLINE !== "1";
}

export async function goiMoHinh(system: string, messages: Anthropic.MessageParam[]): Promise<PhanHoi> {
  if (!coKey()) return moHinhOffline(system, messages);
  const client = new Anthropic(); // tự đọc ANTHROPIC_API_KEY từ biến môi trường
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: "low" },
    system,
    tools: CONG_CU, // giờ có ba công cụ, gồm cả them_mon
    messages,
  });
  return {
    content: response.content,
    stop_reason: response.stop_reason,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}

export function layChu(content: Anthropic.ContentBlock[]): string {
  return content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
}
