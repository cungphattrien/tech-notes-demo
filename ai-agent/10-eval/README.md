# Tập 10 — Eval: bộ kiểm thử cho AI agent

Tiếp tập 9. Agent của quán Mộc đã có vài lớp bảo vệ, nhưng chưa ai biết nó có tệ đi sau mỗi lần sửa không. Tập này dựng một bộ eval nhỏ: 12 ca thử, chấm bằng code trên "vết" chạy (công cụ đã gọi, có chuyển cho người không, câu trả lời có gì), chạy nhiều lần mỗi ca, và có "cổng" để quyết định gộp hay chặn một bản sửa.

**Lưu ý quan trọng:** không có mô hình thật nào được gọi. `src/agent.ts` dùng một "mô hình" giả (nghe theo câu lệnh của khách, và khoảng 1 lần trong 10 bỏ qua công cụ để đoán bừa). Hai phiên bản `v1` và `v2` đều là giả lập: `v2` mô phỏng một lần "sửa cho thân thiện hơn" làm mất lớp chặn lời hứa hoàn tiền. Bài học nằm ở cách chấm, không nằm ở độ thông minh của mô hình giả.

- `src/du-lieu.ts`: ba đơn hàng minh họa.
- `src/agent.ts`: agent gọn, trả về "vết" của mỗi lần chạy.
- `src/ca-thu.ts`: 12 ca thử, mỗi ca kèm danh sách điều cần kiểm.
- `src/cham.ts`: chấm một vết chạy bằng code.
- `src/chay-eval.ts`: chạy N lần mỗi ca, gom theo nhóm, cổng đạt/trượt.
- `chay.ts`: in kết quả `v1` và `v2`. `so-nguyen-van.ts`: cách chấm đầu tiên (sai). `do-on-dinh.ts`: số lần chạy và số lượt gọi mô hình.
- `src/eval.test.ts`: 7 test.

```bash
node chay.ts v1 v2
node so-nguyen-van.ts
node do-on-dinh.ts
node --test src/eval.test.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts, không cần cài gì). Mọi tên, số điện thoại và đơn hàng là minh họa.
