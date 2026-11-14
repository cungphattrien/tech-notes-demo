"use client";

import { useRef, useState } from "react";

import { DocSse } from "../lib/sse.js";

// Khung chat: gửi tin tới /api/chat, đọc luồng SSE và nối từng mảnh vào câu trả lời đang hiện.
export function KhungChat() {
  const [tin, setTin] = useState("");
  const [cauTraLoi, setCauTraLoi] = useState("");
  const [dangNhan, setDangNhan] = useState(false);
  const dieuKhien = useRef(null);

  async function gui(suKienForm) {
    suKienForm.preventDefault();
    dieuKhien.current?.abort(); // khách gửi tin mới thì bỏ luồng cũ
    dieuKhien.current = new AbortController();
    setCauTraLoi("");
    setDangNhan(true);
    try {
      const phanHoi = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tin }),
        signal: dieuKhien.current.signal,
      });
      const boDoc = phanHoi.body.getReader();
      // stream: true để TextDecoder giữ lại byte của một ký tự bị cắt đôi giữa hai chunk.
      const giaiMa = new TextDecoder("utf-8");
      const docSse = new DocSse();
      for (;;) {
        const { value, done } = await boDoc.read();
        if (done) break;
        for (const suKien of docSse.push(giaiMa.decode(value, { stream: true }))) {
          if (suKien.ten === "delta") setCauTraLoi((truoc) => truoc + suKien.duLieu.text);
        }
      }
    } catch (loi) {
      if (loi.name !== "AbortError") setCauTraLoi("Xin lỗi, có lỗi xảy ra. Bạn thử lại giúp quán nhé.");
    } finally {
      setDangNhan(false);
    }
  }

  return (
    <form onSubmit={gui}>
      <label>
        Tin nhắn
        <input onChange={(e) => setTin(e.target.value)} value={tin} />
      </label>
      <button disabled={dangNhan} type="submit">
        Gửi
      </button>
      <p aria-live="polite">{cauTraLoi}</p>
    </form>
  );
}
