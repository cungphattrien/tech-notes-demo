// Máy chủ có log (tập 8) thêm đường /bao-cao, với 50.000 đơn trong bộ nhớ. Gọi hai đường và xem dòng log "request". Chạy: node thu-log-cham.ts
import type { AddressInfo } from "node:net";

import { createLogger } from "./src/logger.ts";
import { createOrderServer } from "./src/order-server.ts";
import { taoDonHang } from "./src/tao-du-lieu.ts";

const dongLog: string[] = [];
const server = createOrderServer(taoDonHang(50_000, 20_000), createLogger((dong) => dongLog.push(dong)));
await new Promise<void>((resolve) => server.listen(0, resolve));
const goc = `http://localhost:${(server.address() as AddressInfo).port}`;

for (const duongDan of ["/don-hang", "/bao-cao"]) await (await fetch(goc + duongDan)).text();
server.close();
for (const dong of dongLog) {
  const { level, msg, path, status, ms } = JSON.parse(dong);
  if (msg === "request") console.log(JSON.stringify({ level, msg, path, status, ms }));
}
