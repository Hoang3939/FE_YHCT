"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Bell, RefreshCw, Calendar as CalendarIcon, Menu } from "lucide-react";

interface AdminHeaderProps {
  onOpenSidebar?: () => void;
}

export const AdminHeader = ({ onOpenSidebar }: AdminHeaderProps) => {
  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-20 w-full border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 lg:hidden"
            aria-label="Mở thanh điều hướng quản trị"
          >
            <Menu size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">Tổng quan hệ thống</h1>
            <p className="mt-1 text-sm text-gray-500">{formattedDate} · Dữ liệu vận hành đang được đồng bộ</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm md:flex">
            <CalendarIcon size={16} className="text-gray-400" />
            Hôm nay
          </div>

          <Button variant="icon" title="Làm mới dữ liệu">
            <RefreshCw size={18} />
          </Button>

          <div className="relative">
            <Button variant="icon" className="relative" title="Thông báo hệ thống">
              <Bell size={18} />
              <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full border border-white bg-red-500"></span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
