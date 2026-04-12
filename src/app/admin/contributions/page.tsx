import type { Metadata } from "next";
import ContributionsPageClient from "./ContributionsPageClient";

export const metadata: Metadata = {
  title: "Duyệt đóng góp | Y-RAG Admin",
  description: "Quản lý và duyệt đóng góp tri thức từ cộng đồng",
};

/**
 * ContributionsPage — Server Component
 * Entry point cho route /admin/contributions.
 * Metadata SEO tại đây, state/interaction delegate xuống ContributionsPageClient.
 */
export default function ContributionsPage() {
  return <ContributionsPageClient />;
}
