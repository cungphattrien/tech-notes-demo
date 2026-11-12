import { randomUUID } from "node:crypto";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";

import { createLogger, describeError, type Logger } from "./logger.ts";
import { baoCaoTheoKhach } from "./bao-cao.ts";
import { listIssues, newOrderSchema } from "./order-schema.ts";
import { listOrders, type Order } from "./orders.ts";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const MAX_BODY_BYTES = 100_000;

// Máy chủ HTTP cho đơn hàng. Mỗi request có một mã ngắn (requestId) gắn vào mọi dòng log của nó.
export function createOrderServer(orders: Order[], logger: Logger = createLogger()): Server {
  return createServer(async (request, response) => {
    const requestId = randomUUID().slice(0, 8);
    const log = logger.child({ requestId, method: request.method, path: request.url });
    const startedAt = performance.now();

    // Một dòng tóm tắt cho mỗi request: mã trạng thái và thời gian xử lý. 4xx là lỗi của người gửi
    // nên chỉ là warn; 5xx là lỗi của máy chủ nên là error.
    response.on("finish", () => {
      const status = response.statusCode;
      const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info";
      log[level]("request", { status, ms: Math.round(performance.now() - startedAt) });
    });

    try {
      await route(request, response, orders, log);
    } catch (error) {
      // Lỗi không lường trước: ghi đủ chi tiết vào log, nhưng chỉ đưa cho người gọi một mã để tra.
      log.error("lỗi không lường trước", { error: describeError(error) });
      if (response.headersSent) response.end();
      else sendError(response, 500, "Lỗi máy chủ", { maLoi: requestId });
    }
  });
}

async function route(request: IncomingMessage, response: ServerResponse, orders: Order[], log: Logger): Promise<void> {
  if (request.url === "/don-hang" && request.method === "POST") return receiveOrder(request, response, orders, log);
  if (request.url === "/don-hang") return sendOrderList(response, orders);
  if (request.url === "/bao-cao") return sendReport(response, orders);
  response.writeHead(404).end();
}

async function receiveOrder(request: IncomingMessage, response: ServerResponse, orders: Order[], log: Logger): Promise<void> {
  const body = await readBody(request);
  if (body === null) {
    log.warn("từ chối đơn", { lyDo: "nội dung quá lớn", gioiHanKyTu: MAX_BODY_BYTES });
    return sendError(response, 413, "Nội dung gửi lên quá lớn");
  }

  let data: unknown;
  try {
    data = JSON.parse(body);
  } catch {
    log.warn("từ chối đơn", { lyDo: "không phải JSON", doDai: body.length });
    return sendError(response, 400, "Nội dung gửi lên không phải JSON hợp lệ");
  }

  const result = newOrderSchema.safeParse(data);
  if (!result.success) {
    // Ghi tên trường và lý do, không ghi giá trị khách gửi lên: số điện thoại, tên là dữ liệu cá nhân.
    const issues = listIssues(result.error);
    log.warn("từ chối đơn", { lyDo: "dữ liệu không hợp lệ", chiTiet: issues });
    return sendError(response, 400, "Đơn hàng không hợp lệ", { chiTiet: issues });
  }

  const order: Order = {
    id: Math.max(0, ...orders.map((existing) => existing.id)) + 1,
    createdAt: new Date().toISOString(),
    source: "web",
    ...result.data,
  };
  orders.push(order);
  log.info("đã nhận đơn", { orderId: order.id, soMon: order.items.length });
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

function sendError(response: ServerResponse, status: number, message: string, extra: object = {}): void {
  response.writeHead(status, JSON_HEADERS).end(JSON.stringify({ loi: message, ...extra }));
}

function sendOrderList(response: ServerResponse, orders: Order[]): void {
  // Không còn try/catch ở đây: nếu listOrders ném lỗi, hàm bọc ngoài ghi log và trả 500.
  // Dựng xong nội dung rồi mới writeHead(200): đã gửi mã 200 đi thì không đổi thành 500 được nữa.
  const orderListJson = JSON.stringify(listOrders(orders), null, 2);
  response.writeHead(200, JSON_HEADERS).end(orderListJson);
}

// Báo cáo tổng chi tiêu theo khách, cho trang quản lý của chủ quán.
function sendReport(response: ServerResponse, orders: Order[]): void {
  response.writeHead(200, JSON_HEADERS).end(JSON.stringify(baoCaoTheoKhach(orders)));
}
