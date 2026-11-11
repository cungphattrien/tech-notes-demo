// Bản viết vội trong 6 phút đầu, trước khi hỏi lại đề. Chạy: node bai-luyen/ban-dau.ts
function topGhiChu(ghiChu: string[]) {
  const dem: Record<string, number> = {};
  for (const g of ghiChu) dem[g] = (dem[g] ?? 0) + 1;
  return Object.entries(dem)
    .map(([ghiChu, soLan]) => ({ ghiChu, soLan }))
    .sort((a, b) => b.soLan - a.soLan)
    .slice(0, 3);
}

// Ví dụ người phỏng vấn đưa ra.
console.log(topGhiChu(["cà phê", "Cà phê ", "cơm trưa", "cà phê", "bún bò", "cơm trưa", "  "]));
