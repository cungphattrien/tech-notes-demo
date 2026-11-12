import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { beforeEach, expect, test } from "vitest";

import { datLaiDonHang } from "./don-hang.ts";
import { taoMayChu } from "./may-chu-moc.ts";

// Nối client với server trong cùng một tiến trình (không cần chạy tiến trình con): nhanh và dễ kiểm tra.
async function noi(): Promise<Client> {
  const [phiaClient, phiaServer] = InMemoryTransport.createLinkedPair();
  await taoMayChu().connect(phiaServer);
  const client = new Client({ name: "test", version: "1.0.0" });
  await client.connect(phiaClient);
  return client;
}

const vanBan = (ketQua: Awaited<ReturnType<Client["callTool"]>>) => (ketQua.content as { text: string }[])[0].text;

beforeEach(() => datLaiDonHang());

test("liệt kê đủ ba công cụ, tool chỉ đọc có readOnlyHint", async () => {
  const { tools } = await (await noi()).listTools();
  expect(tools.map((t) => t.name)).toEqual(["xem_don", "tim_don_theo_sdt", "them_mon"]);
  expect(tools.find((t) => t.name === "xem_don")?.annotations?.readOnlyHint).toBe(true);
  expect(tools.find((t) => t.name === "them_mon")?.annotations?.readOnlyHint).toBe(false);
});

test("xem_don trả đúng đơn", async () => {
  const kq = await (await noi()).callTool({ name: "xem_don", arguments: { ma_don: "1042" } });
  expect(JSON.parse(vanBan(kq))).toMatchObject({ ma_don: "1042", trang_thai: "đang giao" });
});

test("đơn không tồn tại: isError, không ném lỗi", async () => {
  const kq = await (await noi()).callTool({ name: "xem_don", arguments: { ma_don: "9999" } });
  expect(kq.isError).toBe(true);
  expect(vanBan(kq)).toBe("Không có đơn 9999.");
});

test("đầu vào sai định dạng bị schema chặn trước khi tới code của công cụ", async () => {
  const kq = await (await noi()).callTool({ name: "xem_don", arguments: { ma_don: "104" } });
  expect(kq.isError).toBe(true);
  expect(vanBan(kq)).toContain("Mã đơn gồm đúng 4 chữ số");
});

test("them_mon chỉ thêm được vào đơn đang pha chế", async () => {
  const client = await noi();
  const duoc = await client.callTool({ name: "them_mon", arguments: { ma_don: "1041", mon: "Bạc xỉu", so_luong: 2 } });
  expect(JSON.parse(vanBan(duoc)).mon).toEqual(["cà phê sữa", "bánh mì trứng", "bạc xỉu", "bạc xỉu"]);
  const khong = await client.callTool({ name: "them_mon", arguments: { ma_don: "1042", mon: "bạc xỉu", so_luong: 1 } });
  expect(khong.isError).toBe(true);
});

test("số lượng ngoài khoảng 1 đến 5 bị chặn", async () => {
  const kq = await (await noi()).callTool({ name: "them_mon", arguments: { ma_don: "1041", mon: "bạc xỉu", so_luong: 6 } });
  expect(kq.isError).toBe(true);
});
