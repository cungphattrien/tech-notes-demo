import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { taoEnv } from "./setup.ts";

const thuMucMoi = () => {
  const d = mkdtempSync(join(tmpdir(), "setup-"));
  writeFileSync(join(d, ".env.example"), "PORT=3000\nORDER_API_KEY=\n");
  return d;
};

test("tạo .env và điền một khóa 48 ký tự hex", () => {
  const d = thuMucMoi();
  assert.equal(taoEnv(d), "da-tao");
  const env = readFileSync(join(d, ".env"), "utf8");
  assert.match(env, /^PORT=3000$/m);
  assert.match(env, /^ORDER_API_KEY=[0-9a-f]{48}$/m);
});

test("chạy lần hai giữ nguyên .env, không đổi khóa", () => {
  const d = thuMucMoi();
  taoEnv(d);
  const truoc = readFileSync(join(d, ".env"), "utf8");
  assert.equal(taoEnv(d), "da-co");
  assert.equal(readFileSync(join(d, ".env"), "utf8"), truoc);
});

test("hai máy khác nhau nhận hai khóa khác nhau", () => {
  const a = thuMucMoi();
  const b = thuMucMoi();
  taoEnv(a);
  taoEnv(b);
  assert.notEqual(readFileSync(join(a, ".env"), "utf8"), readFileSync(join(b, ".env"), "utf8"));
});
