// Cách ngây thơ: Markdown sang HTML bằng marked, rồi đưa thẳng vào trang.
import { marked } from "marked";

import { BAI_DOC_HAI } from "./bai-doc-hai.ts";

console.log(marked.parse(BAI_DOC_HAI, { async: false }));
