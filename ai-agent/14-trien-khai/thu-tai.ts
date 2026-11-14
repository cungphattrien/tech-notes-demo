// Chạy dịch vụ thật (trong cùng tiến trình, cổng ngẫu nhiên) và thử bốn tình huống: tải đều, một khách gửi dồn, công tắc tắt agent, dừng êm.
// Chạy: node thu-tai.ts      Mô hình là mô hình giả, độ trễ 50 ms là con số mình đặt.
import type { AddressInfo } from "node:net";
import { CA_THU } from "./src/ca-thu.ts";
import { docCauHinh } from "./src/cau-hinh.ts";
import { taoMayChu } from "./src/may-chu.ts";
import { NhatKy } from "./src/nhat-ky.ts";
import { SoDo } from "./src/so-do.ts";
import { TongDai } from "./src/tong-dai.ts";

const KHOA = "khoa-quan-tri-0123456789";

async function khoiDong(env: Record<string, string>) {
  const cauHinh = docCauHinh({ ADMIN_KEY: KHOA, ...env });
  const nhatKy = new NhatKy();
  const soDo = new SoDo();
  const may = taoMayChu({ cauHinh, tongDai: new TongDai(nhatKy), soDo, nhatKy });
  await new Promise<void>((xong) => may.server.listen(0, xong));
  const goc = `http://127.0.0.1:${(may.server.address() as AddressInfo).port}`;
  const gui = (maHoiThoai: string, tin: string) =>
    fetch(`${goc}/tin`, { method: "POST", body: JSON.stringify({ maHoiThoai, tin }) }).then((r) => r.status);
  const metrics = async () => (await (await fetch(`${goc}/metrics`, { headers: { "x-admin-key": KHOA } })).json()) as Record<string, unknown>;
  return { may, goc, gui, metrics };
}

console.log("--- 1. Tải đều: 300 tin, 100 khách, 10 yêu cầu cùng lúc, mô hình giả chậm 50 ms (cứ 10 tin có 1 tin cần chuyển cho người)");
const CAN_CHUYEN = CA_THU.filter((c) => c.nenChuyen);
const BINH_THUONG = CA_THU.filter((c) => !c.nenChuyen);
{
  const { may, gui, metrics } = await khoiDong({ DO_TRE_MO_HINH_MS: "50" });
  const trangThai: Record<number, number> = {};
  let tiep = 0;
  const congNhan = async () => {
    while (tiep < 300) {
      const i = tiep++;
      const ma = await gui(`c-${String(i % 100).padStart(2, "0")}`, (i % 10 === 9 ? CAN_CHUYEN[Math.floor(i / 10) % CAN_CHUYEN.length]! : BINH_THUONG[i % BINH_THUONG.length]!).tin);
      trangThai[ma] = (trangThai[ma] ?? 0) + 1;
    }
  };
  const batDau = Date.now();
  await Promise.all(Array.from({ length: 10 }, congNhan));
  console.log(`Xong sau ${Date.now() - batDau} ms. Mã trả về: ${JSON.stringify(trangThai)}`);
  console.log("Số đo:", JSON.stringify(await metrics()));
  await may.dung();
}

console.log("\n--- 2. Một khách gửi dồn 25 tin liên tiếp (giới hạn 20 tin mỗi phút)");
{
  const { may, gui, metrics } = await khoiDong({});
  const ketQua: number[] = [];
  for (let i = 0; i < 25; i++) ketQua.push(await gui("c-bao", "quán có món gì?"));
  console.log(`Mã trả về: ${ketQua.filter((m) => m === 200).length} lần 200, ${ketQua.filter((m) => m === 429).length} lần 429`);
  console.log(`tuChoiGioiHan trong số đo: ${(await metrics()).tuChoiGioiHan}`);
  await may.dung();
}

console.log("\n--- 3. Công tắc tắt agent (AGENT_TAT=true)");
{
  const { may, goc, metrics } = await khoiDong({ AGENT_TAT: "true" });
  for (const tin of ["quán mấy giờ mở cửa?", "đơn 1042 đâu rồi"]) {
    const r = await fetch(`${goc}/tin`, { method: "POST", body: JSON.stringify({ maHoiThoai: "c-01", tin }) });
    console.log(`Khách: ${tin}\n  → ${r.status} ${(await r.json() as { traLoi: string }).traLoi}`);
  }
  const m = await metrics();
  console.log(`Số đo: agentTat=${m.agentTat}, daTraLoi=${m.daTraLoi}, daImLang=${m.daImLang}, daChuyen=${m.daChuyen}, ${JSON.stringify(m.chuyenTheoLyDo)}`);
  await may.dung();
}

console.log("\n--- 4. Dừng êm: một yêu cầu đang xử lý (mô hình chậm 400 ms) thì dịch vụ nhận lệnh dừng");
{
  const { may, goc, gui } = await khoiDong({ DO_TRE_MO_HINH_MS: "400" });
  const dangXuLy = gui("c-01", "quán có món gì?");
  await new Promise((r) => setTimeout(r, 100));
  const batDau = Date.now();
  const dungXong = may.dung(200).then(() => Date.now() - batDau);
  await new Promise((r) => setTimeout(r, 50));
  console.log(`/readyz lúc đang dừng: ${(await fetch(`${goc}/readyz`).catch(() => null))?.status ?? "kết nối bị từ chối"}`);
  console.log(`Yêu cầu đang xử lý lúc dừng: trả về ${await dangXuLy}`);
  console.log(`Dịch vụ dừng hẳn sau ${await dungXong} ms kể từ lệnh dừng (chờ yêu cầu đó xong)`);
  console.log(`Yêu cầu mới sau khi dừng: ${(await gui("c-02", "xin chào").catch((l: Error) => `lỗi kết nối (${(l.cause as { code?: string } | undefined)?.code ?? l.message})`))}`);
}
