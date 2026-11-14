// Kiểm tra một tin nhắn nhờ việc có đọc được "sau" hay không: người nhận có thể đọc nó vài giờ sau, ở múi giờ khác,
// và vẫn làm được mà không phải hỏi lại. Chỉ kiểm sự có mặt của từng phần bằng từ khóa, không đánh giá nội dung.
// Chạy: node kiem-tin-nhan.ts tin-nhan-xau.txt
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export type KetQua = { ten: string; dat: boolean; loiNhan: string };

// Hỏi xin phép trước khi nói việc ("anh rảnh chưa ạ", "có đó không"): người kia phải trả lời một vòng rồi mới biết bạn cần gì.
const XIN_PHEP = /rảnh chưa|có đó không|có đây không|bận không|hỏi (chút|một chút|cái này) được không/iu;
// Câu chỉ để chào hoặc báo "em có việc" mà chưa nói việc gì: không tính là điều cần.
const CAU_CHUNG_CHUNG = /rảnh chưa|có đó không|có đây không|bận không|có (một )?(chút )?việc|có chuyện|có cái này/iu;

// Mốc giờ tuyệt đối: "15:00", "15h", "3pm"... đi kèm một cách nói múi giờ.
const GIO = /\b(\d{1,2}:\d{2}|\d{1,2}h\d{0,2}|\d{1,2}\s?(am|pm))\b/iu;
const MUI_GIO = /(giờ việt nam|giờ vn|utc\s?[+-]?\d|gmt\s?[+-]?\d|\bict\b)/iu;
const MO_HO = /\b(chiều nay|sáng nay|tối nay|mai|lát nữa|sớm|sớm nhất|cuối ngày|cuối tuần)\b/iu;

export function kiemTra(noiDung: string): KetQua[] {
  const chu = noiDung.trim();
  const cacCau = chu.split(/(?<=[.?!])\s+/u);
  return [
    {
      ten: "Không xin phép trước khi hỏi",
      dat: !XIN_PHEP.test(chu),
      loiNhan: "Hỏi 'anh rảnh chưa' rồi mới nói việc: người kia phải trả lời một vòng trước khi biết bạn cần gì. Hãy nói luôn việc trong cùng tin nhắn.",
    },
    {
      ten: "Có bối cảnh bấm vào được",
      dat: /https?:\/\/\S+|#\d+/u.test(chu),
      loiNhan: "Thiếu đường dẫn hoặc mã (pull request, issue, log): người đọc không biết nhìn vào đâu.",
    },
    {
      ten: "Nói rõ điều cần",
      dat: cacCau.filter((cau) => !CAU_CHUNG_CHUNG.test(cau)).some((cau) => /\?|(?<!\p{L})nhờ(?!\p{L})|(?<!\p{L})cần (anh|chị)(?!\p{L})/iu.test(cau)),
      loiNhan: "Không có một câu hỏi hay yêu cầu cụ thể.",
    },
    {
      ten: "Hạn có giờ và múi giờ",
      dat: GIO.test(chu) && MUI_GIO.test(chu),
      loiNhan: MO_HO.test(chu)
        ? "Hạn nói bằng 'chiều nay', 'mai'...: với người ở múi giờ khác thì 'chiều nay' là lúc nào? Hãy ghi giờ cụ thể và múi giờ."
        : "Thiếu hạn, hoặc có giờ mà không ghi múi giờ.",
    },
    {
      ten: "Nói trong lúc chờ sẽ làm gì",
      dat: /trong lúc chờ|nếu (đến|tới|quá) .{0,40}(chưa|không) .{0,40}(thì|em sẽ)/iu.test(chu) || /em (sẽ )?(làm tiếp|làm trước)/iu.test(chu),
      loiNhan: "Không nói bạn sẽ làm gì trong lúc chờ và làm gì nếu hết hạn mà chưa có trả lời: bạn sẽ ngồi chờ, người kia thì bị áp lực.",
    },
  ];
}

function chayDong(lenh: string[]): void {
  const file = lenh[0];
  if (!file) throw new Error("Cần tên file, ví dụ: node kiem-tin-nhan.ts tin-nhan-xau.txt");
  const ketQua = kiemTra(readFileSync(file, "utf8"));
  const dat = ketQua.filter((k) => k.dat).length;
  console.log(`${file}: ${dat}/${ketQua.length} phần`);
  for (const k of ketQua) console.log(`  ${k.dat ? "✓" : "✗"} ${k.ten}${k.dat ? "" : `\n      ${k.loiNhan}`}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) chayDong(process.argv.slice(2));
