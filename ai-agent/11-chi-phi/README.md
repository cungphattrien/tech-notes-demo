# Tập 11 — Chạy agent không cháy ví: cache, mô hình nhỏ, giới hạn

Tiếp tập 10. Một lần chạy bộ eval là 85 lượt gọi mô hình, còn khách thật nhắn cả ngày. Tập này mô phỏng một ngày 200 tin nhắn của quán Mộc và so chi phí qua bốn cách vận hành: cache prompt, chọn mô hình theo tin nhắn, nhớ câu trả lời chung, giới hạn số lượt gọi.

**Lưu ý quan trọng:** không có mô hình thật nào được gọi. Số token là ước lượng (3 ký tự một token), bảng giá là GIẢ ĐỊNH, còn hệ số cache (ghi 1,25 lần, đọc 0,1 lần) lấy từ tài liệu của Anthropic. Nên đọc kết quả theo tỉ lệ phần trăm giữa các cách làm, đừng đọc số đô la.

- `src/token.ts`, `src/gia.ts`: ước lượng token, bảng giá giả định, công thức tính tiền một lượt gọi.
- `src/chinh-sach.ts`: phần hướng dẫn cố định gửi ở mọi lượt gọi (khoảng 630 token).
- `src/luu-dem.ts`: mô phỏng cache prompt (tiền tố giống hệt, hết hạn 5 phút hoặc 1 giờ, mức tối thiểu).
- `src/dinh-tuyen.ts`: chọn mô hình nhỏ hay lớn bằng code.
- `src/bo-nho-tra-loi.ts`: nhớ câu trả lời theo hai cách, một sai một đúng.
- `src/mo-phong.ts`: sinh 200 tin nhắn trong ngày và tính tiền.
- `chay.ts`: so sánh năm cách vận hành. `thu-gio-o-dau.ts`, `thu-nho-cau-tra-loi.ts`: hai lỗi hay gặp.
- `src/chi-phi.test.ts`: 9 test.

```bash
node chay.ts
node thu-gio-o-dau.ts
node thu-nho-cau-tra-loi.ts
node --test src/chi-phi.test.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts, không cần cài gì). Mọi tên, số điện thoại và đơn hàng là minh họa.
