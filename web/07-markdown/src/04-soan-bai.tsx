// Dựng ô soạn bài một lần với bài chứa mã độc, để thấy phần xem trước ra sao. Trong Next.js, SoanBai là Client Component.
import { renderToString } from "react-dom/server";

import { BAI_DOC_HAI } from "./bai-doc-hai.ts";
import { SoanBai } from "./soan-bai.tsx";

console.log(renderToString(<SoanBai banDau={BAI_DOC_HAI} />));
