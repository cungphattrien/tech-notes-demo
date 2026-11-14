// Mọi cấu hình của máy chủ đi qua đây: đọc biến môi trường MỘT lần, kiểm tra, đổi sang đúng kiểu.
// Có sai chỗ nào thì máy chủ dừng ngay lúc khởi động và liệt kê tất cả chỗ sai cùng một lượt.
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const GOC_DU_AN = fileURLToPath(new URL("..", import.meta.url));

// Biến chưa đặt hoặc đặt rỗng ("PORT=") đều coi như chưa có và dùng giá trị mặc định.
// Mặc định là một CHUỖI, để nó cũng đi qua đúng kiểm tra như giá trị người dùng nhập.
const coMacDinh = <T extends z.ZodType>(macDinh: string, kieu: T) =>
  z.preprocess((giaTri) => (giaTri === undefined || giaTri === "" ? macDinh : giaTri), kieu);

const SO_NGUYEN = /^\d+$/;
const boolEnv = z
  .enum(["true", "false", "1", "0"], "chỉ nhận true, false, 1 hoặc 0")
  .transform((giaTri) => giaTri === "true" || giaTri === "1");

const configSchema = z.object({
  PORT: coMacDinh("3000", z.string().regex(SO_NGUYEN, "phải là số nguyên từ 1 đến 65535").transform(Number).pipe(z.number().min(1, "phải từ 1 đến 65535").max(65535, "phải từ 1 đến 65535"))),
  NODE_ENV: coMacDinh("development", z.enum(["development", "test", "production"], "chỉ nhận development, test hoặc production")),
  LOG_LEVEL: coMacDinh("info", z.string().toLowerCase().pipe(z.enum(["debug", "info", "warn", "error"], "chỉ nhận debug, info, warn hoặc error"))),
  LOG_REQUESTS: coMacDinh("false", boolEnv),
  // Đường dẫn tính từ thư mục gốc của dự án, KHÔNG phụ thuộc vào thư mục đang đứng khi chạy lệnh.
  ORDERS_FILE: coMacDinh("data/orders.json", z.string().min(1)).transform((duong) => resolve(GOC_DU_AN, duong)),
  // Bí mật: không có mặc định. Chưa đặt thì dừng, thay vì chạy với một giá trị đoán được.
  ORDER_API_KEY: z.string("chưa đặt (bắt buộc)").min(16, "phải dài ít nhất 16 ký tự"),
});

export type Config = z.infer<typeof configSchema>;

// Các biến mà giá trị không bao giờ được in ra, kể cả trong thông báo lỗi.
const BI_MAT = new Set<string>(["ORDER_API_KEY"]);

export class ConfigError extends Error {
  cacLoi: { bien: string; loi: string }[];

  constructor(cacLoi: { bien: string; loi: string }[]) {
    super(["Cấu hình sai, máy chủ không khởi động:", ...cacLoi.map(({ bien, loi }) => `  - ${bien}: ${loi}`)].join("\n"));
    this.name = "ConfigError";
    this.cacLoi = cacLoi;
  }
}

export function loadConfig(env: Record<string, string | undefined> = process.env): Config {
  const ketQua = configSchema.safeParse(env);
  if (ketQua.success) return ketQua.data;
  throw new ConfigError(
    ketQua.error.issues.map((issue) => {
      const bien = String(issue.path[0]);
      const daNhap = env[bien];
      const kemGiaTri = daNhap !== undefined && daNhap !== "" && !BI_MAT.has(bien) ? ` (đang là "${daNhap}")` : "";
      return { bien, loi: issue.message + kemGiaTri };
    }),
  );
}

// Bản in được ra log lúc khởi động: giá trị bí mật chỉ còn độ dài.
export function moTaConfig(config: Config): Record<string, string | number | boolean> {
  return { ...config, ORDER_API_KEY: `(đã đặt, ${config.ORDER_API_KEY.length} ký tự)` };
}
