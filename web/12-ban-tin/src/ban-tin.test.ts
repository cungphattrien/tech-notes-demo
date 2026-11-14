// Chạy: node --test src/ban-tin.test.ts
import { PGlite } from "@electric-sql/pglite";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { before, test } from "node:test";

import { MIN_FILL_MS, emailProblem, looksAutomated, normalizeEmail, signupSource } from "./ban-tin.ts";

const BAY_GIO = 1_700_000_000_000;

test("normalizeEmail cắt khoảng trắng và đổi chữ thường", () => {
  assert.equal(normalizeEmail("  An@Example.COM "), "an@example.com");
});

test("emailProblem: để trống, thiếu @, thiếu tên miền, quá dài, hợp lệ", () => {
  assert.equal(emailProblem("   "), "emailMissing");
  assert.equal(emailProblem("an.example.com"), "emailInvalid");
  assert.equal(emailProblem("an@example"), "emailInvalid");
  assert.equal(emailProblem(`${"a".repeat(250)}@x.vn`), "emailInvalid");
  assert.equal(emailProblem("an@example.com"), null);
});

test("looksAutomated: ô ẩn có chữ là robot", () => {
  assert.equal(looksAutomated({ honeypot: "http://x.example", startedAt: String(BAY_GIO - 9000), now: BAY_GIO }), true);
});

test("looksAutomated: điền nhanh hơn MIN_FILL_MS là robot, đúng ngưỡng thì là người", () => {
  assert.equal(looksAutomated({ honeypot: "", startedAt: String(BAY_GIO - (MIN_FILL_MS - 1)), now: BAY_GIO }), true);
  assert.equal(looksAutomated({ honeypot: "", startedAt: String(BAY_GIO - MIN_FILL_MS), now: BAY_GIO }), false);
});

test("looksAutomated: không có mốc giờ thì không phạt người dùng", () => {
  assert.equal(looksAutomated({ honeypot: "", startedAt: "", now: BAY_GIO }), false);
});

test("signupSource chỉ nhận đường dẫn trong site", () => {
  assert.equal(signupSource("/bai-viet/abc"), "/bai-viet/abc");
  assert.equal(signupSource("https://x.example"), "");
  assert.equal(signupSource("//x.example"), "");
});

// ---- Phần database, chạy migration thật trên PGlite ----
let db: PGlite;
before(async () => {
  db = new PGlite();
  await db.exec(readFileSync("moi-truong.sql", "utf8"));
  await db.exec(readFileSync("migration.sql", "utf8"));
});

const nhu = async (vaiTro: string, viec: () => Promise<unknown>) => {
  await db.exec(`set role ${vaiTro}`);
  try {
    return await viec();
  } finally {
    await db.exec("reset role");
  }
};

test("database: anon không đọc được bảng, kể cả để thử xem một email đã đăng ký chưa", async () => {
  await assert.rejects(nhu("anon", () => db.query("select email from public.subscribers")), /permission denied/);
});

test("database: đăng ký lại cùng email (khác hoa thường) không lỗi và không thêm dòng", async () => {
  await nhu("anon", () => db.query("select public.subscribe($1)", ["Binh@Example.com"]));
  await nhu("anon", () => db.query("select public.subscribe($1)", [" binh@example.com "]));
  const { rows } = await db.query("select count(*)::int as n from public.subscribers where email = 'binh@example.com'");
  assert.equal((rows[0] as { n: number }).n, 1);
});

test("database: email sai bị từ chối với mã 22023", async () => {
  await assert.rejects(nhu("anon", () => db.query("select public.subscribe($1)", ["khong-phai-email"])), (e: { code?: string }) => e.code === "22023");
});

test("database: hủy đăng ký bằng token, rồi đăng ký lại thì thành subscribed", async () => {
  await nhu("anon", () => db.query("select public.subscribe($1)", ["chi@example.com"]));
  const { rows } = await db.query("select unsubscribe_token from public.subscribers where email = 'chi@example.com'");
  const token = (rows[0] as { unsubscribe_token: string }).unsubscribe_token;
  const huy = await nhu("anon", () => db.query("select public.unsubscribe($1) as ok", [token]));
  assert.equal((huy.rows[0] as { ok: boolean }).ok, true);
  await nhu("anon", () => db.query("select public.subscribe($1)", ["chi@example.com"]));
  const sau = await db.query("select status from public.subscribers where email = 'chi@example.com'");
  assert.equal((sau.rows[0] as { status: string }).status, "subscribed");
});

test("database: token lạ thì unsubscribe trả false", async () => {
  const huy = await nhu("anon", () => db.query("select public.unsubscribe($1) as ok", ["00000000-0000-0000-0000-000000000000"]));
  assert.equal((huy.rows[0] as { ok: boolean }).ok, false);
});

test("database: lượt đăng ký thứ 31 trong một phút bị chặn với mã 53400", async () => {
  const rieng = new PGlite();
  await rieng.exec(readFileSync("moi-truong.sql", "utf8"));
  await rieng.exec(readFileSync("migration.sql", "utf8"));
  await rieng.exec("set role anon");
  for (let i = 1; i <= 30; i++) await rieng.query("select public.subscribe($1)", [`n${i}@example.com`]);
  await assert.rejects(rieng.query("select public.subscribe($1)", ["n31@example.com"]), (e: { code?: string }) => e.code === "53400");
});
