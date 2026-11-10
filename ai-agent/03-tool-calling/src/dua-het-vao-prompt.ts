// Cách làm đầu tiên (không nên): đưa toàn bộ đơn hàng trong ngày vào system prompt.
// Script dựng system prompt đó với 200 đơn giả, rồi so độ dài với system prompt hiện tại.
import { SYSTEM_V3 } from "./prompts.ts";

const MON = ["cà phê sữa", "bạc xỉu", "cà phê muối", "cà phê đen", "bánh mì trứng"];
const TRANG_THAI = ["đang pha chế", "đang giao", "đã giao"];
const donTrongNgay = Array.from({ length: 200 }, (_, i) => ({
  ma_don: String(5001 + i),
  so_dien_thoai: `09010${String(i).padStart(5, "0")}`,
  mon: [MON[i % 5], MON[(i * 3) % 5]],
  trang_thai: TRANG_THAI[i % 3],
}));

const systemDuaHet = `${SYSTEM_V3}\n\nĐơn hàng hôm nay:\n${donTrongNgay.map((d) => JSON.stringify(d)).join("\n")}`;
console.log(`System prompt hiện tại:  ${SYSTEM_V3.length.toLocaleString("vi-VN")} ký tự`);
console.log(`Kèm 200 đơn trong ngày:  ${systemDuaHet.length.toLocaleString("vi-VN")} ký tự (gấp ${(systemDuaHet.length / SYSTEM_V3.length).toFixed(1)} lần)`);
console.log(`Số điện thoại khách nằm trong prompt: ${donTrongNgay.length}`);
console.log(`Một dòng trong đó: ${JSON.stringify(donTrongNgay[40])}`);
