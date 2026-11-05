// Gửi một câu hỏi tới LLM và nhận câu trả lời.
// Có ANTHROPIC_API_KEY: gọi Claude thật qua SDK chính thức.
// Không có key: dùng chế độ offline (giả lập), để ai cũng chạy được code.
import Anthropic from "@anthropic-ai/sdk";

import { traLoiOffline } from "./offline.ts";

export const MODEL = "claude-opus-5-5";

export type KetQua = {
  text: string;
  stopReason: string | null;
  inputTokens: number;
  outputTokens: number;
  offline: boolean;
};

export function coKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY) && process.env.MOC_OFFLINE !== "1";
}

export async function hoiLLM(system: string, cauHoi: string): Promise<KetQua> {
  if (!coKey()) return traLoiOffline(system, cauHoi);

  const client = new Anthropic(); // tự đọc ANTHROPIC_API_KEY từ biến môi trường
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 16000,
      output_config: { effort: "low" }, // câu hỏi đơn giản, không cần suy nghĩ lâu
      system,
      messages: [{ role: "user", content: cauHoi }],
    });

    // content là một mảng nhiều khối; chỉ lấy các khối chữ.
    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    return {
      text,
      stopReason: response.stop_reason,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      offline: false,
    };
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) throw new Error("API key sai hoặc đã bị thu hồi.", { cause: error });
    if (error instanceof Anthropic.RateLimitError) throw new Error("Gọi quá nhanh, thử lại sau ít phút.", { cause: error });
    throw error;
  }
}
