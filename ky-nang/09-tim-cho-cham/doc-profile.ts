// Đọc file .cpuprofile do `node --cpu-prof` ghi ra và in các hàm tốn nhiều thời gian nhất (thời gian "riêng": không tính hàm con).
// Chạy: node doc-profile.ts <file.cpuprofile>
import { readFileSync } from "node:fs";

type Node = { id: number; callFrame: { functionName: string; url: string; lineNumber: number } };
type Profile = { nodes: Node[]; samples: number[]; timeDeltas: number[] };

const file = process.argv[2];
if (!file) throw new Error("Cách dùng: node doc-profile.ts <file.cpuprofile>");
const profile: Profile = JSON.parse(readFileSync(file, "utf8"));

const nodeTheoId = new Map(profile.nodes.map((node) => [node.id, node]));
const microGiayTheoHam = new Map<string, number>();
// Mẫu thứ i kéo dài timeDeltas[i + 1] micro giây (đến lần lấy mẫu kế tiếp).
profile.samples.forEach((nodeId, i) => {
  const { functionName, url, lineNumber } = nodeTheoId.get(nodeId)!.callFrame;
  const ten = `${functionName || "(vô danh)"} ${url.split("/").slice(-2).join("/")}:${lineNumber + 1}`;
  microGiayTheoHam.set(ten, (microGiayTheoHam.get(ten) ?? 0) + (profile.timeDeltas[i + 1] ?? 0));
});

const tong = [...microGiayTheoHam.values()].reduce((a, b) => a + b, 0);
const top = [...microGiayTheoHam].sort((a, b) => b[1] - a[1]).slice(0, 5);
for (const [ten, microGiay] of top) console.log(`${String(Math.round(microGiay / 1000)).padStart(6)} ms  ${((microGiay / tong) * 100).toFixed(1).padStart(5)}%  ${ten}`);
