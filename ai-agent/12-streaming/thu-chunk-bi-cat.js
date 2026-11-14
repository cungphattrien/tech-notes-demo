// Hai lỗi hay gặp khi đọc luồng: (1) chunk cắt giữa một sự kiện, (2) chunk cắt giữa một chữ có dấu.
// Chạy: node thu-chunk-bi-cat.js   (không cần máy chủ)
import { DocSse, docNgayTho, dongSuKien } from "./lib/sse.js";

const maHoa = new TextEncoder();
const luong = dongSuKien("delta", { text: "Dạ, " }) + dongSuKien("delta", { text: "quán giao hàng " }) + dongSuKien("done", { soManh: 2 });
const byte = maHoa.encode(luong);

// Mạng có thể cắt luồng ở bất kỳ byte nào. Mình cắt ngay trong chữ "ạ" của "Dạ" (chữ này chiếm 3 byte).
const diem = byte.indexOf(0xe1) + 1; // sau byte đầu tiên của "ạ"
const chunk1 = byte.slice(0, diem);
const chunk2 = byte.slice(diem);
console.log(`Cắt luồng thành 2 chunk: ${chunk1.length} byte và ${chunk2.length} byte; chunk 1 dừng giữa chữ "ạ".\n`);

// Cách 1: giải mã mỗi chunk riêng, không giữ trạng thái.
const khongGiu = new TextDecoder();
const manhHong = khongGiu.decode(chunk1) + khongGiu.decode(chunk2);
console.log("Giải mã từng chunk riêng:", JSON.stringify(manhHong.slice(0, 45)));

// Cách 2: giải mã với { stream: true } để giữ lại byte còn dở.
const coGiu = new TextDecoder();
const manhDung = coGiu.decode(chunk1, { stream: true }) + coGiu.decode(chunk2, { stream: true });
console.log("Giải mã với stream: true:", JSON.stringify(manhDung.slice(0, 45)));

// Cách đọc sự kiện: coi mỗi chunk là sự kiện trọn vẹn thì sai khi chunk cắt giữa dòng.
const cacChunkChu = [manhDung.slice(0, 20), manhDung.slice(20)];
try {
  const ngayTho = cacChunkChu.flatMap((c) => docNgayTho(c));
  console.log("\nĐọc ngây thơ:", ngayTho.length, "sự kiện");
} catch (loi) {
  console.log("\nĐọc ngây thơ: lỗi", loi.name, "-", loi.message);
}
const docDung = new DocSse();
const suKien = cacChunkChu.flatMap((c) => docDung.push(c));
console.log("Dùng DocSse có bộ đệm:", suKien.length, "sự kiện:", suKien.map((s) => s.ten).join(", "));
