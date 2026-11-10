import { readFileSync } from "node:fs";
import { createServer } from "node:http";

import { listOrders, normalizeOrder, type RawOrder } from "./orders.ts";

const dataFile = new URL("../data/orders.json", import.meta.url);
// Chuẩn hóa ngay khi đọc file: từ đây trở đi, giá luôn là số.
const rawOrders: RawOrder[] = JSON.parse(readFileSync(dataFile, "utf8"));
const orders = rawOrders.map(normalizeOrder);

export const server = createServer((req, res) => {
  if (req.url === "/don-hang") {
    try {
      const body = JSON.stringify(listOrders(orders), null, 2);
      res.writeHead(200, { "content-type": "application/json; charset=utf-8" }).end(body);
    } catch (error) {
      console.error(error);
      res.writeHead(500, { "content-type": "text/plain; charset=utf-8" }).end("Lỗi máy chủ");
    }
    return;
  }
  res.writeHead(404).end();
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => console.log(`Đơn hàng Mộc: http://localhost:${port}/don-hang`));
