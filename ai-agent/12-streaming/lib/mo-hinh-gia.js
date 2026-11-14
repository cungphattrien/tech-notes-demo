// Mô hình giả cho quán Mộc: không gọi mạng, không cần khóa API.
// Nó mô phỏng hai độ trễ của một mô hình thật: lúc "nghĩ" trước khi ra chữ đầu tiên, rồi nhả đều từng mảnh chữ.
// Con số là do mình đặt để dễ đo: 800 ms chờ chữ đầu, 25 ms mỗi mảnh (khoảng 40 mảnh mỗi giây).
export const CHO_CHU_DAU_MS = 800;
export const MOI_MANH_MS = 25;

export const CAU_TRA_LOI =
  "Dạ, quán Mộc giao hàng trong bán kính 5 km với phí 15.000đ, đơn từ 150.000đ thì miễn phí giao hàng. " +
  "Nếu quán giao sai món hoặc pha sai so với đơn, bạn nhắn cho quán trong vòng 30 phút kể từ lúc nhận, kèm ảnh món đã giao. " +
  "Quán sẽ pha lại món đúng và giao lại miễn phí, hoặc hoàn tiền nếu bạn không muốn đợi. " +
  "Tiền hoàn về đúng phương thức bạn đã thanh toán trong ba ngày làm việc. " +
  "Món đã uống quá một nửa thì quán không đổi được, nên bạn nhớ nhắn sớm nhé.";

// Tách câu trả lời thành các mảnh nhỏ (mỗi từ kèm dấu cách phía sau), giống cách mô hình nhả từng token.
export function tachManh(chu) {
  return chu.match(/\S+\s*/gu) ?? [];
}

const nghi = (ms) => new Promise((xong) => setTimeout(xong, ms));

// Trả về từng mảnh chữ, mỗi mảnh sau một khoảng chờ. `tin` chưa dùng trong bản giả: mọi câu hỏi nhận cùng một câu trả lời.
export async function* hoiMoHinhGia(tin, { tin_hieu } = {}) {
  await nghi(CHO_CHU_DAU_MS);
  for (const manh of tachManh(CAU_TRA_LOI)) {
    if (tin_hieu?.aborted) return;
    yield manh;
    await nghi(MOI_MANH_MS);
  }
}
