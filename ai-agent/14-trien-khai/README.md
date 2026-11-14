# Tập 14 — Đưa AI agent lên production: kiểm tra sức khỏe, giám sát, công tắc tắt

Tiếp tập 13. Agent của quán Mộc biết chuyển cho người, nhưng mới chạy như một thư viện trên máy. Tập này bọc nó thành một dịch vụ HTTP có đủ thứ một dịch vụ thật cần: `/healthz` và `/readyz`, giới hạn tần suất và kích thước, số đo (đếm, độ trễ p50/p95), công tắc tắt agent, dừng êm, và cấu hình từ biến môi trường.

**Lưu ý quan trọng:** mình **không** đưa nó lên máy chủ nào cả, nên không có số liệu từ môi trường thật. Mô hình là mô hình giả (`DO_TRE_MO_HINH_MS` giả lập độ trễ), mọi thứ chạy trên máy mình bằng Node 22 trên Windows. Dừng êm khi nhận SIGTERM từ bên ngoài **không** thử được trên Windows (SIGTERM giết tiến trình ngay); hàm `dung()` được thử trực tiếp.

- `src/cau-hinh.ts`: đọc và kiểm tra biến môi trường, báo hết mọi chỗ sai.
- `src/may-chu.ts`: máy chủ HTTP (`POST /tin`, `GET /healthz`, `/readyz`, `/metrics`).
- `src/so-do.ts`: bộ đếm và đo độ trễ trong bộ nhớ.
- `src/tong-dai.ts`, `quyet-dinh.ts`, `mo-hinh-gia.ts`, `nhat-ky.ts`, `ca-thu.ts`, `du-lieu.ts`: tổng đài của tập 13 (thêm `chuyenThang` và lý do `agent-tat`).
- `chay.ts`: chạy dịch vụ (`npm start`, cần `.env`, xem `.env.example`).
- `thu-tai.ts`: thử tải đều, gửi dồn, công tắc tắt, dừng êm.
- `src/trien-khai.test.ts`: 15 test (chạy máy chủ thật trên cổng ngẫu nhiên).

```bash
cp .env.example .env     # điền ADMIN_KEY (ít nhất 16 ký tự)
npm start
node thu-tai.ts
npm test
```

Gửi thử bằng curl trên Windows: để JSON trong file rồi `curl --data-binary @tin.json localhost:3300/tin`, vì `-d` với chữ có dấu có thể bị lỗi mã hóa. Cần Node.js 22.18+. Không cần `npm install`.
