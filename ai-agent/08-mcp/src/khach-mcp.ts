// Kết nối tới MCP server của Mộc bằng cách chạy nó như một tiến trình con. Dùng chung cho mọi ứng dụng của quán.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export async function noiTuiMayChu(duongDan = "src/may-chu-moc.ts"): Promise<Client> {
  const client = new Client({ name: "ung-dung-cua-moc", version: "1.0.0" });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [duongDan] }));
  return client;
}

// Gọi một công cụ và trả về văn bản kết quả, kèm cờ lỗi.
export async function goiCongCu(client: Client, ten: string, dauVao: Record<string, unknown>): Promise<{ noiDung: string; loi: boolean }> {
  const ketQua = await client.callTool({ name: ten, arguments: dauVao });
  const noiDung = (ketQua.content as { type: string; text?: string }[]).map((phan) => phan.text ?? "").join("");
  return { noiDung, loi: ketQua.isError === true };
}
