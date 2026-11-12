// Test đặc tả: chụp lại hành vi HIỆN TẠI của server.ts trước khi dọn code.
// Không hỏi "code có đúng không", chỉ hỏi "sau khi dọn, máy chủ có trả lời y như trước không".
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, expect, test } from "vitest";

let baseUrl = "";
let close = () => {};

beforeAll(async () => {
  process.env.PORT = "0"; // cổng 0: hệ điều hành chọn một cổng trống, không đụng máy chủ đang chạy ở 3000
  const { server } = await import("./server.ts");
  if (!server.listening) await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
  close = () => server.close();
});

afterAll(() => close());

test("GET /don-hang trả danh sách đơn đúng như trước khi dọn", async () => {
  const response = await fetch(`${baseUrl}/don-hang`);
  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
  expect(await response.json()).toEqual([
    { id: 1041, khach: "NGUYỄN AN", tong: 83000 },
    { id: 1042, khach: "TRẦN BÌNH", tong: 32000 },
    { id: 1043, khach: "KHÁCH TẠI QUẦY", tong: 25000 },
    { id: 1044, khach: "LÊ CHI", tong: 70000 },
  ]);
});

test("đường dẫn khác trả 404", async () => {
  const response = await fetch(`${baseUrl}/khong-co`);
  expect(response.status).toBe(404);
});
