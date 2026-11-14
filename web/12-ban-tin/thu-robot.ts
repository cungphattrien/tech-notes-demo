// Năm lượt gửi form giả, để xem bộ lọc robot (ô ẩn "website" và thời gian điền) quyết định thế nào.
// Chạy: node thu-robot.ts
import { emailProblem, looksAutomated, signupSource } from "./src/ban-tin.ts";

const BAY_GIO = 1_700_000_000_000; // một mốc thời gian cố định để kết quả lặp lại được

const CAC_LUOT: { ten: string; email: string; website: string; started: string; nguon: string }[] = [
  { ten: "người thật, điền sau 8 giây", email: "an@example.com", website: "", started: String(BAY_GIO - 8000), nguon: "/bai-viet/lam-blog-ca-nhan-0d" },
  { ten: "robot điền ô ẩn", email: "spam@example.com", website: "http://quang-cao.example", started: String(BAY_GIO - 8000), nguon: "/" },
  { ten: "robot gửi sau 40 ms", email: "spam2@example.com", website: "", started: String(BAY_GIO - 40), nguon: "/" },
  { ten: "người bật chặn JavaScript (không có mốc giờ)", email: "binh@example.com", website: "", started: "", nguon: "/lo-trinh" },
  { ten: "email thiếu tên miền", email: "chi@", website: "", started: String(BAY_GIO - 8000), nguon: "/" },
];

for (const luot of CAC_LUOT) {
  const loiEmail = emailProblem(luot.email);
  const may = looksAutomated({ honeypot: luot.website, startedAt: luot.started, now: BAY_GIO });
  const ketQua = loiEmail ? `báo lỗi cho người dùng: ${loiEmail}` : may ? "nhận như bình thường nhưng KHÔNG lưu" : "lưu vào database";
  console.log(`${luot.ten.padEnd(46)} -> ${ketQua}  (nguồn: ${JSON.stringify(signupSource(luot.nguon))})`);
}
console.log("\nNguồn lạ bị bỏ:", JSON.stringify(signupSource("https://kẻ-xấu.example/?x=<script>")));
