// Biết khi nào phải báo sớm, và kiểm một bản báo tiến độ có đủ năm phần hay chưa.

/** Dự kiến lệch quá mức này so với ước lượng ban đầu thì báo ngay, không đợi tới hạn. Con số 25% do mình tự đặt. */
export const NGUONG_BAO_NGAY = 0.25;

export type DuBao = { gioDuKien: number; lechPhanTram: number; canBaoNgay: boolean };

/** Từ giờ đã dùng và giờ còn lại (ước lượng LẠI, không phải ước lượng ban đầu) suy ra tổng giờ dự kiến. */
export function duBao({ uocGoc, daDung, conLai }: { uocGoc: number; daDung: number; conLai: number }): DuBao {
  const gioDuKien = daDung + conLai;
  const lech = (gioDuKien - uocGoc) / uocGoc;
  return { gioDuKien, lechPhanTram: Math.round(lech * 100), canBaoNgay: lech >= NGUONG_BAO_NGAY };
}

export type KetQua = { ten: string; dat: boolean; loiNhan: string };

// \b của JavaScript không coi chữ có dấu là chữ, nên ranh giới từ kiểm bằng \p{L}.
const tu = (mau: string) => new RegExp(String.raw`(?<!\p{L})(${mau})(?!\p{L})`, "iu");
const XONG = tu("đã xong|đã làm xong|đã hoàn thành");
const DANG_LAM = tu("đang làm|đang viết|đang sửa");
const VUONG = tu("vướng|kẹt|rủi ro|chưa chắc|chưa rõ|không vướng|không có gì vướng");
const MOC_NGAY = /(thứ (hai|ba|tư|năm|sáu|bảy)|chủ nhật|\d{1,2}\/\d{1,2}|ngày \d{1,2})/iu;
const DU_KIEN = tu("dự kiến|ước lượng lại|xong vào|xong trước|hoàn thành vào");
const BAO_LAI = tu("báo lại|cập nhật lại|sẽ nhắn lại|báo anh|báo chị");

/** Kiểm năm phần của một bản báo tiến độ bằng từ khóa. Chỉ kiểm sự có mặt, không kiểm nội dung có đúng không. */
export function kiemBaoCao(noiDung: string): KetQua[] {
  return [
    { ten: "Đã xong gì", dat: XONG.test(noiDung), loiNhan: "Chưa nói đã xong phần nào." },
    { ten: "Đang làm gì", dat: DANG_LAM.test(noiDung), loiNhan: "Chưa nói đang làm phần nào." },
    { ten: "Vướng ở đâu (hoặc nói rõ là không vướng)", dat: VUONG.test(noiDung), loiNhan: "Không nhắc tới chỗ vướng hay rủi ro; người đọc không biết là không có hay bạn chưa nghĩ tới." },
    { ten: "Dự kiến xong có ngày cụ thể", dat: DU_KIEN.test(noiDung) && MOC_NGAY.test(noiDung), loiNhan: "Dự kiến xong không có ngày, hoặc chỉ nói 'sắp xong'. Hãy ghi ngày cụ thể (thứ mấy, ngày mấy)." },
    { ten: "Khi nào báo lại", dat: BAO_LAI.test(noiDung), loiNhan: "Không nói khi nào sẽ báo lại; người đọc phải tự hỏi." },
  ];
}
