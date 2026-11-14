// Chạy: node --test lam-viec-tu-xa.test.ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { chenhLechPhut, giaoNhau, gio, khungLamViec, thoiDiemDiaPhuong, type Nguoi } from "./gio-trung.ts";
import { kiemTra } from "./kiem-tin-nhan.ts";

const nhom = JSON.parse(readFileSync("doi-nhom.json", "utf8")) as Nguoi[];
const phutChung = (ngay: string) => {
  const chung = giaoNhau(nhom.map((n) => khungLamViec(n, ngay)));
  return chung ? (chung.ketThuc - chung.batDau) / 60000 : 0;
};

test("Việt Nam là UTC+7 quanh năm, Berlin là UTC+1 mùa đông và UTC+2 mùa hè", () => {
  assert.equal(chenhLechPhut(Date.UTC(2026, 11, 14, 0, 0), "Asia/Ho_Chi_Minh"), 420);
  assert.equal(chenhLechPhut(Date.UTC(2026, 11, 14, 0, 0), "Europe/Berlin"), 60);
  assert.equal(chenhLechPhut(Date.UTC(2027, 6, 12, 0, 0), "Europe/Berlin"), 120);
});

test("9:00 sáng ở Berlin ngày 14/12/2026 là 08:00 UTC, tức 15:00 giờ Việt Nam", () => {
  const t = thoiDiemDiaPhuong("2026-12-14", "09:00", "Europe/Berlin");
  assert.equal(new Date(t).toISOString(), "2026-12-14T08:00:00.000Z");
  assert.equal(gio(t, "Asia/Ho_Chi_Minh"), "15:00");
});

test("mùa đông cả nhóm trùng 120 phút (15:00–17:00 giờ VN)", () => {
  assert.equal(phutChung("2026-12-14"), 120);
});

test("mùa hè Berlin lùi giờ: khung trùng dài ra 180 phút và dịch sớm một tiếng", () => {
  assert.equal(phutChung("2027-07-12"), 180);
  const chung = giaoNhau(nhom.map((n) => khungLamViec(n, "2027-07-12")));
  assert.equal(gio(chung!.batDau, "Asia/Ho_Chi_Minh"), "14:00");
});

test("khung trùng đổi đúng vào ngày châu Âu chuyển giờ (28/3/2027)", () => {
  assert.equal(phutChung("2027-03-26"), 120);
  assert.equal(phutChung("2027-03-29"), 180);
});

test("hai múi giờ quá xa nhau thì không có giờ trùng", () => {
  const xa: Nguoi[] = [
    { ten: "A", muiGio: "Asia/Ho_Chi_Minh", tu: "09:00", den: "18:00" },
    { ten: "B", muiGio: "America/Los_Angeles", tu: "09:00", den: "18:00" },
  ];
  assert.equal(giaoNhau(xa.map((n) => khungLamViec(n, "2026-12-14"))), null);
});

const dat = (noiDung: string) => Object.fromEntries(kiemTra(noiDung).map((k) => [k.ten, k.dat]));

test("tin nhắn xấu của Minh không đạt phần nào", () => {
  assert.equal(kiemTra(readFileSync("tin-nhan-xau.txt", "utf8")).filter((k) => k.dat).length, 0);
});

test("tin nhắn tốt đạt cả năm phần", () => {
  assert.equal(kiemTra(readFileSync("tin-nhan-tot.txt", "utf8")).filter((k) => k.dat).length, 5);
});

test("giờ mà không có múi giờ thì không đạt phần hạn", () => {
  assert.equal(dat("Anh trả lời giúp em trước 15:00 nhé?")["Hạn có giờ và múi giờ"], false);
  assert.equal(dat("Anh trả lời giúp em trước 15:00 giờ Việt Nam nhé?")["Hạn có giờ và múi giờ"], true);
});

test("hạn kiểu 'chiều nay' được nhắc là mơ hồ với người ở múi giờ khác", () => {
  const ketQua = kiemTra("Anh trả lời em chiều nay nhé?").find((k) => k.ten === "Hạn có giờ và múi giờ")!;
  assert.equal(ketQua.dat, false);
  assert.match(ketQua.loiNhan, /múi giờ khác/);
});

test("hỏi xin phép trước khi nói việc không đạt phần đầu", () => {
  assert.equal(dat("Anh ơi, anh có đó không ạ?")["Không xin phép trước khi hỏi"], false);
});

test("GIỚI HẠN ĐÃ BIẾT: tin nhắn toàn từ khóa nhưng vô nghĩa vẫn qua được, bộ kiểm chỉ thấy sự có mặt", () => {
  const vonghia = "https://x.example nhờ anh trước 15:00 giờ Việt Nam. Nếu đến 15:00 em chưa thấy trả lời thì em sẽ làm tiếp.";
  assert.equal(kiemTra(vonghia).filter((k) => k.dat).length, 5);
});
