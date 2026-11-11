"use client";

// Ô soạn bài: bên trái gõ Markdown, bên phải xem trước. Cả hai nằm trong một thành phần, dùng chung hai hàm ở trên.
import { useState } from "react";

import { parseMarkdown } from "./markdown-an-toan.ts";
import { XemTruoc } from "./xem-truoc.tsx";

export function SoanBai({ banDau = "" }: { banDau?: string }) {
  const [nguon, setNguon] = useState(banDau);
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
      <textarea aria-label="Nội dung bài viết (Markdown)" onChange={(e) => setNguon(e.target.value)} rows={16} value={nguon} />
      <article aria-label="Xem trước">
        <XemTruoc khoi={parseMarkdown(nguon)} />
      </article>
    </div>
  );
}
