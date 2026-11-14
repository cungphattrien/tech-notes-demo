// Chạy: node --test lib
import assert from "node:assert/strict";
import { test } from "node:test";

import { CAU_TRA_LOI, hoiMoHinhGia, tachManh } from "./mo-hinh-gia.js";
import { DocSse, docNgayTho, dongSuKien } from "./sse.js";

test("một sự kiện SSE gồm dòng event, dòng data và một dòng trống", () => {
  assert.equal(dongSuKien("delta", { text: "Dạ, " }), 'event: delta\ndata: {"text":"Dạ, "}\n\n');
});

test("một chunk chứa hai sự kiện thì đọc ra cả hai", () => {
  const doc = new DocSse();
  const kq = doc.push(dongSuKien("delta", { text: "a" }) + dongSuKien("done", { soManh: 1 }));
  assert.deepEqual(kq.map((s) => s.ten), ["delta", "done"]);
});

test("sự kiện bị cắt đôi giữa hai chunk thì chờ chunk sau rồi mới trả", () => {
  const doc = new DocSse();
  const chu = dongSuKien("delta", { text: "quán giao hàng" });
  assert.deepEqual(doc.push(chu.slice(0, 15)), []);
  assert.deepEqual(doc.push(chu.slice(15)), [{ ten: "delta", duLieu: { text: "quán giao hàng" } }]);
});

test("chữ có xuống dòng và dấu hai chấm vẫn nguyên vẹn nhờ bọc JSON", () => {
  const doc = new DocSse();
  const [suKien] = doc.push(dongSuKien("delta", { text: "Dòng 1\nGiờ: 6:30\n\nDòng 3" }));
  assert.equal(suKien.duLieu.text, "Dòng 1\nGiờ: 6:30\n\nDòng 3");
});

test("cắt luồng byte ở BẤT KỲ vị trí nào, kể cả giữa chữ có dấu, vẫn ra đúng chữ ban đầu", () => {
  const luong = ["Dạ, ", "hoàn tiền ", "trong ba ngày ", "làm việc ạ."].map((text) => dongSuKien("delta", { text })).join("");
  const byte = new TextEncoder().encode(luong);
  for (let diem = 1; diem < byte.length; diem++) {
    const giaiMa = new TextDecoder();
    const doc = new DocSse();
    const kq = [
      ...doc.push(giaiMa.decode(byte.slice(0, diem), { stream: true })),
      ...doc.push(giaiMa.decode(byte.slice(diem), { stream: true })),
    ];
    assert.equal(kq.map((s) => s.duLieu.text).join(""), "Dạ, hoàn tiền trong ba ngày làm việc ạ.", `cắt ở byte ${diem}`);
  }
});

test("giải mã từng chunk riêng làm vỡ chữ có dấu khi chunk cắt giữa ký tự", () => {
  const byte = new TextEncoder().encode("Dạ");
  const vo = new TextDecoder().decode(byte.slice(0, 2)) + new TextDecoder().decode(byte.slice(2));
  assert.notEqual(vo, "Dạ");
  assert.match(vo, /�/u);
});

test("đọc ngây thơ (mỗi chunk là một sự kiện) làm mất hoặc làm hỏng sự kiện bị cắt giữa chừng", () => {
  const chu = dongSuKien("delta", { text: "quán" });
  let ketQua;
  try {
    ketQua = [...docNgayTho(chu.slice(0, 15)), ...docNgayTho(chu.slice(15))];
  } catch {
    ketQua = "lỗi";
  }
  assert.notDeepEqual(ketQua, [{ ten: "delta", duLieu: { text: "quán" } }]);
});

test("các mảnh nối lại đúng bằng câu trả lời", () => {
  assert.equal(tachManh(CAU_TRA_LOI).join(""), CAU_TRA_LOI);
});

test("báo hủy thì mô hình giả ngừng nhả chữ", async () => {
  const dieuKhien = new AbortController();
  const cacManh = [];
  for await (const manh of hoiMoHinhGia("hi", { tin_hieu: dieuKhien.signal })) {
    cacManh.push(manh);
    if (cacManh.length === 3) dieuKhien.abort();
  }
  assert.equal(cacManh.length, 3);
});
