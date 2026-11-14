// Máy chủ đơn hàng bản dùng cấu hình có kiểm tra. Chạy: npm start  (tức node --env-file=.env src/server.ts)
import { timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";

import { ConfigError, loadConfig, moTaConfig, type Config } from "./config.ts";

let config: Config;
try {
  config = loadConfig();
} catch (loi) {
  if (!(loi instanceof ConfigError)) throw loi;
  console.error(loi.message);
  process.exit(1);
}

const THU_TU = ["debug", "info", "warn", "error"];
const ghiLog = (muc: string, noiDung: string) => {
  if (THU_TU.indexOf(muc) >= THU_TU.indexOf(config.LOG_LEVEL)) console.log(`[${muc}] ${noiDung}`);
};

// So khóa bằng timingSafeEqual: thời gian so sánh không để lộ khóa đúng được bao nhiêu ký tự.
const khoaDung = (header: string | undefined) => {
  const nhan = Buffer.from(header ?? "");
  const that = Buffer.from(`Bearer ${config.ORDER_API_KEY}`);
  return nhan.length === that.length && timingSafeEqual(nhan, that);
};

const donHang = JSON.parse(readFileSync(config.ORDERS_FILE, "utf8"));

const server = createServer((request, response) => {
  if (config.LOG_REQUESTS) ghiLog("info", `${request.method} ${request.url}`);
  if (request.url === "/don-hang" && request.method === "GET") {
    return void response.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify(donHang));
  }
  if (request.url === "/don-hang" && request.method === "POST") {
    if (!khoaDung(request.headers.authorization)) return void response.writeHead(401).end("Sai khóa");
    return void response.writeHead(201).end("Đã nhận đơn");
  }
  response.writeHead(404).end();
});

server.listen(config.PORT, () => {
  ghiLog("info", `Máy chủ nghe ở cổng ${config.PORT}`);
  ghiLog("debug", `Cấu hình: ${JSON.stringify(moTaConfig(config))}`);
});
