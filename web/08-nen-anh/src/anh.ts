// Các quyết định thuần (không đụng tới ảnh thật) của bước nén ảnh. Cùng logic với src/lib/image-optimize.ts của blog Tech Notes,
// ở đó việc vẽ ảnh chạy trong trình duyệt; ở đây ta dùng sharp trên Node để đo cho dễ.

// Rộng hơn cột bài viết (720 px) gấp đôi để ảnh còn nét trên màn hình retina.
export const MAX_IMAGE_WIDTH = 1600;

// Thu nhỏ cho cạnh dài nhất vừa `max`, giữ tỉ lệ. Không bao giờ phóng to.
export function fitWithin(width: number, height: number, max = MAX_IMAGE_WIDTH): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= max) return { width, height };
  const scale = max / longest;
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

// GIF có thể là ảnh động; nén lại sẽ làm nó đứng hình, nên để nguyên.
export function shouldOptimize(type: string): boolean {
  return ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(type);
}

// Giữ bản gốc nếu nén xong mà không nhỏ hơn (ảnh vốn đã nhỏ và nén tốt).
// Riêng ảnh đã bị thu nhỏ kích thước thì phải dùng bản mới, kể cả khi nặng hơn, để kích thước lưu khớp với bài viết.
export function pickSmaller<T extends { size: number }>(original: T, optimized: T | null, resized: boolean): T {
  if (!optimized) return original;
  if (resized) return optimized;
  return optimized.size < original.size ? optimized : original;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} MB`;
}
