// Chuẩn bị tự đánh giá cuối thử việc bằng bằng chứng, không bằng cảm giác. Hai việc:
// 1) `thongKe`: từ sổ ghi chú công việc, mỗi năng lực có bao nhiêu bằng chứng, tốt hay chưa tốt, và năng lực nào chưa có bằng chứng nào.
// 2) `kiemTuDanhGia`: một bản tự đánh giá có đủ năm phần và có bằng chứng đi kèm hay chưa.
// Mọi dữ liệu về Minh là minh họa. Chạy: node tu-danh-gia.ts thong-ke   |   node tu-danh-gia.ts kiem <file>
import { readFileSync } from "node:fs";

export type GhiChu = { tuan: number; viec: string; nangLuc: string[]; bangChung: string; ketQua: "tot" | "chua-tot" };

/** Sáu năng lực của một junior mà nhóm của Minh (minh họa) nói là sẽ nhìn vào. Nhóm của bạn sẽ có danh sách khác. */
export const NANG_LUC: Record<string, string> = {
  "viet-code": "Viết code",
  "kiem-thu": "Viết test",
  "doc-code-cu": "Đọc code cũ",
  "giao-tiep": "Giao tiếp bằng tin nhắn",
  "uoc-luong": "Ước lượng và báo tiến độ",
  "hoc-nhanh": "Nhận góp ý và sửa",
  "review": "Review code của người khác",
};

export type DongThongKe = { nangLuc: string; ten: string; tot: number; chuaTot: number; cacTuan: number[] };

export function thongKe(sổ: GhiChu[]): DongThongKe[] {
  return Object.entries(NANG_LUC).map(([ma, ten]) => {
    const lien = sổ.filter((g) => g.nangLuc.includes(ma));
    return {
      nangLuc: ma,
      ten,
      tot: lien.filter((g) => g.ketQua === "tot").length,
      chuaTot: lien.filter((g) => g.ketQua === "chua-tot").length,
      cacTuan: [...new Set(lien.map((g) => g.tuan))].sort((a, b) => a - b),
    };
  });
}

export type KetQua = { ten: string; dat: boolean; loiNhan: string };

// \b của JavaScript không coi chữ có dấu là chữ, nên ranh giới từ kiểm bằng \p{L}.
const tu = (mau: string) => new RegExp(String.raw`(?<!\p{L})(${mau})(?!\p{L})`, "iu");
const BANG_CHUNG = /(PR #\d+|#\d+|https?:\/\/\S+|\d{1,2}\/\d{1,2}|\d+ (giờ|test|ngày|tuần|lần|dòng|PR))/iu;
const TINH_TU_SUONG = tu("tốt|chăm chỉ|nhiệt tình|nhanh|giỏi|ổn|đạt yêu cầu|cố gắng");

const muc = (van: string, tieuDe: string): string => {
  const m = new RegExp(String.raw`^\s*#{1,3}\s*${tieuDe}[^\n]*\n([\s\S]*?)(?=^\s*#{1,3}\s|(?![\s\S]))`, "imu").exec(van);
  return m ? m[1]!.trim() : "";
};

export function kiemTuDanhGia(van: string): KetQua[] {
  const lam = muc(van, "Đã làm được");
  const chua = muc(van, "Chưa tốt");
  const phanHoi = muc(van, "Phản hồi");
  const can = muc(van, "Mình cần");
  const mucTieu = muc(van, "Mục tiêu");
  const cauLam = lam.split(/(?<=[.!?])\s+|\n+/u).filter((c) => c.trim().length > 15);
  const cauKhongBangChung = cauLam.filter((c) => !BANG_CHUNG.test(c));
  const suong = (lam + " " + chua).split(/(?<=[.!?])\s+|\n+/u).filter((c) => TINH_TU_SUONG.test(c) && !BANG_CHUNG.test(c));
  return [
    { ten: "Phần 'Đã làm được' có bằng chứng (PR, số, ngày) ở mọi ý", dat: cauLam.length >= 2 && cauKhongBangChung.length === 0, loiNhan: cauLam.length < 2 ? "Phần 'Đã làm được' thiếu hoặc chỉ có một ý." : `${cauKhongBangChung.length} ý không có bằng chứng, ví dụ: "${cauKhongBangChung[0]?.slice(0, 70)}".` },
    { ten: "Có phần 'Chưa tốt' nói thẳng một điều", dat: chua.length > 30, loiNhan: "Không có phần 'Chưa tốt', hoặc nó quá ngắn; bản tự đánh giá chỉ toàn điểm mạnh thường không đáng tin." },
    { ten: "Có phản hồi đã nhận từ người khác", dat: phanHoi.length > 30, loiNhan: "Không có phần 'Phản hồi đã nhận'; tự đánh giá nên có tiếng nói của người khác, dù chỉ một câu." },
    { ten: "Nói rõ mình cần gì từ nhóm", dat: can.length > 20, loiNhan: "Không có phần 'Mình cần'; người đọc không biết có thể giúp gì cho bạn." },
    { ten: "Mục tiêu 90 ngày tới có số hoặc ngày", dat: mucTieu.length > 20 && /\d/.test(mucTieu), loiNhan: "Mục tiêu thiếu, hoặc không có một con số hay ngày nào để biết khi nào là xong." },
    { ten: "Không dùng tính từ suông (tốt, chăm chỉ, nhanh...) mà không kèm bằng chứng", dat: suong.length === 0, loiNhan: `${suong.length} câu dùng tính từ suông, ví dụ: "${suong[0]?.slice(0, 70)}".` },
  ];
}

if (process.argv[1]?.endsWith("tu-danh-gia.ts")) {
  const [lenh, file] = process.argv.slice(2);
  if (lenh === "thong-ke") {
    const so = JSON.parse(readFileSync("ghi-chu.json", "utf8")) as GhiChu[];
    console.log(`${so.length} ghi chú trong ${Math.max(...so.map((g) => g.tuan))} tuần`);
    for (const d of thongKe(so)) {
      const n = d.tot + d.chuaTot;
      console.log(n === 0 ? `  ${d.ten}: CHƯA CÓ BẰNG CHỨNG NÀO` : `  ${d.ten}: ${n} bằng chứng (${d.tot} tốt, ${d.chuaTot} chưa tốt), tuần ${d.cacTuan.join(", ")}`);
    }
  } else if (lenh === "kiem" && file) {
    const kq = kiemTuDanhGia(readFileSync(file, "utf8"));
    console.log(`${file}: ${kq.filter((k) => k.dat).length}/${kq.length}`);
    for (const k of kq) console.log(`  ${k.dat ? "✓" : "✗"} ${k.ten}${k.dat ? "" : `\n      ${k.loiNhan}`}`);
  } else throw new Error("Cách dùng: node tu-danh-gia.ts thong-ke  |  node tu-danh-gia.ts kiem <file>");
}
