// Đo thời gian tính "tháng theo giờ VN" cho 10.000 khoản chi: tạo formatter mỗi lần gọi, so với dùng lại một formatter.
const OPTS = { timeZone: "Asia/Ho_Chi_Minh", month: "2-digit", year: "numeric" } as const;
const moiLanMoi = (d: Date) => new Intl.DateTimeFormat("en-GB", OPTS).format(d);
const FORMATTER = new Intl.DateTimeFormat("en-GB", OPTS);
const dungLai = (d: Date) => FORMATTER.format(d);

const ngay = Array.from({ length: 10_000 }, (_, i) => new Date(Date.UTC(2026, 10, 1) + i * 3_600_000));
for (const [ten, ham] of [["tạo formatter mỗi lần", moiLanMoi], ["dùng lại một formatter", dungLai]] as const) {
  ham(ngay[0]);
  const batDau = performance.now();
  for (const d of ngay) ham(d);
  console.log(`${ten}: ${(performance.now() - batDau).toFixed(1)} ms cho ${ngay.length.toLocaleString("vi-VN")} khoản`);
}
