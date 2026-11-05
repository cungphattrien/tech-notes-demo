// Một bản cài đặt kiểu "tự đoán" — loại code hợp lý mà một prompt mơ hồ dễ cho ra:
// lấy số đầu tiên, thấy chữ "k" thì nhân nghìn, phần còn lại là ghi chú.
// Viết để minh họa; chạy file này để chấm nó bằng bảng ví dụ trong SPEC.md.
export function parseGuess(message: string) {
  const match = message.match(/[\d.,]+/);
  if (!match) return null;
  let amount = parseFloat(match[0]);
  if (/k/i.test(message)) amount *= 1000;
  if (/tr/i.test(message)) amount *= 1_000_000;
  return { note: message.replace(/[\d.,]+\w*/, "").trim(), amount };
}

const table: [string, { note: string; amount: number } | null][] = [
  ["cà phê 35k", { note: "cà phê", amount: 35000 }],
  ["cơm trưa 45.000", { note: "cơm trưa", amount: 45000 }],
  ["xăng 50000", { note: "xăng", amount: 50000 }],
  ["tiền nhà 3tr", { note: "tiền nhà", amount: 3000000 }],
  ["điện thoại 1tr2", { note: "điện thoại", amount: 1200000 }],
  ["trà sữa 32K", { note: "trà sữa", amount: 32000 }],
  ["35k cà phê", { note: "cà phê", amount: 35000 }],
  ["cà phê", null],
  ["cà phê 0k", null],
  ["cà phê 35k 40k", null],
];

let pass = 0;
for (const [message, expected] of table) {
  const got = parseGuess(message);
  const ok = JSON.stringify(got) === JSON.stringify(expected);
  if (ok) pass += 1;
  console.log(`${ok ? "✓" : "✗"} ${message.padEnd(16)} → ${JSON.stringify(got)}`);
}
console.log(`\nĐúng ${pass}/${table.length} dòng của bảng.`);
