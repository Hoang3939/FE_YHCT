import type { Metadata } from "next";
import FeedbacksPageClient from "./FeedbacksPageClient";

export const metadata: Metadata = {
  title: "Góp ý hệ thống | Y-RAG Admin",
  description: "Quản lý đóng góp cộng đồng — Xem xét và duyệt góp ý người dùng",
};

/**
 * FeedbacksPage — Server Component
 * Entry point cho route /feedbacks. Metadata SEO tại đây,
 * state/interaction delegate xuống FeedbacksPageClient.
 */
export default function FeedbacksPage() {
  return <FeedbacksPageClient />;
}
