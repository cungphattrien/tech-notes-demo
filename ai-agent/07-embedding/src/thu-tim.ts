// In ra các đoạn mà bộ tìm kiếm chọn cho từng câu hỏi, để xem nó đúng hay sai trước khi gọi mô hình.
import { docChinhSach } from "./tach-doan.ts";
import { timDoan } from "./tim-doan.ts";

const CAC_DOAN = docChinhSach();
console.log(`Tài liệu có ${CAC_DOAN.length} đoạn: ${CAC_DOAN.map((d) => d.tieuDe).join(" | ")}\n`);

const CAU_HOI = [
  "Đơn từ bao nhiêu tiền thì được miễn phí giao hàng?",
  "Quán giao sai món thì được hoàn tiền bao lâu?",
  "Em hủy đơn chuyển khoản rồi, bao lâu thì tiền về?",
  "Ly cà phê pha sai, em muốn quán đền tiền",
  "Mình bị dị ứng sữa thì uống gì được?",
];

for (const cau of CAU_HOI) {
  console.log(`Khách: ${cau}`);
  const kq = timDoan(cau, CAC_DOAN);
  if (kq.length === 0) console.log("  (không có đoạn nào khớp)");
  for (const { doan, diem, tuKhop } of kq) console.log(`  ${diem.toFixed(2)}  ${doan.tieuDe}   [khớp: ${tuKhop.join(", ")}]`);
  console.log();
}
