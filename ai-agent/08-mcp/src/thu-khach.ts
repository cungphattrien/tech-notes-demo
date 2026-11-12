// Ứng dụng 1: trợ lý cho nhân viên ở quầy, gọi công cụ trực tiếp. Chạy: node src/thu-khach.ts
import { goiCongCu, noiTuiMayChu } from "./khach-mcp.ts";

const client = await noiTuiMayChu();
const { tools } = await client.listTools();
console.log(`Máy chủ có ${tools.length} công cụ: ${tools.map((t) => t.name).join(", ")}`);

for (const [ten, dauVao] of [
  ["xem_don", { ma_don: "1041" }],
  ["them_mon", { ma_don: "1041", mon: "Bạc xỉu", so_luong: 2 }],
  ["them_mon", { ma_don: "1042", mon: "bạc xỉu", so_luong: 1 }],
  ["xem_don", { ma_don: "104" }],
] as const) {
  const kq = await goiCongCu(client, ten, dauVao);
  console.log(`${ten} ${JSON.stringify(dauVao)} → ${kq.loi ? "LỖI: " : ""}${kq.noiDung}`);
}
await client.close();
