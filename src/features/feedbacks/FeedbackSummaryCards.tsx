"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import {
  MessageSquareHeart, Clock3, CheckCircle2, XCircle, TrendingUp
} from "lucide-react";
import { fetchFeedbackStats } from "@/services/api/feedback.service";

interface Stats { total: number; pending: number; inProgress: number; resolved: number; rejected: number; }

/**
 * FeedbackSummaryCards — stats thật từ API
 */
export const FeedbackSummaryCards = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchFeedbackStats().then(setStats).catch(() => {});
  }, []);

  const cards = [
    { label: "Tổng góp ý",    value: stats?.total ?? '—',   icon: MessageSquareHeart, iconBg: "bg-blue-50",    iconColor: "text-blue-500",    borderTop: "border-t-blue-400",    trend: "Tất cả góp ý" },
    { label: "Chờ duyệt",     value: stats?.pending ?? '—', icon: Clock3,             iconBg: "bg-amber-50",   iconColor: "text-amber-500",   borderTop: "border-t-amber-400",   trend: "Cần xử lý" },
    { label: "Đang xem xét",  value: stats?.inProgress ?? '—', icon: TrendingUp,     iconBg: "bg-blue-50",    iconColor: "text-blue-400",    borderTop: "border-t-blue-300",    trend: "Trong quá trình" },
    { label: "Đã giải quyết", value: stats?.resolved ?? '—', icon: CheckCircle2,      iconBg: "bg-teal-50",    iconColor: "text-teal-500",    borderTop: "border-t-teal-400",    trend: "Hoàn thành" },
    { label: "Đã từ chối",    value: stats?.rejected ?? '—', icon: XCircle,          iconBg: "bg-red-50",     iconColor: "text-red-500",     borderTop: "border-t-red-400",     trend: "Không duyệt" },
    {
      label: "Tỉ lệ giải quyết",
      value: stats && stats.total > 0 ? `${Math.round((stats.resolved / stats.total) * 100)}%` : '—',
      icon: TrendingUp, iconBg: "bg-emerald-50", iconColor: "text-emerald-500", borderTop: "border-t-emerald-400", trend: "Góp ý có hải"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
      {cards.map((card) => (
        <Card key={card.label} className={`flex flex-col gap-2 p-4 border-t-2 ${card.borderTop}`}>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.iconBg}`}>
            <card.icon size={18} className={card.iconColor} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{String(card.value)}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
          </div>
          <p className="text-xs text-gray-400">{card.trend}</p>
        </Card>
      ))}
    </div>
  );
};
