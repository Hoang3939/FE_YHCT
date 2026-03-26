import React from "react";
import { Card } from "@/components/ui/Card";
import {
  MessageSquareHeart, Clock3, CheckCircle2, XCircle, Star, Zap, TrendingUp, TrendingDown
} from "lucide-react";

interface StatCard {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  borderTop: string;
  trend: string;
  trendUp: boolean;
}

/**
 * FeedbackSummaryCards Component
 * 6 thẻ thống kê tổng quan trang Góp ý hệ thống
 */
export const FeedbackSummaryCards = () => {
  const cards: StatCard[] = [
    { label: "Tổng góp ý",         value: "247",  icon: MessageSquareHeart, iconBg: "bg-blue-50",   iconColor: "text-blue-500",   borderTop: "border-t-blue-400",   trend: "+18 tuần này",  trendUp: true  },
    { label: "Chờ xét duyệt",      value: "32",   icon: Clock3,             iconBg: "bg-amber-50",  iconColor: "text-amber-500",  borderTop: "border-t-amber-400",  trend: "5 ưu tiên cao", trendUp: false },
    { label: "Đã duyệt",           value: "189",  icon: CheckCircle2,       iconBg: "bg-teal-50",   iconColor: "text-teal-500",   borderTop: "border-t-teal-400",   trend: "76.5% tỉ lệ",   trendUp: true  },
    { label: "Đã từ chối",         value: "26",   icon: XCircle,            iconBg: "bg-red-50",    iconColor: "text-red-500",    borderTop: "border-t-red-400",    trend: "10.5% tỉ lệ",  trendUp: false },
    { label: "Điểm chất lượng TB", value: "4.6",  icon: Star,               iconBg: "bg-purple-50", iconColor: "text-purple-500", borderTop: "border-t-purple-400", trend: "+0.2 tháng này", trendUp: true },
    { label: "Tốc độ phản hồi",    value: "18h",  icon: Zap,                iconBg: "bg-emerald-50",iconColor: "text-emerald-500",borderTop: "border-t-emerald-400",trend: "Giảm 4h so với tuần trước", trendUp: true },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
      {cards.map((card) => (
        <Card
          key={card.label}
          className={`flex flex-col gap-2 p-4 border-t-2 ${card.borderTop}`}
        >
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.iconBg}`}>
            <card.icon size={18} className={card.iconColor} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${card.trendUp ? "text-emerald-600" : "text-red-500"}`}>
            {card.trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {card.trend}
          </div>
        </Card>
      ))}
    </div>
  );
};
