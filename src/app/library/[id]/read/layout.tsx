export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Override the library layout — reader has its own full-screen layout
  return <>{children}</>;
}
