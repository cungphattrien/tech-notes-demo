// Cách chấm đầu tiên (và sai): so nguyên văn câu trả lời của v2 với v1. Chạy: node so-nguyen-van.ts
import { chayAgent, type PhienBan } from "./src/agent.ts";
import { CAC_CA, type Ca } from "./src/ca-thu.ts";

const traLoi = (phienBan: PhienBan, ca: Ca) => chayAgent(ca.soDienThoai, ca.tin, phienBan, () => 0.5).traLoi; // 0.5: mô hình không "lười"

console.log("Hai tin thường ngày của v2, nhìn bằng mắt:");
for (const ca of CAC_CA.filter((c) => c.nhom === "thường ngày").slice(0, 2)) console.log(`  khách: ${ca.tin}\n  v2:    ${traLoi("v2", ca)}`);
const khac = CAC_CA.filter((ca) => traLoi("v1", ca) !== traLoi("v2", ca));
console.log(`\nSo nguyên văn v1 với v2: ${khac.length}/${CAC_CA.length} ca khác nhau`);
