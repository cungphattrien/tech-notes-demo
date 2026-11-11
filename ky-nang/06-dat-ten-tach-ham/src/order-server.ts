import { createServer, type Server, type ServerResponse } from "node:http";

import { listOrders, type Order } from "./orders.ts";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const TEXT_HEADERS = { "content-type": "text/plain; charset=utf-8" };

// Máy chủ HTTP cho danh sách đơn. Nhận đơn đã chuẩn hóa, không tự đọc file, không tự mở cổng.
export function createOrderServer(orders: Order[]): Server {
  return createServer((request, response) => {
    if (request.url === "/don-hang") return sendOrderList(response, orders);
    response.writeHead(404).end();
  });
}

function sendOrderList(response: ServerResponse, orders: Order[]): void {
  try {
    const orderListJson = JSON.stringify(listOrders(orders), null, 2);
    response.writeHead(200, JSON_HEADERS).end(orderListJson);
  } catch (error) {
    console.error(error);
    response.writeHead(500, TEXT_HEADERS).end("Lỗi máy chủ");
  }
}
