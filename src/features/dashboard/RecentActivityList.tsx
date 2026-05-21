"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, Clock, AlertCircle, FileEdit, MessageCircle, Loader2, UserPlus } from "lucide-react";
import { fetchRecentActivity, type RecentActivityItem } from "@/services/api/dashboard.service";

/**
 * RecentActivityList Component
 * Danh sách hiển thị các hoạt động đóng góp gần đây từ API thật
 */
export const RecentActivityList = () => {
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity().then(setActivities).finally(() => setLoading(false));
  }, []);

  const getIcon = (actionType: RecentActivityItem['actionType']) => {
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

  const getBadgeVariant = (type: RecentActivityItem['type']) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'info': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (actionType: RecentActivityItem['actionType']) => {
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

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-emerald-500" />
        </div>
      )}

      {!loading && activities.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
          Không có hoạt động nào gần đây.
        </div>
      )}

      {!loading && (
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4">
        {activities.map((activity) => (
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
      )}
    </Card>
  );
};
