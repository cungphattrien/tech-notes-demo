// Hai loại "mô hình": các mô hình GIẢ để chạy và test không cần khóa API hay mạng, và một hàm gọi API thật (không chạy trong bài).
import type { CauHoi, MoHinh } from "./phan-loai.ts";

const TU_KHOA: [string, string[]][] = [
  ["ăn uống", ["cà phê", "trà", "phở", "cơm", "bún", "bánh", "ăn", "uống"]],
  ["đi lại", ["grab", "xăng", "taxi", "gửi xe", "xe buýt"]],
  ["nhà ở", ["tiền nhà", "điện", "nước", "wifi"]],
  ["mua sắm", ["áo", "giày", "mua"]],
  ["giải trí", ["phim", "game", "netflix"]],
  ["sức khỏe", ["thuốc", "khám"]],
];

function doanNhan(ghiChu: string): string {
  const thuong = ghiChu.toLowerCase();
  return TU_KHOA.find(([, tu]) => tu.some((t) => thuong.includes(t)))?.[0] ?? "khác";
}

export type KieuGia = "ngoan" | "rao-code" | "lan-man" | "bia-nhan" | "bi-dan-dat" | "loi" | "cham";

/** Mô hình giả, mỗi kiểu bắt chước một cách mô hình thật hay trả lời: đúng ý, bọc khung code, nói dài, bịa nhãn, nghe lệnh trong ghi chú, lỗi mạng, quá chậm. */
export function moHinhGia(kieu: KieuGia): MoHinh {
  return async (cauHoi: CauHoi, { signal }) => {
    const nhan = doanNhan(cauHoi.nguoiDung);
    switch (kieu) {
      case "ngoan": return JSON.stringify({ danh_muc: nhan });
      case "rao-code": return "```json\n" + JSON.stringify({ danh_muc: nhan }) + "\n```";
      case "lan-man": return `Mình nghĩ khoản này thuộc nhóm ${nhan} nhé! Chúc bạn một ngày vui vẻ.`;
      case "bia-nhan": return JSON.stringify({ danh_muc: "ăn trưa" }); // nhãn nghe hợp lý nhưng không có trong danh sách
      case "bi-dan-dat": return /bỏ qua|xóa/i.test(cauHoi.nguoiDung) ? "Đã xóa toàn bộ sổ chi tiêu của bạn." : JSON.stringify({ danh_muc: nhan });
      case "loi": throw new Error("ECONNRESET");
      case "cham": // đợi 10 giây, trừ khi bị hủy giữa chừng
        await new Promise((_xong, tuChoi) => {
          const timer = setTimeout(_xong, 10_000);
          signal.addEventListener("abort", () => { clearTimeout(timer); tuChoi(new Error("bị hủy")); });
        });
        return JSON.stringify({ danh_muc: nhan });
    }
  };
}

/**
 * Gọi API Messages của Anthropic bằng fetch. KHÔNG chạy trong bài này vì cần khóa API thật.
 * Địa chỉ, tên header và hình dạng phản hồi lấy từ tài liệu "Messages API" (tra ngày 13/11/2026).
 * Giá trị anthropic-version lấy từ ví dụ cURL trong trang get-started của tài liệu cùng ngày; hãy đối chiếu lại khi bạn dùng.
 */
export function moHinhThat(apiKey: string, model = "claude-haiku-5-5"): MoHinh {
  return async (cauHoi, { signal }) => {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal,
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2026-10-21" },
      body: JSON.stringify({
        model,
        max_tokens: 50, // nhãn chỉ vài token; trần thấp cũng là một lớp chặn chi phí
        system: cauHoi.heThong,
        messages: [{ role: "user", content: cauHoi.nguoiDung }],
      }),
    });
    if (!res.ok) throw new Error(`API trả ${res.status}`); // 429 (hết hạn mức) và 529 (quá tải) cũng đi vào đây
    const du_lieu = (await res.json()) as { content: { type: string; text?: string }[] };
    return du_lieu.content.find((khoi) => khoi.type === "text")?.text ?? "";
  };
}
