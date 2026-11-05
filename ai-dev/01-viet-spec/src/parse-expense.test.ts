// Mỗi dòng trong bảng "Quy tắc đọc số tiền" của SPEC.md là một test.
import assert from "node:assert/strict";
import { test } from "node:test";

import { parseExpense } from "./parse-expense.ts";

const ok: [string, string, number][] = [
  ["cà phê 35k", "cà phê", 35000],
  ["cơm trưa 45.000", "cơm trưa", 45000],
  ["xăng 50000", "xăng", 50000],
  ["tiền nhà 3tr", "tiền nhà", 3000000],
  ["điện thoại 1tr2", "điện thoại", 1200000],
  ["trà sữa 32K", "trà sữa", 32000],
  ["35k cà phê", "cà phê", 35000],
];

for (const [message, note, amount] of ok) {
  test(`đọc được "${message}"`, () => {
    assert.deepEqual(parseExpense(message), { note, amount });
  });
}

for (const message of ["cà phê", "cà phê 0k", "cà phê 35k 40k", "35k"]) {
  test(`không hiểu "${message}"`, () => {
    assert.equal(parseExpense(message), null);
  });
}
