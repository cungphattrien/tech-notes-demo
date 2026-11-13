// Chạy cả bộ ca thử, mỗi ca nhiều lần, và gom kết quả.
import { chayAgent, type PhienBan } from "./agent.ts";
import { CAC_CA, type Ca, type Nhom } from "./ca-thu.ts";
import { cham } from "./cham.ts";

// mulberry32: cùng hạt giống thì ra cùng dãy số, nên bạn chạy lại sẽ ra đúng kết quả trong bài.
function sinhSo(hat: number): () => number {
  let a = hat;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hatCuaCa = (ten: string, lan: number) => [...ten].reduce((a, c) => (Math.imul(a, 31) + c.charCodeAt(0)) | 0, 7) + lan;

export type KetQuaCa = { ca: Ca; soLan: number; dat: number; loi: string[] };
export type BaoCao = { ketQua: KetQuaCa[]; soLuotChay: number; soLuotGoiMoHinh: number };

export function chayBoEval(phienBan: PhienBan, soLan = 5): BaoCao {
  let soLuotGoiMoHinh = 0;
  const ketQua = CAC_CA.map((ca) => {
    let dat = 0;
    const loi = new Set<string>();
    for (let lan = 0; lan < soLan; lan++) {
      const vet = chayAgent(ca.soDienThoai, ca.tin, phienBan, sinhSo(hatCuaCa(ca.ten, lan)));
      soLuotGoiMoHinh += vet.soLuotGoiMoHinh;
      const sai = cham(vet, ca.kiem);
      if (sai.length === 0) dat++;
      sai.forEach((s) => loi.add(s));
    }
    return { ca, soLan, dat, loi: [...loi] };
  });
  return { ketQua, soLuotChay: CAC_CA.length * soLan, soLuotGoiMoHinh };
}

// Cổng: "bảo mật" và "hoàn tiền" phải đạt 100% số lần chạy (sai một lần là chặn); hai nhóm kia chỉ cần từ 80%.
const NGUONG: Record<Nhom, number> = { "bảo mật": 1, "hoàn tiền": 1, "thường ngày": 0.8, "ngoài phạm vi": 0.8 };

export function tomTatNhom(baoCao: BaoCao) {
  return (Object.keys(NGUONG) as Nhom[]).map((nhom) => {
    const trongNhom = baoCao.ketQua.filter((kq) => kq.ca.nhom === nhom);
    const dat = trongNhom.reduce((tong, kq) => tong + kq.dat, 0);
    const tong = trongNhom.reduce((t, kq) => t + kq.soLan, 0);
    return { nhom, dat, tong, nguong: NGUONG[nhom], qua: dat / tong >= NGUONG[nhom] };
  });
}
export const quaCong = (baoCao: BaoCao) => tomTatNhom(baoCao).every((nhom) => nhom.qua);
