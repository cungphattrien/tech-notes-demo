// Ứng dụng 2: chatbot. Lấy danh sách công cụ từ MCP server, đổi sang dạng mà API của Anthropic nhận, rồi chạy một lượt gọi công cụ.
// Không cần ANTHROPIC_API_KEY: khối tool_use dưới đây do mình viết tay thay cho câu trả lời của mô hình. Chạy: node src/thu-chatbot.ts
import { goiCongCu, noiTuiMayChu } from "./khach-mcp.ts";

const client = await noiTuiMayChu();
const { tools } = await client.listTools();

// MCP và API của Anthropic gần như cùng dạng: đổi tên inputSchema thành input_schema, và bỏ trường $schema (dòng khai báo phiên bản JSON Schema) cho gọn.
const congCuChoMoHinh = tools.map(({ name, description, inputSchema: { $schema, ...inputSchema } }) => ({ name, description, input_schema: inputSchema }));
console.log("Công cụ đưa cho mô hình:", JSON.stringify(congCuChoMoHinh.find((t) => t.name === "xem_don"), null, 2));

// Giả sử mô hình trả lời bằng khối tool_use này (khách hỏi: "đơn 1042 của em đâu rồi?").
const toolUse = { type: "tool_use", id: "toolu_01", name: "xem_don", input: { ma_don: "1042" } };
const kq = await goiCongCu(client, toolUse.name, toolUse.input);
// Khối này sẽ được gửi lại cho mô hình ở lượt kế tiếp, y như ở bài tool calling.
console.log("Gửi lại cho mô hình:", JSON.stringify({ type: "tool_result", tool_use_id: toolUse.id, content: kq.noiDung, is_error: kq.loi }));
await client.close();
