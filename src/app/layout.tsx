import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/toast/ToastContext";

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
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
