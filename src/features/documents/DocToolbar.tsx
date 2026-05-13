"use client";

import React from "react";
import { Search, SlidersHorizontal, LayoutGrid, List, Upload, Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { SortOption } from "@/types/document";
import { cn } from "@/lib/utils";

interface DocToolbarProps {
  searchQuery: string;
  onSearch: (v: string) => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (m: "grid" | "list") => void;
}

const SORT_CHIPS: { key: SortOption; label: string }[] = [
  { key: "newest",  label: "Mới nhất" },
  { key: "views",   label: "Lượt xem" },
  { key: "queries", label: "Truy vấn" },
  { key: "chunks",  label: "Chunks" },
];

/**
 * DocToolbar Component
 * Thanh công cụ gồm: search, bộ lọc, đổi view, import/thêm mới, và sort chips
 */
export const DocToolbar = ({
  searchQuery, onSearch,
  sortBy, onSortChange,
  viewMode, onViewModeChange,
}: DocToolbarProps) => (
  <div className="flex flex-col gap-3 mb-5">
    {/* Row 1: Search + actions */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="w-full sm:w-72">
        <Input
          leftIcon={<Search size={15} />}
          placeholder="Tìm kiếm tài liệu..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <Button variant="outline" className="gap-2 h-10 whitespace-nowrap">
        <SlidersHorizontal size={15} />
        Bộ lọc
      </Button>

      {/* View mode toggle */}
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        <button
          type="button"
          title="Chuyển sang chế độ xem lưới"
          aria-label="Chuyển sang chế độ xem lưới"
          onClick={() => onViewModeChange("grid")}
          className={cn(
            "p-2.5 transition-colors",
            viewMode === "grid" ? "bg-emerald-500 text-white" : "bg-white text-gray-400 hover:bg-gray-50"
          )}
        >
          <LayoutGrid size={16} />
        </button>
        <button
          type="button"
          title="Chuyển sang chế độ xem danh sách"
          aria-label="Chuyển sang chế độ xem danh sách"
          onClick={() => onViewModeChange("list")}
          className={cn(
            "p-2.5 transition-colors",
            viewMode === "list" ? "bg-emerald-500 text-white" : "bg-white text-gray-400 hover:bg-gray-50"
          )}
        >
          <List size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" className="gap-2 h-10 whitespace-nowrap">
          <Upload size={15} />
          Nhập file
        </Button>
        <Button className="gap-2 h-10 whitespace-nowrap">
          <Plus size={15} />
          Thêm tài liệu
        </Button>
      </div>
    </div>

    {/* Row 2: Sort chips */}
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-500 font-medium">Sắp xếp:</span>
      {SORT_CHIPS.map((chip) => (
        <button
          key={chip.key}
          onClick={() => onSortChange(chip.key)}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-full border transition-colors",
            sortBy === chip.key
              ? "bg-emerald-500 text-white border-emerald-500"
              : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
          )}
        >
          {chip.label}
        </button>
      ))}
    </div>
  </div>
);
