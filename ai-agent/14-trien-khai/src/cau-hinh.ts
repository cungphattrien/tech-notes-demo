// Cấu hình của dịch vụ đọc từ biến môi trường một lần, kiểm tra, đổi kiểu (cùng ý với tập 12 của series Kỹ năng, không cần thư viện).
// Giá trị bí mật không bao giờ được in ra, kể cả trong thông báo lỗi.

export type CauHinh = {
  PORT: number;
  /** Công tắc tắt agent: true thì mọi tin được chuyển thẳng cho người, không gọi mô hình. */
  AGENT_TAT: boolean;
  /** Số tin tối đa của một cuộc trò chuyện trong một phút. */
  GIOI_HAN_MOI_PHUT: number;
  MAX_DO_DAI_TIN: number;
  /** Giả lập độ trễ của mô hình (ms). Dịch vụ thật có độ trễ này vì phải gọi mô hình; mặc định 0. */
  DO_TRE_MO_HINH_MS: number;
  ADMIN_KEY: string;
};

export class CauHinhLoi extends Error {
  cacLoi: string[];
  constructor(cacLoi: string[]) {
    super(["Cấu hình sai, dịch vụ không khởi động:", ...cacLoi.map((l) => `  - ${l}`)].join("\n"));
    this.name = "CauHinhLoi";
    this.cacLoi = cacLoi;
  }
}

type Env = Record<string, string | undefined>;
const trong = (v: string | undefined) => v === undefined || v === "";

export function docCauHinh(env: Env = process.env): CauHinh {
  const loi: string[] = [];
  const so = (ten: string, macDinh: number, min: number, max: number): number => {
    const v = env[ten];
    if (trong(v)) return macDinh;
    if (!/^\d+$/.test(v!) || Number(v) < min || Number(v) > max) {
      loi.push(`${ten}: phải là số nguyên từ ${min} đến ${max} (đang là "${v}")`);
      return macDinh;
    }
    return Number(v);
  };
  const boolean = (ten: string): boolean => {
    const v = env[ten];
    if (trong(v)) return false;
    if (v === "true" || v === "1") return true;
    if (v === "false" || v === "0") return false;
    loi.push(`${ten}: chỉ nhận true, false, 1 hoặc 0 (đang là "${v}")`);
    return false;
  };
  const cauHinh = {
    PORT: so("PORT", 3300, 1, 65535),
    AGENT_TAT: boolean("AGENT_TAT"),
    GIOI_HAN_MOI_PHUT: so("GIOI_HAN_MOI_PHUT", 20, 1, 10000),
    MAX_DO_DAI_TIN: so("MAX_DO_DAI_TIN", 1000, 1, 100000),
    DO_TRE_MO_HINH_MS: so("DO_TRE_MO_HINH_MS", 0, 0, 60000),
    ADMIN_KEY: env.ADMIN_KEY ?? "",
  };
  if (cauHinh.ADMIN_KEY.length < 16) loi.push("ADMIN_KEY: bắt buộc, dài ít nhất 16 ký tự");
  if (loi.length > 0) throw new CauHinhLoi(loi);
  return cauHinh;
}
