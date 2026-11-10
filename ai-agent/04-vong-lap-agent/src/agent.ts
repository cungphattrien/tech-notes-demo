import type Anthropic from "@anthropic-ai/sdk";

import { chayCongCu } from "./cong-cu.ts";
import { goiMoHinh, layChu } from "./goi-llm.ts";
import { SYSTEM_V4 } from "./prompts.ts";

export type KetQuaAgent = { traLoi: string; soLanGoi: number; nhatKy: string[] };

// Vòng lặp agent: gọi mô hình, chạy công cụ nó xin, gửi kết quả lại, lặp tới khi nó trả lời bằng chữ.
export async function chayAgent(cauHoi: string, maxLanGoi = 6): Promise<KetQuaAgent> {
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: cauHoi }];
  const nhatKy: string[] = [];

  for (let lan = 1; lan <= maxLanGoi; lan++) {
    const phanHoi = await goiMoHinh(SYSTEM_V4, messages);
    messages.push({ role: "assistant", content: phanHoi.content }); // luôn gửi lại nguyên văn

    // Không xin công cụ nữa: đây là câu trả lời cuối.
    if (phanHoi.stop_reason !== "tool_use") return { traLoi: layChu(phanHoi.content), soLanGoi: lan, nhatKy };

    // Chạy MỌI khối tool_use của lượt này, gom kết quả vào MỘT tin nhắn.
    const ketQua: Anthropic.ToolResultBlockParam[] = [];
    for (const block of phanHoi.content) {
      if (block.type !== "tool_use") continue;
      const kq = chayCongCu(block.name, block.input);
      nhatKy.push(`lần ${lan}: ${block.name}(${JSON.stringify(block.input)}) → ${kq.noiDung}${kq.loi ? "  (is_error)" : ""}`);
      ketQua.push({ type: "tool_result", tool_use_id: block.id, content: kq.noiDung, is_error: kq.loi });
    }
    messages.push({ role: "user", content: ketQua });
  }

  // Chạm giới hạn: dừng lại và nói thật, thay vì lặp mãi.
  return {
    traLoi: "Dạ yêu cầu này Mộc chưa xử lý xong, nhân viên sẽ kiểm tra và nhắn lại bạn ngay ạ.",
    soLanGoi: maxLanGoi,
    nhatKy: [...nhatKy, `dừng: đã gọi mô hình ${maxLanGoi} lần mà chưa có câu trả lời cuối`],
  };
}
