import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Y-RAG Admin Dashboard",
  description: "Hệ thống quản trị Y-RAG - Tra cứu y học cổ truyền thông minh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
