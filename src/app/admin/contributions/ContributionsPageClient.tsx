"use client";

import { useState } from "react";
import { ContributionTable } from "@/features/contributions/ContributionTable";
import { ContributionDetailPanel } from "@/features/contributions/ContributionDetailPanel";

/**
 * ContributionsPageClient
 * Client component lắp ráp toàn bộ trang Duyệt đóng góp.
 * Layout: Split View 60/40
 *   - Trái: ContributionTable (danh sách, tabs, search)
 *   - Phải: ContributionDetailPanel (chi tiết + review actions cho expert)
 */
const ContributionsPageClient = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewed = () => {
    setRefreshKey((k) => k + 1);
    setSelectedId(null);
  };

  return (
    <div className="mx-auto flex max-w-[1600px] min-w-0 flex-col gap-4">
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[60%_40%]">
        {/* Left: List */}
        <ContributionTable
          key={refreshKey}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        {/* Right: Detail */}
        <ContributionDetailPanel
          contributionId={selectedId}
          onReviewed={handleReviewed}
        />
      </div>
    </div>
  );
};

export default ContributionsPageClient;
