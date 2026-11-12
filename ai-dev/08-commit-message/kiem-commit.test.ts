import assert from "node:assert/strict";
import { test } from "node:test";

import { checkCommit, MAX_SUBJECT } from "./kiem-commit.ts";

const commit = (subject: string, body = "") => ({ hash: "abc1234", subject, body });

test("tiêu đề mơ hồ như 'fix' hay 'ok' bị báo", () => {
  for (const subject of ["fix", "ok", "update", "xong", "fix tiếp", "sửa lại"]) {
    assert.match(checkCommit(commit(subject)).join(), /mơ hồ/, subject);
  }
});

test("tiêu đề đúng dạng, có thân: không vấn đề nào", () => {
  assert.deepEqual(checkCommit(commit("feat(bot): cập nhật khoản chi khi sửa tin nhắn", "Vì sao: ...")), []);
});

test("feat và fix cần phần thân, docs thì không", () => {
  assert.match(checkCommit(commit("fix(bot): không dừng khi lỗi")).join(), /thiếu phần thân/);
  assert.deepEqual(checkCommit(commit("docs: sửa lỗi chính tả trong README")), []);
});

test("tiêu đề dài hơn giới hạn bị báo", () => {
  const dai = `docs: ${"a".repeat(MAX_SUBJECT)}`;
  assert.match(checkCommit(commit(dai)).join(), /tối đa 72/);
});
