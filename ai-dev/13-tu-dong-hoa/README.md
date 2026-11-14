# Tập 13 — Tự động hóa việc lặp lại bằng script và agent

Tiếp tập 12. Dự án sổ chi tiêu đã có CLAUDE.md, nhưng mỗi lần commit mình vẫn gõ tay: kiểm kiểu, chạy test, kiểm CLAUDE.md, rồi nghĩ tin nhắn commit. Tập này gom ba việc đầu vào một lệnh (`npm run kiem`), cài Git hook để Git tự chạy nó trước mỗi commit, kiểm hình thức tin nhắn commit, và cho thấy hook bị bỏ qua dễ thế nào bằng `--no-verify`.

**Lưu ý quan trọng:** không có AI hay agent thật nào được chạy ở tập này. Phần "việc nào giao cho agent" chỉ là nhận định trong bài, chưa chạy thử. Hook `pre-commit` chạy trên cây làm việc, không phải đúng thứ đã `git add`.

- `kiem.ts` (+ `kiem.test.ts`, 4 test): chạy ba bước, dừng ở bước đầu tiên hỏng; `--het` chạy hết.
- `hooks/pre-commit`, `hooks/commit-msg`, `.gitattributes` (giữ hook ở dạng LF).
- `kiem-commit-msg.ts` (+ test, 5 test): kiểm dòng đầu của tin nhắn commit.
- `thu-hook.ts`: dựng kho Git tạm, cài hook, commit bốn lần (code hỏng, tin nhắn mơ hồ, đúng, `--no-verify`).
- `src/`, `kiem-claude-md.ts`, `CLAUDE.md`, ...: dự án của tập 12 (`npm test` chạy 30 test của cả hai tập).

```bash
npm install
npm run kiem
node kiem.ts --het
node thu-hook.ts
npm test
```

Cần Node.js 22.18+ và Git. Hook `.sh` trên Linux/macOS cần quyền thực thi (`chmod +x hooks/*`).
