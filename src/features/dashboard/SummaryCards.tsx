import React from "react";
import { Card } from "@/components/ui/Card";
import { Users, Activity, FileText, MessageSquare, TrendingUp, TrendingDown } from "lucide-react";

/**
 * SummaryCards Component
 * Hiển thị 4 thẻ thống kê tổng quan ở trên cùng của Dashboard
 */
export const SummaryCards = () => {
  const cardsData = [
    {
      title: "Tài khoản đã đăng ký",
      subtitle: "Tổng sinh viên",
      value: "2,847",
      trend: "+12%",
      trendLabel: "so với tháng trước",
      isPositive: true,
      icon: Users,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-500",
    },
    {
      title: "Phiên truy cập",
      subtitle: "Lưu lượng hôm nay",
      value: "156",
      trend: "+14.5%",
      trendLabel: "so với hôm qua",
      isPositive: true,
      icon: Activity,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      title: "Bài thuốc/ dược liệu mới",
      subtitle: "Tài liệu chờ duyệt",
      value: "247",
      trend: "-3.1%",
      trendLabel: "so với kỳ trước",
      isPositive: false,
      icon: FileText,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Chưa được xử lý",
      subtitle: "Góp ý mới",
      value: "89",
      trend: "+3%",
      trendLabel: "so với tuần trước",
      isPositive: true,
      icon: MessageSquare,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cardsData.map((card, index) => (
        <Card key={index} className="flex flex-col relative overflow-hidden">
           {/* Trang trí góc trên phải */}
           <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20 ${card.iconBg}`}></div>

          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg} ${card.iconColor}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
          <div className="mb-4">
             <p className="text-sm text-gray-500 font-medium mb-1">{card.title}</p>
             <p className="text-sm font-semibold text-gray-900">{card.subtitle}</p>
          </div>
          <div className="flex items-center gap-1.5 mt-auto text-xs">
            <div className={`flex items-center font-medium ${card.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
               {card.isPositive ? <TrendingUp size={14} className="mr-0.5" /> : <TrendingDown size={14} className="mr-0.5" />}
               {card.trend}
            </div>
            <span className="text-gray-500">{card.trendLabel}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};
