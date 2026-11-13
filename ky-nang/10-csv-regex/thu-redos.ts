// Một biểu thức chính quy trông vô hại có thể treo máy chủ. Chạy: node thu-redos.ts
const DE_HONG = /^(\d+\.?)+$/; // "một hoặc nhiều nhóm: chữ số, rồi có thể có dấu chấm"; chữ số lặp lồng trong nhóm lặp
const AN_TOAN = /^\d+(\.\d+)*$/; // "chữ số, rồi các nhóm: dấu chấm kèm chữ số"; mỗi ký tự chỉ có một cách khớp

// Thời gian trung vị của 3 lần chạy (lần đầu V8 còn đang biên dịch biểu thức nên hay chậm bất thường).
function doThoiGian(mau: RegExp, doan: string): number {
  const cacLan = Array.from({ length: 3 }, () => {
    const batDau = performance.now();
    mau.test(doan);
    return performance.now() - batDau;
  }).sort((a, b) => a - b);
  return cacLan[1];
}

console.log("Đầu vào: n chữ số 1 rồi một chữ 'x' ở cuối (không khớp). Thời gian trung vị, mili giây:");
for (const n of [22, 24, 26, 28]) {
  const doan = `${"1".repeat(n)}x`;
  console.log(`n=${n}  dễ hỏng: ${doThoiGian(DE_HONG, doan).toFixed(1).padStart(8)} ms   an toàn: ${doThoiGian(AN_TOAN, doan).toFixed(3)} ms`);
}
