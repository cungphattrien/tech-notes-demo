// Chọn mô hình theo nội dung tin nhắn, bằng code. Mặc định là mô hình lớn; chỉ đưa sang mô hình nhỏ những tin
// chắc chắn là câu hỏi đơn giản (thực đơn, giờ mở cửa) và không dính tới đơn hàng hay tiền.
import type { MoHinh } from "./gia.ts";

const DON_GIAN = /(thực đơn|món gì|có món|giờ mở cửa|mấy giờ (mở|đóng)|phí giao|giao.*bao xa)/iu;
const NHAY_CAM = /(\d{4}|hoàn|đền|trả lại|hủy|đổi|tiền|bực|khiếu nại|người đặt|số điện thoại)/iu;

/** Câu hỏi chung: câu trả lời giống nhau với mọi khách (thực đơn, giờ mở cửa), không dính tới đơn hay tiền. */
export const laCauHoiChung = (tin: string): boolean => DON_GIAN.test(tin) && !NHAY_CAM.test(tin);

export const chonMoHinh = (tin: string): MoHinh => (laCauHoiChung(tin) ? "nho" : "lon");
