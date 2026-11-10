// In ra toàn bộ cuộc trao đổi cho câu hỏi về đơn 1041: 4 tin nhắn, 2 lần gọi mô hình.
// Chạy ở chế độ offline để kết quả giống nhau mỗi lần.
import type Anthropic from "@anthropic-ai/sdk";

import { CONG_CU, chayCongCu } from "./cong-cu.ts";
import { moHinhOffline } from "./offline.ts";
import { SYSTEM_V3 } from "./prompts.ts";

console.log("Công cụ đầu tiên trong danh sách gửi kèm mỗi request:");
console.log(JSON.stringify(CONG_CU[0], null, 2));

const messages: Anthropic.MessageParam[] = [{ role: "user", content: "Đơn 1041 của em giao chưa ạ?" }];
const lan1 = moHinhOffline(SYSTEM_V3, messages);
const toolUse = lan1.content.find((b) => b.type === "tool_use")!;
const kq = chayCongCu(toolUse.name, toolUse.input);
messages.push({ role: "assistant", content: lan1.content });
messages.push({ role: "user", content: [{ type: "tool_result", tool_use_id: toolUse.id, content: kq.noiDung }] });
const lan2 = moHinhOffline(SYSTEM_V3, messages);
messages.push({ role: "assistant", content: lan2.content });

console.log(`\nLần gọi 1: stop_reason = "${lan1.stop_reason}". Lần gọi 2: stop_reason = "${lan2.stop_reason}".`);
console.log("Mảng messages sau hai lần gọi:");
for (const m of messages) console.log(`${m.role}: ${JSON.stringify(m.content)}`);
