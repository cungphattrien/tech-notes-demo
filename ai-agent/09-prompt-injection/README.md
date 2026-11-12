# Tập 9 — Prompt injection: khi khách hàng lừa được agent

Tiếp tập 8. Công cụ của agent đã nằm sau một cổng chung, nhưng khách vẫn nói chuyện với agent bằng văn bản tự do. Tập này cho thấy hai kiểu tấn công (trực tiếp và gián tiếp) và các lớp bảo vệ nằm trong code.

**Lưu ý quan trọng:** không có mô hình thật nào được gọi ở đây. `src/mo-hinh-gia.ts` là một "mô hình" giả ở trường hợp xấu nhất: nó nghe theo mọi câu mệnh lệnh nó thấy. Nó không cho biết mô hình thật dễ bị dụ đến đâu. Mục đích là kiểm tra các lớp bảo vệ trong code, vì chúng phải đứng vững ngay cả khi mô hình đã bị dụ.

- `src/du-lieu.ts`: ba đơn hàng minh họa, đơn 1043 có ghi chú giao hàng chứa một câu lệnh giả làm "hệ thống".
- `src/agent.ts`: hai bản agent: `ngay-tho` và `co-phong-thu` (xác thực chủ đơn, chỉ trả trường cần thiết, lọc câu cam kết hoàn tiền, chuyển cho người).
- `src/tan-cong.ts`: 5 tin nhắn (một bình thường, bốn tấn công) và hai hàm chấm thiệt hại độc lập với bộ lọc.
- `thu-tan-cong.ts`: chạy từng tin qua hai bản agent.
- `src/agent.test.ts`: 7 test, gồm một test ghi lại giới hạn đã biết của bộ lọc.

```bash
node thu-tan-cong.ts
node --test src/agent.test.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts, không cần cài gì). Mọi tên người, số điện thoại và đơn hàng là minh họa.
