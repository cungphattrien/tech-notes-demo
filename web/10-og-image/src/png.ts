// Đọc chiều rộng và chiều cao từ phần đầu của một file PNG: 8 byte chữ ký, rồi khối IHDR (rộng và cao mỗi số 4 byte, big-endian).
const CHU_KY_PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

export function docKichThuocPng(anh: Buffer): { rong: number; cao: number } {
  if (anh.length < 24 || !anh.subarray(0, 8).equals(CHU_KY_PNG)) throw new Error("Không phải file PNG");
  return { rong: anh.readUInt32BE(16), cao: anh.readUInt32BE(20) };
}
