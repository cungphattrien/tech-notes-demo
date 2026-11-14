// Một cuộc trò chuyện đầy đủ, từ lúc khách nhắn đến lúc đóng phiếu, rồi đọc lại bằng nhật ký.
// Đồng hồ giả: mỗi lần gọi `gio()` tiến thêm số giây trong `buoc`, để output lặp lại được.
import { NhatKy } from "./src/nhat-ky.ts";
import { TongDai } from "./src/tong-dai.ts";

let giay = Date.parse("2026-11-20T03:10:00Z") / 1000; // 10:10 giờ Việt Nam
const gio = () => new Date(giay * 1000);
const tienThem = (s: number) => {
  giay += s;
};

const nhatKy = new NhatKy(gio);
const tongDai = new TongDai(nhatKy, gio);

console.log("Khách: " + "Đơn 1042 của mình bị đổ hết, gọi mình qua 0901000002 nhé");
console.log("Mộc:   " + tongDai.khach("h-07", "Đơn 1042 của mình bị đổ hết, gọi mình qua 0901000002 nhé"));
tienThem(40);
tongDai.khach("h-07", "alo?");
tienThem(660);
tongDai.nhanVienTiepNhan("P1", "chị Hạnh");
tienThem(90);
tongDai.nhanVienTraLoi("P1", "Mộc xin lỗi bạn, bên mình làm lại ly mới và giao lại ngay, không tính thêm tiền.");
tienThem(20);
tongDai.dongPhieu("P1");

console.log("\nMột dòng nhật ký nguyên bản (dòng đầu):");
console.log(nhatKy.dong[0]);

console.log("\nCả cuộc trò chuyện h-07, đọc lại từ nhật ký:");
for (const s of nhatKy.cuaHoiThoai("h-07")) {
  const { luc, loai, maHoiThoai: _m, ...con } = s as Record<string, unknown>;
  const gioVn = new Date(Date.parse(String(luc)) + 7 * 3600_000).toISOString().slice(11, 19);
  console.log(`${gioVn}  ${String(loai).padEnd(20)} ${JSON.stringify(con)}`);
}
