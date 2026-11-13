// Cách làm đầu tiên: không nhúng font, cỡ chữ cố định. Chạy: npx tsx thu-ban-dau.tsx
import { mkdir, writeFile } from "node:fs/promises";

import { ImageResponse } from "next/og";

import { TIEU_DE } from "./src/tieu-de.ts";

await mkdir("ra", { recursive: true });
const anh = new ImageResponse(
  (
    <div style={{ display: "flex", width: "100%", height: "100%", padding: "64px 72px", background: "#fff9f0", color: "#1b1433", fontSize: 72, fontWeight: 800, lineHeight: 1.12 }}>
      {TIEU_DE.vua}
    </div>
  ),
  { width: 1200, height: 630 },
);
await writeFile("ra/1-ban-dau.png", Buffer.from(await anh.arrayBuffer()));
console.log("Đã ghi ra/1-ban-dau.png");
