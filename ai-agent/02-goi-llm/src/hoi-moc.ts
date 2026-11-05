// Chạy: node src/hoi-moc.ts [v1|v2]
//   v1: system prompt chỉ có vai trò
//   v2: system prompt có thông tin quán, được phép nói "chưa tra được", thêm lớp kiểm tra cuối
import { coKey, hoiLLM, MODEL } from "./goi-llm.ts";
import { chanTrangThaiBia } from "./kiem-tra-bia.ts";
import { SYSTEM_V1, SYSTEM_V2 } from "./prompts.ts";

const CAU_HOI = [
  "Quán mở cửa mấy giờ vậy ạ?",
  "co ship qua quan 7 ko shop",
  "Giá cà phê muối bao nhiêu?",
  "Đơn 1041 của em giao chưa ạ?",
];

const banIn = process.argv[2] === "v1" ? "v1" : "v2";
const system = banIn === "v1" ? SYSTEM_V1 : SYSTEM_V2;

console.log(
  coKey()
    ? `Gọi Claude thật (${MODEL}), system prompt ${banIn}\n`
    : `Chế độ OFFLINE (giả lập, không phải mô hình thật), system prompt ${banIn}\n`,
);

for (const cauHoi of CAU_HOI) {
  const ketQua = await hoiLLM(system, cauHoi);
  const cuoi = banIn === "v2" ? chanTrangThaiBia(ketQua.text) : { text: ketQua.text, daChan: false };
  console.log(`Khách: ${cauHoi}`);
  console.log(`Mộc:   ${cuoi.text}${cuoi.daChan ? "   [đã chặn một câu đoán trạng thái đơn]" : ""}`);
  if (!ketQua.offline) {
    console.log(`       (stop_reason: ${ketQua.stopReason}, token vào/ra: ${ketQua.inputTokens}/${ketQua.outputTokens})`);
  }
  console.log();
}
