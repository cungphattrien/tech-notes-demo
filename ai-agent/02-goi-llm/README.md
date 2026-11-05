# Tập 2 — Gọi LLM đầu tiên bằng TypeScript

Chatbot trả lời câu hỏi thường gặp của quán Mộc bằng một lần gọi LLM (Claude, qua SDK chính thức `@anthropic-ai/sdk`).

```bash
npm install
node src/hoi-moc.ts v1        # system prompt chỉ có vai trò: đoán giờ, đoán giá, bịa trạng thái đơn
node src/hoi-moc.ts v2        # có thông tin quán + được phép nói "chưa tra được" + lớp chặn câu đoán
node src/xem-request.ts       # xem request gửi đi: không có dữ liệu đơn hàng nào
node src/kiem-tra-bia.test.ts # test lớp chặn câu đoán trạng thái đơn
```

- Có biến môi trường `ANTHROPIC_API_KEY`: gọi Claude thật (model `claude-opus-5-5`, effort `low`).
- Không có key (hoặc `MOC_OFFLINE=1`): chạy **chế độ offline**. Đây là kịch bản giả lập, không phải mô hình thật;
  nó bắt chước hai hành vi hay gặp để bạn chạy được code ngay. Câu trả lời của mô hình thật mỗi lần mỗi khác.

Cần Node.js 22.18 trở lên. Không bao giờ commit API key: đặt nó trong biến môi trường hoặc file `.env` (đã nằm trong `.gitignore`).

Còn lại: chatbot đã thôi bịa, nhưng vẫn chưa trả lời được câu "đơn 1041 giao chưa". Tập 3 cho nó tra đơn thật bằng tool calling.
