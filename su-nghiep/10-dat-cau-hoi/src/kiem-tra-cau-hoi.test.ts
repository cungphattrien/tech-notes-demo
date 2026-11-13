import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { kiemTra } from "./kiem-tra-cau-hoi.ts";

const doc = (ten: string) => readFileSync(new URL(`../${ten}`, import.meta.url), "utf8");
const soPhanDat = (tin: string) => kiemTra(tin).filter((k) => k.dat).length;

test("tin nhắn xấu không đạt phần nào", () => {
  assert.equal(soPhanDat(doc("cau-hoi-xau.txt")), 0);
});

test("tin nhắn tốt đạt đủ sáu phần", () => {
  assert.equal(soPhanDat(doc("cau-hoi-tot.txt")), 6);
});

test("bỏ dòng lỗi nguyên văn thì chỉ mất đúng phần 'dán lỗi nguyên văn'", () => {
  const khongLoi = doc("cau-hoi-tot.txt").replace(/^Error:.*\n.*\n/m, "");
  assert.deepEqual(kiemTra(khongLoi).filter((k) => !k.dat).map((k) => k.phep), ["dán lỗi nguyên văn"]);
});

test("chỉ một việc đã thử thì chưa đủ", () => {
  const motViec = doc("cau-hoi-tot.txt").replace(/^- Xóa node_modules.*\n- Tìm .*\n/m, "");
  assert.deepEqual(kiemTra(motViec).filter((k) => !k.dat).map((k) => k.phep), ["nêu ít nhất hai việc đã thử"]);
});

test("lỗi viết liền vào câu (không đứng đầu dòng) không được tính là dán nguyên văn", () => {
  assert.equal(kiemTra("Em đang chạy test, bị Error: getaddrinfo ENOTFOUND db, anh biết sao không ạ?")[1].dat, false);
});

test("GHI LẠI GIỚI HẠN: mẫu chưa điền gì vẫn được 4 trên 6 phần, vì bộ kiểm tra chỉ nhìn từ khóa", () => {
  assert.equal(soPhanDat(doc("mau-cau-hoi.txt")), 4);
});

test("GHI LẠI GIỚI HẠN: tin nhắn nhồi từ khóa mà rỗng ruột vẫn qua bộ kiểm tra", () => {
  const rongRuot = "Em đang làm việc.\nEm mong đợi tốt, nhưng thực tế không.\nError: gì đó\nEm đã thử:\n- cái này\n- cái kia\nMôi trường: Windows, Node 22\nAnh ơi sao vậy ạ?";
  assert.equal(soPhanDat(rongRuot), 6);
});
