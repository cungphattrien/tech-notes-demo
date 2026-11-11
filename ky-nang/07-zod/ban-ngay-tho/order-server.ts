import { createServer, type Server, type ServerResponse } from "node:http";

import { listOrders, type Order } from "../src/orders.ts";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const TEXT_HEADERS = { "content-type": "text/plain; charset=utf-8" };

// Bản đầu tiên của POST /don-hang: tin hoàn toàn vào dữ liệu gửi lên.
export function createOrderServer(orders: Order[]): Server {
  return createServer(async (request, response) => {
    if (request.url === "/don-hang" && request.method === "POST") return receiveOrder(request, response, orders);
    if (request.url === "/don-hang") return sendOrderList(response, orders);
    response.writeHead(404).end();
  });
}

async function receiveOrder(request: AsyncIterable<Buffer>, response: ServerResponse, orders: Order[]): Promise<void> {
  let body = "";
  for await (const chunk of request) body += chunk;
  const data = JSON.parse(body);
  const order = { id: Math.max(...orders.map((o) => o.id)) + 1, createdAt: new Date().toISOString(), source: "web", ...data } as Order;
  orders.push(order);
  response.writeHead(201, JSON_HEADERS).end(JSON.stringify({ id: order.id }));
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
