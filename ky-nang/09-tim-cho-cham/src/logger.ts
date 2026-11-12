import { pathToFileURL } from "node:url";

// Ghi log dạng JSON, mỗi dòng một sự kiện. Máy đọc được, người cũng đọc được.
export type Level = "info" | "warn" | "error";
export type Fields = Record<string, unknown>;

export type Logger = {
  info(msg: string, fields?: Fields): void;
  warn(msg: string, fields?: Fields): void;
  error(msg: string, fields?: Fields): void;
  // Logger mới luôn ghi kèm các trường này (ví dụ requestId), khỏi phải truyền lại ở mỗi dòng.
  child(fields: Fields): Logger;
};

export type ErrorInfo = { name: string; message: string; stack?: string; cause?: ErrorInfo };

const PROJECT_URL = pathToFileURL(process.cwd()).href + "/";

// Biến một lỗi thành dữ liệu thường để JSON.stringify ghi được. Lỗi thật có name/message/stack
// là thuộc tính không đếm được, nên JSON.stringify(new Error("x")) chỉ ra "{}".
// Đi theo chuỗi cause để không mất lỗi gốc. Stack chỉ giữ 4 dòng đầu cho log gọn.
export function describeError(error: unknown): ErrorInfo {
  if (!(error instanceof Error)) return { name: "NonError", message: String(error) };
  return {
    name: error.name,
    message: error.message,
    stack: error.stack?.split("\n").slice(1, 5).map((line) => line.trim().replace(PROJECT_URL, "")).join(" | "),
    ...(error.cause === undefined ? {} : { cause: describeError(error.cause) }),
  };
}

export function createLogger(write: (line: string) => void = console.log, base: Fields = {}): Logger {
  const emit = (level: Level, msg: string, fields: Fields = {}) =>
    write(JSON.stringify({ time: new Date().toISOString(), level, msg, ...base, ...fields }));
  return {
    info: (msg, fields) => emit("info", msg, fields),
    warn: (msg, fields) => emit("warn", msg, fields),
    error: (msg, fields) => emit("error", msg, fields),
    child: (fields) => createLogger(write, { ...base, ...fields }),
  };
}

export const silentLogger: Logger = createLogger(() => {});
