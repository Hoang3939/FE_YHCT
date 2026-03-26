import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Y-RAG - Nền tảng Y học cổ truyền",
  description: "Tra cứu Y học cổ truyền minh xác với AI",
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
