import React from "react";
import { Button } from "@/components/ui/Button";
import { Bell, Download, RefreshCw, Calendar as CalendarIcon, ChevronDown } from "lucide-react";

/**
 * AdminHeader Component
 * Header topbar hiển thị tiêu đề, ngày tháng hiện tại, nút xuất báo cáo và thông báo
 */
export const AdminHeader = () => {
  // Mock current date format like wireframe: "Thứ Ba, 03/03/2026 - Dữ liệu thời gian thực"
  const formattedDate = "Thứ Ba, 03/03/2026 - Dữ liệu thời gian thực";

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      {/* Title & Date */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tổng quan hệ thống</h1>
        <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Month Dropdown Selector */}
        <div className="relative">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 h-10 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <CalendarIcon size={16} className="text-gray-400" />
            Tháng 3, 2026
            <ChevronDown size={16} className="text-gray-400 ml-1" />
          </button>
        </div>

        {/* Refresh Button */}
        <Button variant="icon" title="Làm mới dữ liệu">
          <RefreshCw size={18} />
        </Button>

        {/* Export Button */}
        <Button variant="outline" className="gap-2">
          <Download size={16} />
          Xuất báo cáo
        </Button>

        {/* Notifications */}
        <div className="relative ml-2">
          <Button variant="icon" className="relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </Button>
        </div>
      </div>
    </header>
  );
};
