// Chấm một câu trả lời viết theo STAR. Đọc file Markdown có bốn mục "## Tình huống", "## Nhiệm vụ", "## Hành động", "## Kết quả".
// Dùng: node kiem-tra-star.ts tra-loi-truoc.md
import { readFileSync } from "node:fs";

const MUC = ["Tình huống", "Nhiệm vụ", "Hành động", "Kết quả"] as const;
const TU_MOI_PHUT = 130; // tốc độ nói do mình tự chọn để ước lượng, hãy bấm giờ đọc to một đoạn của bạn để thay bằng số của bạn
const THOI_GIAN_TOT = [60, 120]; // giây: ngưỡng mình đặt cho một câu trả lời hành vi

const file = process.argv[2];
if (!file) throw new Error("Cần tên file, ví dụ: node kiem-tra-star.ts tra-loi-truoc.md");
const noiDung = readFileSync(file, "utf8").normalize("NFC");

const dem = (chu: string) => (chu.match(/[\p{L}\p{N}]+/gu) ?? []).length;
// Chia file thành các phần: mỗi dòng "## Tên mục" mở một phần, các dòng sau nó thuộc phần đó.
const cacPhan: Record<string, string> = Object.fromEntries(MUC.map((ten) => [ten, ""]));
let hienTai = "";
for (const dong of noiDung.split("\n")) {
  const tieuDe = /^##\s+(.+?)\s*$/.exec(dong);
  if (tieuDe) hienTai = tieuDe[1];
  else if (hienTai in cacPhan) cacPhan[hienTai] += `${dong}\n`;
}

const soTu = Object.fromEntries(MUC.map((ten) => [ten, dem(cacPhan[ten])]));
const tong = MUC.reduce((t, ten) => t + soTu[ten], 0);
const giay = Math.round((tong / TU_MOI_PHUT) * 60);
const tiLe = (ten: (typeof MUC)[number]) => Math.round((soTu[ten] / tong) * 100);

console.log(`${file}: ${tong} từ, khoảng ${giay} giây nếu nói ${TU_MOI_PHUT} từ/phút`);
for (const ten of MUC) console.log(`  ${ten.padEnd(10)} ${String(soTu[ten]).padStart(3)} từ  ${String(tiLe(ten)).padStart(3)}%`);

// "chúng em", "bọn em", "nhóm em": nói về cả nhóm. "em" đứng riêng: nói về chính mình.
const NHOM = /(chúng em|bọn em|nhóm em)/giu;
const hanhDong = cacPhan["Hành động"].toLowerCase();
const soNhom = (hanhDong.match(NHOM) ?? []).length;
const soEm = (hanhDong.replace(NHOM, " ").match(/(?<![\p{L}])em(?![\p{L}])/gu) ?? []).length;

const canhBao: string[] = [];
for (const ten of MUC) if (soTu[ten] === 0) canhBao.push(`Thiếu mục "${ten}".`);
if (giay < THOI_GIAN_TOT[0] || giay > THOI_GIAN_TOT[1]) canhBao.push(`Thời lượng ${giay} giây, nên khoảng ${THOI_GIAN_TOT[0]}–${THOI_GIAN_TOT[1]} giây.`);
if (tiLe("Tình huống") + tiLe("Nhiệm vụ") > 30) canhBao.push(`Tình huống và nhiệm vụ chiếm ${tiLe("Tình huống") + tiLe("Nhiệm vụ")}% câu trả lời, nên dưới 30%.`);
if (tiLe("Hành động") < 45) canhBao.push(`Hành động chỉ chiếm ${tiLe("Hành động")}%, nên từ 45%: người nghe muốn biết bạn đã làm gì.`);
if (!/\d/.test(cacPhan["Kết quả"])) canhBao.push("Kết quả không có con số nào.");
if (soEm + soNhom > 0 && soEm / (soEm + soNhom) < 0.5) canhBao.push(`Trong hành động, nói về cả nhóm ${soNhom} lần, về mình ${soEm} lần: người nghe không biết phần của bạn là gì.`);

console.log(canhBao.length ? canhBao.map((c) => `  ! ${c}`).join("\n") : "  Không có cảnh báo.");
