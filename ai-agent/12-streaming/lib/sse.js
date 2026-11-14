// Định dạng Server-Sent Events (SSE) mà route gửi đi, và bộ đọc phía người nhận.
// Một sự kiện SSE là vài dòng "tên: giá trị", kết thúc bằng MỘT DÒNG TRỐNG.
// Ví dụ:
//   event: delta
//   data: {"text":"Dạ, "}
//
// Mình bọc nội dung trong JSON để chữ có xuống dòng hay dấu hai chấm không làm hỏng định dạng.

export function dongSuKien(ten, duLieu) {
  return `event: ${ten}\ndata: ${JSON.stringify(duLieu)}\n\n`;
}

// Bộ đọc nhận các mảnh chữ (chunk) theo đúng thứ tự mạng giao tới, và trả về các sự kiện đã đủ.
// Một chunk có thể chứa nhiều sự kiện, hoặc chỉ một nửa sự kiện, nên phần chưa đủ được giữ lại cho lần sau.
export class DocSse {
  #dem = "";

  push(chunk) {
    this.#dem += chunk;
    const cacSuKien = [];
    let vitri;
    while ((vitri = this.#dem.indexOf("\n\n")) !== -1) {
      const khoi = this.#dem.slice(0, vitri);
      this.#dem = this.#dem.slice(vitri + 2);
      const suKien = docKhoi(khoi);
      if (suKien) cacSuKien.push(suKien);
    }
    return cacSuKien;
  }
}

function docKhoi(khoi) {
  let ten = "message";
  const phanData = [];
  for (const dong of khoi.split("\n")) {
    if (dong.startsWith("event: ")) ten = dong.slice(7);
    else if (dong.startsWith("data: ")) phanData.push(dong.slice(6));
  }
  if (phanData.length === 0) return null;
  return { ten, duLieu: JSON.parse(phanData.join("\n")) };
}

// Cách đọc "ngây thơ" để so sánh: coi mỗi chunk là một sự kiện trọn vẹn. Sẽ hỏng khi chunk cắt giữa chừng.
export function docNgayTho(chunk) {
  return chunk
    .split("\n\n")
    .filter(Boolean)
    .map((khoi) => docKhoi(khoi))
    .filter(Boolean);
}
