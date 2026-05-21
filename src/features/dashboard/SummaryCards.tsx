"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Users, Activity, FileText, MessageSquare, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { fetchDashboardStats, type DashboardStats } from "@/services/api/dashboard.service";
import { useToast } from "@/components/toast/ToastContext";

function formatNumber(num: number): string {
  return num.toLocaleString("vi-VN");
}

export const SummaryCards = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
        showToast("Không thể tải thống kê", "error");
      } finally {
        setLoading(false);
      }
    };

    void loadStats();
    // Refresh every 60 seconds
    const interval = setInterval(() => void loadStats(), 60000);
    return () => clearInterval(interval);
  }, [showToast]);

  // Fallback values while loading
  const cardsData = [
    {
      title: "Tài khoản đã đăng ký",
      subtitle: "Tổng người dùng",
      value: formatNumber(stats?.totalUsers ?? 0),
      trend: "+12%",
      trendLabel: "so với tháng trước",
      isPositive: true,
      icon: Users,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-500",
      loading,
    },
    {
      title: "Truy vấn hôm nay",
      subtitle: "Lưu lượng chat",
      value: formatNumber(stats?.todayQueries ?? 0),
      trend: "+14.5%",
      trendLabel: "so với hôm qua",
      isPositive: true,
      icon: Activity,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
      loading,
    },
    {
      title: "Tài liệu trong hệ thống",
      subtitle: "Số lượng ebook",
      value: formatNumber(stats?.totalEbooks ?? 0),
      trend: "+5%",
      trendLabel: "so với tháng trước",
      isPositive: true,
      icon: FileText,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      loading,
    },
    {
      title: "Đóng góp chờ duyệt",
      subtitle: "Cần expert xử lý",
      value: formatNumber(stats?.pendingContributions ?? 0),
      trend: stats && stats.pendingContributions > 20 ? "+3" : "-2",
      trendLabel: "so với hôm qua",
      isPositive: stats ? stats.pendingContributions <= 20 : true,
      icon: MessageSquare,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
      loading,
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
              {card.loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              )}
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
