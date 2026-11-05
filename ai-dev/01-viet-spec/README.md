# Tập 1 — Viết spec trước khi viết prompt

Side project: **sổ chi tiêu qua tin nhắn** (nhắn `cà phê 35k` là ghi xong một khoản chi).

- `SPEC.md` — spec v1: vấn đề, phạm vi, bảng quy tắc đọc số tiền, tiêu chí hoàn thành.
- `PROMPTS.md` — prompt mơ hồ và prompt kèm spec cho cùng một việc.
- `src/parse-expense.ts` + `src/parse-expense.test.ts` — hàm đọc tin nhắn, mỗi dòng trong bảng spec là một test.

```bash
node --test src/parse-expense.test.ts   # 11 test, cần Node.js 22.18+
```
