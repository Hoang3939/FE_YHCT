import React from "react";
import { Card } from "@/components/ui/Card";
import { FileText, CheckCircle2, Clock, Layers, AlertTriangle, Cpu } from "lucide-react";

interface StatCard {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  sub?: string;
}

/**
 * DocSummaryCards Component
 * 6 thẻ thống kê tổng quan trang Quản lý tài liệu
 */
export const DocSummaryCards = () => {
  const stats: StatCard[] = [
    {
      label: "Tổng tài liệu",
      value: "15",
      icon: FileText,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      sub: "+3 tháng này",
    },
    {
      label: "Đã xuất bản",
      value: "11",
      icon: CheckCircle2,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      sub: "73% tổng số",
    },
    {
      label: "Đang kiểm duyệt",
      value: "2",
      icon: Clock,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      sub: "Cần xử lý",
    },
    {
      label: "Đã index RAG",
      value: "11",
      icon: Layers,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      sub: "73% đã sẵn sàng",
    },
    {
      label: "Lỗi embedding",
      value: "1",
      icon: AlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      sub: "Cần kiểm tra",
    },
    {
      label: "Tổng token",
      value: "104K",
      icon: Cpu,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      sub: "Đã xử lý",
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
          {stat.sub && <p className="text-xs text-gray-400">{stat.sub}</p>}
        </Card>
      ))}
    </div>
  );
};
