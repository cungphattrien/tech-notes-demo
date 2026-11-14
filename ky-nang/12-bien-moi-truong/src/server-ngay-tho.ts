// Máy chủ đơn hàng bản đầu tiên: đọc thẳng process.env ở khắp nơi. Chạy: node src/server-ngay-tho.ts
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const port = Number(process.env.PORT ?? 3000);
const chiTiet = Boolean(process.env.LOG_REQUESTS);
const donHang = JSON.parse(readFileSync(process.env.ORDERS_FILE ?? "data/orders.json", "utf8"));

const server = createServer((request, response) => {
  if (chiTiet) console.log(`${request.method} ${request.url}`);
  if (request.url === "/don-hang" && request.method === "GET") {
    return void response.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify(donHang));
  }
  if (request.url === "/don-hang" && request.method === "POST") {
    // Website gửi kèm "Authorization: Bearer <khóa>". So với khóa lấy từ biến môi trường.
    if (request.headers.authorization !== "Bearer " + process.env.ORDER_API_KEY) {
      return void response.writeHead(401).end("Sai khóa");
    }
    return void response.writeHead(201).end("Đã nhận đơn");
  }
  response.writeHead(404).end();
});

server.listen(port, () => console.log(`Máy chủ nghe ở cổng ${(server.address() as { port: number }).port}`));
