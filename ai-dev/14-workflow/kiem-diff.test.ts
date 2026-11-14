import assert from "node:assert/strict";
import { test } from "node:test";
import { chot, docSo, ghi, ghiSo, tongKet, type Muc } from "./du-doan.ts";
import { docNumstat, kiemDiff, NGUONG_DONG } from "./kiem-diff.ts";

const ma = (cac: ReturnType<typeof kiemDiff>) => cac.map((p) => p.ma);

test("docNumstat đọc thêm, xóa, đường dẫn; file nhị phân ghi '-' tính là 0 dòng; đường dẫn có dấu cách giữ nguyên", () => {
  assert.deepEqual(docNumstat("10\t2\tsrc/a.ts\n-\t-\tanh.png\n1\t1\tthu muc/b c.ts\n"), [
    { them: 10, xoa: 2, duong: "src/a.ts" },
    { them: 0, xoa: 0, duong: "anh.png" },
    { them: 1, xoa: 1, duong: "thu muc/b c.ts" },
  ]);
});

test("sửa code mà không sửa test thì báo, có sửa test thì không", () => {
  assert.deepEqual(ma(kiemDiff(docNumstat("5\t1\tsrc/a.ts"))), ["sua-code-khong-test"]);
  assert.deepEqual(ma(kiemDiff(docNumstat("5\t1\tsrc/a.ts\n8\t0\tsrc/a.test.ts"))), []);
});

test("chỉ sửa tài liệu hoặc test thì không bị báo là sửa code không kèm test", () => {
  assert.deepEqual(ma(kiemDiff(docNumstat("5\t1\tREADME.md"))), []);
  assert.deepEqual(ma(kiemDiff(docNumstat("5\t1\tsrc/a.test.ts"))), []);
});

test("test bị xóa nhiều hơn thêm thì báo, thêm nhiều hơn xóa thì không", () => {
  assert.ok(ma(kiemDiff(docNumstat("1\t40\tsrc/a.test.ts"))).includes("xoa-test"));
  assert.ok(!ma(kiemDiff(docNumstat("40\t1\tsrc/a.test.ts"))).includes("xoa-test"));
});

test(`diff đúng ${NGUONG_DONG} dòng thì chưa báo, ${NGUONG_DONG + 1} dòng thì báo`, () => {
  assert.ok(!ma(kiemDiff(docNumstat(`${NGUONG_DONG}\t0\tdoc.md`))).includes("diff-lon"));
  assert.ok(ma(kiemDiff(docNumstat(`${NGUONG_DONG + 1}\t0\tdoc.md`))).includes("diff-lon"));
});

test("file nhạy cảm: .env, package.json, lockfile, CI, .sql bị báo; .env.example thì không", () => {
  for (const f of [".env", ".env.local", "package.json", "web/package-lock.json", ".github/workflows/ci.yml", "db/001.sql", "tsconfig.json", "vercel.json"]) {
    assert.ok(ma(kiemDiff(docNumstat(`1\t0\t${f}`))).includes("file-nhay-cam"), f);
  }
  assert.ok(!ma(kiemDiff(docNumstat("1\t0\t.env.example"))).includes("file-nhay-cam"));
});

test("trải trên nhiều file (trên 20) thì báo", () => {
  const nhieu = Array.from({ length: 21 }, (_, i) => `1\t0\tdoc/${i}.md`).join("\n");
  assert.ok(ma(kiemDiff(docNumstat(nhieu))).includes("nhieu-file"));
  assert.ok(!ma(kiemDiff(docNumstat(nhieu.split("\n").slice(0, 20).join("\n")))).includes("nhieu-file"));
});

test("diff trống thì không có dấu hiệu nào", () => {
  assert.deepEqual(kiemDiff([]), []);
});

test("giới hạn đã biết: xóa test rồi thêm test vô nghĩa với số dòng nhiều hơn thì bộ kiểm không thấy gì", () => {
  assert.deepEqual(ma(kiemDiff(docNumstat("5\t0\tsrc/a.ts\n50\t3\tsrc/a.test.ts"))), []);
});

test("sổ đoán trước: ghi, chốt, tổng kết", () => {
  let so: Muc[] = [];
  so = ghi(so, "Thêm lệnh /xoa", "AI sẽ thêm một hàm xóa khoản chi cuối cùng và test cho nó, không đụng tới bot.ts");
  so = ghi(so, "Sửa lỗi 35 nghìn", "AI sẽ sửa regex trong phan-loai.ts, test cũ vẫn xanh");
  so = chot(so, 1, "dung");
  so = chot(so, 2, "sai", "AI sửa cả hàm đọc số tiền, làm hỏng 2 test cũ");
  assert.deepEqual(tongKet(so), ["2 mục, 2 đã chốt, 0 chưa chốt.", "Đoán đúng 1, đúng một phần 0, sai 1 (50% đúng hoàn toàn).", "  #2 Sửa lỗi 35 nghìn: sai. AI sửa cả hàm đọc số tiền, làm hỏng 2 test cũ"]);
});

test("dự đoán quá ngắn bị từ chối, đoán sai mà không ghi chú vì sao cũng bị từ chối", () => {
  assert.throws(() => ghi([], "việc", "ok"), /quá ngắn/);
  const so = ghi([], "việc", "AI sẽ thêm một hàm và một test cho hàm đó");
  assert.throws(() => chot(so, 1, "sai"), /phải ghi chú/);
});

test("đã chốt thì không đổi lại; mục không có thì báo lỗi", () => {
  let so = ghi([], "việc", "AI sẽ thêm một hàm và một test cho hàm đó");
  so = chot(so, 1, "dung");
  assert.throws(() => chot(so, 1, "sai", "x"), /không đổi lại/);
  assert.throws(() => chot(so, 9, "dung"), /Không có mục số 9/);
});

test("đọc và ghi sổ qua lại không đổi gì", () => {
  const so = ghi([], "việc", "AI sẽ thêm một hàm và một test cho hàm đó");
  assert.deepEqual(docSo(ghiSo(so)), so);
});
