// Tạo một ảnh thử lớn, giống ảnh chụp từ điện thoại: chi tiết ở nhiều cỡ (mảng màu lớn, vân, hạt), nhiễu cảm biến, kèm metadata
// EXIF có tên máy và vị trí GPS. Ảnh được tạo bằng code, không phải ảnh chụp thật, nên số liệu của bạn sẽ khác với ảnh của bạn.
// Chạy: node src/tao-anh-thu.ts <đường-dẫn-file.jpg>
import sharp from "sharp";

export const ANH_THU = { width: 6000, height: 4000 };

// Một lớp nhiễu ở "cỡ hạt" cho trước: tạo nhiễu nhỏ rồi phóng to. Hạt càng lớn thì mảng màu càng to.
async function lopNhieu(coHat: number, bienDo: number): Promise<Buffer> {
  const { width, height } = ANH_THU;
  return sharp({ create: { width: Math.ceil(width / coHat), height: Math.ceil(height / coHat), channels: 3, background: "#808080", noise: { type: "gaussian", mean: 128, sigma: bienDo } } })
    .resize(width, height, { kernel: "cubic" }).png().toBuffer();
}

export async function taoAnhThu(file: string): Promise<void> {
  const cacLop = await Promise.all([[400, 70], [120, 60], [40, 55], [12, 50], [4, 40], [1, 22]].map(([coHat, bienDo]) => lopNhieu(coHat, bienDo)));
  await sharp(cacLop[0])
    .composite(cacLop.slice(1).map((input) => ({ input, blend: "soft-light" as const })))
    .modulate({ saturation: 1.6 })
    .withExif({
      IFD0: { Make: "DemoCam", Model: "Moc-1", Software: "tao-anh-thu.ts" },
      IFD3: { GPSLatitudeRef: "N", GPSLatitude: "10/1 46/1 30/1", GPSLongitudeRef: "E", GPSLongitude: "106/1 42/1 0/1" },
    })
    .jpeg({ quality: 92 })
    .toFile(file);
}

if (import.meta.main) {
  const file = process.argv[2];
  if (!file) throw new Error("Cách dùng: node src/tao-anh-thu.ts <đường-dẫn-file.jpg>");
  await taoAnhThu(file);
  const info = await sharp(file).metadata();
  console.log(`Đã tạo ${file}: ${info.width}x${info.height}`);
}
