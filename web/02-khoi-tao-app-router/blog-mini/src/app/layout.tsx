import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
};

// Root layout: bắt buộc có <html> và <body>, bọc mọi trang của website.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <header>
          <Link href="/">{site.name}</Link>
          <nav>
            <Link href="/bai-viet">Bài viết</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
