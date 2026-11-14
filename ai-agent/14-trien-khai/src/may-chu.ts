// Máy chủ HTTP bọc quanh tổng đài của tập 13: nhận tin của khách, và có đủ những thứ một dịch vụ chạy thật cần:
// kiểm tra sức khỏe, giới hạn tần suất, giới hạn kích thước, công tắc tắt agent, số đo, và dừng êm.
import { timingSafeEqual } from "node:crypto";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import type { CauHinh } from "./cau-hinh.ts";
import type { NhatKy } from "./nhat-ky.ts";
import type { SoDo } from "./so-do.ts";
import type { TongDai } from "./tong-dai.ts";

export type MayChu = { server: Server; dung: (docChoMs?: number) => Promise<void> };

const MA_HOI_THOAI = /^[\w-]{1,64}$/;
const TOI_DA_THAN_BYTE = 10_000;
const chờ = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function gui(res: ServerResponse, ma: number, noiDung: unknown): void {
  res.writeHead(ma, { "content-type": "application/json; charset=utf-8" }).end(JSON.stringify(noiDung));
}

async function docThan(req: IncomingMessage): Promise<string | null> {
  let tong = 0;
  const manh: Buffer[] = [];
  for await (const m of req) {
    tong += (m as Buffer).length;
    if (tong > TOI_DA_THAN_BYTE) return null;
    manh.push(m as Buffer);
  }
  return Buffer.concat(manh).toString("utf8");
}

export function taoMayChu(opts: { cauHinh: CauHinh; tongDai: TongDai; soDo: SoDo; nhatKy: NhatKy; gio?: () => number }): MayChu {
  const { cauHinh, tongDai, soDo, nhatKy } = opts;
  const gio = opts.gio ?? Date.now;
  const luotGanDay = new Map<string, number[]>(); // maHoiThoai → các mốc thời gian trong 60 giây qua
  let dangDung = false;

  const khoaQuanTriDung = (header: string | string[] | undefined) => {
    const nhan = Buffer.from(typeof header === "string" ? header : "");
    const that = Buffer.from(cauHinh.ADMIN_KEY);
    return nhan.length === that.length && timingSafeEqual(nhan, that);
  };

  const quaGioiHan = (ma: string): boolean => {
    const bay = gio();
    const cacLuot = (luotGanDay.get(ma) ?? []).filter((t) => bay - t < 60_000);
    if (cacLuot.length >= cauHinh.GIOI_HAN_MOI_PHUT) {
      luotGanDay.set(ma, cacLuot);
      return true;
    }
    cacLuot.push(bay);
    luotGanDay.set(ma, cacLuot);
    return false;
  };

  async function xuLyTin(req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (dangDung) return gui(res, 503, { loi: "dang-dung" });
    const than = await docThan(req);
    if (than === null) {
      soDo.tuChoiDoDai++;
      return gui(res, 413, { loi: "than-qua-lon" });
    }
    let dauVao: { maHoiThoai?: unknown; tin?: unknown };
    try {
      dauVao = JSON.parse(than);
    } catch {
      return gui(res, 400, { loi: "json-sai" });
    }
    const { maHoiThoai, tin } = dauVao;
    if (typeof maHoiThoai !== "string" || !MA_HOI_THOAI.test(maHoiThoai)) return gui(res, 400, { loi: "ma-hoi-thoai-sai" });
    if (typeof tin !== "string" || tin.trim() === "") return gui(res, 400, { loi: "tin-rong" });
    if (tin.length > cauHinh.MAX_DO_DAI_TIN) {
      soDo.tuChoiDoDai++;
      nhatKy.ghi({ loai: "tu-choi-do-dai", maHoiThoai, doDai: tin.length });
      return gui(res, 413, { loi: "tin-qua-dai", toiDa: cauHinh.MAX_DO_DAI_TIN });
    }
    if (quaGioiHan(maHoiThoai)) {
      soDo.tuChoiGioiHan++;
      nhatKy.ghi({ loai: "tu-choi-gioi-han", maHoiThoai });
      return gui(res, 429, { loi: "qua-nhieu-tin", thuLaiSau: "60s" });
    }

    soDo.tinNhan++;
    const batDau = gio();
    if (cauHinh.DO_TRE_MO_HINH_MS > 0) await chờ(cauHinh.DO_TRE_MO_HINH_MS); // chỗ dịch vụ thật sẽ gọi mô hình
    const truoc = tongDai.phieu.length;
    const daChuyenTruoc = (tongDai.hoiThoai.get(maHoiThoai)?.trangThai ?? "agent") !== "agent";
    const traLoi = cauHinh.AGENT_TAT ? tongDai.chuyenThang(maHoiThoai, tin) : tongDai.khach(maHoiThoai, tin);
    if (tongDai.phieu.length > truoc) soDo.ghiChuyen(tongDai.phieu[tongDai.phieu.length - 1]!.lyDo);
    else if (daChuyenTruoc) soDo.daImLang++; // cuộc trò chuyện đang ở chỗ người thật, agent chỉ nhắn "đã chuyển rồi"
    else soDo.daTraLoi++;
    soDo.ghiDoTre(gio() - batDau);
    gui(res, 200, { traLoi });
  }

  const server = createServer(async (req, res) => {
    try {
      if (req.url === "/healthz" && req.method === "GET") return gui(res, 200, { ok: true }); // tiến trình còn sống
      if (req.url === "/readyz" && req.method === "GET") return gui(res, dangDung ? 503 : 200, { san_sang: !dangDung });
      if (req.url === "/metrics" && req.method === "GET") {
        if (!khoaQuanTriDung(req.headers["x-admin-key"])) return gui(res, 401, { loi: "sai-khoa" });
        return gui(res, 200, { agentTat: cauHinh.AGENT_TAT, ...soDo.tongHop() });
      }
      if (req.url === "/tin" && req.method === "POST") return await xuLyTin(req, res);
      gui(res, 404, { loi: "khong-co" });
    } catch (loi) {
      soDo.loiNoiBo++;
      nhatKy.ghi({ loai: "loi-noi-bo", thongBao: loi instanceof Error ? loi.message : "không rõ" });
      if (!res.headersSent) gui(res, 500, { loi: "loi-noi-bo" }); // khách không thấy stack trace
    }
  });

  /**
   * Dừng êm. Bước 1: đánh dấu "chưa sẵn sàng" (/readyz trả 503) rồi đợi `docChoMs` để bộ cân bằng tải kịp ngừng gửi việc tới.
   * Bước 2: ngừng nhận kết nối mới và đợi các yêu cầu đang xử lý xong. Kết nối đã xong việc nhưng còn mở (keep-alive)
   * phải được đóng liên tục, nếu không server.close() sẽ đợi hết thời gian giữ kết nối của Node.
   */
  const dung = async (docChoMs = 0) => {
    dangDung = true;
    if (docChoMs > 0) await chờ(docChoMs);
    await new Promise<void>((xong, hong) => {
      const vong = setInterval(() => server.closeIdleConnections(), 50);
      server.close((loi) => {
        clearInterval(vong);
        loi ? hong(loi) : xong();
      });
    });
  };

  return { server, dung };
}
