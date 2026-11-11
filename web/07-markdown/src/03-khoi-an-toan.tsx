// Cách thứ ba: Markdown sang khối có kiểu, rồi sang phần tử React. Không có bước nào tạo ra chuỗi HTML.
import { renderToStaticMarkup } from "react-dom/server";

import { BAI_DOC_HAI } from "./bai-doc-hai.ts";
import { parseMarkdown } from "./markdown-an-toan.ts";
import { XemTruoc } from "./xem-truoc.tsx";

const khoi = parseMarkdown(BAI_DOC_HAI);
for (const k of khoi) console.log(JSON.stringify(k));
console.log("\n" + renderToStaticMarkup(<XemTruoc khoi={khoi} />));
