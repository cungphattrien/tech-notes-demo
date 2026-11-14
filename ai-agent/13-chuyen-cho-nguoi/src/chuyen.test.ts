import assert from "node:assert/strict";
import { test } from "node:test";
import { CA_THU } from "./ca-thu.ts";
import { moHinhGia } from "./mo-hinh-gia.ts";
import { cheSoDienThoai, NhatKy } from "./nhat-ky.ts";
import { doGiong, quyetDinh } from "./quyet-dinh.ts";
import { TongDai, trongGioLam } from "./tong-dai.ts";

const SANG = new Date("2026-11-20T03:10:00Z"); // 10:10 giờ Việt Nam
const KHUYA = new Date("2026-11-20T15:30:00Z"); // 22:30 giờ Việt Nam

const taoTongDai = (luc = SANG) => {
  const nhatKy = new NhatKy(() => luc);
  return { nhatKy, tongDai: new TongDai(nhatKy, () => luc) };
};

test("che số điện thoại nhưng giữ đầu và cuối để phân biệt hai khách", () => {
  assert.equal(cheSoDienThoai("gọi 0901000002 nhé"), "gọi 090*****02 nhé");
  assert.equal(cheSoDienThoai("+84901000002"), "+84*******02");
  assert.notEqual(cheSoDienThoai("0901000001"), cheSoDienThoai("0901000002"));
});

test("mã đơn 4 chữ số không bị coi là số điện thoại", () => {
  assert.equal(cheSoDienThoai("đơn 1042 và 2026"), "đơn 1042 và 2026");
});

test("an toàn trước: dị ứng luôn được chuyển, kể cả khi mô hình rất tự tin", () => {
  assert.deepEqual(quyetDinh("Mình dị ứng sữa bò, bạc xỉu có sữa không?", [], 0.99), { chuyen: true, lyDo: "di-ung" });
});

test("hoàn tiền thắng khiếu nại khi cả hai cùng có mặt", () => {
  assert.deepEqual(quyetDinh("giao trễ quá, đền mình đi", [], 0.9), { chuyen: true, lyDo: "hoan-tien" });
});

test("'đổi' không bị nhầm thành 'đổ'", () => {
  assert.deepEqual(quyetDinh("mình muốn đổi sang bạc xỉu", [], 0.9), { chuyen: false });
  assert.deepEqual(quyetDinh("ly cà phê bị đổ", [], 0.9), { chuyen: true, lyDo: "khieu-nai" });
});

test("khách hỏi lại gần y nguyên thì chuyển, hỏi khác đi thì không", () => {
  assert.ok(doGiong("đơn 1043 đã giao chưa", "đơn 1043 đã giao chưa?") >= 0.6);
  assert.deepEqual(quyetDinh("đơn 1043 đã giao chưa?", ["đơn 1043 đã giao chưa"], 0.95), { chuyen: true, lyDo: "lap-lai" });
  assert.deepEqual(quyetDinh("quán mấy giờ mở cửa?", ["đơn 1043 đã giao chưa"], 0.95), { chuyen: false });
});

test("mô hình không chắc (dưới 0,6) thì chuyển", () => {
  assert.deepEqual(quyetDinh("bên bạn có bán bánh sinh nhật không?", [], moHinhGia("bên bạn có bán bánh sinh nhật không?").doTinCay), {
    chuyen: true,
    lyDo: "agent-khong-chac",
  });
});

test("14 tin có đáp án: không bỏ sót và không chuyển thừa (đáp án và quy tắc do cùng một người viết)", () => {
  for (const { tin, nenChuyen } of CA_THU) {
    assert.equal(quyetDinh(tin, [], moHinhGia(tin).doTinCay).chuyen, nenChuyen, tin);
  }
});

test("sau khi chuyển, agent im lặng: mô hình không được gọi nữa", () => {
  const { nhatKy, tongDai } = taoTongDai();
  tongDai.khach("h1", "Đơn 1042 bị đổ hết, đền mình");
  const soTraLoiTruoc = nhatKy.cuaHoiThoai("h1").filter((s) => s.loai === "agent-tra-loi").length;
  tongDai.khach("h1", "alo?");
  tongDai.khach("h1", "đơn 1041 đang ở đâu?");
  const loai = nhatKy.cuaHoiThoai("h1").map((s) => s.loai);
  assert.equal(loai.filter((l) => l === "agent-tra-loi").length, soTraLoiTruoc);
  assert.equal(loai.filter((l) => l === "agent-im-lang").length, 2);
});

test("phiếu có tóm tắt: lý do, mã đơn kèm trạng thái, tin cuối", () => {
  const { tongDai } = taoTongDai();
  tongDai.khach("h1", "Đơn 1042 giao trễ gần hai tiếng rồi");
  assert.equal(tongDai.phieu.length, 1);
  assert.match(tongDai.phieu[0]!.tomTat, /Lý do: khieu-nai\. đơn 1042 \(đang giao\)\. 1 tin của khách/);
});

test("mã đơn không tồn tại được ghi rõ trong phiếu", () => {
  const { tongDai } = taoTongDai();
  tongDai.khach("h1", "Đơn 9999 bị đổ hết");
  assert.match(tongDai.phieu[0]!.tomTat, /đơn 9999 \(không tìm thấy\)/);
});

test("ngoài giờ mở cửa thì lời hẹn nói đúng giờ nhân viên có mặt", () => {
  assert.equal(trongGioLam(SANG), true);
  assert.equal(trongGioLam(KHUYA), false);
  const { tongDai } = taoTongDai(KHUYA);
  assert.match(tongDai.khach("h1", "đền mình đi"), /sau 7:00 sáng/);
  const { tongDai: ban } = taoTongDai(SANG);
  assert.doesNotMatch(ban.khach("h1", "đền mình đi"), /sau 7:00/);
});

test("nhân viên tiếp nhận ghi số giây khách đã chờ; đóng phiếu trả cuộc trò chuyện về cho agent", () => {
  let giay = SANG.getTime() / 1000;
  const gio = () => new Date(giay * 1000);
  const nhatKy = new NhatKy(gio);
  const tongDai = new TongDai(nhatKy, gio);
  tongDai.khach("h1", "đền mình đi");
  giay += 700;
  tongDai.nhanVienTiepNhan("P1", "chị Hạnh");
  assert.equal(nhatKy.cuaHoiThoai("h1").find((s) => s.loai === "nhan-vien-tiep-nhan")?.choGiay, 700);
  assert.equal(tongDai.hoiThoai.get("h1")?.trangThai, "nhan-vien-dang-xu-ly");
  tongDai.dongPhieu("P1");
  assert.equal(tongDai.hoiThoai.get("h1")?.trangThai, "agent");
  assert.match(tongDai.khach("h1", "mấy giờ quán mở cửa?"), /7:00 đến 21:00/);
});

test("hai cuộc trò chuyện không lẫn nhau", () => {
  const { nhatKy, tongDai } = taoTongDai();
  tongDai.khach("a", "đền mình đi");
  assert.match(tongDai.khach("b", "quán có món gì?"), /cà phê sữa/);
  assert.equal(tongDai.hoiThoai.get("b")?.trangThai, "agent");
  assert.ok(nhatKy.cuaHoiThoai("a").every((s) => s.maHoiThoai === "a"));
});

test("nhật ký: mọi dòng có maHoiThoai và không dòng nào chứa số điện thoại nguyên vẹn", () => {
  const { nhatKy, tongDai } = taoTongDai();
  tongDai.khach("h1", "bị đổ hết, gọi mình qua 0901000002 nhé");
  assert.equal(nhatKy.dong.length, 3); // khach-nhan, quyet-dinh, tao-phieu (không có mã đơn nên không gọi công cụ)
  for (const d of nhatKy.dong) {
    assert.ok(JSON.parse(d).maHoiThoai);
    assert.doesNotMatch(d, /0901000002/);
  }
});

test("phiếu không tồn tại thì báo lỗi rõ ràng", () => {
  const { tongDai } = taoTongDai();
  assert.throws(() => tongDai.nhanVienTiepNhan("P9", "ai đó"), /Không có phiếu P9/);
});
