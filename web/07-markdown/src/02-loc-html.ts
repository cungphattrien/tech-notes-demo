// Cách thứ hai: vẫn dùng marked, nhưng lọc HTML đầu ra bằng sanitize-html theo danh sách cho phép.
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

import { BAI_DOC_HAI } from "./bai-doc-hai.ts";

const html = marked.parse(BAI_DOC_HAI, { async: false });
console.log(
  sanitizeHtml(html, {
    allowedTags: ["h2", "h3", "p", "ul", "ol", "li", "strong", "code", "pre", "a", "blockquote"],
    allowedAttributes: { a: ["href"] },
    allowedSchemes: ["http", "https"],
  }),
);
