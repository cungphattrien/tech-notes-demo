import Anthropic from "@anthropic-ai/sdk";

import type { Doan } from "./tach-doan.ts";
import { tachTu } from "./tim-doan.ts";

export const MODEL = "claude-opus-5-5";

export const SYSTEM = `Bạn là nhân viên chăm sóc khách hàng của quán cà phê Mộc. Trả lời ngắn gọn, thân thiện, bằng tiếng Việt.
Chỉ trả lời dựa trên các đoạn trong thẻ <tai_lieu>. Cuối câu trả lời, ghi tên đoạn bạn đã dùng trong ngoặc vuông.
Nếu các đoạn không có thông tin để trả lời, hãy nói quán chưa có thông tin đó, đừng đoán.`;

// Ghép các đoạn tìm được vào tin nhắn của khách. Mỗi đoạn có tên để mô hình trích nguồn.
export function ghepCauHoi(cauHoi: string, cacDoan: Doan[]): string {
  const taiLieu = cacDoan.map((d) => `<doan ten="${d.tieuDe}">\n${d.noiDung}\n</doan>`).join("\n");
  return `<tai_lieu>\n${taiLieu}\n</tai_lieu>\n\nCâu hỏi của khách: ${cauHoi}`;
}

export function coKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY) && process.env.MOC_OFFLINE !== "1";
}

export async function traLoi(cauHoi: string, cacDoan: Doan[]): Promise<string> {
  if (!coKey()) return moHinhOffline(cauHoi, cacDoan);
  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: "low" },
    system: SYSTEM,
    messages: [{ role: "user", content: ghepCauHoi(cauHoi, cacDoan) }],
  });
  return response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
}

// Mô hình giả lập, không phải mô hình thật: chọn câu trong các đoạn có nhiều từ trùng nhất với câu hỏi
// và đọc lại nguyên văn. Nó chỉ dùng được chữ có trong đoạn, nên cho thấy rõ mô hình "nhìn thấy" gì.
function moHinhOffline(cauHoi: string, cacDoan: Doan[]): string {
  const tuHoi = new Set(tachTu(cauHoi));
  const cacCau = cacDoan.flatMap((d) =>
    d.noiDung.split(/(?<=\.)\s+/).map((cau) => ({ cau, ten: d.tieuDe, khop: tachTu(cau).filter((tu) => tuHoi.has(tu)).length })),
  );
  const tot = cacCau.filter((c) => c.khop >= 2).sort((a, b) => b.khop - a.khop).slice(0, 2);
  if (tot.length === 0) return "Dạ Mộc chưa có thông tin này ạ.";
  return `Dạ, ${tot.map((c) => c.cau).join(" ")} [${[...new Set(tot.map((c) => c.ten))].join("; ")}]`;
}
