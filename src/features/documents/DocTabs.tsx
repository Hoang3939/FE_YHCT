"use client";

import React from "react";
import type { DocType } from "@/types/document";
import { cn } from "@/lib/utils";

export type DocTabKey = "all" | DocType;

interface DocTabsProps {
  activeTab: DocTabKey;
  onTabChange: (tab: DocTabKey) => void;
}

const TABS: { key: DocTabKey; label: string }[] = [
  { key: "all",                    label: "Tất cả" },
  { key: "Bài thuốc",             label: "Bài thuốc" },
  { key: "Dược liệu",             label: "Dược liệu" },
  { key: "Phương pháp",           label: "Phương pháp" },
  { key: "Kinh nghiệm lâm sàng",  label: "Kinh nghiệm lâm sàng" },
];

/**
 * DocTabs Component
 * Tab điều hướng lọc theo loại tài liệu
 */
export const DocTabs = ({ activeTab, onTabChange }: DocTabsProps) => (
  <div className="flex items-center gap-1 border-b border-gray-100 pb-0 mb-4">
    {TABS.map((tab) => (
      <button
        key={tab.key}
        onClick={() => onTabChange(tab.key)}
        className={cn(
          "px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap",
          activeTab === tab.key
            ? "text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/60"
            : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
