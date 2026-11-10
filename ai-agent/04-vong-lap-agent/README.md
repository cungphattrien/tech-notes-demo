# Tập 4 — Vòng lặp agent: để chatbot tự làm nhiều bước

`src/agent.ts` gọi mô hình, chạy công cụ nó xin, gửi kết quả lại và lặp tới khi mô hình trả lời bằng chữ,
với giới hạn số lần gọi (mặc định 6). Thêm công cụ `them_mon` (chỉ thêm được khi đơn còn đang pha chế).

```bash
npm install
node src/hoi-moc.ts        # 6 câu hỏi mẫu, câu khó nhất cần 3 công cụ và 4 lần gọi mô hình
node src/gioi-han.ts       # cùng câu đó nhưng chỉ cho 2 lần gọi: agent dừng và nói thật
node src/hai-tin-nhan.ts   # hai tin nhắn liên tiếp: agent quên mã đơn khách vừa nói
```

- Có biến môi trường `ANTHROPIC_API_KEY`: gọi Claude thật (model `claude-opus-5-5`, effort `low`).
- Không có key (hoặc `MOC_OFFLINE=1`): chạy **chế độ offline**, một kịch bản giả lập trả về đúng hình dạng phản hồi
  của API. Nó không phải mô hình thật.

Cần Node.js 22.18 trở lên (chạy thẳng file `.ts`).

Còn lại: mỗi tin nhắn bắt đầu bằng một mảng `messages` mới, nên agent không nhớ khách vừa nói gì.
Bài sau giữ lại lịch sử hội thoại và xử lý giới hạn context.
