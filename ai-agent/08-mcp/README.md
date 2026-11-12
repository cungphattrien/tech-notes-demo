# Tập 8 — MCP: đóng gói công cụ của agent

Tiếp tập 7. Ba công cụ của chatbot quán Mộc (`xem_don`, `tim_don_theo_sdt`, `them_mon`) đang nằm trong code của chatbot. Tập này đóng gói chúng thành một MCP server, để chatbot và một trợ lý cho nhân viên quầy cùng dùng một bản.

- `src/don-hang.ts`, `src/thong-tin-quan.ts`: dữ liệu đơn hàng và thực đơn (minh họa), như các tập trước.
- `src/may-chu-moc.ts`: MCP server (SDK chính thức `@modelcontextprotocol/sdk` 1.32.2), nói chuyện qua stdio. Schema đầu vào viết bằng Zod.
- `src/khach-mcp.ts`: kết nối tới server bằng cách chạy nó như tiến trình con; `goiCongCu` trả văn bản kết quả và cờ lỗi.
- `src/thu-khach.ts`: ứng dụng 1, trợ lý quầy gọi công cụ trực tiếp.
- `src/thu-chatbot.ts`: ứng dụng 2, chatbot: đổi danh sách công cụ MCP sang dạng API Anthropic nhận và xử lý một khối tool_use viết tay (không cần API key).
- `src/may-chu-moc.test.ts`: 6 test, nối client với server trong cùng tiến trình bằng `InMemoryTransport`.

```bash
npm install
node src/thu-khach.ts
node src/thu-chatbot.ts
npx vitest run
```

Cần Node.js 22.18+ (chạy thẳng file .ts, và client chạy server bằng `node src/may-chu-moc.ts`). Không cần ANTHROPIC_API_KEY.
