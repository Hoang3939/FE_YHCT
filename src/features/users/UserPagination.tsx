"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface UserPaginationProps {
  /** Tổng số records */
  total: number;
  /** Trang hiện tại (1-indexed) */
  currentPage: number;
  /** Số dòng mỗi trang */
  pageSize: number;
  /** Callback khi đổi trang */
  onPageChange: (page: number) => void;
  /** Callback khi đổi page size */
  onPageSizeChange: (size: number) => void;
}

/**
 * UserPagination Component
 * Thanh phân trang: dropdown số dòng/trang, text tổng, nút prev/next và số trang
 */
export const UserPagination = ({
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: UserPaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);

  // Tạo mảng số trang để render
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
      {/* Left: rows per page + summary */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span>Hiển thị</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="h-8 px-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
          >
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span>/ trang</span>
        </div>
        <span className="text-gray-400">|</span>
        <span>
          Hiển thị <strong className="text-gray-800">{from}-{to}</strong> / <strong className="text-gray-800">{total}</strong> người dùng
        </span>
      </div>

      {/* Right: page buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg"
        >
          <ChevronLeft size={16} />
        </Button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-emerald-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};
