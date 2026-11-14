import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { kiemTuDanhGia, thongKe, type GhiChu } from "./tu-danh-gia.ts";

const so = JSON.parse(readFileSync("ghi-chu.json", "utf8")) as GhiChu[];
const dat = (kq: ReturnType<typeof kiemTuDanhGia>) => kq.map((k) => k.dat);
const tot = readFileSync("tu-danh-gia-tot.md", "utf8");

test("thống kê: 12 ghi chú trong 8 tuần, chia theo bảy năng lực", () => {
  assert.equal(so.length, 12);
  assert.equal(Math.max(...so.map((g) => g.tuan)), 8);
  assert.equal(thongKe(so).length, 7);
});

test("thống kê: viết code 4 bằng chứng (3 tốt, 1 chưa tốt) ở tuần 1, 2, 4, 7", () => {
  const d = thongKe(so).find((x) => x.nangLuc === "viet-code")!;
  assert.deepEqual([d.tot, d.chuaTot, d.cacTuan], [3, 1, [1, 2, 4, 7]]);
});

test("thống kê: ước lượng có 3 bằng chứng, 2 trong số đó chưa tốt", () => {
  const d = thongKe(so).find((x) => x.nangLuc === "uoc-luong")!;
  assert.deepEqual([d.tot, d.chuaTot, d.cacTuan], [1, 2, [2, 4, 6]]);
});

test("thống kê: review code của người khác chưa có bằng chứng nào", () => {
  const d = thongKe(so).find((x) => x.nangLuc === "review")!;
  assert.deepEqual([d.tot, d.chuaTot, d.cacTuan], [0, 0, []]);
});

test("thống kê: một tuần chỉ tính một lần dù có nhiều ghi chú cùng năng lực", () => {
  const nhieu: GhiChu[] = [
    { tuan: 3, viec: "a", nangLuc: ["viet-code"], bangChung: "PR #1", ketQua: "tot" },
    { tuan: 3, viec: "b", nangLuc: ["viet-code"], bangChung: "PR #2", ketQua: "tot" },
  ];
  assert.deepEqual(thongKe(nhieu).find((x) => x.nangLuc === "viet-code")!.cacTuan, [3]);
});

test("bản tự đánh giá tốt đạt 6/6, bản xấu đạt 0/6", () => {
  assert.deepEqual(dat(kiemTuDanhGia(tot)), [true, true, true, true, true, true]);
  assert.deepEqual(dat(kiemTuDanhGia(readFileSync("tu-danh-gia-xau.md", "utf8"))), [false, false, false, false, false, false]);
});

test("bỏ phần 'Chưa tốt' thì không đạt tiêu chí thứ hai và chỉ tiêu chí đó", () => {
  const bo = tot.replace(/## Chưa tốt[\s\S]*?(?=## Phản hồi)/, "");
  assert.deepEqual(dat(kiemTuDanhGia(bo)), [true, false, true, true, true, true]);
});

test("mục tiêu không có con số hoặc ngày thì không đạt", () => {
  const bo = tot.replace(/## Mục tiêu 90 ngày tới[\s\S]*$/, "## Mục tiêu 90 ngày tới\nEm sẽ cải thiện việc ước lượng và học thêm về review.\n");
  assert.equal(kiemTuDanhGia(bo)[4]!.dat, false);
});

test("phần cuối của văn bản (không còn tiêu đề sau) vẫn được đọc đủ", () => {
  assert.equal(kiemTuDanhGia(tot)[4]!.dat, true);
});

test("tính từ suông đi kèm bằng chứng trong cùng câu thì chấp nhận, không kèm thì bị báo", () => {
  const co = tot.replace("Em thêm trường ghi chú", "Em làm tốt việc thêm trường ghi chú");
  assert.equal(kiemTuDanhGia(co)[5]!.dat, true);
  const khong = tot.replace("## Chưa tốt\n", "## Chưa tốt\nEm làm việc rất chăm chỉ.\n");
  assert.equal(kiemTuDanhGia(khong)[5]!.dat, false);
});

test("một ý trong 'Đã làm được' thiếu bằng chứng thì bị chỉ ra đúng câu đó", () => {
  const sua = tot.replace("Em báo trễ task bộ lọc đơn vào cuối ngày thứ ba, ngày 15/12, thay vì chờ bị hỏi.", "Em báo trễ task bộ lọc đơn sớm thay vì chờ bị hỏi.");
  const k = kiemTuDanhGia(sua)[0]!;
  assert.equal(k.dat, false);
  assert.match(k.loiNhan, /1 ý không có bằng chứng.*báo trễ task bộ lọc đơn sớm/);
});

test("giới hạn đã biết: một bản có đủ năm phần và con số nhưng vô nghĩa vẫn qua cả sáu tiêu chí", () => {
  const vo = "## Đã làm được\nEm làm gì đó ở PR #1.\nEm làm thêm gì đó ở PR #2.\n## Chưa tốt\nEm chưa làm tốt gì đó khoảng 3 lần.\n## Phản hồi đã nhận\nAnh nào đó nói em cần thêm 2 điều gì đó.\n## Mình cần\nEm cần nhiều thứ gì đó từ nhóm.\n## Mục tiêu\nEm sẽ làm gì đó 5 lần trước 15/03.\n";
  assert.deepEqual(dat(kiemTuDanhGia(vo)), [true, true, true, true, true, true]);
});
