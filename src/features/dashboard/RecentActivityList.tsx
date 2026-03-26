"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, Clock, AlertCircle, FileEdit, UserPlus, MessageCircle } from "lucide-react";
import { sortData } from "@/lib/utils";

// Định nghĩa interface cho Activity
interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string; // ISO string để sort
  displayTime: string;
  type: 'success' | 'warning' | 'error' | 'info';
  actionType: 'approve' | 'pending' | 'error' | 'register' | 'feedback' | 'edit';
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    title: 'Bài thuốc "Tam thất tam" đã được phê duyệt',
    subtitle: "Bởi bác sĩ Lê Hữu Trác",
    timestamp: "2026-03-03T10:15:00Z",
    displayTime: "2 phút trước",
    type: "success",
    actionType: "approve",
  },
  {
    id: "2",
    title: "12 tài liệu dược liệu mới đang chờ duyệt",
    subtitle: "Hệ thống System Worker",
    timestamp: "2026-03-03T10:05:00Z",
    displayTime: "8 phút trước",
    type: "warning",
    actionType: "pending",
  },
  {
    id: "3",
    title: "Lỗi đồng bộ vector DB - chunk #2847",
    subtitle: "RAG Engine",
    timestamp: "2026-03-03T09:50:00Z",
    displayTime: "15 phút trước",
    type: "error",
    actionType: "error",
  },
  {
    id: "4",
    title: "Người dùng NguyenVanA đã đăng ký tài khoản",
    subtitle: "Hệ thống User Auth",
    timestamp: "2026-03-03T09:30:00Z",
    displayTime: "22 phút trước",
    type: "info",
    actionType: "register",
  },
  {
    id: "5",
    title: 'Góp ý: "Thiếu liều dùng cho trẻ em" - bài #1209',
    subtitle: "Khách User394",
    timestamp: "2026-03-03T09:10:00Z",
    displayTime: "35 phút trước",
    type: "info",
    actionType: "feedback",
  },
  {
    id: "6",
    title: 'Bài thuốc "Tam thất tam" đã được sửa đổi',
    subtitle: "Bởi Admin",
    timestamp: "2026-03-03T08:00:00Z",
    displayTime: "1 giờ trước",
    type: "info",
    actionType: "edit",
  },
];

/**
 * RecentActivityList Component
 * Danh sách hiển thị các hoạt động gần đây của hệ thống
 */
export const RecentActivityList = () => {
  // Sử dụng hàm sortData từ utils để sắp xếp theo thời gian mới nhất
  const sortedActivities = useMemo(() => {
    return sortData(mockActivities, "timestamp", "desc");
  }, []);

  const getIcon = (actionType: ActivityItem['actionType']) => {
    switch (actionType) {
      case 'approve': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'pending': return <Clock size={16} className="text-yellow-500" />;
      case 'error': return <AlertCircle size={16} className="text-red-500" />;
      case 'register': return <UserPlus size={16} className="text-blue-500" />;
      case 'feedback': return <MessageCircle size={16} className="text-purple-500" />;
      case 'edit': return <FileEdit size={16} className="text-gray-500" />;
      default: return <CheckCircle2 size={16} className="text-gray-500" />;
    }
  };

  const getBadgeVariant = (type: ActivityItem['type']) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'info': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (actionType: ActivityItem['actionType']) => {
    switch (actionType) {
      case 'approve': return 'Đã duyệt';
      case 'pending': return 'Đang xử lý';
      case 'error': return 'Lỗi';
      case 'register': return 'Tham gia';
      case 'feedback': return 'Góp ý';
      case 'edit': return 'Bản nháp';
      default: return 'Thông tin';
    }
  };

  return (
    <Card className="flex flex-col h-[420px] overflow-hidden">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">Hoạt động gần đây</h3>
        <p className="text-sm text-gray-500">Nhật ký hệ thống - Real-time</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4">
        {sortedActivities.map((activity) => (
          <div key={activity.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="mt-1">
              <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                {getIcon(activity.actionType)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate" title={activity.title}>
                {activity.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default" className="text-[10px] px-1.5 py-0 rounded bg-gray-100 text-gray-500">
                  {activity.subtitle.split(' ')[0]}
                </Badge>
                <p className="text-xs text-gray-500 truncate">{activity.subtitle}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1.5 whitespace-nowrap pl-2">
              <span className="text-xs text-gray-400">{activity.displayTime}</span>
              <Badge variant={getBadgeVariant(activity.type)} className="text-[10px]">
                {getStatusLabel(activity.actionType)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
