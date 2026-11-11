# Tập 5 — Bộ nhớ hội thoại và context window

`src/phien.ts` giữ lịch sử của một cuộc trò chuyện và gửi lại cho mô hình ở mỗi tin nhắn, nên chatbot nhớ
điều khách vừa nói. `src/cat-lich-su.ts` cắt bớt lịch sử theo lượt, `src/ghi-nho.ts` giữ lại mã đơn đang nói tới.

```bash
npm install
node src/hai-tin-nhan.ts   # hai tin nhắn liên tiếp: lần này agent nhớ mã đơn
node src/buoi-sang.ts      # 30 tin nhắn: mỗi lần gọi gửi đi bao nhiêu, cộng dồn bao nhiêu
node src/cat-sai.ts        # cắt theo số tin nhắn làm hỏng cặp tool_use / tool_result
node src/quen-don.ts       # ba cách chọn lịch sử, so ở tin nhắn thứ năm
```

- Có biến môi trường `ANTHROPIC_API_KEY`: gọi Claude thật (model `claude-opus-5-5`, effort `low`).
- Không có key (hoặc `MOC_OFFLINE=1`): chạy **chế độ offline**, một kịch bản giả lập. Nó không phải mô hình thật,
  và kích thước được đo bằng ký tự thay cho token.

Cần Node.js 22.18 trở lên (chạy thẳng file `.ts`).

Còn lại: mọi thứ chatbot biết về quán vẫn nằm trong system prompt. Tài liệu chính sách dài thì gửi kèm
ở mỗi lần gọi sẽ rất tốn; bài sau cho agent tìm đúng đoạn cần đọc.
