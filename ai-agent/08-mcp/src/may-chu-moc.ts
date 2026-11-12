// MCP server của quán Mộc: đóng gói ba công cụ tra đơn / tìm đơn / thêm món để mọi ứng dụng dùng chung.
// Chạy trực tiếp (node src/may-chu-moc.ts) thì nói chuyện qua stdin/stdout. Nhớ: stdout dành riêng cho giao thức, log phải ra stderr.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { themMon, timDonTheoMa, timDonTheoSdt } from "./don-hang.ts";

const maDon = z.string().regex(/^\d{4}$/, "Mã đơn gồm đúng 4 chữ số, không có dấu #").describe("Mã đơn gồm 4 chữ số, không có dấu #");

const ketQua = (noiDung: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(noiDung) }] });
const loi = (thongBao: string) => ({ content: [{ type: "text" as const, text: thongBao }], isError: true });

export function taoMayChu(): McpServer {
  const server = new McpServer({ name: "moc-don-hang", version: "1.0.0" });

  server.registerTool(
    "xem_don",
    {
      title: "Xem đơn hàng",
      description:
        "Xem món và trạng thái hiện tại của một đơn hàng theo mã đơn (4 chữ số, ví dụ 1041). " +
        "Gọi công cụ này mỗi khi khách hỏi đơn đã giao chưa, đang ở đâu, khi nào tới.",
      inputSchema: { ma_don: maDon },
      annotations: { readOnlyHint: true },
    },
    async ({ ma_don }) => {
      const don = timDonTheoMa(ma_don);
      if (!don) return loi(`Không có đơn ${ma_don}.`);
      return ketQua({ ma_don: don.maDon, mon: don.mon, trang_thai: don.trangThai, dat_luc: don.datLuc });
    },
  );

  server.registerTool(
    "tim_don_theo_sdt",
    {
      title: "Tìm đơn theo số điện thoại",
      description:
        "Tìm mã đơn gần nhất của khách theo số điện thoại (10 chữ số, bắt đầu bằng 0). " +
        "Chỉ trả về mã đơn; muốn biết trạng thái thì gọi tiếp xem_don.",
      inputSchema: { so_dien_thoai: z.string().regex(/^0\d{9}$/, "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0").describe("Số điện thoại 10 chữ số") },
      annotations: { readOnlyHint: true },
    },
    async ({ so_dien_thoai }) => {
      const don = timDonTheoSdt(so_dien_thoai);
      if (!don) return loi("Không tìm thấy đơn nào với số này.");
      return ketQua({ ma_don: don.maDon });
    },
  );

  server.registerTool(
    "them_mon",
    {
      title: "Thêm món vào đơn",
      description:
        "Thêm món vào một đơn còn đang pha chế. Chỉ gọi khi khách nói rõ muốn thêm món nào, bao nhiêu phần. " +
        "Đơn đang giao hoặc đã giao thì công cụ sẽ báo lỗi.",
      inputSchema: {
        ma_don: maDon,
        mon: z.string().describe("Tên món đúng như trong bảng giá, ví dụ: bạc xỉu"),
        so_luong: z.number().int().min(1).max(5).describe("Số phần, từ 1 đến 5"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async ({ ma_don, mon, so_luong }) => {
      const kq = themMon(ma_don, mon.trim().toLowerCase(), so_luong);
      if (!kq.ok) return loi(kq.lyDo);
      return ketQua({ ma_don: kq.don.maDon, mon: kq.don.mon, trang_thai: kq.don.trangThai });
    },
  );

  return server;
}

if (import.meta.main) {
  await taoMayChu().connect(new StdioServerTransport());
  console.error("Máy chủ MCP của Mộc đã sẵn sàng (stdio)"); // stderr, không phải stdout
}
