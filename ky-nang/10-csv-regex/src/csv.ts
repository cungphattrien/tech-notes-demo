// Tách MỘT dòng CSV thành các ô. Hiểu ô nằm trong ngoặc kép (có thể chứa dấu phẩy) và ngoặc kép đôi "" là một dấu ngoặc kép.
// Giới hạn: ô không được chứa xuống dòng. File có ô nhiều dòng thì dùng thư viện đọc CSV.
export function tachDongCsv(dong: string): string[] {
  const cacO: string[] = [];
  let hienTai = "";
  let trongNgoac = false;
  for (let i = 0; i < dong.length; i++) {
    const c = dong[i];
    if (trongNgoac) {
      if (c === '"' && dong[i + 1] === '"') {
        hienTai += '"';
        i++;
      } else if (c === '"') trongNgoac = false;
      else hienTai += c;
    } else if (c === '"') trongNgoac = true;
    else if (c === ",") {
      cacO.push(hienTai);
      hienTai = "";
    } else hienTai += c;
  }
  if (trongNgoac) throw new Error("ngoặc kép không được đóng");
  cacO.push(hienTai);
  return cacO;
}
