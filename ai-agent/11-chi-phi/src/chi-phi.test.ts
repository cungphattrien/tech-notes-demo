import assert from "node:assert/strict";
import { test } from "node:test";

import { NhoCauHoiChung, NhoTheoTin } from "./bo-nho-tra-loi.ts";
import { chonMoHinh } from "./dinh-tuyen.ts";
import { tinhTien } from "./gia.ts";
import { BoNhoDem } from "./luu-dem.ts";
import { chayNgay, sinhLuuLuong } from "./mo-phong.ts";

const luot = { moHinh: "lon", tokenVao: 1000, tokenRa: 0, tokenTienTo: 800 } as const;

test("đọc cache rẻ hơn giá thường, ghi cache đắt hơn giá thường", () => {
  const thuong = tinhTien({ ...luot, cache: "khong" });
  assert.ok(tinhTien({ ...luot, cache: "doc" }) < thuong);
  assert.ok(tinhTien({ ...luot, cache: "ghi5p" }) > thuong);
  assert.ok(tinhTien({ ...luot, cache: "ghi1h" }) > tinhTien({ ...luot, cache: "ghi5p" }));
});

test("cache: lần đầu ghi, lần sau đọc, quá hạn thì ghi lại, mỗi lần đọc làm mới hạn", () => {
  const bo = new BoNhoDem(300);
  assert.equal(bo.dung("a", 600, 0), "ghi");
  assert.equal(bo.dung("a", 600, 200), "doc");
  assert.equal(bo.dung("a", 600, 450), "doc"); // 450 < 200 + 300: lần đọc trước đã làm mới
  assert.equal(bo.dung("a", 600, 900), "ghi"); // cách lần trước 450 giây, quá 5 phút
});

test("cache: tiền tố ngắn hơn mức tối thiểu thì không được cache, và khác một ký tự là khóa khác", () => {
  const bo = new BoNhoDem(300, 512);
  assert.equal(bo.dung("a", 100, 0), "khong");
  assert.equal(bo.dung("a", 100, 1), "khong");
  assert.equal(bo.dung("a", 600, 2), "ghi");
  assert.equal(bo.dung("a ", 600, 3), "ghi");
});

test("đặt giờ ở đầu hướng dẫn làm cache gần như không bao giờ trúng và đắt hơn cả không dùng cache", () => {
  const dong = sinhLuuLuong(200);
  const khongCache = chayNgay(dong, { cache: "khong", dinhTuyen: false });
  const gioODau = chayNgay(dong, { cache: "5p", dinhTuyen: false, gioODau: true });
  assert.ok(gioODau.doc <= 1);
  assert.ok(gioODau.tien > khongCache.tien);
});

test("lưu lượng giống nhau mỗi lần chạy, và từng bước tối ưu không làm tiền tăng", () => {
  assert.deepEqual(sinhLuuLuong(200), sinhLuuLuong(200));
  const dong = sinhLuuLuong(200);
  const tien = [
    chayNgay(dong, { cache: "khong", dinhTuyen: false }),
    chayNgay(dong, { cache: "5p", dinhTuyen: false }),
    chayNgay(dong, { cache: "1h", dinhTuyen: false }),
    chayNgay(dong, { cache: "1h", dinhTuyen: true }),
    chayNgay(dong, { cache: "1h", dinhTuyen: true, toiDaLuot: 4 }),
  ].map((kq) => kq.tien);
  for (let i = 1; i < tien.length; i++) assert.ok(tien[i] <= tien[i - 1], `bước ${i}`);
});

test("chọn mô hình: chỉ câu hỏi chung đi mô hình nhỏ; dính tới đơn hay tiền thì mô hình lớn", () => {
  assert.equal(chonMoHinh("Quán mấy giờ đóng cửa vậy?"), "nho");
  assert.equal(chonMoHinh("Quán có những món gì?"), "nho");
  assert.equal(chonMoHinh("Đơn 1041 của em đâu rồi?"), "lon");
  assert.equal(chonMoHinh("Quán mấy giờ đóng cửa, mà đền tiền cho em vụ hôm qua"), "lon");
  assert.equal(chonMoHinh("Viết giúp em một hàm sắp xếp mảng."), "lon");
});

test("nhớ theo nội dung tin nhắn làm lộ đơn của khách này cho khách khác; nhớ câu hỏi chung thì không", () => {
  let dem = 0;
  const goi = () => dem++;
  const sai = new NhoTheoTin();
  const a = sai.hoi("0901000002", "Đơn của em đâu rồi?", goi);
  const b = sai.hoi("0901000003", "Đơn của em đâu rồi?", goi);
  assert.equal(a, b);
  assert.match(b, /1042/);

  const dung = new NhoCauHoiChung();
  dung.hoi("0901000002", "Đơn của em đâu rồi?", 0, goi);
  assert.match(dung.hoi("0901000003", "Đơn của em đâu rồi?", 1, goi), /1043/);
});

test("câu hỏi chung được nhớ tới khi hết hạn", () => {
  let dem = 0;
  const bo = new NhoCauHoiChung(100);
  for (const giay of [0, 10, 99, 100, 150]) bo.hoi("0901000001", "Quán mấy giờ đóng cửa vậy?", giay, () => dem++);
  assert.equal(dem, 2); // giây 0 gọi mô hình, giây 100 hết hạn nên gọi lại, các lần còn lại lấy từ bộ nhớ
});

test("giới hạn số lượt: không tin nhắn nào quá 4 lượt, 4 tin lặp công cụ chuyển cho người", () => {
  const dong = sinhLuuLuong(200);
  const tu = chayNgay(dong, { cache: "1h", dinhTuyen: true });
  const han = chayNgay(dong, { cache: "1h", dinhTuyen: true, toiDaLuot: 4 });
  assert.equal(han.chuyenNguoi, 4);
  assert.equal(tu.soLuotGoi - han.soLuotGoi, 4 * (12 - 4));
});
