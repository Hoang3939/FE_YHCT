"use client";

import React from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Bell, Download, RefreshCw, Calendar as CalendarIcon, ChevronDown } from "lucide-react";

/**
 * AdminHeader Component
 * Header topbar hiển thị tiêu đề, ngày tháng hiện tại, nút xuất báo cáo và thông báo
 */
export const AdminHeader = () => {
  const activeSegment = useSelectedLayoutSegment();

  const pageMeta: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: "Tổng quan hệ thống",
      subtitle: "Thứ Ba, 03/03/2026 - Dữ liệu thời gian thực",
    },
    users: {
      title: "Quản lý người dùng",
      subtitle: "Theo dõi tài khoản, trạng thái hoạt động và phân quyền người dùng",
    },
    documents: {
      title: "Quản lý tài liệu",
      subtitle: "Quản lý tài nguyên tri thức, tệp tải lên và trạng thái xử lý dữ liệu",
    },
    pipeline: {
      title: "Vận hành Pipeline",
      subtitle: "Giám sát tiến trình xử lý, hàng đợi tác vụ và hiệu suất hệ thống",
    },
    contributions: {
      title: "Duyệt đóng góp",
      subtitle: "Xét duyệt nội dung cộng đồng gửi lên và phản hồi cho người đóng góp",
    },
    feedbacks: {
      title: "Góp ý",
      subtitle: "Theo dõi phản hồi hệ thống, ý kiến người dùng và các đề xuất cải tiến",
    },
    settings: {
      title: "Cấu hình hệ thống",
      subtitle: "Quản lý thông số vận hành, quyền hạn và thiết lập nền tảng",
    },
  };

  const currentPage = activeSegment ? pageMeta[activeSegment] : pageMeta.dashboard;
  const title = currentPage?.title ?? pageMeta.dashboard.title;
  const subtitle = currentPage?.subtitle ?? pageMeta.dashboard.subtitle;

  return (
    <header className="sticky top-0 z-10 w-full border-b border-gray-100 bg-white px-4 py-4 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* Title & Date */}
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 lg:text-2xl">{title}</h1>
          <p className="mt-1 max-w-[28rem] text-sm leading-6 text-gray-500 lg:max-w-none">{subtitle}</p>
        </div>
 
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          {/* Month Dropdown Selector */}
          <div className="relative">
            <button className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 lg:px-4">
              <CalendarIcon size={16} className="text-gray-400" />
              <span className="whitespace-nowrap">Tháng 3, 2026</span>
              <ChevronDown size={16} className="ml-1 text-gray-400" />
            </button>
          </div>
 
          {/* Refresh Button */}
          <Button variant="icon" title="Làm mới dữ liệu">
            <RefreshCw size={18} />
          </Button>
 
          {/* Export Button */}
          <Button variant="outline" className="gap-2 px-3 text-sm lg:px-4">
            <Download size={16} />
            <span className="whitespace-nowrap">Xuất báo cáo</span>
          </Button>
 
          {/* Notifications */}
          <div className="relative">
            <Button variant="icon" className="relative">
              <Bell size={18} />
              <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full border border-white bg-red-500"></span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
