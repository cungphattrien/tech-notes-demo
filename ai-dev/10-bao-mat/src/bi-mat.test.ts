import assert from "node:assert/strict";
import { test } from "node:test";

import { anBiMat } from "./bi-mat.ts";
import { BOT_TOKEN_GIA, LOG_MAU, MAT_KHAU_DB_GIA } from "./mau-log.ts";

const loai = (vanBan: string) => anBiMat(vanBan).phatHien.map((p) => p.loai);

test("log mẫu: tìm đúng năm chỗ và sau khi che không còn token, mật khẩu, email, số điện thoại", () => {
  const { sach, phatHien } = anBiMat(LOG_MAU);
  assert.deepEqual(phatHien.map((p) => p.loai).sort(), ["bot-token", "bot-token", "email", "so-dien-thoai", "url-co-mat-khau"]);
  for (const bi of [BOT_TOKEN_GIA, MAT_KHAU_DB_GIA, "an.nguyen@example.com", "0901 000 001"]) assert.equal(sach.includes(bi), false, bi);
});

test("không che nhầm: mã commit, ngày, mã đơn, số tiền, số điện thoại thiếu hoặc thừa chữ số", () => {
  const binhThuong = "Commit 3f2a9c1, ngày 2026-11-13, đơn 1041, ăn trưa 45k, mã 2026111300, số 090100000, số 09010000012";
  assert.deepEqual(anBiMat(binhThuong).phatHien, []);
  assert.equal(anBiMat(binhThuong).sach, binhThuong);
});

test("giá trị mẫu trong .env.example không bị coi là bí mật", () => {
  for (const dong of ["BOT_TOKEN=your_token_here", "API_KEY=changeme", "SECRET=<điền vào đây>", "TOKEN=xxxxxxxxxxxx", 'url = "env(DATABASE_URL)"']) {
    assert.deepEqual(loai(dong), [], dong);
  }
});

test("gán mật khẩu: giữ tên biến, che giá trị", () => {
  assert.equal(anBiMat('password = "hunter2hunter2"').sach, 'password = "[ẨN:mat-khau-gan]"');
  assert.equal(anBiMat("SUPABASE_SERVICE_ROLE_KEY: abcdef123456").sach, "SUPABASE_SERVICE_ROLE_KEY: [ẨN:mat-khau-gan]");
});

test("số điện thoại viết ba kiểu đều bị che", () => {
  for (const sdt of ["0901 000 001", "+84 902 000 002", "090.100.0003"]) assert.deepEqual(loai(`gọi ${sdt} nhé`), ["so-dien-thoai"], sdt);
});

test("khóa AWS mẫu trong tài liệu và JWT được nhận ra", () => {
  const khoaAws = `AKIA${"IOSFODNN7EXAMPLE"}`;
  const jwt = `${"eyJhbGciOiJIUzI1NiJ9"}.${"eyJzdWIiOiIxMjM0In0"}.${"c2lnbmF0dXJlLWdpYQ"}`;
  assert.deepEqual(loai(`key ${khoaAws}`), ["khoa-aws"]);
  assert.deepEqual(loai(`Authorization: Bearer ${jwt}`), ["jwt"]);
});

test("GIỚI HẠN ĐÃ BIẾT: bí mật hình dạng lạ, không có tên gợi ý, lọt qua bộ lọc", () => {
  assert.deepEqual(loai('const k = "Zq8vN3mT7xL2pR9wB5yC";'), []);
});
