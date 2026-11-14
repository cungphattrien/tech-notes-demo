// Quyết định bằng code (không nhờ mô hình) một tin nhắn có nên chuyển cho người thật hay không.
// Quy tắc đặt theo thứ tự rủi ro: an toàn của khách trước, tiền sau, cảm xúc sau nữa.

export type LyDo = "di-ung" | "khach-yeu-cau" | "hoan-tien" | "khieu-nai" | "lap-lai" | "agent-khong-chac";
export type QuyetDinh = { chuyen: false } | { chuyen: true; lyDo: LyDo };

// \b của JavaScript không coi chữ có dấu là chữ ("đổ" dính vào "đổi"), nên mình tự kiểm ranh giới bằng \p{L}.
const tu = (mau: string) => new RegExp(String.raw`(?<!\p{L})(${mau})(?!\p{L})`, "iu");

const DI_UNG = tu("dị ứng|lactose|không dung nạp|có hạt không|có đậu phộng không");
const YEU_CAU = tu("(gặp|nói chuyện với|chuyển cho|chuyển sang) (một )?(người|nhân viên|chủ quán|người thật)");
const HOAN_TIEN = tu("hoàn tiền|đền|bồi thường|trả lại tiền|hủy đơn");
const KHIEU_NAI = tu("tệ|bực|không chấp nhận|khiếu nại|làm ăn kiểu gì|đổ|hỏng|sai món|thiếu món|nguội|trễ");

const NGUONG_TIN_CAY = 0.6;

const cacTu = (tin: string) => new Set(tin.toLowerCase().match(/\p{L}+/gu) ?? []);
/** Độ giống nhau của hai tin nhắn, từ 0 đến 1 (tỉ lệ từ chung trên tổng số từ khác nhau). */
export function doGiong(a: string, b: string): number {
  const x = cacTu(a);
  const y = cacTu(b);
  const chung = [...x].filter((t) => y.has(t)).length;
  const hop = new Set([...x, ...y]).size;
  return hop === 0 ? 0 : chung / hop;
}

export function quyetDinh(tin: string, tinTruocCuaKhach: string[], doTinCay: number): QuyetDinh {
  if (DI_UNG.test(tin)) return { chuyen: true, lyDo: "di-ung" };
  if (YEU_CAU.test(tin)) return { chuyen: true, lyDo: "khach-yeu-cau" };
  if (HOAN_TIEN.test(tin)) return { chuyen: true, lyDo: "hoan-tien" };
  if (KHIEU_NAI.test(tin)) return { chuyen: true, lyDo: "khieu-nai" };
  // Khách hỏi lại gần như y nguyên một câu nghĩa là câu trả lời trước chưa giúp được.
  if (tinTruocCuaKhach.some((truoc) => doGiong(tin, truoc) >= 0.6)) return { chuyen: true, lyDo: "lap-lai" };
  if (doTinCay < NGUONG_TIN_CAY) return { chuyen: true, lyDo: "agent-khong-chac" };
  return { chuyen: false };
}

/** Bản "ngây thơ": chỉ chuyển khi khách nói thẳng muốn gặp người. */
export const quyetDinhNgayTho = (tin: string): boolean => YEU_CAU.test(tin);
