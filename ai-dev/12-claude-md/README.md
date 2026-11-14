# Tập 12 — File hướng dẫn cho AI: CLAUDE.md, rules và ngữ cảnh dự án

Tiếp tập 11. AI bắt đầu mỗi phiên làm việc từ trắng, nên vấp lại cùng một quy ước ngầm của dự án (ví dụ Node chạy file `.ts` ở chế độ strip-only không hiểu `constructor(private x)`). Tập này viết quy ước đó thành `CLAUDE.md`, dựng một phép kiểm để file không "cũ" so với dự án, và để máy bắt lỗi quy ước thay cho lời nhắc.

**Lưu ý:** không có AI thật nào được chạy trong demo này. Mình không đo AI có tuân theo `CLAUDE.md` tốt hơn không; chỉ phần code xung quanh được chạy và kiểm.

- `CLAUDE.md`: file hướng dẫn cho dự án sổ chi tiêu (bản "tốt").
- `CLAUDE-cu.md`: bản "cũ": câu mơ hồ, lệnh và đường dẫn không còn tồn tại.
- `kiem-claude-md.ts`: kiểm lệnh `npm run`, đường dẫn, câu mơ hồ, độ dài của một file hướng dẫn.
- `vi-du-sai/bo-nho.ts`: code dùng cú pháp mà Node strip-only không chạy được.
- `npm run kiem-kieu`: `tsc --noEmit --erasableSyntaxOnly` bắt đúng loại cú pháp đó.
- `src/`, `thu-*.ts`: dự án sổ chi tiêu từ tập 11.
- `kiem-claude-md.test.ts`: 10 test.

```bash
npm install
npm run kiem-claude-md                 # CLAUDE.md: 0 lỗi
node kiem-claude-md.ts CLAUDE-cu.md    # 4 lỗi, 4 cảnh báo
node vi-du-sai/bo-nho.ts               # SyntaxError: parameter property is not supported in strip-only mode
npm run kiem-kieu                      # sạch; chép vi-du-sai/bo-nho.ts vào src/ thì báo TS1294
npm test
```

Cần Node.js 22.18+ (chạy thẳng file .ts) và TypeScript 7.0.2.
