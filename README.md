# Tech Notes — code demo

Code chạy được đi kèm các series trên blog [Tech Notes](https://tech-notes-tawny.vercel.app).
Mỗi series là một câu chuyện; mỗi tập có một thư mục `NN-ten-tap/` chứa trạng thái code **sau khi** tập đó kết thúc.
Muốn xem lỗi trước khi sửa, mở thư mục của tập trước (tập 1 có thêm thư mục `00-ban-dau/`).

| Thư mục | Series | Nội dung |
|---|---|---|
| [`ai-agent/`](ai-agent) | Xây AI agent đầu tiên | Trợ lý chăm sóc khách hàng cho quán cà phê Mộc |
| [`web/`](web) | Xây blog với Next.js + Supabase | Từ chọn stack đến deploy một blog thật |
| [`ky-nang/`](ky-nang) | Nhận dự án cũ: từ bug report đến pull request | Hệ thống đơn hàng của quán Mộc, đầy lỗi |
| [`ai-dev/`](ai-dev) | Làm side project cùng AI | App sổ chi tiêu qua tin nhắn |
| [`su-nghiep/`](su-nghiep) | Hành trình junior: từ CV đến hết thử việc | Mẫu CV, checklist, bảng luyện tập |

## Chạy code

Cần **Node.js 22.18 trở lên** (chạy thẳng file TypeScript, không cần cài thêm gì):

```bash
node --version          # v22.18.0 trở lên
cd ky-nang/01-doc-stack-trace
node src/server.ts
```

Quán Mộc, khách hàng và đơn hàng trong repo đều là dữ liệu minh họa.

Giấy phép: MIT.
