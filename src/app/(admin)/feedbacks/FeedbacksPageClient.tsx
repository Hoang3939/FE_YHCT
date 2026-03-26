"use client";

import React, { useState } from "react";
import { FeedbackSummaryCards }      from "@/features/feedbacks/FeedbackSummaryCards";
import { FeedbackStatusBar }         from "@/features/feedbacks/FeedbackStatusBar";
import { FeedbackList }              from "@/features/feedbacks/FeedbackList";
import { FeedbackDetailPlaceholder } from "@/features/feedbacks/FeedbackDetailPlaceholder";

/**
 * FeedbacksPageClient
 * Client component lắp ráp toàn bộ trang Góp ý hệ thống.
 * Layout bố cục:
 *   1. FeedbackSummaryCards  (6 thẻ thống kê)
 *   2. FeedbackStatusBar     (thanh nền tối ONLINE)
 *   3. Split View 65/35:
 *      - FeedbackList        (danh sách, search, tabs, sort)
 *      - FeedbackDetailPlaceholder (placeholder cột phải)
 */
const FeedbacksPageClient = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-0 max-w-[1600px] mx-auto">
      {/* Row 1: Stats */}
      <FeedbackSummaryCards />

      {/* Row 2: Status bar */}
      <FeedbackStatusBar />

      {/* Row 3: Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-4 items-start">
        {/* Left: List */}
        <FeedbackList selectedId={selectedId} onSelect={setSelectedId} />

        {/* Right: Detail placeholder */}
        <FeedbackDetailPlaceholder />
      </div>
    </div>
  );
};

export default FeedbacksPageClient;
