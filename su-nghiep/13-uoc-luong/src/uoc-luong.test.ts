import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { duBao, kiemBaoCao, NGUONG_BAO_NGAY } from "./tien-do.ts";
import { heSoLech, ngayXong, phanVi, thuCua, tiLeDungHan, uocLuong, type Viec } from "./uoc-luong.ts";

const lichSu = JSON.parse(readFileSync("lich-su.json", "utf8")) as Viec[];

test("hệ số lệch của lịch sử mẫu: 8 giá trị, từ 0,75 đến 1,83", () => {
  const he = heSoLech(lichSu);
  assert.equal(he.length, 8);
  assert.equal(Math.min(...he), 0.75);
  assert.equal(Number(Math.max(...he).toFixed(2)), 1.83);
});

test("phanVi nearest-rank: p50 của 1..4 là 2, p80 của 1..10 là 8, p100 là giá trị lớn nhất", () => {
  assert.equal(phanVi([4, 1, 3, 2], 0.5), 2);
  assert.equal(phanVi([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 0.8), 8);
  assert.equal(phanVi([3, 9, 1], 1), 9);
});

test("phanVi báo lỗi khi không có dữ liệu và không đổi mảng gốc", () => {
  assert.throws(() => phanVi([], 0.5), /ít nhất một giá trị/);
  const goc = [3, 1, 2];
  phanVi(goc, 0.5);
  assert.deepEqual(goc, [3, 1, 2]);
});

test("chỉ 1 trong 8 việc xong đúng hạn hoặc sớm hơn", () => {
  assert.equal(tiLeDungHan(lichSu), 1 / 8);
});

test("uocLuong: cộng 11 giờ, thường 14,7 giờ, chắc 19,3 giờ", () => {
  const kq = uocLuong([{ ten: "a", gio: 1.5 }, { ten: "b", gio: 3 }, { ten: "c", gio: 3 }, { ten: "d", gio: 2 }, { ten: "e", gio: 1.5 }], lichSu);
  assert.equal(kq.gioCongLai, 11);
  assert.equal(kq.gioThuong.toFixed(1), "14.7");
  assert.equal(kq.gioChac.toFixed(1), "19.3");
});

test("thuCua: 14/12/2026 là thứ hai", () => {
  assert.equal(thuCua("2026-12-14"), "Thứ hai");
  assert.equal(thuCua("2026-12-20"), "Chủ nhật");
});

test("ngayXong: 10 giờ từ thứ hai là thứ ba; 15 giờ là thứ tư; 19,3 giờ là thứ năm", () => {
  assert.equal(ngayXong("2026-12-14", 10), "2026-12-15");
  assert.equal(ngayXong("2026-12-14", 15), "2026-12-16");
  assert.equal(ngayXong("2026-12-14", 19.3), "2026-12-17");
});

test("ngayXong bỏ qua cuối tuần: thứ năm làm 3 ngày thì xong thứ hai tuần sau", () => {
  assert.equal(ngayXong("2026-12-17", 15), "2026-12-21");
});

test("ngayXong: bắt đầu vào thứ bảy thì tính từ thứ hai; việc rất nhỏ vẫn mất một ngày", () => {
  assert.equal(ngayXong("2026-12-19", 1), "2026-12-21");
  assert.equal(ngayXong("2026-12-14", 0.5), "2026-12-14");
});

test("duBao: lệch 24% chưa báo, đúng 25% thì báo", () => {
  assert.equal(NGUONG_BAO_NGAY, 0.25);
  assert.equal(duBao({ uocGoc: 10, daDung: 5, conLai: 7.4 }).canBaoNgay, false);
  assert.equal(duBao({ uocGoc: 10, daDung: 5, conLai: 7.5 }).canBaoNgay, true);
});

test("duBao với số của Minh: cuối thứ hai chưa báo (+15%), cuối thứ ba báo (+80%)", () => {
  assert.deepEqual(duBao({ uocGoc: 10, daDung: 5, conLai: 6.5 }), { gioDuKien: 11.5, lechPhanTram: 15, canBaoNgay: false });
  assert.deepEqual(duBao({ uocGoc: 10, daDung: 10, conLai: 8 }), { gioDuKien: 18, lechPhanTram: 80, canBaoNgay: true });
});

test("duBao: làm nhanh hơn dự kiến thì lệch âm và không báo", () => {
  assert.deepEqual(duBao({ uocGoc: 10, daDung: 4, conLai: 4 }), { gioDuKien: 8, lechPhanTram: -20, canBaoNgay: false });
});

test("kiemBaoCao: bản xấu đạt 1/5, bản tốt đạt 5/5", () => {
  const dat = (f: string) => kiemBaoCao(readFileSync(f, "utf8")).filter((k) => k.dat).length;
  assert.equal(dat("bao-cao-xau.txt"), 1);
  assert.equal(dat("bao-cao-tot.txt"), 5);
});

test("'sắp xong' không phải ngày; 'dự kiến' phải đi kèm một mốc ngày thật", () => {
  const kq = (s: string) => kiemBaoCao(s).find((k) => k.ten.startsWith("Dự kiến"))!.dat;
  assert.equal(kq("Em dự kiến sắp xong rồi ạ."), false);
  assert.equal(kq("Em dự kiến xong vào thứ năm."), true);
  assert.equal(kq("Em dự kiến xong vào 17/12."), true);
});

test("nói rõ 'không có gì vướng' cũng được tính là đã nói về chỗ vướng", () => {
  const kq = kiemBaoCao("Hiện không có gì vướng.").find((k) => k.ten.startsWith("Vướng"))!;
  assert.equal(kq.dat, true);
});

test("giới hạn đã biết: một tin chứa đủ từ khóa nhưng vô nghĩa vẫn qua cả năm phần", () => {
  const vo = "đã xong gì đó. đang làm gì đó. vướng gì đó. dự kiến xong vào thứ hai. sẽ báo lại.";
  assert.equal(kiemBaoCao(vo).every((k) => k.dat), true);
});
