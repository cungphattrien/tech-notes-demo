// Khách đóng tab giữa chừng: đọc vài mảnh rồi ngắt kết nối. Server phải dừng hỏi mô hình.
// Chạy khi máy chủ đang chạy ở cổng 3200:  node thu-ngat.js   rồi xem dòng "[chat] khách ngắt..." ở terminal của máy chủ.
const dieuKhien = new AbortController();
const phanHoi = await fetch("http://localhost:3200/api/chat", {
  method: "POST",
  body: JSON.stringify({ tin: "Giao hàng thế nào?" }),
  signal: dieuKhien.signal,
});
const boDoc = phanHoi.body.getReader();
let soChunk = 0;
while (soChunk < 10) {
  const { done } = await boDoc.read();
  if (done) break;
  soChunk += 1;
}
console.log(`đã nhận ${soChunk} chunk, ngắt kết nối`);
dieuKhien.abort();
await new Promise((xong) => setTimeout(xong, 500));
