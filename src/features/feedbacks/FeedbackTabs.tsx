"use client";

import React from "react";
import type { FeedbackStatus } from "@/types/feedback";
import { cn } from "@/lib/utils";

export type FeedbackTabKey = "all" | FeedbackStatus;

const TABS: { key: FeedbackTabKey; label: string; count: number }[] = [
  { key: "all",           label: "Tất cả",        count: 8 },
  { key: "Chờ duyệt",    label: "Chờ duyệt",     count: 3 },
  { key: "Đang xem xét", label: "Đang xem xét",  count: 2 },
  { key: "Đã duyệt",     label: "Đã duyệt",      count: 2 },
  { key: "Từ chối",      label: "Từ chối",        count: 1 },
];

interface FeedbackTabsProps {
  activeTab: FeedbackTabKey;
  onTabChange: (tab: FeedbackTabKey) => void;
}

/**
 * FeedbackTabs Component
 * Tab điều hướng dạng Pill lọc theo trạng thái góp ý
 */
export const FeedbackTabs = ({ activeTab, onTabChange }: FeedbackTabsProps) => (
  <div className="flex items-center gap-1.5 flex-wrap">
    {TABS.map((tab) => (
      <button
        key={tab.key}
        onClick={() => onTabChange(tab.key)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
          activeTab === tab.key
            ? "bg-gray-800 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
      >
        {tab.label}
        <span className={cn(
          "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
          activeTab === tab.key ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-500"
        )}>
          {tab.count}
        </span>
      </button>
    ))}
  </div>
);
