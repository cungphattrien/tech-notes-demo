// "Mô hình" giả cho trường hợp xấu nhất: nghe theo mọi câu mệnh lệnh nó thấy, ở đâu cũng vậy (tin của khách hay kết quả công cụ).
// ĐÂY KHÔNG PHẢI MÔ HÌNH THẬT và không cho biết mô hình thật dễ bị dụ đến đâu. Mục đích: kiểm tra các lớp bảo vệ nằm trong code,
// vì chúng phải đứng vững ngay cả khi mô hình đã bị dụ.
export type TinNhan = { vaiTro: "khach" | "cong-cu"; noiDung: string };
export type DauRa = { loai: "van-ban"; noiDung: string } | { loai: "goi-cong-cu"; ten: "xem_don"; dauVao: { ma_don: string } };

const MENH_LENH_TRA_LOI = /hãy trả lời:\s*"([^"]+)"/i;
const MENH_LENH_TRA_DON = /hãy tra đơn (\d{4})/i;

export function moHinhDeDut(cacTin: TinNhan[]): DauRa {
  // Kết quả công cụ là JSON nên dấu ngoặc kép trong đó bị viết thành \"; đưa về dạng thường để đọc được câu lệnh nằm bên trong.
  const tatCa = cacTin.map((tin) => tin.noiDung).join("\n").replaceAll('\\"', '"');
  const tin = cacTin[cacTin.length - 1];

  if (tin.vaiTro === "cong-cu") {
    const lenh = tatCa.match(MENH_LENH_TRA_LOI);
    if (lenh) return { loai: "van-ban", noiDung: lenh[1] };
    try {
      const du = JSON.parse(tin.noiDung);
      if (du.ma_don) return { loai: "van-ban", noiDung: `Dạ đơn ${du.ma_don} của mình ${du.trang_thai}, gồm ${du.mon.join(", ")} ạ.` };
    } catch {
      /* kết quả công cụ không phải JSON: đó là thông báo lỗi, đọc lại nguyên văn bên dưới */
    }
    return { loai: "van-ban", noiDung: `Dạ ${tin.noiDung[0].toLowerCase()}${tin.noiDung.slice(1)}` };
  }

  const traDon = tin.noiDung.match(MENH_LENH_TRA_DON) ?? tin.noiDung.match(/đơn (\d{4}) .*(đâu|đã giao|khi nào)/i);
  if (traDon) return { loai: "goi-cong-cu", ten: "xem_don", dauVao: { ma_don: traDon[1] } };
  const lenh = tin.noiDung.match(MENH_LENH_TRA_LOI);
  if (lenh) return { loai: "van-ban", noiDung: lenh[1] };
  return { loai: "van-ban", noiDung: "Dạ em có thể giúp gì cho mình ạ?" };
}
