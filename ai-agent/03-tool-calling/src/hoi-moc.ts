// Chạy: node src/hoi-moc.ts
// Mỗi câu hỏi: gọi mô hình một lần; nếu mô hình xin gọi công cụ thì chạy công cụ,
// gửi kết quả lại và gọi mô hình lần thứ hai để viết câu trả lời. Chỉ MỘT vòng như vậy.
import type Anthropic from "@anthropic-ai/sdk";

import { chayCongCu } from "./cong-cu.ts";
import { coKey, goiMoHinh, layChu, MODEL } from "./goi-llm.ts";
import { SYSTEM_V3 } from "./prompts.ts";

const CAU_HOI = [
  "Quán mở cửa mấy giờ vậy ạ?",
  "Đơn 1041 của em giao chưa ạ?",
  "Đơn #1099 sao chưa thấy ạ",
  "Sáng nay em đặt mà chưa thấy ai gọi, sđt 0901000001",
];

console.log(coKey() ? `Gọi Claude thật (${MODEL})\n` : "Chế độ OFFLINE (giả lập, không phải mô hình thật)\n");

async function hoi(cauHoi: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: cauHoi }];
  const lan1 = await goiMoHinh(SYSTEM_V3, messages);
  if (lan1.stop_reason !== "tool_use") return layChu(lan1.content);

  // Mô hình xin gọi công cụ: chạy từng khối tool_use, gom mọi kết quả vào MỘT tin nhắn.
  const ketQua: Anthropic.ToolResultBlockParam[] = [];
  for (const block of lan1.content) {
    if (block.type !== "tool_use") continue;
    const kq = chayCongCu(block.name, block.input);
    console.log(`  [công cụ] ${block.name}(${JSON.stringify(block.input)}) → ${kq.noiDung}${kq.loi ? "  (is_error)" : ""}`);
    ketQua.push({ type: "tool_result", tool_use_id: block.id, content: kq.noiDung, is_error: kq.loi });
  }
  messages.push({ role: "assistant", content: lan1.content }); // gửi lại nguyên văn phản hồi có khối tool_use
  messages.push({ role: "user", content: ketQua });

  const lan2 = await goiMoHinh(SYSTEM_V3, messages);
  if (lan2.stop_reason === "tool_use") {
    const muonGoi = lan2.content.filter((b) => b.type === "tool_use").map((b) => `${b.name}(${JSON.stringify(b.input)})`);
    return `(mô hình còn muốn gọi ${muonGoi.join(", ")}, nhưng code này chỉ chạy một vòng nên dừng ở đây)`;
  }
  return layChu(lan2.content);
}

for (const cauHoi of CAU_HOI) {
  console.log(`Khách: ${cauHoi}`);
  const traLoi = await hoi(cauHoi);
  console.log(`Mộc:   ${traLoi}\n`);
}
