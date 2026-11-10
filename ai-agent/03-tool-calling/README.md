# Tập 3 — Tool calling: cho chatbot tra đơn hàng thật

Chatbot của quán Mộc được mô tả hai công cụ (`xem_don`, `tim_don_theo_sdt`). Khi khách hỏi về đơn hàng,
mô hình trả về một khối `tool_use`; code chạy hàm thật rồi gửi `tool_result` lại để mô hình viết câu trả lời.

```bash
npm install
node src/hoi-moc.ts              # 4 câu hỏi mẫu, mỗi câu tối đa MỘT vòng gọi công cụ
node src/xem-request.ts          # in định nghĩa công cụ và cả 4 tin nhắn của cuộc trao đổi về đơn 1041
node src/dua-het-vao-prompt.ts   # cách làm đầu tiên: đưa 200 đơn vào system prompt thì dài bao nhiêu
```

- Có biến môi trường `ANTHROPIC_API_KEY`: gọi Claude thật (model `claude-opus-5-5`, effort `low`).
- Không có key (hoặc `MOC_OFFLINE=1`): chạy **chế độ offline**, một kịch bản giả lập trả về đúng hình dạng phản hồi
  của API (khối `tool_use`, `stop_reason: "tool_use"`). Nó không phải mô hình thật.

Cần Node.js 22.18 trở lên (chạy thẳng file `.ts`).

Còn lại: câu hỏi cần hai bước (tìm đơn theo số điện thoại rồi mới xem trạng thái) dừng giữa chừng,
vì code chỉ chạy một vòng. Bài sau biến nó thành vòng lặp agent.
