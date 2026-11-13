import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { kiemTra } from "./kiem-yeu-cau.ts";
import { docSo, tomTat, xepNhom } from "./theo-doi.ts";

const doc = (ten: string) => readFileSync(new URL(`../${ten}`, import.meta.url), "utf8");
const soPhanHoi = docSo(doc("so-phan-hoi.txt"));

test("tin nhắn xin nhận xét chung chung đạt 0/5", () => {
  assert.equal(kiemTra(doc("yeu-cau-xau.txt")).filter((k) => k.dat).length, 0);
});

test("tin nhắn xin nhận xét cụ thể đạt 5/5", () => {
  assert.equal(kiemTra(doc("yeu-cau-tot.txt")).filter((k) => k.dat).length, 5);
});

test("hỏi quá nhiều điều một lúc (bốn gạch đầu dòng) thì phần 'một hai điều' không đạt", () => {
  const tin = "Em muốn xin anh góp ý về PR #12.\n- a\n- b\n- c\n- d\nAnh xem giúp em trong 10 phút, trước thứ Hai, comment thẳng vào PR.";
  const ketQua = Object.fromEntries(kiemTra(tin).map((k) => [k.phep, k.dat]));
  assert.equal(ketQua["nói rõ muốn góp ý về một hai điều"], false);
});

test("giới hạn đã biết: tin nhắn nhồi từ khóa nhưng rỗng ruột vẫn đạt 5/5", () => {
  const rong = "Em muốn xin góp ý về PR #1.\n- gì đó\nXem giúp em 5 phút trước thứ Hai, comment trực tiếp vào PR.";
  assert.equal(kiemTra(rong).filter((k) => k.dat).length, 5);
});

test("đọc sổ phản hồi: bốn việc, ngày được đổi sang yyyy-mm-dd, 'chưa' thành null", () => {
  assert.equal(soPhanHoi.length, 4);
  assert.equal(soPhanHoi[0].han, "2026-12-15");
  assert.equal(soPhanHoi[1].baoLai, null);
  assert.equal(soPhanHoi[0].tu, "anh Phúc");
});

test("xếp nhóm ngày 16/12: xong chưa báo lại, quá hạn, còn hạn, đã khép vòng, mỗi nhóm một việc", () => {
  const nhom = tomTat(soPhanHoi, "2026-12-16");
  assert.deepEqual([...nhom].map(([ten, ds]) => [ten, ds.length]), [
    ["xong rồi nhưng chưa báo lại", 1],
    ["quá hạn", 1],
    ["còn trong hạn", 1],
    ["đã xong và đã báo lại", 1],
  ]);
});

test("việc có hạn đúng hôm nay chưa phải quá hạn; sang hôm sau thì quá hạn", () => {
  const viec = soPhanHoi[2]; // hạn 18/12
  assert.equal(xepNhom(viec, "2026-12-18"), "còn trong hạn");
  assert.equal(xepNhom(viec, "2026-12-19"), "quá hạn");
});

test("dòng sai dạng hoặc thiếu trường thì báo lỗi rõ ràng, không bỏ qua", () => {
  assert.throws(() => docSo("việc gì đó"), /sai dạng/);
  assert.throws(() => docSo("- [ ] a | từ: b | nhận: 01/12/2026 | hạn: 02/12/2026"), /thiếu "báo lại"/);
  assert.throws(() => docSo("- [ ] a | từ: b | nhận: 1/12/26 | hạn: 02/12/2026 | báo lại: chưa"), /dd\/mm\/yyyy/);
});
