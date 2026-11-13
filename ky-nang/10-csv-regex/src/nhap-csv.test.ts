import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { chuanHoaNgay, chuanHoaSdt, chuanHoaTien, tachMon } from "./chuan-hoa.ts";
import { tachDongCsv } from "./csv.ts";
import { nhapCsv } from "./nhap-csv.ts";

const FILE_CU = readFileSync(new URL("./don-cu.csv", import.meta.url), "utf8");

test("tachDongCsv: dấu phẩy trong ngoặc kép không tách ô, \"\" là một dấu ngoặc kép", () => {
  assert.deepEqual(tachDongCsv('1,"Lê, Văn Cường","nói ""xin chào""",x'), ["1", "Lê, Văn Cường", 'nói "xin chào"', "x"]);
  assert.deepEqual(tachDongCsv("a,,c"), ["a", "", "c"]);
  assert.throws(() => tachDongCsv('1,"chưa đóng'), /ngoặc kép/);
});

test("chuanHoaSdt: bốn kiểu viết cùng ra một số; ô trống là khách tại quầy; số sai bị loại", () => {
  assert.equal(chuanHoaSdt("0901 000 001"), "0901000001");
  assert.equal(chuanHoaSdt("+84 902 000 002"), "0902000002");
  assert.equal(chuanHoaSdt("(090)1000003"), "0901000003");
  assert.equal(chuanHoaSdt("  "), undefined);
  assert.throws(() => chuanHoaSdt("09O5000005"), /không hợp lệ/); // chữ O thay cho số 0
  assert.throws(() => chuanHoaSdt("090100000"), /không hợp lệ/); // thiếu một số
});

test("chuanHoaNgay: ba kiểu viết cùng ra dạng ISO; ngày không có thật bị loại", () => {
  assert.equal(chuanHoaNgay("03/11/2026"), "2026-11-03");
  assert.equal(chuanHoaNgay("3-11-26"), "2026-11-03");
  assert.equal(chuanHoaNgay("2026.11.03"), "2026-11-03");
  assert.throws(() => chuanHoaNgay("31/02/2026"), /không tồn tại/);
  assert.throws(() => chuanHoaNgay("03/13/2026"), /không tồn tại/); // tháng 13
  assert.throws(() => chuanHoaNgay("3/11/226"), /không tồn tại/); // năm ba chữ số
  assert.throws(() => chuanHoaNgay("hôm qua"), /không đúng dạng/);
});

test("GHI LẠI GIẢ ĐỊNH: 01/02/2026 được đọc là ngày 1 tháng 2 (ngày trước tháng), không đoán kiểu Mỹ", () => {
  assert.equal(chuanHoaNgay("01/02/2026"), "2026-02-01");
});

test("chuanHoaTien: các kiểu viết tiền; số nhỏ hơn 1.000đ và chữ lạ bị loại", () => {
  assert.equal(chuanHoaTien("79.000đ"), 79000);
  assert.equal(chuanHoaTien("32,000"), 32000);
  assert.equal(chuanHoaTien("85k"), 85000);
  assert.equal(chuanHoaTien("1.250.000"), 1250000);
  assert.equal(chuanHoaTien("75000"), 75000);
  assert.throws(() => chuanHoaTien("35"), /nghi mất dấu chấm/);
  assert.throws(() => chuanHoaTien("32,5"), /không đọc được/);
  assert.throws(() => chuanHoaTien("abc"), /không đọc được/);
});

test("tachMon: có hoặc không có số lượng, khoảng trắng lộn xộn", () => {
  assert.deepEqual(tachMon("1x cà phê muối ; 2 x bánh mì trứng"), [
    { ten: "cà phê muối", soLuong: 1 },
    { ten: "bánh mì trứng", soLuong: 2 },
  ]);
  assert.deepEqual(tachMon("cà phê sữa"), [{ ten: "cà phê sữa", soLuong: 1 }]);
  assert.throws(() => tachMon(" ; "), /không có món nào/);
});

test("nhapCsv trên file mẫu: 5 hợp lệ, 4 bị loại đúng số dòng, không dòng nào biến mất", () => {
  const { hopLe, biLoai } = nhapCsv(FILE_CU);
  assert.deepEqual(hopLe.map((don) => don.maDon), ["2001", "2002", "2003", "2004", "2007"]);
  assert.deepEqual(biLoai.map((loi) => loi.dong), [6, 7, 9, 10]);
  assert.equal(hopLe.length + biLoai.length, 9);
  assert.equal(hopLe[2].khach, "Lê, Văn Cường");
  assert.equal(hopLe[3].sdt, undefined);
});

test("nhapCsv: file không có BOM, kết thúc dòng bằng \\n thay vì \\r\\n vẫn đọc được; tiêu đề sai thì báo lỗi", () => {
  const khongBom = FILE_CU.replace(/^﻿/, "").replaceAll("\r\n", "\n");
  assert.equal(nhapCsv(khongBom).hopLe.length, 5);
  assert.throws(() => nhapCsv("ngay,ma_don\n1,2"), /Dòng tiêu đề/);
});
