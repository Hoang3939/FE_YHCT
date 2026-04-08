import type { Metadata } from "next";
import SettingsPageClient from "./SettingsPageClient";

export const metadata: Metadata = {
  title: "Cấu hình hệ thống | Y-RAG Admin",
  description: "Thiết lập RAG Engine, Bảo mật & Backup thông số hệ thống",
};

/**
 * SettingsPage — Server Component
 * Entry point cho route `/settings`, cung cấp metadata SEO SEO.
 * Logic form và navigation đều chuyển qua Client Component.
 */
export default function SettingsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cấu hình hệ thống</h1>
        <p className="text-sm text-gray-500 mt-1">Thiết lập RAG Engine, Bảo mật & Backup</p>
      </div>

      <SettingsPageClient />
    </>
  );
}
