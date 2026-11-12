# Tập 9 — Tìm chỗ chậm: đo trước, sửa sau

Tiếp tập 8. Log của máy chủ đơn hàng ghi thời gian xử lý mỗi request; tập này thêm đường `/bao-cao` (tổng chi tiêu theo khách), thấy nó chậm trên 50.000 đơn, và tìm đúng chỗ chậm bằng đo đạc.

- `src/bao-cao.ts`: báo cáo bản dùng `Map`. `src/bao-cao-cu.ts`: bản đầu dùng `find`, giữ lại để so sánh kết quả.
- `src/tao-du-lieu.ts`: sinh N đơn giả, luôn giống nhau mỗi lần chạy.
- `thu-log-cham.ts`: máy chủ có log, gọi `/don-hang` và `/bao-cao`, in dòng log tóm tắt.
- `thu-do.ts`, `thu-doan.ts`: đo bản đầu; đo riêng định dạng tiền và JSON (giả thuyết sai).
- `doc-profile.ts`: đọc file `.cpuprofile` và in các hàm tốn thời gian nhất.
- `do-nhieu-lan.ts`: so sánh hai bản ở 4 cỡ dữ liệu, trung vị của 5 lần chạy.

```bash
npm ci
npx vitest run                                   # 8 file, 55 test
node thu-log-cham.ts
node thu-doan.ts
node --no-turbo-inlining --cpu-prof --cpu-prof-dir=prof thu-do.ts
node doc-profile.ts prof/*.cpuprofile
node do-nhieu-lan.ts
```

Cần Node.js 22.18+. Thời gian đo trên máy của mình (Windows 11); máy bạn sẽ ra số khác, nhưng tỉ lệ giữa các bản thì tương tự.
