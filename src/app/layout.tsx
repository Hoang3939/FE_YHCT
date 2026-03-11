import './globals.css';

export const metadata = {
  title: 'Y-RAG - Nền tảng Y học cổ truyền',
  description: 'Tra cứu Y học cổ truyền minh xác với AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
