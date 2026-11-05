# Tập 1 — Chatbot, workflow và agent khác nhau thế nào

Bài toán: quán cà phê Mộc nhận nhiều tin nhắn hỏi giờ mở cửa, phí ship, giá món, tình trạng đơn.
Ba cách trả lời tự động, chạy không cần API key:

```bash
node src/1-chatbot-luat.ts   # dò từ khóa: đúng 5/8 tin nhắn mẫu
node src/2-workflow.ts       # các bước cố định: tốt với câu hỏi đã biết trước
node src/3-agent.ts          # vòng lặp agent: tự chọn công cụ, làm nhiều bước
```

`3-agent.ts` dùng một **mô hình giả lập** để thấy rõ hình dạng vòng lặp. Tập 2 gọi LLM thật.
Dữ liệu (quán, đơn hàng, số điện thoại) là minh họa.
