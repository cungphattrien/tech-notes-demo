// Thẻ ảnh chia sẻ (Open Graph) 1200x630 của một bài viết, vẽ bằng ImageResponse của Next.js.
// Cùng ý với src/lib/og/render.tsx của blog Tech Notes; trong blog thật, hàm này được gọi từ file opengraph-image.tsx.
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

// Font không phụ thuộc vào yêu cầu nên đọc một lần ở cấp module (cách tài liệu Next.js khuyên).
const dam = await readFile(join(process.cwd(), "assets/fonts/BeVietnamPro-ExtraBold.ttf"));
const vua = await readFile(join(process.cwd(), "assets/fonts/BeVietnamPro-SemiBold.ttf"));

/** Tiêu đề càng dài thì chữ càng nhỏ, để luôn nằm gọn trong khoảng ba đến năm dòng. */
export function coChuTieuDe(tieuDe: string): number {
  if (tieuDe.length <= 40) return 72;
  if (tieuDe.length <= 70) return 60;
  return 50;
}

export type TheChiaSe = { tieuDe: string; nhan: string; chanTrang: string };

export function veTheChiaSe({ tieuDe, nhan, chanTrang }: TheChiaSe, coChu: number = coChuTieuDe(tieuDe)) {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "64px 72px", background: "#fff9f0", color: "#1b1433", fontFamily: "Be Vietnam Pro" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 800, color: "#6d4aff" }}>{nhan}</div>
          <div style={{ display: "flex", fontSize: coChu, fontWeight: 800, lineHeight: 1.12, letterSpacing: -2 }}>{tieuDe}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, fontWeight: 600 }}>
          <div style={{ display: "flex", fontWeight: 800 }}>Tech Notes</div>
          <div style={{ display: "flex", color: "#5b5470" }}>{chanTrang}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Be Vietnam Pro", data: vua, weight: 600, style: "normal" },
        { name: "Be Vietnam Pro", data: dam, weight: 800, style: "normal" },
      ],
    },
  );
}
