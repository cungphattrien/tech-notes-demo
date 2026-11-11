// Bài luyện 20 phút: cho danh sách ghi chú khoản chi, trả về tối đa 3 ghi chú xuất hiện nhiều nhất.
// Luật (sau khi hỏi lại đề): hai ghi chú chỉ khác chữ hoa/thường hoặc dấu cách thừa là MỘT ghi chú;
// ghi chú trống bị bỏ qua; số lần bằng nhau thì ghi chú xuất hiện trước trong mảng đứng trước;
// kết quả hiển thị dạng đã chuẩn hóa (chữ thường, không dấu cách thừa).
export type DongTop = { ghiChu: string; soLan: number };

const chuanHoa = (ghiChu: string) => ghiChu.normalize("NFC").trim().replace(/\s+/g, " ").toLowerCase();

export function topGhiChu(ghiChu: string[], soDong = 3): DongTop[] {
  const dem = new Map<string, number>(); // Map giữ thứ tự thêm vào, nên "xuất hiện trước" còn nguyên
  for (const g of ghiChu) {
    const khoa = chuanHoa(g);
    if (khoa === "") continue;
    dem.set(khoa, (dem.get(khoa) ?? 0) + 1);
  }
  // sort của JavaScript ổn định (từ ES2019): số lần bằng nhau thì giữ nguyên thứ tự thêm vào.
  return [...dem]
    .map(([ghiChu, soLan]) => ({ ghiChu, soLan }))
    .sort((a, b) => b.soLan - a.soLan)
    .slice(0, soDong);
}
