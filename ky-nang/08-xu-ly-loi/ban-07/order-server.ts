import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";

import { listIssues, newOrderSchema } from "../src/order-schema.ts";
import { listOrders, type Order } from "../src/orders.ts";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const TEXT_HEADERS = { "content-type": "text/plain; charset=utf-8" };
const MAX_BODY_BYTES = 100_000;

// Máy chủ HTTP cho đơn hàng. Nhận đơn đã chuẩn hóa, không tự đọc file, không tự mở cổng.
export function createOrderServer(orders: Order[]): Server {
  return createServer(async (request, response) => {
    if (request.url === "/don-hang" && request.method === "POST") return receiveOrder(request, response, orders);
    if (request.url === "/don-hang") return sendOrderList(response, orders);
    response.writeHead(404).end();
  });
}

async function receiveOrder(request: IncomingMessage, response: ServerResponse, orders: Order[]): Promise<void> {
  const body = await readBody(request);
  if (body === null) return sendError(response, 413, "Nội dung gửi lên quá lớn");

  let data: unknown;
  try {
    data = JSON.parse(body);
  } catch {
    return sendError(response, 400, "Nội dung gửi lên không phải JSON hợp lệ");
  }

  const result = newOrderSchema.safeParse(data);
  if (!result.success) return sendError(response, 400, "Đơn hàng không hợp lệ", listIssues(result.error));

  const order: Order = {
    id: Math.max(0, ...orders.map((existing) => existing.id)) + 1,
    createdAt: new Date().toISOString(),
    source: "web",
    ...result.data,
  };
  orders.push(order);
  response.writeHead(201, JSON_HEADERS).end(JSON.stringify({ id: order.id }));
}

// Đọc tối đa MAX_BODY_BYTES; vượt quá thì trả null để bên gọi từ chối.
async function readBody(request: IncomingMessage): Promise<string | null> {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > MAX_BODY_BYTES) return null;
  }
  return body;
}

function sendError(response: ServerResponse, status: number, message: string, details?: unknown): void {
  response.writeHead(status, JSON_HEADERS).end(JSON.stringify({ loi: message, ...(details ? { chiTiet: details } : {}) }));
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
