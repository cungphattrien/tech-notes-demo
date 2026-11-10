// Kiểm chứng các khẳng định về Intl.DateTimeFormat trong hàm thangVN.
const d = new Date("2026-12-01T06:30+07:00");
const opts = { timeZone: "Asia/Ho_Chi_Minh", month: "2-digit", year: "numeric" } as const;
console.log("en-GB parts:", JSON.stringify(new Intl.DateTimeFormat("en-GB", opts).formatToParts(d)));
console.log("vi-VN parts:", JSON.stringify(new Intl.DateTimeFormat("vi-VN", opts).formatToParts(d)));
console.log("vi-VN format:", new Intl.DateTimeFormat("vi-VN", opts).format(d), "| en-US format:", new Intl.DateTimeFormat("en-US", opts).format(d));
console.log("không có timeZone, TZ=", process.env.TZ, ":", new Intl.DateTimeFormat("en-GB", { month: "2-digit", year: "numeric" }).format(d));
