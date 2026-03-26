import React from "react";
import { Card } from "@/components/ui/Card";
import { TrendingUp, Users, CheckCircle2, Clock, ShieldBan, Stethoscope } from "lucide-react";

interface StatCard {
  label: string;
  value: number;
  subLabel: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  trend?: string;
  trendUp?: boolean;
}

/**
 * UserSummaryCards Component
 * 6 thẻ thống kê tổng quan trên đầu trang Quản lý người dùng
 */
export const UserSummaryCards = () => {
  const stats: StatCard[] = [
    {
      label: "Tổng người dùng",
      value: 20,
      subLabel: "+4 hôm nay",
      icon: Users,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      trend: "+4",
      trendUp: true,
    },
    {
      label: "Đang hoạt động",
      value: 13,
      subLabel: "65% tổng số",
      icon: CheckCircle2,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      trend: "+2",
      trendUp: true,
    },
    {
      label: "Chờ xác minh",
      value: 3,
      subLabel: "Cần xử lý",
      icon: Clock,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      label: "Tạm khóa",
      value: 2,
      subLabel: "10 phiên năm ngoái",
      icon: ShieldBan,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
    },
    {
      label: "Chuyên gia y tế",
      value: 4,
      subLabel: "20% tổng số",
      icon: Stethoscope,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      trend: "+1",
      trendUp: true,
    },
    {
      label: "Mới trong tháng",
      value: 4,
      subLabel: "+20% so với T2",
      icon: TrendingUp,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      trend: "+20%",
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex flex-col gap-3 p-4">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
            <stat.icon size={18} className={stat.iconColor} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">{stat.label}</p>
          </div>
          {stat.trend && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <TrendingUp size={11} />
              {stat.subLabel}
            </span>
          )}
          {!stat.trend && (
            <span className="text-xs text-gray-400">{stat.subLabel}</span>
          )}
        </Card>
      ))}
    </div>
  );
};
