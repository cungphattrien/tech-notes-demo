// Đo hai điều khách cảm nhận được: bao lâu thì thấy chữ đầu tiên, và bao lâu thì có đủ câu trả lời.
// Chạy sau khi đã `npm run build` và `npm start` ở cổng 3200:  node do-thoi-gian.js
const GOC = "http://localhost:3200";
const dem = () => performance.now();

async function doDuong(duong) {
  const batDau = dem();
  const phanHoi = await fetch(`${GOC}${duong}`, { method: "POST", body: JSON.stringify({ tin: "Giao hàng thế nào?" }) });
  const boDoc = phanHoi.body.getReader();
  let chuDau = null;
  let soChunk = 0;
  for (;;) {
    const { value, done } = await boDoc.read();
    if (done) break;
    soChunk += 1;
    if (value.length > 0 && chuDau === null) chuDau = dem() - batDau;
  }
  const tong = dem() - batDau;
  return { duong, chuDau: Math.round(chuDau), tong: Math.round(tong), soChunk, loai: phanHoi.headers.get("content-type") };
}

for (const duong of ["/api/chat-cho-du", "/api/chat"]) {
  const kq = await doDuong(duong);
  console.log(`${kq.duong.padEnd(18)} chữ đầu sau ${String(kq.chuDau).padStart(4)} ms, đủ câu sau ${String(kq.tong).padStart(4)} ms, ${kq.soChunk} chunk (${kq.loai})`);
}
