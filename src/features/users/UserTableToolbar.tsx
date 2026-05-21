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
  /** Callback khi xuất CSV */
  onExportCSV?: () => void | Promise<void>;
  /** Callback khi nhấn Thêm người dùng */
  onAddUser?: () => void;
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
  onExportCSV,
  onAddUser,
}: UserTableToolbarProps) => {
  const tabs: { key: TabFilter; label: string }[] = [
    { key: "all", label: "Tất cả" },
    { key: "user", label: "Người dùng" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {/* Search Input */}
      <div className="w-full sm:w-72">
        <Input
          leftIcon={<Search size={15} />}
          placeholder="Tên, email, id..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Filter button */}
      <Button variant="outline" className="gap-2 whitespace-nowrap h-10">
        <SlidersHorizontal size={15} />
        Bộ lọc
      </Button>

      {/* Tab Chips */}
      <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
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
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" className="gap-2 whitespace-nowrap h-10" onClick={onExportCSV}>
          <Download size={15} />
          Xuất CSV
        </Button>
        <Button className="gap-2 whitespace-nowrap h-10" onClick={onAddUser}>
          <Plus size={15} />
          Thêm người dùng
        </Button>
      </div>
    </div>
  );
};
