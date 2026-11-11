import type { Khoi } from "./markdown-an-toan.ts";
import { tachManh } from "./markdown-an-toan.ts";

// Mỗi khối thành một phần tử React. Chữ của tác giả luôn là "con" của phần tử, nên React tự thoát ký tự đặc biệt.
function ChuTrongDong({ chu }: { chu: string }) {
  return (
    <>
      {tachManh(chu).map((manh, i) => {
        switch (manh.loai) {
          case "dam":
            return <strong key={i}>{manh.chu}</strong>;
          case "code":
            return <code key={i}>{manh.chu}</code>;
          case "lien-ket":
            return (
              <a href={manh.href} key={i} rel="noopener noreferrer">
                {manh.chu}
              </a>
            );
          default:
            return manh.chu;
        }
      })}
    </>
  );
}

export function XemTruoc({ khoi }: { khoi: Khoi[] }) {
  return (
    <>
      {khoi.map((k, i) => {
        switch (k.loai) {
          case "tieu-de":
            return k.muc === 2 ? <h2 key={i}><ChuTrongDong chu={k.chu} /></h2> : <h3 key={i}><ChuTrongDong chu={k.chu} /></h3>;
          case "danh-sach":
            return <ul key={i}>{k.muc.map((m, j) => <li key={j}><ChuTrongDong chu={m} /></li>)}</ul>;
          case "code":
            return <pre key={i}><code>{k.ma}</code></pre>;
          default:
            return <p key={i}><ChuTrongDong chu={k.chu} /></p>;
        }
      })}
    </>
  );
}
