import { dongSuKien } from "../../../lib/sse.js";
import { hoiMoHinhGia } from "../../../lib/mo-hinh-gia.js";

// Chạy theo yêu cầu, không dựng sẵn lúc build.
export const dynamic = "force-dynamic";

const maHoa = new TextEncoder();

// POST /api/chat: trả câu trả lời theo từng mảnh bằng SSE. Chữ đầu tiên tới trình duyệt ngay khi mô hình ra chữ đầu tiên.
export async function POST(request) {
  const { tin } = await request.json();
  const dieuKhien = new AbortController();
  const nguon = hoiMoHinhGia(tin, { tin_hieu: dieuKhien.signal });
  let soManh = 0;

  const dong = new ReadableStream({
    // pull được gọi mỗi khi người nhận cần thêm dữ liệu: mỗi lần mình lấy một mảnh từ mô hình rồi đẩy đi.
    async pull(kenh) {
      const { value, done } = await nguon.next();
      if (done) {
        kenh.enqueue(maHoa.encode(dongSuKien("done", { soManh })));
        kenh.close();
        return;
      }
      soManh += 1;
      kenh.enqueue(maHoa.encode(dongSuKien("delta", { text: value })));
    },
    // cancel được gọi khi khách đóng tab hoặc ngắt kết nối: dừng hỏi mô hình để khỏi tốn tiền cho chữ không ai đọc.
    cancel() {
      dieuKhien.abort();
      console.log(`[chat] khách ngắt kết nối sau ${soManh} mảnh, đã dừng mô hình`);
    },
  });

  return new Response(dong, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      // no-transform: không cho proxy hay bộ nén gom chữ lại; X-Accel-Buffering: no dành cho nginx.
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
