# Tập 7 — Khi AI bịa API: kiểm chứng code AI viết

Spec v1.3 của app sổ chi tiêu: người dùng sửa một tin nhắn đã gửi thì khoản chi tương ứng được cập nhật.

- `ai-viet/bot-sua-tin.ts`: đoạn code "AI viết" cho tính năng đó. Bản mình dựng để minh họa, không trích từ một lần chạy AI cụ thể.
  Nó có ba chỗ bịa: bộ lọc `"edited_message.text"` (đúng là `"edited_message:text"`), `so.capNhat` (mảng không có hàm này),
  `ctx.replyWithMarkdown` (hàm của Telegraf, grammY không có).
- `src/bot.ts`: bản đúng, dùng đúng API của grammY. `src/bot.test.ts`: thêm 4 test cho việc sửa tin nhắn.

```bash
npm install
node ai-viet/bot-sua-tin.ts                      # lỗi lúc chạy: chỉ thấy lỗi đầu tiên
npx tsc --noEmit -p tsconfig.ai-viet.json        # trình biên dịch liệt kê cả ba chỗ bịa
npx tsc --noEmit                                 # src/ sạch, không lỗi
node --test src/bot.test.ts src/so-chi-tieu.test.ts src/parse-expense.test.ts   # 30 test
```

Cần Node.js 22.18+ (chạy thẳng file .ts). grammy 1.46.0, typescript 7.0.2.
