import { expect, test } from "vitest";

import { createLogger, describeError } from "./logger.ts";

test("JSON.stringify không ghi được Error, describeError thì có", () => {
  const error = new Error("hỏng");
  expect(JSON.stringify({ error })).toBe('{"error":{}}');
  expect(describeError(error)).toMatchObject({ name: "Error", message: "hỏng" });
});

test("describeError đi theo chuỗi cause tới lỗi gốc", () => {
  const error = new Error("Không liệt kê được đơn 1050", { cause: new TypeError("toUpperCase của undefined") });
  expect(describeError(error).cause).toMatchObject({ name: "TypeError", message: "toUpperCase của undefined" });
});

test("giá trị không phải Error (ví dụ throw 'chuỗi') vẫn ghi được", () => {
  expect(describeError("chuỗi")).toEqual({ name: "NonError", message: "chuỗi" });
});

test("logger con ghi kèm trường của cha, mỗi sự kiện một dòng JSON", () => {
  const lines: string[] = [];
  const log = createLogger((line) => lines.push(line), { app: "don-hang" }).child({ requestId: "ab12" });
  log.warn("thử", { status: 400 });
  expect(lines).toHaveLength(1);
  expect(JSON.parse(lines[0])).toMatchObject({ level: "warn", msg: "thử", app: "don-hang", requestId: "ab12", status: 400 });
});
