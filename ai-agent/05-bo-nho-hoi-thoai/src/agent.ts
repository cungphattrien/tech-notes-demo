import type Anthropic from "@anthropic-ai/sdk";

import { chayCongCu } from "./cong-cu.ts";
import { goiMoHinh, layChu } from "./goi-llm.ts";
import { SYSTEM_V4 } from "./prompts.ts";

export type TinNhan = Anthropic.MessageParam;
export type LanGoi = { soTinNhan: number; kyTu: number; inputTokens: number };
export type KetQuaAgent = { traLoi: string; lichSu: TinNhan[]; nhatKy: string[]; cacLanGoi: LanGoi[] };

// Vòng lặp agent của bài trước, khác một chỗ: nó nhận lịch sử cuộc trò chuyện và trả về lịch sử mới.
export async function chayAgent(lichSu: TinNhan[], cauHoi: string, system = SYSTEM_V4, maxLanGoi = 6): Promise<KetQuaAgent> {
  const messages: TinNhan[] = [...lichSu, { role: "user", content: cauHoi }];
  const nhatKy: string[] = [];
  const cacLanGoi: LanGoi[] = [];

  for (let lan = 1; lan <= maxLanGoi; lan++) {
    const phanHoi = await goiMoHinh(system, messages);
    // Ghi lại mỗi lần gọi đã gửi đi bao nhiêu: số tin nhắn, số ký tự, và số token nếu gọi API thật.
    cacLanGoi.push({ soTinNhan: messages.length, kyTu: JSON.stringify(messages).length, inputTokens: phanHoi.inputTokens });
    messages.push({ role: "assistant", content: phanHoi.content });

    if (phanHoi.stop_reason !== "tool_use") return { traLoi: layChu(phanHoi.content), lichSu: messages, nhatKy, cacLanGoi };

    const ketQua: Anthropic.ToolResultBlockParam[] = [];
    for (const block of phanHoi.content) {
      if (block.type !== "tool_use") continue;
      const kq = chayCongCu(block.name, block.input);
      nhatKy.push(`${block.name}(${JSON.stringify(block.input)}) → ${kq.noiDung}${kq.loi ? "  (is_error)" : ""}`);
      ketQua.push({ type: "tool_result", tool_use_id: block.id, content: kq.noiDung, is_error: kq.loi });
    }
    messages.push({ role: "user", content: ketQua });
  }

  const xinLoi = "Dạ yêu cầu này Mộc chưa xử lý xong, nhân viên sẽ kiểm tra và nhắn lại bạn ngay ạ.";
  messages.push({ role: "assistant", content: xinLoi });
  return { traLoi: xinLoi, lichSu: messages, nhatKy: [...nhatKy, `dừng: đã gọi mô hình ${maxLanGoi} lần`], cacLanGoi };
}
