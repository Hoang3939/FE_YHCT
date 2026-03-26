import type { Metadata } from "next";
import DocumentsPageClient from "./DocumentsPageClient";

export const metadata: Metadata = {
  title: "Quản lý tài liệu | Y-RAG Admin",
  description: "Bài thuốc & Dược liệu cổ truyền — Quản lý và kiểm duyệt nội dung RAG",
};

/**
 * DocumentsPage — Server Component
 * Entry point cho route /documents. Metadata SEO tại đây,
 * state/interaction delegate xuống DocumentsPageClient.
 */
export default function DocumentsPage() {
  return <DocumentsPageClient />;
}
