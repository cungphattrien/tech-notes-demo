import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { test } from "node:test";
import { CauHinhLoi, docCauHinh } from "./cau-hinh.ts";
import { taoMayChu } from "./may-chu.ts";
import { NhatKy } from "./nhat-ky.ts";
import { phanVi, SoDo } from "./so-do.ts";
import { TongDai } from "./tong-dai.ts";

const KHOA = "khoa-quan-tri-0123456789";

async function khoiDong(env: Record<string, string> = {}, tuyChon: { gio?: () => number; tongDai?: TongDai } = {}) {
  const cauHinh = docCauHinh({ ADMIN_KEY: KHOA, ...env });
  const nhatKy = new NhatKy();
  const soDo = new SoDo();
  const tongDai = tuyChon.tongDai ?? new TongDai(nhatKy);
  const may = taoMayChu({ cauHinh, tongDai, soDo, nhatKy, gio: tuyChon.gio });
  await new Promise<void>((xong) => may.server.listen(0, "127.0.0.1", xong));
  const goc = `http://127.0.0.1:${(may.server.address() as AddressInfo).port}`;
  const gui = (maHoiThoai: unknown, tin: unknown) => fetch(`${goc}/tin`, { method: "POST", body: JSON.stringify({ maHoiThoai, tin }) });
  return { may, goc, gui, soDo, nhatKy, tongDai };
}

test("cấu hình: giá trị mặc định khi chỉ có ADMIN_KEY", () => {
  const c = docCauHinh({ ADMIN_KEY: KHOA });
  assert.deepEqual(c, { PORT: 3300, AGENT_TAT: false, GIOI_HAN_MOI_PHUT: 20, MAX_DO_DAI_TIN: 1000, DO_TRE_MO_HINH_MS: 0, ADMIN_KEY: KHOA });
});

test("cấu hình: biến để rỗng coi như chưa đặt, AGENT_TAT=true và 1 đều là bật", () => {
  assert.equal(docCauHinh({ ADMIN_KEY: KHOA, PORT: "" }).PORT, 3300);
  assert.equal(docCauHinh({ ADMIN_KEY: KHOA, AGENT_TAT: "true" }).AGENT_TAT, true);
  assert.equal(docCauHinh({ ADMIN_KEY: KHOA, AGENT_TAT: "1" }).AGENT_TAT, true);
  assert.equal(docCauHinh({ ADMIN_KEY: KHOA, AGENT_TAT: "false" }).AGENT_TAT, false);
});

test("cấu hình: báo hết mọi chỗ sai cùng lúc và không in khóa bí mật", () => {
  try {
    docCauHinh({ PORT: "abc", AGENT_TAT: "yes", ADMIN_KEY: "ngan" });
    assert.fail("phải ném lỗi");
  } catch (loi) {
    assert.ok(loi instanceof CauHinhLoi);
    assert.equal(loi.cacLoi.length, 3);
    assert.match(loi.message, /PORT: .*"abc"/);
    assert.match(loi.message, /AGENT_TAT: .*"yes"/);
    assert.doesNotMatch(loi.message, /ngan/);
  }
});

test("cấu hình: thiếu ADMIN_KEY thì không khởi động", () => {
  assert.throws(() => docCauHinh({}), /ADMIN_KEY: bắt buộc/);
});

test("phanVi và SoDo: p50, p95, tối đa của 100 số đo từ 1 đến 100", () => {
  assert.equal(phanVi([3, 1, 2], 0.5), 2);
  const s = new SoDo();
  for (let i = 1; i <= 100; i++) s.ghiDoTre(i);
  assert.deepEqual(s.tongHop().doTreMs, { p50: 50, p95: 95, toiDa: 100 });
  assert.equal(new SoDo().tongHop().doTreMs, null);
});

test("/healthz và /readyz trả 200, đường lạ trả 404", async () => {
  const { may, goc } = await khoiDong();
  assert.equal((await fetch(`${goc}/healthz`)).status, 200);
  assert.equal((await fetch(`${goc}/readyz`)).status, 200);
  assert.equal((await fetch(`${goc}/khong-co`)).status, 404);
  await may.dung();
});

test("/metrics cần khóa quản trị: không khóa hoặc sai khóa thì 401", async () => {
  const { may, goc } = await khoiDong();
  assert.equal((await fetch(`${goc}/metrics`)).status, 401);
  assert.equal((await fetch(`${goc}/metrics`, { headers: { "x-admin-key": "sai-khoa-sai-khoa-sai" } })).status, 401);
  assert.equal((await fetch(`${goc}/metrics`, { headers: { "x-admin-key": KHOA } })).status, 200);
  await may.dung();
});

test("đầu vào sai bị từ chối đúng mã: JSON hỏng, mã cuộc trò chuyện sai, tin rỗng", async () => {
  const { may, goc, gui } = await khoiDong();
  assert.equal((await fetch(`${goc}/tin`, { method: "POST", body: "không phải json" })).status, 400);
  assert.equal((await gui("có dấu cách!", "xin chào")).status, 400);
  assert.equal((await gui(42, "xin chào")).status, 400);
  assert.equal((await gui("c-1", "   ")).status, 400);
  assert.equal((await gui("c-1", 5)).status, 400);
  await may.dung();
});

test("tin quá dài (413) và thân yêu cầu quá lớn (413) đều bị từ chối và được đếm", async () => {
  const { may, goc, gui, soDo } = await khoiDong({ MAX_DO_DAI_TIN: "50" });
  assert.equal((await gui("c-1", "a".repeat(51))).status, 413);
  assert.equal((await fetch(`${goc}/tin`, { method: "POST", body: "x".repeat(20_000) })).status, 413);
  assert.equal(soDo.tuChoiDoDai, 2);
  assert.equal((await gui("c-1", "a".repeat(50))).status, 200);
  await may.dung();
});

test("giới hạn tần suất: tin thứ 21 trong một phút bị 429, sau 60 giây thì được lại, khách khác không bị ảnh hưởng", async () => {
  let bay = 1_000_000;
  const { may, gui, soDo } = await khoiDong({}, { gio: () => bay });
  for (let i = 0; i < 20; i++) assert.equal((await gui("c-1", "quán có món gì?")).status, 200);
  assert.equal((await gui("c-1", "quán có món gì?")).status, 429);
  assert.equal((await gui("c-2", "quán có món gì?")).status, 200);
  bay += 61_000;
  assert.equal((await gui("c-1", "quán có món gì?")).status, 200);
  assert.equal(soDo.tuChoiGioiHan, 1);
  await may.dung();
});

test("tin đi qua tổng đài: câu hỏi thường được agent trả lời, khiếu nại được chuyển và đếm theo lý do", async () => {
  const { may, gui, soDo } = await khoiDong();
  const thuong = (await (await gui("c-1", "quán có món gì?")).json()) as { traLoi: string };
  assert.match(thuong.traLoi, /cà phê sữa/);
  await gui("c-2", "đơn 1042 bị đổ hết, đền mình");
  await gui("c-2", "alo?");
  const t = soDo.tongHop();
  assert.equal(t.daTraLoi, 1);
  assert.equal(t.daChuyen, 1);
  assert.equal(t.daImLang, 1);
  assert.deepEqual(t.chuyenTheoLyDo, { "hoan-tien": 1 });
  await may.dung();
});

test("công tắc AGENT_TAT: mọi khách mới đều bị chuyển thẳng, mô hình không được gọi", async () => {
  const { may, gui, soDo, nhatKy } = await khoiDong({ AGENT_TAT: "true" });
  const r = (await (await gui("c-1", "quán mấy giờ mở cửa?")).json()) as { traLoi: string };
  assert.match(r.traLoi, /nhân viên trả lời trực tiếp/);
  assert.deepEqual(soDo.tongHop().chuyenTheoLyDo, { "agent-tat": 1 });
  assert.equal(nhatKy.cuaHoiThoai("c-1").filter((s) => s.loai === "agent-tra-loi" || s.loai === "quyet-dinh").length, 0);
  await may.dung();
});

test("lỗi bất ngờ trong tổng đài: khách nhận 500 gọn, không lộ stack trace, và lỗi được đếm và ghi", async () => {
  const hong = new TongDai(new NhatKy());
  hong.khach = () => {
    throw new Error("mô hình sập");
  };
  const { may, gui, soDo, nhatKy } = await khoiDong({}, { tongDai: hong });
  const r = await gui("c-1", "xin chào");
  assert.equal(r.status, 500);
  const than = await r.text();
  assert.equal(than, '{"loi":"loi-noi-bo"}');
  assert.equal(soDo.loiNoiBo, 1);
  assert.ok(nhatKy.dong.some((d) => d.includes("mô hình sập")));
  await may.dung();
});

test("dừng êm: yêu cầu đang xử lý vẫn được trả lời, sau đó kết nối mới bị từ chối", async () => {
  const { may, goc, gui } = await khoiDong({ DO_TRE_MO_HINH_MS: "200" });
  const dangXuLy = gui("c-1", "quán có món gì?");
  await new Promise((r) => setTimeout(r, 50));
  let dungXong = false;
  const dung = may.dung().then(() => (dungXong = true));
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(dungXong, false, "chưa được dừng khi yêu cầu còn đang chạy");
  assert.equal((await dangXuLy).status, 200);
  await dung;
  await assert.rejects(fetch(`${goc}/healthz`));
});

test("dừng êm có thời gian chờ: trong lúc chờ /readyz trả 503 nhưng dịch vụ vẫn trả lời", async () => {
  const { may, goc } = await khoiDong();
  const dung = may.dung(150);
  await new Promise((r) => setTimeout(r, 30));
  assert.equal((await fetch(`${goc}/readyz`)).status, 503);
  assert.equal((await fetch(`${goc}/healthz`)).status, 200);
  await dung;
});
