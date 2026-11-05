// Cách 3: agent — mô hình tự chọn bước tiếp theo và gọi công cụ, lặp cho tới khi xong việc.
//
// Tập này chưa gọi LLM thật: `mohinhGiaLap` trả về đúng loại phản hồi mà một LLM có tool calling
// sẽ trả về (gọi công cụ, hoặc trả lời bằng chữ), theo kịch bản cho một tin nhắn. Mục đích là thấy
// rõ hình dạng vòng lặp. Tập 2–3 thay nó bằng LLM thật, vòng lặp bên dưới giữ nguyên.
import { themMon, timDonTheoSdt, xemDon } from "./shop.ts";

type ToolCall = { type: "tool"; name: string; input: Record<string, string | number> };
type FinalAnswer = { type: "text"; text: string };
type Step = ToolCall | FinalAnswer;
type HistoryEntry = { role: "khach" | "mo-hinh" | "cong-cu"; content: string };

// Các công cụ agent được phép dùng.
const tools: Record<string, (input: Record<string, string | number>) => string> = {
  tim_don_theo_sdt: ({ phone }) => {
    const order = timDonTheoSdt(String(phone));
    return order ? `Tìm thấy đơn ${order.id}.` : "Không tìm thấy đơn nào với số này.";
  },
  xem_don: ({ id }) => xemDon(Number(id)),
  them_mon: ({ id, item }) => themMon(Number(id), String(item)),
};

// Mô hình giả lập: nhìn lịch sử và quyết định bước tiếp theo.
function mohinhGiaLap(history: HistoryEntry[]): Step {
  const last = history.at(-1)!;
  const toolResults = history.filter((entry) => entry.role === "cong-cu").length;
  if (toolResults === 0) return { type: "tool", name: "tim_don_theo_sdt", input: { phone: "0901000001" } };
  if (toolResults === 1) {
    const id = last.content.match(/\d{4}/)?.[0] ?? "";
    return { type: "tool", name: "xem_don", input: { id } };
  }
  if (toolResults === 2 && last.content.includes("đang pha chế")) {
    return { type: "tool", name: "them_mon", input: { id: 1041, item: "bánh mì trứng" } };
  }
  return {
    type: "text",
    text: "Đơn 1041 của bạn vẫn đang pha chế nên chưa giao ạ. Mộc đã thêm 1 bánh mì trứng vào đơn, sẽ giao cùng lúc nhé!",
  };
}

export function runAgent(message: string, maxSteps = 5): string {
  const history: HistoryEntry[] = [{ role: "khach", content: message }];
  for (let step = 1; step <= maxSteps; step += 1) {
    const decision = mohinhGiaLap(history);
    if (decision.type === "text") {
      console.log(`[bước ${step}] trả lời khách`);
      return decision.text;
    }
    const result = tools[decision.name](decision.input);
    console.log(`[bước ${step}] gọi ${decision.name}(${JSON.stringify(decision.input)}) → ${result}`);
    history.push({ role: "mo-hinh", content: `${decision.name} ${JSON.stringify(decision.input)}` });
    history.push({ role: "cong-cu", content: result });
  }
  return "Xin lỗi, Mộc cần nhân viên hỗ trợ thêm cho yêu cầu này."; // giới hạn số bước
}

const message = "Đơn của em sđt 0901000001 giao chưa, nếu chưa thì thêm 1 bánh mì trứng nhé";
console.log(`Khách: ${message}\n`);
const answer = runAgent(message);
console.log(`\nMộc: ${answer}`);
