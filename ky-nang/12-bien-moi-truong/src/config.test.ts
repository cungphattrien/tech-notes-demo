// Chạy: node --test src/config.test.ts
import assert from "node:assert/strict";
import { isAbsolute, join } from "node:path";
import { test } from "node:test";

import { ConfigError, loadConfig, moTaConfig } from "./config.ts";

const KHOA = "0123456789abcdef0123";

// Gọi loadConfig và trả về danh sách lỗi dạng "BIEN: loi", hoặc [] nếu hợp lệ.
function loiCua(env: Record<string, string | undefined>): string[] {
  try {
    loadConfig(env);
    return [];
  } catch (loi) {
    assert.ok(loi instanceof ConfigError);
    return loi.cacLoi.map(({ bien, loi }) => `${bien}: ${loi}`);
  }
}

test("chỉ cần đặt khóa là chạy được, mọi thứ còn lại dùng mặc định", () => {
  const config = loadConfig({ ORDER_API_KEY: KHOA });
  assert.equal(config.PORT, 3000);
  assert.equal(config.NODE_ENV, "development");
  assert.equal(config.LOG_LEVEL, "info");
  assert.equal(config.LOG_REQUESTS, false);
});

test("PORT rỗng (kiểu 'PORT=' trong file .env) dùng mặc định thay vì thành 0", () => {
  assert.equal(loadConfig({ PORT: "", ORDER_API_KEY: KHOA }).PORT, 3000);
});

test("PORT là số thì đổi thành số", () => {
  assert.equal(loadConfig({ PORT: "8080", ORDER_API_KEY: KHOA }).PORT, 8080);
});

test("PORT sai: chữ, 0, quá lớn, số lẻ đều bị từ chối", () => {
  for (const sai of ["abc", "0", "70000", "30.5", "-1"]) {
    assert.deepEqual(loiCua({ PORT: sai, ORDER_API_KEY: KHOA }).map((s) => s.split(":")[0]), ["PORT"], `PORT=${sai}`);
  }
});

test("LOG_REQUESTS=false là FALSE thật, không phải chuỗi 'false' (vốn đúng khi ép kiểu)", () => {
  assert.equal(loadConfig({ LOG_REQUESTS: "false", ORDER_API_KEY: KHOA }).LOG_REQUESTS, false);
  assert.equal(loadConfig({ LOG_REQUESTS: "true", ORDER_API_KEY: KHOA }).LOG_REQUESTS, true);
  assert.equal(loadConfig({ LOG_REQUESTS: "1", ORDER_API_KEY: KHOA }).LOG_REQUESTS, true);
  assert.equal(loadConfig({ LOG_REQUESTS: "0", ORDER_API_KEY: KHOA }).LOG_REQUESTS, false);
});

test("LOG_REQUESTS gõ sai thì báo lỗi, không đoán", () => {
  assert.equal(loiCua({ LOG_REQUESTS: "yes", ORDER_API_KEY: KHOA }).length, 1);
});

test("LOG_LEVEL không phân biệt hoa thường", () => {
  assert.equal(loadConfig({ LOG_LEVEL: "DEBUG", ORDER_API_KEY: KHOA }).LOG_LEVEL, "debug");
});

test("thiếu khóa: báo lỗi 'chưa đặt'; khóa quá ngắn: báo lỗi độ dài", () => {
  assert.deepEqual(loiCua({}), ["ORDER_API_KEY: chưa đặt (bắt buộc)"]);
  assert.deepEqual(loiCua({ ORDER_API_KEY: "ngan" }), ["ORDER_API_KEY: phải dài ít nhất 16 ký tự"]);
});

test("nhiều chỗ sai thì báo hết một lượt", () => {
  const loi = loiCua({ PORT: "abc", NODE_ENV: "staging", LOG_LEVEL: "verbose" });
  assert.deepEqual(loi.map((s) => s.split(":")[0]), ["PORT", "NODE_ENV", "LOG_LEVEL", "ORDER_API_KEY"]);
});

test("thông báo lỗi nhắc lại giá trị sai, nhưng không bao giờ in khóa bí mật", () => {
  const loi = loiCua({ PORT: "abc", ORDER_API_KEY: "ngan-bi-mat" });
  assert.ok(loi.some((s) => s.includes('"abc"')));
  assert.ok(!loi.join("\n").includes("ngan-bi-mat"));
});

test("ORDERS_FILE tương đối được tính từ thư mục gốc dự án, thành đường dẫn tuyệt đối", () => {
  const config = loadConfig({ ORDER_API_KEY: KHOA });
  assert.ok(isAbsolute(config.ORDERS_FILE));
  assert.ok(config.ORDERS_FILE.endsWith(join("data", "orders.json")));
});

test("moTaConfig che khóa bí mật, chỉ còn độ dài", () => {
  const mota = moTaConfig(loadConfig({ ORDER_API_KEY: KHOA }));
  assert.equal(mota.ORDER_API_KEY, "(đã đặt, 20 ký tự)");
  assert.ok(!JSON.stringify(mota).includes(KHOA));
});
