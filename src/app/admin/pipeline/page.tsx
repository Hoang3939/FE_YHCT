import type { Metadata } from "next";
import PipelinePageClient from "./PipelinePageClient";

export const metadata: Metadata = {
  title: "Vận hành Pipeline RAG | Y-RAG Admin",
  description: "Xử lý dữ liệu và vector hóa — Giám sát và điều khiển pipeline RAG",
};

/**
 * PipelinePage — Server Component
 * Entry point cho route /pipeline. Giữ metadata SEO,
 * delegate toàn bộ UI xuống PipelinePageClient.
 */
export default function PipelinePage() {
  return <PipelinePageClient />;
}
