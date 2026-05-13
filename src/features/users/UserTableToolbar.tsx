"use client";

import React from "react";
import { Search, SlidersHorizontal, Download, Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export type TabFilter = "all" | "user";

interface UserTableToolbarProps {
  /** Giá trị search hiện tại */
  searchQuery: string;
  /** Callback khi search thay đổi */
  onSearch: (value: string) => void;
  /** Tab filter đang active */
  activeTab: TabFilter;
  /** Callback khi đổi tab */
  onTabChange: (tab: TabFilter) => void;
}

/**
 * UserTableToolbar Component
 * Thanh công cụ phía trên bảng: search, filter chips, actions
 */
export const UserTableToolbar = ({
  searchQuery,
  onSearch,
  activeTab,
  onTabChange,
}: UserTableToolbarProps) => {
  const tabs: { key: TabFilter; label: string }[] = [
    { key: "all", label: "Tất cả" },
    { key: "user", label: "Người dùng" },
  ];

  return (
    <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center">
      {/* Search Input */}
      <div className="w-full xl:max-w-xs">
        <Input
          leftIcon={<Search size={15} />}
          placeholder="Tên, email, id..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center xl:w-auto xl:flex-1">
        {/* Filter button */}
        <Button variant="outline" className="h-10 gap-2 whitespace-nowrap">
          <SlidersHorizontal size={15} />
          Bộ lọc
        </Button>

        {/* Tab Chips */}
        <div className="flex w-full flex-wrap items-center gap-1.5 rounded-lg bg-gray-100 p-1 lg:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap lg:ml-auto lg:w-auto lg:justify-end">
          <Button variant="outline" className="h-10 gap-2 whitespace-nowrap">
            <Download size={15} />
            Xuất CSV
          </Button>
          <Button className="h-10 gap-2 whitespace-nowrap">
            <Plus size={15} />
            Thêm người dùng
          </Button>
        </div>
      </div>
    </div>
  );
};
