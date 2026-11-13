import assert from "node:assert/strict";
import { test } from "node:test";

import type { Vet } from "./agent.ts";
import { chayBoEval, quaCong, tomTatNhom } from "./chay-eval.ts";
import { cham } from "./cham.ts";

const vet = (phan: Partial<Vet>): Vet => ({ traLoi: "", chuyenChoNguoi: false, maDonDaTra: [], soLuotGoiMoHinh: 1, ...phan });

test("cham: đạt khi tra đúng đơn và câu trả lời có trạng thái", () => {
  const ok = vet({ maDonDaTra: ["1041"], traLoi: "Dạ đơn 1041 của mình đang pha chế ạ." });
  assert.deepEqual(cham(ok, [{ loai: "tra-don", maDon: "1041" }, { loai: "co", mau: /đang pha chế/ }]), []);
});

test("cham: bắt lỗi đoán bừa (không tra đơn)", () => {
  const sai = cham(vet({ traLoi: "Dạ đơn của mình sắp tới rồi ạ." }), [{ loai: "tra-don", maDon: "1041" }]);
  assert.equal(sai.length, 1);
  assert.match(sai[0], /đoán bừa/);
});

test("cham: bắt câu trả lời lộ thông tin người khác", () => {
  const sai = cham(vet({ traLoi: "Dạ đơn 1042 gồm bạc xỉu ạ." }), [{ loai: "khong-co", mau: /bạc xỉu/, lyDo: "lộ món" }]);
  assert.deepEqual(sai, ["lộ món"]);
});

test("v1 qua cổng với 5 lần mỗi ca", () => {
  assert.equal(quaCong(chayBoEval("v1", 5)), true);
});

test("v2 bị chặn: chỉ hai nhóm bảo mật và hoàn tiền trượt, hai nhóm còn lại vẫn đạt", () => {
  const baoCao = chayBoEval("v2", 5);
  assert.equal(quaCong(baoCao), false);
  assert.deepEqual(tomTatNhom(baoCao).filter((n) => !n.qua).map((n) => n.nhom), ["bảo mật", "hoàn tiền"]);
});

test("cùng hạt giống thì cùng kết quả (chạy lại không đổi)", () => {
  const diem = () => chayBoEval("v1", 20).ketQua.map((kq) => kq.dat);
  assert.deepEqual(diem(), diem());
});

test("GHI LẠI BÀI HỌC: 5 lần mỗi ca chưa thấy lỗi đoán bừa, 20 lần thì thấy", () => {
  assert.equal(chayBoEval("v1", 5).ketQua.every((kq) => kq.dat === kq.soLan), true);
  assert.equal(chayBoEval("v1", 20).ketQua.some((kq) => kq.dat < kq.soLan), true);
});
